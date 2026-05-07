#!/usr/bin/env node
// Reads the "Mapped Pain Points and Use Cases" workbook CSVs and emits the
// canonical TypeScript data files consumed by the cloud function and the UI.
//
// Run from the repo root, pointing at the directory holding the CSV exports:
//   node scripts/build-sheet-data.mjs ~/Downloads
//
// Inputs (sheet number prefix in the filename is required):
//   1. Industries.csv
//   2. Industries - Categories.csv (informational; not parsed — use Sheet 3)
//   3. Industries - Categories - Sub Categories.csv
//   4. Detailed Pain Points and Use Cases - Mapped.csv
//   6. Practice Relevance.csv
//
// Outputs (overwritten):
//   functions/src/data/sheet-pain-points.ts      — server-side pain-point dataset
//   functions/src/data/sheet-practice-relevance.ts — server-side practice scoring
//   lib/sheet-taxonomy.ts                        — UI-facing labels + lookups
//
// Sheet 3 is the authoritative source for canonical category / sub-category
// labels per Full_ID; Sheet 4 supplies the detailed and converged pain points
// + use cases. Sheet 4 occasionally uses abbreviated names for its category
// column ("Travel & Logistics Tech" vs Sheet 3's "Travel & Logistics
// Technology") — Sheet 3 wins when both are present.
// Sheet 6 (Practice Relevance) maps each DPPID to a 0–3 score per Searce
// practice (AI, D&A, Infra Mod, CMS, LI, FoW). The prompt layer uses this to
// avoid claiming capabilities we don't actually deliver.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");

const csvDir = process.argv[2] ? resolve(process.argv[2]) : null;
if (!csvDir) {
	console.error("Usage: node scripts/build-sheet-data.mjs <directory-with-CSV-exports>");
	process.exit(1);
}

const SHEET_FILES = {
	industriesMeta: "Mapped Pain Points and Use Cases - 1. Industries.csv",
	taxonomy: "Mapped Pain Points and Use Cases - 3. Industries - Categories - Sub Categories.csv",
	painPoints:
		"Mapped Pain Points and Use Cases - 4.Detailed Pain Points and Use Cases - Mapped.csv",
	practiceRelevance: "Mapped Pain Points and Use Cases - 6. Practice Relevance.csv",
};

function parseCsv(text) {
	// Splits CSV into records, supporting "..." quoted fields with embedded
	// commas, newlines, and "" escapes for literal quotes.
	const records = [];
	let row = [];
	let cell = "";
	let inQuote = false;
	for (let i = 0; i < text.length; i++) {
		const ch = text[i];
		if (inQuote) {
			if (ch === '"') {
				if (text[i + 1] === '"') {
					cell += '"';
					i++;
				} else {
					inQuote = false;
				}
			} else {
				cell += ch;
			}
			continue;
		}
		if (ch === '"') {
			inQuote = true;
			continue;
		}
		if (ch === ",") {
			row.push(cell);
			cell = "";
			continue;
		}
		if (ch === "\n") {
			row.push(cell);
			records.push(row);
			row = [];
			cell = "";
			continue;
		}
		if (ch === "\r") continue;
		cell += ch;
	}
	if (cell.length > 0 || row.length > 0) {
		row.push(cell);
		records.push(row);
	}
	return records.filter((r) => r.length > 0 && r.some((c) => c.length > 0));
}

function slug(s) {
	return s
		.toLowerCase()
		.replace(/&/g, " and ")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

function tsString(s) {
	return '"' + String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n") + '"';
}

const sheet1 = parseCsv(readFileSync(join(csvDir, SHEET_FILES.industriesMeta), "utf8"));
const sheet3 = parseCsv(readFileSync(join(csvDir, SHEET_FILES.taxonomy), "utf8"));
const sheet4 = parseCsv(readFileSync(join(csvDir, SHEET_FILES.painPoints), "utf8"));
const sheet6 = parseCsv(readFileSync(join(csvDir, SHEET_FILES.practiceRelevance), "utf8"));

// Sheet 1: row 0 = header (Industry ID, Industry Code, Detailed Industry Name, …),
// rows 1..N = data, last row = totals (skip).
const industryMeta = []; // [{ code, label }]
for (let i = 1; i < sheet1.length; i++) {
	const r = sheet1[i];
	if (!r[0] || /totals/i.test(r[0])) continue;
	const [, industryCode, detailedName] = r;
	if (!industryCode) continue;
	industryMeta.push({ code: industryCode.trim(), label: detailedName.trim() });
}

// Sheet 3: row 0 = "Totals,...", row 1 = header, row 2+ = data.
const taxonomy = new Map(); // fullId -> { industryCode, categoryLabel, subCategoryLabel }
for (let i = 2; i < sheet3.length; i++) {
	const r = sheet3[i];
	if (!r[0]) continue;
	const [fullId, industryCode, categoryLabel, subCategoryLabel] = r;
	taxonomy.set(fullId, {
		industryCode: industryCode.trim(),
		categoryLabel: categoryLabel.trim(),
		subCategoryLabel: subCategoryLabel.trim(),
	});
}

// Sheet 4: row 0 = header, rows 1+ = data.
const painPoints = [];
for (let i = 1; i < sheet4.length; i++) {
	const r = sheet4[i];
	if (!r[0]) continue;
	const [
		fullId,
		primaryIndustryCode,
		sheet4Category,
		sheet4SubCategory,
		dppId,
		detailed,
		cppId,
		converged,
		detailedUseCase,
		cucId,
		convergedUseCase,
	] = r;
	const canon = taxonomy.get(fullId) ?? {
		industryCode: primaryIndustryCode.trim(),
		categoryLabel: sheet4Category.trim(),
		subCategoryLabel: sheet4SubCategory.trim(),
	};
	painPoints.push({
		fullId: fullId.trim(),
		industryCode: canon.industryCode,
		category: slug(canon.categoryLabel),
		categoryLabel: canon.categoryLabel,
		subCategory: slug(canon.subCategoryLabel),
		subCategoryLabel: canon.subCategoryLabel,
		dppId: Number(dppId),
		detailed: detailed.trim(),
		cppId: Number(cppId),
		converged: converged.trim(),
		detailedUseCase: detailedUseCase.trim(),
		cucId: Number(cucId),
		convergedUseCase: convergedUseCase.trim(),
	});
}

painPoints.sort((a, b) => {
	const [a1, a2, a3] = a.fullId.split(".").map(Number);
	const [b1, b2, b3] = b.fullId.split(".").map(Number);
	return a1 - b1 || a2 - b2 || a3 - b3 || a.dppId - b.dppId;
});

const industryCodeOrder =
	industryMeta.length > 0
		? industryMeta.map((m) => m.code)
		: ["FSI", "HLS", "TTL", "RCE", "TMEG", "MCM", "TSS", "EUP", "PSE"];

// Sheet 6: row 0 = header (Full_ID, DPPID, Description, AI, D&A, Infra Mod, CMS, LI, FoW, Aggregate)
const practiceRelevance = []; // [{ fullId, dppId, abbreviated, ai, da, infraMod, cms, li, fow, aggregate }]
for (let i = 1; i < sheet6.length; i++) {
	const r = sheet6[i];
	if (!r[0] || !r[1]) continue;
	const [fullId, dppId, abbreviated, ai, da, infraMod, cms, li, fow, aggregate] = r;
	practiceRelevance.push({
		fullId: fullId.trim(),
		dppId: Number(dppId),
		abbreviated: abbreviated.trim(),
		ai: Number(ai) || 0,
		da: Number(da) || 0,
		infraMod: Number(infraMod) || 0,
		cms: Number(cms) || 0,
		li: Number(li) || 0,
		fow: Number(fow) || 0,
		aggregate: Number(aggregate) || 0,
	});
}
practiceRelevance.sort((a, b) => a.dppId - b.dppId);

const industryCategories = {}; // industryCode -> [{ value, label }]
const categorySubCategories = {}; // industryCode -> categorySlug -> [{ value, label, fullId }]
const seenCategoryByIndustry = new Map();
const seenSubCategoryByCategory = new Map();

for (const p of painPoints) {
	const indKey = p.industryCode;
	if (!industryCategories[indKey]) industryCategories[indKey] = [];
	if (!categorySubCategories[indKey]) categorySubCategories[indKey] = {};

	const catSeenKey = `${indKey}:${p.category}`;
	if (!seenCategoryByIndustry.has(catSeenKey)) {
		seenCategoryByIndustry.set(catSeenKey, true);
		industryCategories[indKey].push({ value: p.category, label: p.categoryLabel });
	}

	if (!categorySubCategories[indKey][p.category]) categorySubCategories[indKey][p.category] = [];

	const subSeenKey = `${catSeenKey}:${p.subCategory}`;
	if (!seenSubCategoryByCategory.has(subSeenKey)) {
		seenSubCategoryByCategory.set(subSeenKey, true);
		categorySubCategories[indKey][p.category].push({
			value: p.subCategory,
			label: p.subCategoryLabel,
			fullId: p.fullId,
		});
	}
}

// Sort industries by canonical order, others alphabetically.
const sortedIndustryCodes = Object.keys(industryCategories).sort((a, b) => {
	const ai = industryCodeOrder.indexOf(a);
	const bi = industryCodeOrder.indexOf(b);
	if (ai !== -1 && bi !== -1) return ai - bi;
	if (ai !== -1) return -1;
	if (bi !== -1) return 1;
	return a.localeCompare(b);
});

// ─── Write functions/src/data/sheet-pain-points.ts ──────────────────────────

const painPointsOut = [];
painPointsOut.push(
	"// Auto-generated from the Mapped Pain Points and Use Cases workbook (Sheets 3 & 4).",
	"// Run scripts/build-sheet-data.mjs to regenerate after the workbook changes.",
	"// DO NOT EDIT BY HAND.",
	"",
	"export interface SheetPainPointRow {",
	"\tfullId: string;",
	"\tindustryCode: string;",
	"\tcategory: string;",
	"\tcategoryLabel: string;",
	"\tsubCategory: string;",
	"\tsubCategoryLabel: string;",
	"\tdppId: number;",
	"\tdetailed: string;",
	"\tcppId: number;",
	"\tconverged: string;",
	"\tdetailedUseCase: string;",
	"\tcucId: number;",
	"\tconvergedUseCase: string;",
	"}",
	"",
	"export const SHEET_PAIN_POINTS: SheetPainPointRow[] = [",
);
for (const p of painPoints) {
	painPointsOut.push(
		`\t{ fullId: ${tsString(p.fullId)}, industryCode: ${tsString(p.industryCode)}, category: ${tsString(p.category)}, categoryLabel: ${tsString(p.categoryLabel)}, subCategory: ${tsString(p.subCategory)}, subCategoryLabel: ${tsString(p.subCategoryLabel)}, dppId: ${p.dppId}, detailed: ${tsString(p.detailed)}, cppId: ${p.cppId}, converged: ${tsString(p.converged)}, detailedUseCase: ${tsString(p.detailedUseCase)}, cucId: ${p.cucId}, convergedUseCase: ${tsString(p.convergedUseCase)} },`,
	);
}
painPointsOut.push("];", "");

const painPointsPath = join(REPO_ROOT, "functions/src/data/sheet-pain-points.ts");
mkdirSync(dirname(painPointsPath), { recursive: true });
writeFileSync(painPointsPath, painPointsOut.join("\n"));
console.log(`Wrote ${painPointsPath} (${painPoints.length} rows)`);

// ─── Write lib/sheet-taxonomy.ts ────────────────────────────────────────────

const taxonomyOut = [];
taxonomyOut.push(
	"// Auto-generated from the Mapped Pain Points and Use Cases workbook (Sheets 1, 2 & 3).",
	"// Run scripts/build-sheet-data.mjs to regenerate after the workbook changes.",
	"// DO NOT EDIT BY HAND.",
	"",
	"export interface IndustryOption {",
	"\tvalue: string;",
	"\tlabel: string;",
	"}",
	"",
	"export interface CategoryOption {",
	"\tvalue: string;",
	"\tlabel: string;",
	"}",
	"",
	"export interface SubCategoryOption {",
	"\tvalue: string;",
	"\tlabel: string;",
	"\tfullId: string;",
	"}",
	"",
	"/** Sheet-1 canonical industry codes + detailed labels, in workbook order. */",
	"export const SHEET_INDUSTRIES: IndustryOption[] = [",
);
for (const m of industryMeta) {
	taxonomyOut.push(`\t{ value: ${tsString(m.code)}, label: ${tsString(m.label)} },`);
}
taxonomyOut.push("];", "");

taxonomyOut.push(
	"/** Sheet-driven categories (sub-industries) per industry code. */",
	"export const INDUSTRY_CATEGORIES: Record<string, CategoryOption[]> = {",
);
for (const indCode of sortedIndustryCodes) {
	taxonomyOut.push(`\t${tsString(indCode)}: [`);
	for (const c of industryCategories[indCode]) {
		taxonomyOut.push(`\t\t{ value: ${tsString(c.value)}, label: ${tsString(c.label)} },`);
	}
	taxonomyOut.push("\t],");
}
taxonomyOut.push("};", "");

taxonomyOut.push(
	"/** Sheet-driven sub-categories per industry+category. */",
	"export const CATEGORY_SUBCATEGORIES: Record<string, Record<string, SubCategoryOption[]>> = {",
);
for (const indCode of sortedIndustryCodes) {
	taxonomyOut.push(`\t${tsString(indCode)}: {`);
	for (const cat of Object.keys(categorySubCategories[indCode])) {
		taxonomyOut.push(`\t\t${tsString(cat)}: [`);
		for (const sc of categorySubCategories[indCode][cat]) {
			taxonomyOut.push(
				`\t\t\t{ value: ${tsString(sc.value)}, label: ${tsString(sc.label)}, fullId: ${tsString(sc.fullId)} },`,
			);
		}
		taxonomyOut.push("\t\t],");
	}
	taxonomyOut.push("\t},");
}
taxonomyOut.push("};", "");

taxonomyOut.push(
	"export function getIndustryCategories(industryCode: string): CategoryOption[] {",
	"\treturn INDUSTRY_CATEGORIES[industryCode] ?? [];",
	"}",
	"",
	"export function getCategorySubCategories(",
	"\tindustryCode: string,",
	"\tcategory: string,",
	"): SubCategoryOption[] {",
	"\treturn CATEGORY_SUBCATEGORIES[industryCode]?.[category] ?? [];",
	"}",
	"",
);

const taxonomyPath = join(REPO_ROOT, "lib/sheet-taxonomy.ts");
mkdirSync(dirname(taxonomyPath), { recursive: true });
writeFileSync(taxonomyPath, taxonomyOut.join("\n"));
console.log(`Wrote ${taxonomyPath}`);

// ─── Write functions/src/data/sheet-practice-relevance.ts ───────────────────

const practiceOut = [];
practiceOut.push(
	"// Auto-generated from the Mapped Pain Points and Use Cases workbook (Sheet 6).",
	"// Run scripts/build-sheet-data.mjs to regenerate after the workbook changes.",
	"// DO NOT EDIT BY HAND.",
	"//",
	"// Scoring scale per practice column:",
	"//   3 = Primary Solution Owner",
	"//   2 = Secondary Solution Provider",
	"//   1 = Ancillary or Enabling Role",
	"//   0 = No Direct Involvement",
	"// The aggregate column is the sum of all practice scores for the DPP.",
	"",
	'export type SearcePracticeKey = "ai" | "da" | "infraMod" | "cms" | "li" | "fow";',
	"",
	"export interface PracticeRelevanceRow {",
	"\tfullId: string;",
	"\tdppId: number;",
	"\tabbreviated: string;",
	"\tai: number;",
	"\tda: number;",
	"\tinfraMod: number;",
	"\tcms: number;",
	"\tli: number;",
	"\tfow: number;",
	"\taggregate: number;",
	"}",
	"",
	"export const SHEET_PRACTICE_RELEVANCE: PracticeRelevanceRow[] = [",
);
for (const p of practiceRelevance) {
	practiceOut.push(
		`\t{ fullId: ${tsString(p.fullId)}, dppId: ${p.dppId}, abbreviated: ${tsString(p.abbreviated)}, ai: ${p.ai}, da: ${p.da}, infraMod: ${p.infraMod}, cms: ${p.cms}, li: ${p.li}, fow: ${p.fow}, aggregate: ${p.aggregate} },`,
	);
}
practiceOut.push("];", "");

const practicePath = join(REPO_ROOT, "functions/src/data/sheet-practice-relevance.ts");
mkdirSync(dirname(practicePath), { recursive: true });
writeFileSync(practicePath, practiceOut.join("\n"));
console.log(`Wrote ${practicePath} (${practiceRelevance.length} rows)`);

// ─── Stats ──────────────────────────────────────────────────────────────────

console.log(
	`Industries: ${sortedIndustryCodes.length}, Categories: ${Object.values(industryCategories).reduce((acc, arr) => acc + arr.length, 0)}, Sub-categories: ${Object.values(categorySubCategories).reduce((acc, m) => acc + Object.values(m).reduce((s, arr) => s + arr.length, 0), 0)}, Pain points: ${painPoints.length}, Practice rows: ${practiceRelevance.length}`,
);
