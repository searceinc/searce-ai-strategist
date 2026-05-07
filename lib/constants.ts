import type {
	ContentFormat,
	EmailSequenceLength,
	LinkedinInmailVariation,
	NurtureTemplate,
	SearceService,
	StrategicAngle,
} from "@/lib/types";
import {
	SHEET_INDUSTRIES,
	INDUSTRY_CATEGORIES,
	CATEGORY_SUBCATEGORIES,
	type CategoryOption,
	type IndustryOption,
	type SubCategoryOption,
} from "@/lib/sheet-taxonomy";

// ─── Industries ─────────────────────────────────────────────────────────────
//
// Sheet 1 is the canonical source. Anything below the "Other industries"
// divider is an extra not present in the workbook — kept so old sessions
// don't 404 in the dropdown.

const SHEET_INDUSTRY_OPTIONS: IndustryOption[] = SHEET_INDUSTRIES;

const EXTRA_INDUSTRY_OPTIONS: IndustryOption[] = [{ value: "MISC", label: "Other Industries" }];

export const INDUSTRIES: ReadonlyArray<IndustryOption> = [
	...SHEET_INDUSTRY_OPTIONS,
	...EXTRA_INDUSTRY_OPTIONS,
];

export const INDUSTRY_LABELS: Record<string, string> = Object.fromEntries(
	INDUSTRIES.map((i) => [i.value, i.label]),
);

/** Sheet-driven only; used for cascading dropdowns. */
export { INDUSTRY_CATEGORIES, CATEGORY_SUBCATEGORIES };
export type { CategoryOption, SubCategoryOption };

export function getCategoryOptions(industryCode: string): CategoryOption[] {
	return INDUSTRY_CATEGORIES[industryCode] ?? [];
}

export function getSubCategoryOptions(industryCode: string, category: string): SubCategoryOption[] {
	return CATEGORY_SUBCATEGORIES[industryCode]?.[category] ?? [];
}

/** Aggregated label maps (id → display label). */
export const CATEGORY_LABELS: Record<string, string> = (() => {
	const out: Record<string, string> = {};
	for (const cats of Object.values(INDUSTRY_CATEGORIES)) {
		for (const c of cats) out[c.value] = c.label;
	}
	return out;
})();

export const SUB_CATEGORY_LABELS: Record<string, string> = (() => {
	const out: Record<string, string> = {};
	for (const byCat of Object.values(CATEGORY_SUBCATEGORIES)) {
		for (const subs of Object.values(byCat)) {
			for (const s of subs) out[s.value] = s.label;
		}
	}
	return out;
})();

// ─── Cloud Ecosystems ───────────────────────────────────────────────────────

export const CLOUD_ECOSYSTEMS = [
	{ value: "gcp", label: "Google Cloud", icon: "☁️" },
	{ value: "aws", label: "AWS", icon: "🔶" },
	{ value: "multicloud", label: "Multi-Cloud", icon: "🌐" },
] as const;

// ─── Content Formats ────────────────────────────────────────────────────────

export const CONTENT_FORMATS: { value: ContentFormat; label: string; description: string }[] = [
	{ value: "cold_email", label: "Cold Email", description: "First-touch outbound email" },
	{ value: "sales_email", label: "Sales Email", description: "Solution-oriented sales pitch" },
	{ value: "nurture_email", label: "Nurture Email", description: "Value-driven follow-up" },
	{
		value: "email_sequence",
		label: "Email Sequence",
		description: "Multi-touch cadence (3, 5, or 6 emails)",
	},
	{
		value: "linkedin_inmail",
		label: "LinkedIn InMail",
		description: "Personal, low-pressure outreach",
	},
	{
		value: "linkedin_conversational_ad",
		label: "LinkedIn Conversation Ad",
		description: "Choose-your-own-path Sponsored Messaging flow",
	},
];

export const NURTURE_TEMPLATE_OPTIONS: {
	value: NurtureTemplate;
	label: string;
	description: string;
}[] = [
	{
		value: "1",
		label: "Template 1 — Introduction",
		description: "Dear [Name] intro, role relevance, proof line, 15-min ask",
	},
	{
		value: "2",
		label: "Template 2 — Post-call / capabilities",
		description: "Thank-you opener, service pillars, 30-min + contact CTA",
	},
	{
		value: "3",
		label: "Template 3 — Industry provocation",
		description: "Short strategic hook, sector proof, 10-min ask",
	},
];

export const EMAIL_SEQUENCE_LENGTH_OPTIONS: {
	value: EmailSequenceLength;
	label: string;
}[] = [
	{ value: 3, label: "3 emails (open → proof → closer)" },
	{ value: 5, label: "5 emails (full arc)" },
	{ value: 6, label: "6 emails (+ strategic check-in)" },
];

export const LINKEDIN_INMAIL_VARIATION_OPTIONS: {
	value: LinkedinInmailVariation;
	label: string;
	description: string;
}[] = [
	{
		value: "1",
		label: "Variation 1 — Leadership / role",
		description: "AI-native angle, event/booth hooks, bullet value props",
	},
	{
		value: "2",
		label: "Variation 2 — VIP / 1:1",
		description: "Quiet space, company-specific session, checklist + book CTA",
	},
];

// ─── Searce Services ────────────────────────────────────────────────────────

export const SEARCE_SERVICES: { value: SearceService; label: string; description: string }[] = [
	{
		value: "cloud_modernization",
		label: "Cloud Modernisation",
		description: "Migration, infra modernization, multi-cloud",
	},
	{
		value: "data_analytics",
		label: "Data & Analytics",
		description: "Data platform, BI, lakehouse, streaming",
	},
	{
		value: "ai_automation",
		label: "Applied AI (GenAI/ML)",
		description: "Gen AI, ML ops, intelligent automation",
	},
	{
		value: "location_intelligence",
		label: "Location Intelligence",
		description: "Geospatial analytics, maps, fleet management",
	},
	{
		value: "devops_platform_engineering",
		label: "Software Engineering",
		description: "CI/CD, Kubernetes, platform as a product",
	},
	{
		value: "finops_cost_optimization",
		label: "Managed Services",
		description: "Cloud cost management, SRE, monitoring",
	},
	{
		value: "enterprise_transformation",
		label: "Future of Work",
		description: "Workspace, app modernization, change management",
	},
];

// ─── Regions ────────────────────────────────────────────────────────────────

export const REGIONS = [
	{ value: "AMER", label: "Americas" },
	{ value: "APAC", label: "Asia Pacific" },
	{ value: "EMEA", label: "Europe, Middle East & Africa" },
	{ value: "India", label: "India" },
] as const;

export const REGION_LABELS: Record<string, string> = Object.fromEntries(
	REGIONS.map((r) => [r.value, r.label]),
);

// ─── Confidence Thresholds ──────────────────────────────────────────────────

export const CONFIDENCE = {
	HIGH: 0.8,
	MEDIUM: 0.5,
	LOW: 0.3,
} as const;

export function confidenceLabel(score: number): "High" | "Medium" | "Low" {
	if (score >= CONFIDENCE.HIGH) return "High";
	if (score >= CONFIDENCE.MEDIUM) return "Medium";
	return "Low";
}

export function confidenceColor(score: number): string {
	if (score >= CONFIDENCE.HIGH) return "text-green-600 dark:text-green-400";
	if (score >= CONFIDENCE.MEDIUM) return "text-yellow-600 dark:text-yellow-400";
	return "text-red-500 dark:text-red-400";
}

// ─── Strategic Angles ───────────────────────────────────────────────────────

export const STRATEGIC_ANGLES: { value: StrategicAngle; label: string; description: string }[] = [
	{ value: "pain_point", label: "Pain Point", description: "Empathetic problem-first approach" },
	{ value: "roi_metrics", label: "ROI / Metrics", description: "Data-driven value narrative" },
	{ value: "social_proof", label: "Social Proof", description: "Case study-led storytelling" },
	{
		value: "direct_pitch",
		label: "Direct Pitch",
		description: "Confident, solution-first pitch",
	},
];
