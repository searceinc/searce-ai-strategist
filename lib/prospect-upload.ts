import * as XLSX from "xlsx";

/**
 * Maps an uploaded prospect list (CSV / XLSX exported from a Google Sheet) onto
 * the three Company Intel fields in the Config panel. Header detection is
 * case-insensitive and fuzzy ("matching slightly"), so columns like
 * "Account Name", "Company", "Web Site", "Domain", "LinkedIn URL" are all
 * recognised. Columns that don't match any field are ignored, and fields whose
 * header is missing simply keep their manual text input.
 */

/** A Config-panel Company Intel field that an uploaded column can populate. */
export type ProspectField = "company" | "website" | "linkedin";

export const PROSPECT_FIELDS: readonly ProspectField[] = ["company", "website", "linkedin"];

/** Human label for each field (used in UI + toasts). */
export const PROSPECT_FIELD_LABEL: Record<ProspectField, string> = {
	company: "Company Name",
	website: "Website / Domain",
	linkedin: "LinkedIn URL",
};

export interface ProspectRow {
	company?: string;
	website?: string;
	linkedin?: string;
}

export interface ParsedProspectUpload {
	fileName: string;
	/** Original sheet header text that matched each detected field. */
	matchedHeaders: Partial<Record<ProspectField, string>>;
	/** Whether each field was detected in the sheet header. */
	matchedFields: Record<ProspectField, boolean>;
	/** One entry per non-empty data row, keyed by detected field. */
	rows: ProspectRow[];
}

/** Guard rails so a giant sheet can't blow past Firestore's 1 MB document limit. */
export const MAX_PROSPECT_ROWS = 3000;
const MAX_CELL_LENGTH = 2000;

export const ACCEPTED_FILE_EXTENSIONS = [".csv", ".xlsx"] as const;
export const ACCEPTED_FILE_ACCEPT_ATTR =
	".csv,.xlsx,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

/**
 * Keyword signals per field. Evaluated in this order, so the more specific
 * "linkedin" wins over the generic "url" before "website" is considered.
 */
const FIELD_KEYWORDS: Array<{ field: ProspectField; keywords: string[] }> = [
	{ field: "linkedin", keywords: ["linkedin", "linked in", "linkdin", "li url", "li profile"] },
	{
		field: "website",
		keywords: ["website", "web site", "domain", "url", "site", "web", "homepage", "webpage"],
	},
	{
		field: "company",
		keywords: [
			"account name",
			"account",
			"company name",
			"company",
			"organisation",
			"organization",
			"organisation name",
			"client",
			"prospect",
			"business",
			"firm",
			"employer",
			"name",
		],
	},
];

/** Canonical spellings used for a typo-tolerant (Levenshtein) fallback match. */
const FIELD_CANONICALS: Array<{ field: ProspectField; canonical: string }> = [
	{ field: "linkedin", canonical: "linkedin" },
	{ field: "linkedin", canonical: "linkedin url" },
	{ field: "website", canonical: "website" },
	{ field: "website", canonical: "domain" },
	{ field: "company", canonical: "company" },
	{ field: "company", canonical: "company name" },
	{ field: "company", canonical: "account name" },
];

function normalizeHeader(raw: string): string {
	return raw
		.toLowerCase()
		.replace(/[_\-/\\.]+/g, " ")
		.replace(/[^a-z0-9 ]+/g, "")
		.replace(/\s+/g, " ")
		.trim();
}

function levenshtein(a: string, b: string): number {
	if (a === b) return 0;
	if (!a.length) return b.length;
	if (!b.length) return a.length;
	let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
	let curr = new Array<number>(b.length + 1);
	for (let i = 1; i <= a.length; i++) {
		curr[0] = i;
		for (let j = 1; j <= b.length; j++) {
			const cost = a[i - 1] === b[j - 1] ? 0 : 1;
			curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
		}
		[prev, curr] = [curr, prev];
	}
	return prev[b.length] ?? 0;
}

/**
 * Resolve a raw header cell to one of the three fields, or `null` if it does
 * not resemble any of them. Matching is case-insensitive, keyword-based, with a
 * Levenshtein fallback for small typos.
 */
export function matchHeaderToField(rawHeader: string): ProspectField | null {
	const normalized = normalizeHeader(rawHeader);
	if (!normalized) return null;

	const tokens = new Set(normalized.split(" "));

	for (const { field, keywords } of FIELD_KEYWORDS) {
		for (const keyword of keywords) {
			if (keyword.includes(" ")) {
				if (normalized.includes(keyword)) return field;
			} else if (tokens.has(keyword) || normalized === keyword) {
				return field;
			}
		}
	}

	// Typo-tolerant fallback: allow a small edit distance against canonicals.
	let best: { field: ProspectField; distance: number } | null = null;
	for (const { field, canonical } of FIELD_CANONICALS) {
		const distance = levenshtein(normalized, canonical);
		const threshold = canonical.length <= 5 ? 1 : 2;
		if (distance <= threshold && (!best || distance < best.distance)) {
			best = { field, distance };
		}
	}
	return best?.field ?? null;
}

function readWorkbook(data: ArrayBuffer): XLSX.WorkBook {
	return XLSX.read(data, { type: "array", raw: false });
}

/**
 * Parse a CSV / XLSX file into prospect rows and detect which of the three
 * Company Intel columns are present. Always reads the first worksheet and treats
 * its first non-empty row as the header.
 */
export async function parseProspectFile(file: File): Promise<ParsedProspectUpload> {
	const buffer = await file.arrayBuffer();
	const workbook = readWorkbook(buffer);

	const firstSheetName = workbook.SheetNames[0];
	if (!firstSheetName) throw new Error("This file doesn't contain any sheets.");

	const sheet = workbook.Sheets[firstSheetName];
	if (!sheet) throw new Error("Couldn't read the first sheet in this file.");

	const matrix = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
		header: 1,
		blankrows: false,
		defval: "",
	});

	if (matrix.length === 0) throw new Error("This file appears to be empty.");

	const headerRow = (matrix[0] ?? []).map((cell) => String(cell ?? "").trim());

	const columnToField = new Map<number, ProspectField>();
	const matchedHeaders: Partial<Record<ProspectField, string>> = {};
	const claimed = new Set<ProspectField>();

	headerRow.forEach((header, index) => {
		if (!header) return;
		const field = matchHeaderToField(header);
		// First column to claim a field wins; ignore later duplicate columns.
		if (field && !claimed.has(field)) {
			columnToField.set(index, field);
			claimed.add(field);
			matchedHeaders[field] = header;
		}
	});

	const matchedFields: Record<ProspectField, boolean> = {
		company: claimed.has("company"),
		website: claimed.has("website"),
		linkedin: claimed.has("linkedin"),
	};

	const rows: ProspectRow[] = [];
	for (let r = 1; r < matrix.length && rows.length < MAX_PROSPECT_ROWS; r++) {
		const rawRow = matrix[r] ?? [];
		const row: ProspectRow = {};
		let hasValue = false;
		for (const [index, field] of columnToField) {
			const value = String(rawRow[index] ?? "")
				.trim()
				.slice(0, MAX_CELL_LENGTH);
			if (value) {
				row[field] = value;
				hasValue = true;
			}
		}
		if (hasValue) rows.push(row);
	}

	return { fileName: file.name, matchedHeaders, matchedFields, rows };
}

/** Distinct, non-empty values for a single field, preserving first-seen order. */
export function getColumnValues(rows: ProspectRow[], field: ProspectField): string[] {
	const seen = new Set<string>();
	const out: string[] = [];
	for (const row of rows) {
		const value = row[field];
		if (value && !seen.has(value)) {
			seen.add(value);
			out.push(value);
		}
	}
	return out;
}

/** First row whose `field` equals `value` — used to auto-fill row-linked fields. */
export function findRowByValue(
	rows: ProspectRow[],
	field: ProspectField,
	value: string,
): ProspectRow | undefined {
	return rows.find((row) => row[field] === value);
}
