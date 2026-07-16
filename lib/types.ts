import type { Timestamp } from "firebase/firestore";

// ─── Enums / Union Types ────────────────────────────────────────────────────

export type ContentFormat =
	| "cold_email"
	| "sales_email"
	| "nurture_email"
	| "email_sequence"
	| "linkedin_inmail"
	| "linkedin_conversational_ad";

/** Nurture email structural variant (maps to internal templates). */
export type NurtureTemplate = "1" | "2" | "3";

/** Multi-touch email sequence length (emails 1–N follow the strategic arc below). */
export type EmailSequenceLength = 3 | 5 | 6;

/**
 * Universal "Sequence count" for ANY content format. 1 = single touch (default).
 * 2–5 routes single-email formats through the sequence schema so cold / sales /
 * nurture / linkedin_inmail / linkedin_conversational_ad all support multi-touch.
 */
export type SequenceCount = 1 | 2 | 3 | 4 | 5;

/** LinkedIn InMail copy variant. */
export type LinkedinInmailVariation = "1" | "2";

export type StrategicAngle =
	| "pain_point"
	| "roi_metrics"
	| "social_proof"
	| "direct_pitch"
	| "strategic_priority";

/** Account-level (generic company POV) vs persona-level (named individual). */
export type GenerationMode = "account" | "persona";
/** Persona-level only: buying role in the deal. */
export type PersonaType = "champion" | "economic_buyer" | "influencer_user" | "blocker";
/** Persona-level only: how this contact enters the sales motion. */
export type PersonaEntrancePath = "bottoms_up" | "top_down" | "middle_out";

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

// ─── Input / Config ─────────────────────────────────────────────────────────

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
	/** Persona-level only: the named contact's full name. */
	personaName: string;
	/** Persona-level only: the named contact's LinkedIn profile URL. */
	personaLinkedInUrl: string;
	/** Persona-level only: buying role in the deal. */
	personaType?: PersonaType;
	/** Persona-level only: how this contact enters the sales motion. */
	personaEntrancePath?: PersonaEntrancePath;
	region: string;
	selectedService: SearceService | "";
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
	/** Used when selectedFormat is nurture_email. */
	nurtureTemplate: NurtureTemplate;
	/** Used when selectedFormat is email_sequence. */
	emailSequenceLength: EmailSequenceLength;
	/** Used when selectedFormat is linkedin_inmail. */
	linkedinInmailVariation: LinkedinInmailVariation;
	/**
	 * Universal touches count for non-`email_sequence` formats.
	 * 1 = single touch (default). 2–5 routes the format through the sequence schema.
	 * Ignored for `email_sequence` (which uses `emailSequenceLength` instead).
	 */
	sequenceCount: SequenceCount;
	/**
	 * Ephemeral: centers generation on a chosen Intelligence Feed signal.
	 * Stripped before persisting sessions.
	 */
	intelligenceFeedFocus: string;
}

// ─── Tavily ─────────────────────────────────────────────────────────────────

export interface TavilyResult {
	title: string;
	url: string;
	content: string;
	score: number;
	publishedDate?: string;
}

// ─── Research ───────────────────────────────────────────────────────────────

export interface ResearchSnapshot {
	companyContext: string;
	industryTrends: string[];
	painPoints: string[];
	metrics: string[];
	sources: TavilyResult[];
	tavilyAnswer?: string;
	newsWithUrls: { title: string; url: string; content: string }[];
	metricsWithUrls: { value: string; source: string; sourceUrl: string }[];
	painPointsWithUrls: { text: string; source: string; sourceUrl: string }[];
	/** Third-party URLs (not searce.com) for sidebar sourcing. */
	externalSources: ExternalSourceItem[];
	isLiveData: boolean;
	timestamp: string;
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

export interface ExternalSourceItem {
	title: string;
	url: string;
	kind: "news" | "metric" | "pain" | "reference";
}

/** Firestore / older sessions may omit nested arrays; keeps UI from crashing on `.length`. */
export function normalizeResearchSnapshot(
	r: ResearchSnapshot | null | undefined,
): ResearchSnapshot | null {
	if (!r) return null;
	return {
		...r,
		companyContext: r.companyContext ?? "",
		industryTrends: r.industryTrends ?? [],
		painPoints: r.painPoints ?? [],
		metrics: r.metrics ?? [],
		sources: r.sources ?? [],
		newsWithUrls: r.newsWithUrls ?? [],
		metricsWithUrls: r.metricsWithUrls ?? [],
		painPointsWithUrls: r.painPointsWithUrls ?? [],
		externalSources: r.externalSources ?? [],
		isLiveData: r.isLiveData ?? false,
		timestamp: r.timestamp ?? "",
		personaBio: r.personaBio ?? "",
		personaSignals: r.personaSignals ?? [],
		personaTriggers: r.personaTriggers ?? [],
	};
}

// ─── Strategic Priority (hardcoded, per-industry) ───────────────────────────

/**
 * Display shape for the "Strategic Priority" angle — mode-agnostic so both the
 * account-level StrategicPriority and the persona-level PersonaMessaging (from
 * functions/src/data/strategic-priorities.ts) can populate the same feed tab.
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

// ─── Case Study (hardcoded, verified) ───────────────────────────────────────

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

// ─── Session / Generation ───────────────────────────────────────────────────

export interface StrategistSession {
	id: string;
	userId: string;
	createdAt: Timestamp;
	updatedAt: Timestamp;
	input: GenerationInput;
	research: ResearchSnapshot | null;
	caseStudyMatches: VerifiedCaseStudy[];
	fallbackPath: FallbackPath;
	confidenceScore: number;
	generatedContent: string;
	editedContent: string;
	transparencyNote: string | null;
	strategicPriority?: StrategicPriorityDisplay | null;
	exportCount: number;
	saveCount: number;
	isFavorite: boolean;
}

/** Lightweight version for history lists. */
export interface SessionSummary {
	id: string;
	userId: string;
	createdAt: Timestamp;
	updatedAt: Timestamp;
	mode: GenerationMode;
	targetCompany: string;
	targetPersonaJobTitle: string;
	selectedFormat: ContentFormat;
	strategicAngle: StrategicAngle;
	selectedService: SearceService | "";
	region: string;
	confidenceScore: number;
	fallbackPath: FallbackPath;
	isFavorite: boolean;
	contentPreview: string;
}

// ─── Cloud Function Payloads ────────────────────────────────────────────────

export interface GenerateContentRequest {
	input: GenerationInput;
}

export interface GenerateContentResponse {
	sessionId: string;
	research: ResearchSnapshot;
	caseStudyMatches: VerifiedCaseStudy[];
	fallbackPath: FallbackPath;
	confidenceScore: number;
	generatedContent: string;
	transparencyNote: string | null;
	strategicPriority?: StrategicPriorityDisplay | null;
	featureNotAvailable?: boolean;
	noMatchMessage?: string;
}
