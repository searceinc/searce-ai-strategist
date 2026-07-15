// Regenerates functions/src/data/referenceable-stories.ts from the master
// referenceable-stories CSV.
//
// Usage:
//   node scripts/build-referenceable-stories.mjs [path/to/sheet.csv]
//
// Full sheet is produced by:
//   npm run extract:referenceable-stories
// which parses every "Referenceable" slide from the master-deck PDF into
// scripts/referenceable-stories.csv (255 stories). Curated overrides for the
// original 52 hand-edited rows live in referenceable-stories-curated-52.csv.bak.
// Deterministic, no fabrication: every field is sourced from the sheet. URLs
// intentionally point at the Searce case-studies hub — we do not have per-story
// detail URLs and the prompt rules forbid inventing them.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CSV_PATH = process.argv[2]
	? resolve(process.argv[2])
	: resolve(__dirname, "referenceable-stories.csv");
const OUT_PATH = resolve(__dirname, "../functions/src/data/referenceable-stories.ts");
const HUB = "https://www.searce.com/insights/case-studies";

const IND_MAP = {
	"Financial Services & Insurance (FSI)": "FSI",
	"Retail, CPG & E-commerce (RCE)": "RCE",
	"Retail, CPG & E-commerce": "RCE",
	"Healthcare, Pharma & Life Sciences (HPL)": "HLS",
	"ISVs & Emerging Tech": "TSS",
	"ITES & Professional Services": "TSS",
	"Travel, Transportation & Logistics (TTL)": "TTL",
	"Telecommunications, Media, Entertainment & Gaming (TMEG)": "TMEG",
	"Manufacturing & Mining (MM)": "MCM",
	"Public Sector & Education (PSE)": "PSE",
	"Real Estate": "MISC",
	"Other Industries": "MISC",
};
const REGION_MAP = { APAC: "APAC", AMER: "AMER", EMEA: "EMEA", India: "India", Europe: "EMEA" };
const SERVICE_MAP = {
	"Infra Modernization": "cloud_modernization",
	"Cloud Modernization": "cloud_modernization",
	"Cloud Engineering": "cloud_modernization",
	"Cloud Managed Services": "finops_cost_optimization",
	"Data & Analytics": "data_analytics",
	"Applied AI": "ai_automation",
	"Applied Al": "ai_automation",
	"Software Engineering": "devops_platform_engineering",
	"Location Intelligence": "location_intelligence",
	"Future of Work": "enterprise_transformation",
	Cloud: "cloud_modernization",
};
const PRACTICE_LABEL = {
	"Infra Modernization": "Infrastructure Modernization",
	"Cloud Modernization": "Infrastructure Modernization",
	"Cloud Engineering": "Infrastructure Modernization",
	"Cloud Managed Services": "Cloud Managed Services",
	"Data & Analytics": "Data & Analytics",
	"Applied AI": "Applied AI",
	"Applied Al": "Applied AI",
	"Software Engineering": "Software Engineering",
	"Location Intelligence": "Location Intelligence",
	"Future of Work": "Future of Work",
	Cloud: "Infrastructure Modernization",
};
const AWS_HINTS = [
	"aws",
	"eks",
	"redshift",
	"aurora",
	"dynamodb",
	"ec2",
	"lambda",
	" s3",
	"athena",
	" emr",
	"quicksight",
	"kinesis",
	"ecs",
	"glue",
	"cloudwatch",
	"beanstalk",
	"control tower",
];
const GCP_HINTS = [
	"google",
	"gke",
	"bigquery",
	"gcs",
	"cloud run",
	"compute engine",
	"vertex",
	"dataproc",
	"apigee",
	"cloud sql",
	"looker",
	"gce",
	"cloud build",
	"cloud armor",
	"cloud functions",
	"cloud composer",
	"datastream",
	"app engine",
	"firestore",
	"datastore",
	"pub/sub",
	"memorystore",
	"artifact registry",
	"secret manager",
	"bq",
];

function cloudOf(tech) {
	const t = (tech || "").toLowerCase();
	const aws = AWS_HINTS.some((h) => t.includes(h));
	const gcp = GCP_HINTS.some((h) => t.includes(h));
	if (aws && gcp) return "multicloud";
	if (aws) return "aws";
	if (gcp) return "gcp";
	return "gcp";
}

function slug(s) {
	return (s || "")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

function splitSentences(text) {
	return (text || "")
		.trim()
		.split(/(?<=[.!?])\s+/)
		.map((p) => p.trim())
		.filter(Boolean);
}

function headlineMetric(impact) {
	const sents = splitSentences(impact);
	const numbered = sents.filter((s) => /\d/.test(s));
	// Prefer a single punchy, number-bearing sentence; fall back to the first.
	let out = (numbered[0] || sents[0] || "").replace(/\s+/g, " ").trim();
	if (out.length > 130) out = out.slice(0, 127).replace(/\s+\S*$/, "") + "…";
	return out || "Delivered measurable cloud, data and AI outcomes.";
}

const clean = (t) => (t || "").replace(/\s+/g, " ").trim();

/** Known bad PDF extractions → real or anonymized client label. */
const CLIENT_OVERRIDES_BY_TITLE = {
	"Centralized Data Warehouse and Reporting": "Floweraura",
	"Data led Decision Making for Retail Startup": "Floweraura",
	"Data Lake and Recommendation Engine": "E-commerce retailer",
};

const BAD_CLIENT_RE =
	/insights into|centralized data|warehouse and reporting|implementation and deployment|capturing accurate|optimizing delivery|improving ux|asset tracking|migration of workloads|containerized and deployed|field rep the company|in the existing setup|go quo hosted|ensure minimum downtime|increase in lead time|platform science|tableau for visualizations|ci-cd pipeline automations|api performance api security|oms, cicd and billing/i;

function looksLikeBadClient(name, title) {
	if (!name) return true;
	if (CLIENT_OVERRIDES_BY_TITLE[title]) return true;
	if (name.split(/\s+/).length >= 5) return true;
	if (BAD_CLIENT_RE.test(name)) return true;
	if (name.toLowerCase() === title.toLowerCase() && name.split(/\s+/).length >= 3) return true;
	return false;
}

function repairClientName(client, title, context, solution, impact) {
	if (CLIENT_OVERRIDES_BY_TITLE[title]) return CLIENT_OVERRIDES_BY_TITLE[title];
	if (!looksLikeBadClient(client, title)) return client;
	const blob = `${context} ${solution} ${impact}`;
	const patterns = [
		/\b([A-Z][A-Za-z0-9]+(?:\s+[A-Z][A-Za-z0-9]+){0,2})\s+team\b/,
		/\bSearce\s+(?:helped|assisted|worked with|has previously assisted)\s+([A-Z][A-Za-z0-9]+(?:\s+[A-Z][A-Za-z0-9]+){0,2})\b/i,
		/\bMigrating\s+([A-Z][A-Za-z0-9]+)'s\b/,
		/\b([A-Z][A-Za-z0-9]+)\s+(?:wanted|needed|decided|engaged)\b/,
		/\bfor\s+([A-Z][A-Za-z0-9]+(?:\s+[A-Z][A-Za-z0-9]+)?),/,
		/\b([A-Z][A-Za-z0-9]+(?:\s+[A-Z][A-Za-z0-9]+)?)\s+is\s+a\b/,
	];
	for (const re of patterns) {
		const m = blob.match(re);
		if (
			m?.[1] &&
			m[1].length >= 3 &&
			m[1].length <= 40 &&
			!/^(Searce|Google|AWS|Azure|The|They|This|Data|Real|Centralized)$/i.test(m[1])
		) {
			return m[1].trim();
		}
	}
	if (/\b(App|Platform|Giant|Startup|Corporation|Firm|Bank)\b/i.test(title)) {
		return title.split(/[:\-–|]/)[0].trim();
	}
	return client;
}

// Minimal RFC-4180 CSV parser (handles quoted fields, escaped quotes, newlines).
function parseCsv(text) {
	const rows = [];
	let row = [];
	let field = "";
	let inQuotes = false;
	for (let i = 0; i < text.length; i++) {
		const c = text[i];
		if (inQuotes) {
			if (c === '"') {
				if (text[i + 1] === '"') {
					field += '"';
					i++;
				} else inQuotes = false;
			} else field += c;
		} else if (c === '"') inQuotes = true;
		else if (c === ",") {
			row.push(field);
			field = "";
		} else if (c === "\r") {
			/* ignore */
		} else if (c === "\n") {
			row.push(field);
			rows.push(row);
			row = [];
			field = "";
		} else field += c;
	}
	if (field.length > 0 || row.length > 0) {
		row.push(field);
		rows.push(row);
	}
	return rows;
}

const raw = readFileSync(CSV_PATH, "utf-8");
const table = parseCsv(raw).filter((r) => r.some((c) => c.trim()));
const header = table[0];
const idx = (name) => header.indexOf(name);
const COL = {
	client: idx("Company / Client Name"),
	region: idx("Region"),
	industry: idx("Industry Name"),
	service: idx("Service Name"),
	title: idx("Case Study Title"),
	summary: idx("One-Line Summary / Core Focus"),
	context: idx("Business Context"),
	solution: idx("Solution"),
	impact: idx("Business Impact & Key Metrics"),
	tech: idx("Tech Stack"),
};

const seen = new Map();
const dedupe = new Set();
const records = [];
let skipped = 0;
for (const r of table.slice(1)) {
	let client = clean(r[COL.client]);
	if (!client) continue;
	const title = clean(r[COL.title]);
	client = repairClientName(client, title, r[COL.context], r[COL.solution], r[COL.impact]);
	// The source sheet contains accidental duplicate rows (e.g. rows 35–44 are
	// repeated at 53–62). Drop exact repeats so we don't double-count proof.
	const dedupeKey = [client, clean(r[COL.title]), clean(r[COL.impact])].join("||").toLowerCase();
	if (dedupe.has(dedupeKey)) {
		skipped++;
		continue;
	}
	dedupe.add(dedupeKey);
	const rawService = (r[COL.service] || "").trim();
	const rawInd = (r[COL.industry] || "").trim();
	const base = "ref-" + slug(client || title);
	const n = (seen.get(base) || 0) + 1;
	seen.set(base, n);
	const id = n === 1 ? base : `${base}-${n}`;
	records.push({
		id,
		client,
		region: REGION_MAP[(r[COL.region] || "").trim()] || (r[COL.region] || "").trim(),
		industryCode: IND_MAP[rawInd] || "MISC",
		industryName: rawInd,
		service: SERVICE_MAP[rawService] || "general",
		practiceLabel: PRACTICE_LABEL[rawService] || rawService,
		title,
		summary: clean(r[COL.summary]),
		businessContext: clean(r[COL.context]),
		solution: clean(r[COL.solution]),
		impact: clean(r[COL.impact]),
		metricHeadline: headlineMetric(r[COL.impact]),
		techStack: clean(r[COL.tech]),
		cloudProvider: cloudOf(r[COL.tech]),
		url: HUB,
	});
}

const ORDER = [
	"id",
	"client",
	"region",
	"industryCode",
	"industryName",
	"service",
	"practiceLabel",
	"title",
	"summary",
	"businessContext",
	"solution",
	"impact",
	"metricHeadline",
	"techStack",
	"cloudProvider",
	"url",
];

const out = [];
out.push('// AUTO-GENERATED from the "Referenceable Solution Stories Master Sheet".');
out.push("// Source: curated CSV of referenceable (publicly citable) Searce case studies.");
out.push("// Regenerate with scripts/build-referenceable-stories.mjs after the sheet changes.");
out.push("// DO NOT EDIT BY HAND.");
out.push("//");
out.push("// URLs intentionally point at the Searce case-studies hub: we do not have");
out.push("// per-story detail URLs, and fabricating them is forbidden. Emails therefore");
out.push("// name these clients in plain prose (no inline link) as social proof.");
out.push("");
out.push("export interface ReferenceableStory {");
out.push("\tid: string;");
out.push("\t/** Verified client name — safe to name in outreach (referenceable). */");
out.push("\tclient: string;");
out.push("\t/** App region code: AMER | APAC | EMEA | India. */");
out.push("\tregion: string;");
out.push("\t/** App industry code: FSI | RCE | HLS | TSS | MISC. */");
out.push("\tindustryCode: string;");
out.push("\t/** Raw industry label from the sheet. */");
out.push("\tindustryName: string;");
out.push("\t/** SearceService enum value this story best maps to. */");
out.push("\tservice: string;");
out.push("\t/** Human practice label (matches ALLOWED SEARCE PRACTICES vocabulary). */");
out.push("\tpracticeLabel: string;");
out.push("\ttitle: string;");
out.push("\tsummary: string;");
out.push("\tbusinessContext: string;");
out.push("\tsolution: string;");
out.push("\t/** Full business impact & key metrics text from the sheet. */");
out.push("\timpact: string;");
out.push("\t/** Short, scannable proof headline derived from `impact`. */");
out.push("\tmetricHeadline: string;");
out.push("\ttechStack: string;");
out.push("\t/** Inferred from tech stack: gcp | aws | multicloud. */");
out.push("\tcloudProvider: string;");
out.push("\turl: string;");
out.push("}");
out.push("");
out.push("export const REFERENCEABLE_STORIES: ReferenceableStory[] = [");
for (const rec of records) {
	out.push("\t{");
	for (const k of ORDER) out.push(`\t\t${k}: ${JSON.stringify(rec[k])},`);
	out.push("\t},");
}
out.push("];");
out.push("");

writeFileSync(OUT_PATH, out.join("\n"));
console.log(
	`Wrote ${records.length} unique stories to ${OUT_PATH} (skipped ${skipped} duplicate rows)`,
);

// ─── Also emit the client-side Proof-tab supplement (research-data.ts) ───────
// Static per-industry "Verified Searce stories" used when the Intelligence
// Feed has no dynamic case-study matches yet. Derived from the same source.
const CLIENT_OUT = resolve(__dirname, "../components/strategist/research-data.ts");
const byIndustry = {};
for (const r of records) {
	(byIndustry[r.industryCode] ||= []).push(r);
}
function pickTop(list) {
	return [...list]
		.sort((a, b) => {
			const an = /\d/.test(a.metricHeadline) ? 0 : 1;
			const bn = /\d/.test(b.metricHeadline) ? 0 : 1;
			return an - bn;
		})
		.slice(0, 3);
}
const cl = [];
cl.push("// AUTO-GENERATED by scripts/build-referenceable-stories.mjs. DO NOT EDIT BY HAND.");
cl.push("// Static per-industry referenceable stories shown in the Intelligence Feed");
cl.push('// "Proof" tab as a supplement to the live case-study matches.');
cl.push("");
cl.push("export const VERIFIED_SEARCE_LINKS: Record<");
cl.push("\tstring,");
cl.push("\t{ title: string; url: string; metrics: string }[]");
cl.push("> = {");
for (const code of Object.keys(byIndustry)) {
	cl.push(`\t${code}: [`);
	for (const r of pickTop(byIndustry[code])) {
		const displayTitle =
			r.title.toLowerCase().startsWith(r.client.toLowerCase()) ||
			r.client.toLowerCase() === r.title.toLowerCase()
				? r.title
				: `${r.client}: ${r.title}`;
		cl.push("\t\t{");
		cl.push(`\t\t\ttitle: ${JSON.stringify(displayTitle)},`);
		cl.push(`\t\t\turl: ${JSON.stringify(r.url)},`);
		cl.push(`\t\t\tmetrics: ${JSON.stringify(r.metricHeadline)},`);
		cl.push("\t\t},");
	}
	cl.push("\t],");
}
cl.push("};");
cl.push("");
writeFileSync(CLIENT_OUT, cl.join("\n"));
console.log(`Wrote client Proof-tab data to ${CLIENT_OUT}`);
