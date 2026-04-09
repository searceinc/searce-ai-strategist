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
	nurtureTemplate: NurtureTemplate;
	emailSequenceLength: EmailSequenceLength;
	linkedinInmailVariation: LinkedinInmailVariation;
}

// ─── Tavily ──────────────────────────────────────────────────────────────────

export interface TavilyResult {
	title: string;
	url: string;
	content: string;
	score: number;
	published_date?: string;
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
	isLiveData: boolean;
	timestamp: string;
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

// ─── Case Study (hardcoded, verified) ────────────────────────────────────────

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
	painPoints: string[];
}
