// Extracts ALL "Referenceable" solution stories from the master-deck PDF text
// (produced via pdftotext) into scripts/referenceable-stories.csv.
//
// Usage:
//   node scripts/extract-referenceable-from-pdf.mjs [path/to/deck.pdf]
//
// Defaults to the WIP master deck in Downloads. Override with env PDF_PATH.

import { execSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEFAULT_PDF = resolve(
	process.env.HOME ?? "",
	"Downloads/_WIP_ Master Deck _ Solution Stories (Case Studies) _ Verticals + Practices - Google Slides.pdf",
);
const PDF_PATH = process.argv[2] ? resolve(process.argv[2]) : DEFAULT_PDF;
const OUT_CSV = resolve(__dirname, "referenceable-stories.csv");
const CURATED_CSV = resolve(__dirname, "referenceable-stories-curated-52.csv.bak");

const REGIONS = new Set(["APAC", "AMER", "EMEA", "Europe", "India"]);
const SECTION_MARKERS = new Set([
	"Business Context",
	"Solution",
	"Technology",
	"Platform",
	"Tech Stack",
	"Impact",
]);
const SERVICE_ALIASES = {
	"infra mod": "Infra Modernization",
	"infra modernization": "Infra Modernization",
	"cloud modernization": "Cloud Modernization",
	"cloud engineering": "Cloud Engineering",
	"data & analytics": "Data & Analytics",
	"data analytics": "Data & Analytics",
	"applied ai": "Applied AI",
	"location intelligence": "Location Intelligence",
	"software engineering": "Software Engineering",
	"future of work": "Future of Work",
	"cloud managed services": "Cloud Managed Services",
};

const INDUSTRY_RAW_TO_NAME = {
	FSI: "Financial Services & Insurance (FSI)",
	"R, C, & E": "Retail, CPG & E-commerce (RCE)",
	"R,C, & E": "Retail, CPG & E-commerce (RCE)",
	RCE: "Retail, CPG & E-commerce (RCE)",
	Retail: "Retail, CPG & E-commerce (RCE)",
	"Retail Ecommerce": "Retail, CPG & E-commerce (RCE)",
	"Retail, CPG & E-commerce": "Retail, CPG & E-commerce (RCE)",
	Healthcare: "Healthcare, Pharma & Life Sciences (HPL)",
	"Healthcare services": "Healthcare, Pharma & Life Sciences (HPL)",
	"Healthcare - surgery": "Healthcare, Pharma & Life Sciences (HPL)",
	HPL: "Healthcare, Pharma & Life Sciences (HPL)",
	TTL: "Travel, Transportation & Logistics (TTL)",
	"TTL - Satellite Analytics": "Travel, Transportation & Logistics (TTL)",
	Logistics: "Travel, Transportation & Logistics (TTL)",
	TMEG: "Telecommunications, Media, Entertainment & Gaming (TMEG)",
	Media: "Telecommunications, Media, Entertainment & Gaming (TMEG)",
	"Media and Entertainment": "Telecommunications, Media, Entertainment & Gaming (TMEG)",
	"Media/Entertainment": "Telecommunications, Media, Entertainment & Gaming (TMEG)",
	"Entertainment & Gaming": "Telecommunications, Media, Entertainment & Gaming (TMEG)",
	"ITES & Professional Services": "ITES & Professional Services",
	ISVs: "ISVs & Emerging Tech",
	"ISV & Emerging Tech": "ISVs & Emerging Tech",
	Manufacturing: "Manufacturing & Mining (MM)",
	MM: "Manufacturing & Mining (MM)",
	"PS & E": "Public Sector & Education (PSE)",
	PSE: "Public Sector & Education (PSE)",
	Fintech: "Financial Services & Insurance (FSI)",
	FinTech: "Financial Services & Insurance (FSI)",
	Finance: "Financial Services & Insurance (FSI)",
	Banking: "Financial Services & Insurance (FSI)",
	Insurance: "Financial Services & Insurance (FSI)",
	"Wealth Management": "Financial Services & Insurance (FSI)",
	"Institutional Capital Provider": "Financial Services & Insurance (FSI)",
	"Open Finance Platform": "Financial Services & Insurance (FSI)",
	"E-commerce": "Retail, CPG & E-commerce (RCE)",
	"E Commerce": "Retail, CPG & E-commerce (RCE)",
	"Real Estate": "Real Estate",
	"Automation Industry": "Manufacturing & Mining (MM)",
	"Training & Learning applications": "Public Sector & Education (PSE)",
	Telecommunications: "Telecommunications, Media, Entertainment & Gaming (TMEG)",
	"Digital Marketing": "ITES & Professional Services",
	"Digital Life Sciences": "Healthcare, Pharma & Life Sciences (HPL)",
	"Consumer Electronics Retail": "Retail, CPG & E-commerce (RCE)",
	"Enterprise resource planning": "ITES & Professional Services",
	"Market Intelligence": "ITES & Professional Services",
	Blockchain: "ISVs & Emerging Tech",
	"GCP ISVs": "ISVs & Emerging Tech",
	"GCP TTL": "Travel, Transportation & Logistics (TTL)",
	EC2: "Healthcare, Pharma & Life Sciences (HPL)",
	Telehealth: "Healthcare, Pharma & Life Sciences (HPL)",
};

function clean(t) {
	return (t || "").replace(/\s+/g, " ").trim();
}

function isReferenceable(slide) {
	if (/non[- ]?referenceable/i.test(slide)) return false;
	return /\bReferenceable\b/i.test(slide);
}

function normalizeService(raw) {
	let s = clean(raw)
		.split(/\b(?:Referenceable|Non-referenceable)\b/i)[0]
		.replace(/\b(?:Storage|DNS|Cloud|Platform|Engine)\b\s*$/gi, "")
		.replace(/\|/g, " ")
		.replace(/\bI\b/g, " ")
		.replace(/Practice SBU - To be Discarded/gi, "")
		.trim();
	const key = s.toLowerCase();
	if (SERVICE_ALIASES[key]) return SERVICE_ALIASES[key];
	for (const [k, v] of Object.entries(SERVICE_ALIASES)) {
		if (key.includes(k)) return v;
	}
	// "Cloud Engineering | Cloud Modernization" → pick first recognized
	for (const part of s.split(/\s*\|\s*/)) {
		const p = part.trim().toLowerCase();
		if (SERVICE_ALIASES[p]) return SERVICE_ALIASES[p];
	}
	return s || "Cloud Modernization";
}

function normalizeIndustry(raw) {
	const r = clean(raw).replace(/\|/g, " ").trim();
	if (INDUSTRY_RAW_TO_NAME[r]) return INDUSTRY_RAW_TO_NAME[r];
	for (const [k, v] of Object.entries(INDUSTRY_RAW_TO_NAME)) {
		if (r.startsWith(k)) return v;
	}
	// Sub-industry footers like "Fintech | Cloud Modernization"
	const first = r.split(/\s*\|\s*/)[0]?.trim() ?? r;
	if (INDUSTRY_RAW_TO_NAME[first]) return INDUSTRY_RAW_TO_NAME[first];
	return "Other Industries";
}

const INDUSTRY_FOOTER_RE =
	/^(FSI|RCE|HPL|TTL|GCP TTL|TMEG|ISVs|ITES|Manufacturing|PS & E|Fintech|FinTech|Finance|Banking|Insurance|Wealth Management|Institutional Capital Provider|Open Finance Platform|R, C, & E|R,C, & E|Healthcare(?:\s*-\s*surgery)?|Healthcare services|E-commerce|E Commerce|Retail(?:\s*Ecommerce)?|Retail, CPG & E-commerce|Real Estate|Telecommunications|Digital Marketing|Automation Industry|Training & Learning applications|Blockchain|GCP ISVs|Consumer Electronics Retail|Enterprise resource planning|Market Intelligence|Digital Life Sciences|Logistics|Media(?:\s*and\s*Entertainment)?|Media\/Entertainment|Entertainment & Gaming|EC2 Telehealth|TTL - Satellite Analytics)\s*(?:[I|]\s*|\|\s*)(.+)$/i;

function parseIndustryService(slide) {
	const lines = slide
		.split("\n")
		.map((l) => l.trim())
		.filter(Boolean);
	const candidates = [];
	for (const l of lines) {
		if (SECTION_MARKERS.has(l) || /^PR-\d+/i.test(l) || /^\d+$/.test(l)) continue;
		if (/\bReferenceable\b/i.test(l)) continue;
		const m = l.match(INDUSTRY_FOOTER_RE);
		if (m) {
			candidates.push({ industry: m[1], service: m[2] });
		}
	}
	if (candidates.length > 0) {
		const last = candidates[candidates.length - 1];
		return {
			industryName: normalizeIndustry(last.industry),
			serviceName: normalizeService(last.service),
		};
	}
	return { industryName: "Other Industries", serviceName: "Cloud Modernization" };
}

function extractSection(lines, startLabel, endLabels) {
	const start = lines.findIndex((l) => l === startLabel);
	if (start < 0) return "";
	const end = lines.length;
	for (const label of endLabels) {
		const idx = lines.findIndex((l, i) => i > start && l === label);
		if (idx >= 0 && idx < end) {
			/* keep earliest end */ void 0;
		}
	}
	let endIdx = lines.length;
	for (let i = start + 1; i < lines.length; i++) {
		if (endLabels.includes(lines[i])) {
			endIdx = i;
			break;
		}
	}
	return clean(lines.slice(start + 1, endIdx).join(" "));
}

const TECH_LINE_RE =
	/^(?:Google |Amazon |AWS |Azure |Cloud |BigQuery|Bigquery|GKE|GCS|GCP |Kubernetes|Compute Engine|Cloud Run|Cloud SQL|Cloud Build|Cloud Armor|Cloud Functions|Cloud Storage|Dataflow|Dataproc|Vertex|Apigee|Looker|Terraform|Jenkins|Helm|Pub\/Sub|Memorystore|Dialogflow|Directions API|Geocoding API|Places|Fivetran|Spanner|Lambda|EC2|RDS|S3|EKS|Redshift|DMS|EMR|Athena|Kinesis|ECS|CloudWatch|IAM|VPC|CDN|Redis|MongoDB|Kafka|Elastic|ScyllaDB|Striim|Airflow|Composer|Datastream|Secret Manager|Artifact Registry|BeyondCorp|Cloud VPN|Cloud NAT|Load Balancing|Security Command|SonarQube|Bitbucket|ArgoCD|Buildkite|MySQL|Oracle|PostgreSQL|MSSQL|Snowflake|Databricks|Rook|Ceph|Dataproc|Firestore|App Engine|Datastore|QuickSight|Quicksight|SSM|WAF|KMS|Route 53|Control Tower|Transit Gateway|Network Firewall|Guard Duty|Security Hub|Lex|SSO|WinSW|JavaScript|Python|Java\b)/i;

function isTechLine(l) {
	if (!l || l.length < 3 || l.length > 120) return false;
	if (SECTION_MARKERS.has(l)) return false;
	if (INDUSTRY_FOOTER_RE.test(l)) return false;
	if (/\bReferenceable\b/i.test(l)) return false;
	if (/^PR-\d+/i.test(l) || /^\d+$/.test(l)) return false;
	return (
		TECH_LINE_RE.test(l) ||
		/\b(API|Engine|Registry|Manager|Service|Stack|Studio|Gateway|Operator)\b/i.test(l)
	);
}

function extractTechStack(lines) {
	const parts = [];
	const start = lines.findIndex((l) => l === "Tech Stack");
	if (start >= 0) {
		let endIdx = lines.length;
		for (let i = start + 1; i < lines.length; i++) {
			const l = lines[i];
			if (l === "Impact" || INDUSTRY_FOOTER_RE.test(l) || /\bReferenceable\b/i.test(l)) {
				endIdx = i;
				break;
			}
		}
		for (const l of lines.slice(start + 1, endIdx)) {
			if (isTechLine(l)) parts.push(l);
		}
	}
	// PDF often places tech names under Technology/Platform without a Tech Stack header.
	if (parts.length === 0) {
		const techStart = lines.findIndex((l) => l === "Technology" || l === "Platform");
		const impactIdx = lines.findIndex((l) => l === "Impact");
		if (techStart >= 0 && impactIdx > techStart) {
			for (const l of lines.slice(techStart + 1, impactIdx)) {
				if (isTechLine(l)) parts.push(l);
			}
		}
	}
	return clean([...new Set(parts)].join(", "));
}

function extractRegion(lines) {
	for (let i = 0; i < Math.min(lines.length, 20); i++) {
		const l = lines[i];
		if (REGIONS.has(l)) return l === "Europe" ? "EMEA" : l;
	}
	return "APAC";
}

function extractTitleAndSummary(lines) {
	const body = [];
	for (const l of lines) {
		if (l === "Business Context") break;
		if (SECTION_MARKERS.has(l)) continue;
		if (REGIONS.has(l)) continue;
		body.push(l);
	}
	const title = clean(body[0] ?? "Untitled");
	const summary = clean(body.slice(1).join(" "));
	return { title, summary: summary || title };
}

const CLIENT_PATTERNS = [
	/\bMigrating\s+([A-Z][A-Za-z0-9][\w &.'-]{1,30})'s\b/,
	/\b([A-Z][A-Za-z0-9][\w &.'-]{1,40}?)\s+(?:wanted|needed|decided|engaged|partnered|opt(?:ed)?|is|was|had|runs|operates|provides|holds|collates)\b/,
	/\bSearce\s+(?:helped|worked with|assisted|team deployed|successfully migrated)\s+(?:the\s+)?([A-Z][A-Za-z0-9][\w &.'-]{1,40}?)\b/i,
	/\bSearce\s+has\s+previously\s+assisted\s+([A-Z][A-Za-z0-9][\w &.'-]{1,40}?)\b/i,
	/\bFor\s+([A-Z][A-Za-z0-9][\w &.'-]{1,40}?),/,
	/\b([A-Z][A-Za-z0-9][\w &.'-]{1,40}?)'s\b/,
	/\b([A-Z][A-Za-z0-9][\w &.'-]{1,40}?)\s+-\s+/,
];

const DESCRIPTIVE_TITLE_RE =
	/\b(App|Platform|Firm|Giant|Startup|Corporation|Company|Agency|Provider|Group|Bank|Insurance|Airline|Retailer|Marketplace|Studio|Client)\b/i;

function extractClient(title, summary, businessContext, impact) {
	const blob = `${summary} ${businessContext} ${impact}`;
	for (const re of CLIENT_PATTERNS) {
		const m = blob.match(re);
		if (m?.[1]) {
			let c = clean(m[1]);
			c = c.replace(/^(The|A|An|Their|This|That|We|Our)\s+/i, "").trim();
			if (
				c.length >= 3 &&
				c.length <= 50 &&
				!/^(Searce|Google|AWS|Azure|GCP|PickMe)$/i.test(c)
			) {
				return c;
			}
		}
	}
	// Anonymized / descriptive titles used as client label in outreach
	if (DESCRIPTIVE_TITLE_RE.test(title)) {
		return clean(title.split(/[:\-–|]/)[0]);
	}
	const short = clean(title.split(/[:\-–|]/)[0]);
	if (short.length >= 8 && short.length <= 60) return short;
	return clean(title.slice(0, 60));
}

function parseSlide(slide) {
	const lines = slide
		.split("\n")
		.map((l) => l.trim())
		.filter(Boolean);
	const { title, summary } = extractTitleAndSummary(lines);
	const region = extractRegion(lines);
	const businessContext = extractSection(lines, "Business Context", [
		"Solution",
		"Technology",
		"Impact",
	]);
	const solution = extractSection(lines, "Solution", ["Technology", "Tech Stack", "Impact"]);
	const impact = extractSection(lines, "Impact", []);
	// Trim impact at industry/footer noise
	const impactClean = clean(
		impact
			.split(/\b(?:FSI|RCE|Healthcare|TTL|TMEG|Fintech|Insurance|Banking)\s*[|I]/)[0]
			.replace(/\bReferenceable\b.*$/i, ""),
	);
	const techStack = extractTechStack(lines);
	const { industryName, serviceName } = parseIndustryService(slide);
	const client = extractClient(title, summary, businessContext, impactClean);

	return {
		client,
		region,
		industryName,
		serviceName,
		title,
		summary,
		businessContext: businessContext || summary,
		solution: solution || "",
		impact: impactClean || "",
		techStack: techStack || "",
	};
}

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
			/* skip */
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

function normKey(title) {
	return clean(title)
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "");
}

function loadCuratedOverrides() {
	if (!existsSync(CURATED_CSV)) return new Map();
	const table = parseCsv(readFileSync(CURATED_CSV, "utf-8"));
	const header = table[0];
	const idx = (n) => header.indexOf(n);
	const map = new Map();
	for (const r of table.slice(1)) {
		const title = clean(r[idx("Case Study Title")]);
		if (!title) continue;
		map.set(normKey(title), {
			client: clean(r[idx("Company / Client Name")]),
			region: clean(r[idx("Region")]),
			industryName: clean(r[idx("Industry Name")]),
			serviceName: clean(r[idx("Service Name")]),
			title,
			summary: clean(r[idx("One-Line Summary / Core Focus")]),
			businessContext: clean(r[idx("Business Context")]),
			solution: clean(r[idx("Solution")]),
			impact: clean(r[idx("Business Impact & Key Metrics")]),
			techStack: clean(r[idx("Tech Stack")]),
		});
	}
	return map;
}

function csvEscape(v) {
	const s = String(v ?? "");
	if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
	return s;
}

function toCsvRow(r) {
	return [
		r.client,
		r.region,
		r.industryName,
		r.serviceName,
		r.title,
		r.summary,
		r.businessContext,
		r.solution,
		r.impact,
		r.techStack,
	]
		.map(csvEscape)
		.join(",");
}

// ─── Main ───────────────────────────────────────────────────────────────────

if (!existsSync(PDF_PATH)) {
	console.error(`PDF not found: ${PDF_PATH}`);
	console.error("Pass path as argv[1] or set a valid default.");
	process.exit(1);
}

const txtPath = resolve(__dirname, ".tmp-master-deck-extract.txt");
execSync(`pdftotext "${PDF_PATH}" "${txtPath}"`, { stdio: "pipe" });
const text = readFileSync(txtPath, "latin1");
const slides = text
	.split("\f")
	.map((s) => s.trim())
	.filter(Boolean);

const curated = loadCuratedOverrides();
const records = [];
const seen = new Set();
let skippedDup = 0;
let curatedHits = 0;

for (const slide of slides) {
	if (!isReferenceable(slide)) continue;
	let rec = parseSlide(slide);
	const override = curated.get(normKey(rec.title));
	if (override) {
		rec = { ...rec, ...override };
		curatedHits++;
	}
	const dedupeKey = `${normKey(rec.client)}||${normKey(rec.title)}`;
	if (seen.has(dedupeKey)) {
		skippedDup++;
		continue;
	}
	seen.add(dedupeKey);
	if (!rec.impact && !rec.solution && !rec.businessContext) continue;
	records.push(rec);
}

const header =
	"Company / Client Name,Region,Industry Name,Service Name,Case Study Title,One-Line Summary / Core Focus,Business Context,Solution,Business Impact & Key Metrics,Tech Stack";
const csv = [header, ...records.map(toCsvRow)].join("\n") + "\n";
writeFileSync(OUT_CSV, csv);

console.log(`Extracted ${records.length} referenceable stories → ${OUT_CSV}`);
console.log(`  Skipped ${skippedDup} exact duplicate client+title pairs`);
console.log(`  Applied ${curatedHits} curated-sheet overrides (client names + richer fields)`);
