/**
 * Server-side type definitions for Cloud Functions.
 *
 * WHY THIS FILE EXISTS SEPARATELY FROM lib/types.ts:
 * Cloud Functions is a standalone TypeScript project with its own tsconfig
 * and package.json. It compiles and deploys independently to Google Cloud —
 * it cannot import from the Next.js app's `lib/` directory.
 *
 * The shared types (ContentFormat, SearceService, etc.) intentionally mirror
 * lib/types.ts. If you change a shared type, update BOTH files.
 */

export type ContentFormat =
	| "cold_email"
	| "sales_email"
	| "nurture_email"
	| "email_sequence"
	| "linkedin_inmail"
	| "linkedin_conversational_ad";

export type NurtureTemplate = "1" | "2" | "3";
export type EmailSequenceLength = 3 | 5 | 6;
/** Universal multi-touch count for any single-email format (1 = single). */
export type SequenceCount = 1 | 2 | 3 | 4 | 5;
export type LinkedinInmailVariation = "1" | "2";

export type StrategicAngle =
	| "pain_point"
	| "roi_metrics"
	| "social_proof"
	| "direct_pitch"
	| "strategic_priority";

/**
 * account  — generic company POV, one named target account
 * persona  — one named individual
 * generic  — segment/industry level: a roster of companies sharing the same
 *            filters, written for all of them and personalised to none
 */
export type GenerationMode = "account" | "persona" | "generic";
export type PersonaType = "champion" | "economic_buyer" | "influencer_user" | "blocker";

/**
 * The known Searce practices. Note the values below are historical keys — several
 * no longer read like their current label (`finops_cost_optimization` is shown as
 * "Managed Services", `enterprise_transformation` as "Future of Work"). Never
 * derive a display string from the value; use `serviceLabel()` instead.
 */
export type SearceService =
	| "general"
	| "cloud_modernization"
	| "data_analytics"
	| "ai_automation"
	| "location_intelligence"
	| "devops_platform_engineering"
	| "finops_cost_optimization"
	| "enterprise_transformation";

export type FallbackPath =
	| "exact_match"
	| "similar_industry"
	| "cross_industry"
	| "capability_proof"
	| "benchmark_only"
	| "none";

export interface GenerationInput {
	targetCompany: string;
	targetDomain: string;
	targetLinkedInUrl: string;
	/** Industry code (e.g. FSI, HLS) sourced from sheet 1. */
	targetPersonaIndustry: string;
	/** Industry-category slug (e.g. "banking") sourced from sheet 2. */
	targetPersonaCategory: string;
	/** Industry-sub-category slug (e.g. "retail-and-consumer") sourced from sheet 3. */
	targetPersonaSubCategory: string;
	targetPersonaJobTitle: string;
	/** Account-level (generic company POV) vs persona-level (named individual). */
	mode: GenerationMode;
	/** Generic mode only: prospect_uploads doc id for the audience roster. */
	prospectUploadId?: string;
	/** Persona-level only: the named contact's full name. */
	personaName: string;
	/** Persona-level only: the named contact's LinkedIn profile URL. */
	personaLinkedInUrl: string;
	/** Persona-level only: buying role in the deal. */
	personaType?: PersonaType;
	region: string;
	/**
	 * A `SearceService` value, a rep-typed custom practice, or "" when unset.
	 * Free string by design — the ConfigPanel offers a "Custom service" input
	 * alongside the dropdown, exactly like targetPersonaJobTitle.
	 */
	selectedService: string;
	selectedFormat: ContentFormat;
	strategicAngle: StrategicAngle;
	/** Used when strategicAngle is "strategic_priority"; empty = auto-match by job title. */
	selectedStrategicPriorityId: string;
	cloudEcosystem: string;
	intelligentFallback: boolean;
	/** Free-text directive that the model MUST follow (e.g. "make it short"). */
	instructions: string;
	/** Private rep notes; never sent to the model. */
	myNotes: string;
	nurtureTemplate: NurtureTemplate;
	emailSequenceLength: EmailSequenceLength;
	linkedinInmailVariation: LinkedinInmailVariation;
	/**
	 * Universal multi-touch count for single-email formats (default 1).
	 * When > 1, the format is rendered through the sequence schema so cold /
	 * sales / nurture / linkedin_inmail / linkedin_conversational_ad all support
	 * multi-touch like the dedicated email_sequence format.
	 */
	sequenceCount: SequenceCount;
	/**
	 * Ephemeral: when set, the model must center the email on this Intelligence Feed
	 * signal. Cleared before persisting sessions; not shown in the config form.
	 */
	intelligenceFeedFocus: string;
}

// ─── Tavily ──────────────────────────────────────────────────────────────────

export interface TavilyResult {
	title: string;
	url: string;
	content: string;
	score: number;
	published_date?: string;
	/**
	 * Full cleaned page text, present only when a search opts in via
	 * `includeRawContent`. Server-only: consumed by the summarizer passes for
	 * richer fact extraction, then stripped before results are persisted to
	 * Firestore / returned to the client (see `runResearch`), since 12 sources
	 * of full-page text would blow past the Firestore doc-size limit.
	 */
	raw_content?: string;
}

export interface TavilyResponse {
	query: string;
	answer?: string;
	results: TavilyResult[];
	response_time: number;
}

// ─── Research ────────────────────────────────────────────────────────────────

export interface ResearchSnapshot {
	companyContext: string;
	industryTrends: string[];
	painPoints: string[];
	metrics: string[];
	sources: TavilyResult[];
	tavilyAnswer?: string;
	newsWithUrls: NewsItem[];
	metricsWithUrls: MetricItem[];
	painPointsWithUrls: PainPointItem[];
	/** Third-party sources (news, stats, pain articles); Searce URLs excluded. */
	externalSources: ExternalSourceItem[];
	isLiveData: boolean;
	timestamp: string;
	/**
	 * Company's own LinkedIn page, resolved from the LinkedIn-scoped search.
	 * Absent when nothing matched — never constructed from the company name.
	 */
	resolvedLinkedInUrl?: string;
	/** Company's website host, parsed off its LinkedIn page. Absent if not found. */
	resolvedDomain?: string;
	/** Persona-level only: named contact's bio/career summary. */
	personaBio?: string;
	/** Persona-level only: dated public signals (quotes, interviews, LinkedIn activity). */
	personaSignals?: PersonaSignalItem[];
	/** Persona-level only: hard/soft evidence bullets that could drive a personalized hook. */
	personaTriggers?: string[];
}

export interface PersonaSignalItem {
	text: string;
	source: string;
	sourceUrl: string;
	date?: string;
}

export interface NewsItem {
	title: string;
	url: string;
	content: string;
}

export interface MetricItem {
	value: string;
	source: string;
	sourceUrl: string;
}

export interface PainPointItem {
	text: string;
	source: string;
	sourceUrl: string;
}

/** Non-Searce URLs for the Intelligence Feed (email body must not link these). */
export interface ExternalSourceItem {
	title: string;
	url: string;
	/** Where this link came from in the research pipeline. */
	kind: "news" | "metric" | "pain" | "reference";
}

// ─── Strategic Priority (hardcoded, per-industry) ────────────────────────────

/**
 * Display shape for the "Strategic Priority" angle — mode-agnostic so both the
 * account-level StrategicPriority and the persona-level PersonaMessaging (from
 * data/strategic-priorities.ts) can populate the same feed tab and be persisted.
 */
export interface StrategicPriorityDisplay {
	source: "strategic_priority" | "persona_messaging";
	title: string;
	headline?: string;
	coreFocus: string;
	painPoints: string[];
	strategicPivot?: string;
	valueProps: string[];
	proofPoints: string[];
	reachout: { hook: string; pivot: string; closer: string };
}

// ─── Case Study (hardcoded, verified) ────────────────────────────────────────

export interface VerifiedCaseStudy {
	id: string;
	title: string;
	client: string;
	metrics: string;
	url: string;
	industries: string[];
	regions: string[];
	/**
	 * Industry-category slugs the case study addresses (e.g. "banking",
	 * "logistics-and-warehousing"). Replaces the old persona-function field.
	 */
	categories: string[];
	cloudProvider: string;
	context: string;
}

// ─── Sheet-driven pain points (server-side) ─────────────────────────────────

export interface SheetPainPointBundle {
	industryCode: string;
	category: string;
	subCategory: string;
	categoryLabel: string;
	subCategoryLabel: string;
	fullId: string | null;
	detailed: string[];
	converged: string[];
	detailedUseCases: string[];
	convergedUseCases: string[];
	/** Searce practices that score >= 2 for these pain points; never claim others. */
	relevantPractices: string[];
}

// ─── Content Brief (assembled server-side, never sent to client) ─────────────

export interface ContentBrief {
	input: GenerationInput;
	research: ResearchSnapshot;
	caseStudies: VerifiedCaseStudy[];
	fallbackPath: FallbackPath;
	usedFallback: boolean;
	fallbackRegion?: string;
	confidenceScore: number;
	industryMetrics: string[];
	sheetPainPoints: SheetPainPointBundle;
	strategicPriority?: StrategicPriorityDisplay | null;
}
