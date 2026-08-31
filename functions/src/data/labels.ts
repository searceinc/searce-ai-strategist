/**
 * Server-side label maps. Mirrors lib/constants.ts but compiled into the
 * Cloud Functions deploy bundle.
 *
 * Industry codes + display labels follow the Mapped Pain Points workbook
 * (Sheet 1). Anything below the "Other industries" divider is an extra not
 * present in the workbook — kept so legacy session payloads still resolve.
 *
 * CATEGORY_LABELS / SUB_CATEGORY_LABELS are derived from the generated
 * sheet data (Sheets 2 & 3) and re-exported here so prompt builders only
 * need this single import.
 */

import { SHEET_PAIN_POINTS } from "./sheet-pain-points.js";

// ─── Sheet 1 (workbook) ──────────────────────────────────────────────────────

const SHEET_INDUSTRY_LABELS: Record<string, string> = {
	FSI: "Financial Services & Insurance",
	HLS: "Healthcare & Life Sciences",
	TTL: "Travel, Transportation & Logistics",
	RCE: "Retail, CPG & E-commerce",
	TMEG: "Telecommunications, Media, Entertainment & Gaming",
	MCM: "Manufacturing, Construction & Mining",
	TSS: "Technology, Services & Startups",
	EUP: "Energy, Utilities & Power",
	PSE: "Public Sector & Education",
};

// ─── Other industries (kept for legacy / outside the workbook) ──────────────

const EXTRA_INDUSTRY_LABELS: Record<string, string> = {
	GENERAL: "General (any industry)",
	MISC: "Other Industries",
};

export const INDUSTRY_LABELS: Record<string, string> = {
	...SHEET_INDUSTRY_LABELS,
	...EXTRA_INDUSTRY_LABELS,
};

// ─── Categories & Sub-categories (Sheets 2 & 3) ─────────────────────────────

export const CATEGORY_LABELS: Record<string, string> = (() => {
	const out: Record<string, string> = {};
	for (const row of SHEET_PAIN_POINTS) {
		out[row.category] = row.categoryLabel;
	}
	return out;
})();

export const SUB_CATEGORY_LABELS: Record<string, string> = (() => {
	const out: Record<string, string> = {};
	for (const row of SHEET_PAIN_POINTS) {
		out[row.subCategory] = row.subCategoryLabel;
	}
	return out;
})();

// ─── Regions ────────────────────────────────────────────────────────────────

export const REGION_LABELS: Record<string, string> = {
	AMER: "Americas",
	APAC: "Asia Pacific",
	EMEA: "Europe, Middle East & Africa",
	India: "India",
};

export const REGION_FALLBACKS: Record<string, string> = {
	AMER: "APAC",
	APAC: "India",
	EMEA: "India",
	India: "APAC",
};

// ─── Searce services / practices ─────────────────────────────────────────────

/**
 * Display names for the service values the ConfigPanel offers. Mirrors
 * SEARCE_SERVICES in lib/constants.ts.
 *
 * These keys are historical and several no longer match their label, so the
 * prompt must never build a service name by de-underscoring the value — doing
 * that told the model "finops cost optimization" when the rep picked
 * "Managed Services", and "enterprise transformation" for "Future of Work".
 */
export const SERVICE_LABELS: Record<string, string> = {
	general: "General Service",
	cloud_modernization: "Cloud Modernisation",
	data_analytics: "Data & Analytics",
	ai_automation: "Applied AI (GenAI/ML)",
	location_intelligence: "Location Intelligence",
	devops_platform_engineering: "Software Engineering",
	finops_cost_optimization: "Managed Services",
	enterprise_transformation: "Future of Work",
	secops: "SecOps",
};

/**
 * Display name for a service value. Anything not in SERVICE_LABELS is a
 * rep-typed custom practice and is passed through verbatim.
 */
export function serviceLabel(value: string): string {
	const trimmed = (value ?? "").trim();
	if (!trimmed) return "";
	return SERVICE_LABELS[trimmed] ?? trimmed;
}
