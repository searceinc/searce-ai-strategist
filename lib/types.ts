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

/** LinkedIn InMail copy variant. */
export type LinkedinInmailVariation = "1" | "2";

export type StrategicAngle = "pain_point" | "roi_metrics" | "social_proof" | "direct_pitch";

export type SearceService =
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
	targetPersonaIndustry: string;
	targetPersonaFunction: string;
	targetPersonaSubFunction: string;
	targetPersonaJobTitle: string;
	region: string;
	selectedService: SearceService | "";
	selectedFormat: ContentFormat;
	strategicAngle: StrategicAngle;
	cloudEcosystem: string;
	intelligentFallback: boolean;
	notes: string;
	/** Used when selectedFormat is nurture_email. */
	nurtureTemplate: NurtureTemplate;
	/** Used when selectedFormat is email_sequence. */
	emailSequenceLength: EmailSequenceLength;
	/** Used when selectedFormat is linkedin_inmail. */
	linkedinInmailVariation: LinkedinInmailVariation;
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
	isLiveData: boolean;
	timestamp: string;
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
		isLiveData: r.isLiveData ?? false,
		timestamp: r.timestamp ?? "",
	};
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
	departments: string[];
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
	featureNotAvailable?: boolean;
	noMatchMessage?: string;
}
