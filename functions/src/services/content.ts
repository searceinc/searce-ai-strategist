import { generateStructuredWithGemini, generateWithGemini } from "../gemini/client.js";
import { buildSystemPrompt, buildContentPrompt } from "../prompts/templates.js";
import { getVerifiedCaseStudies } from "../data/case-studies.js";
import { getCloudContext } from "../data/cloud-context.js";
import { getIndustryMetrics } from "../data/industry-metrics.js";
import { getSheetPainPoints } from "../data/pain-points.js";
import { migrateLegacyInput } from "../data/legacy-codes.js";
import { REGION_LABELS, INDUSTRY_LABELS } from "../data/labels.js";
import { runResearch } from "./research.js";
import { buildCorrectivePrompt, checkCompliance } from "./compliance.js";
import { assembleSequence, assembleSingleEmail } from "./output-assembler.js";
import {
	SEQUENCE_SCHEMA,
	SINGLE_EMAIL_SCHEMA,
	type SequenceResponse,
	type SingleEmailResponse,
} from "./output-schemas.js";
import type {
	ContentBrief,
	ContentFormat,
	FallbackPath,
	GenerationInput,
	ResearchSnapshot,
	VerifiedCaseStudy,
} from "../types.js";

const SINGLE_EMAIL_FORMATS: ReadonlySet<ContentFormat> = new Set([
	"cold_email",
	"sales_email",
	"nurture_email",
	"linkedin_inmail",
]);

export interface GenerationResult {
	research: ResearchSnapshot;
	caseStudyMatches: VerifiedCaseStudy[];
	fallbackPath: FallbackPath;
	usedFallback: boolean;
	fallbackRegion?: string;
	confidenceScore: number;
	generatedContent: string;
	transparencyNote: string | null;
	featureNotAvailable?: boolean;
	noMatchMessage?: string;
}

function computeConfidence(
	research: ResearchSnapshot,
	caseStudies: VerifiedCaseStudy[],
	usedFallback: boolean,
): number {
	let score = 0.3;

	if (research.sources.length > 3) score += 0.15;
	else if (research.sources.length > 0) score += 0.08;

	if (research.companyContext) score += 0.1;
	if (research.painPoints.length > 0) score += 0.05;
	if (research.metrics.length > 0) score += 0.05;
	if (research.isLiveData) score += 0.1;

	if (caseStudies.length >= 3) score += 0.2;
	else if (caseStudies.length > 0) score += 0.12;

	if (!usedFallback && caseStudies.length > 0) score += 0.05;

	return Math.min(score, 1);
}

export async function orchestrateGeneration(
	rawInput: GenerationInput,
	tavilyKey: string,
	geminiKey: string,
): Promise<GenerationResult> {
	// Legacy → canonical translation. Old session payloads may carry
	// targetPersonaFunction / notes / MIC / NEU; normalize before anything else.
	const input = migrateLegacyInput(rawInput) as GenerationInput;

	// ── Phase 1: Hardcoded data (instant) ──
	const cloudContext = getCloudContext(input.cloudEcosystem);
	const industryMetrics = getIndustryMetrics(input.targetPersonaIndustry);
	const sheetPainPoints = getSheetPainPoints(
		input.targetPersonaIndustry,
		input.targetPersonaCategory,
		input.targetPersonaSubCategory,
	);

	const {
		studies: caseStudies,
		usedFallback,
		fallbackRegion,
	} = getVerifiedCaseStudies(
		input.targetPersonaIndustry,
		input.region,
		input.targetPersonaCategory,
		input.cloudEcosystem,
		input.intelligentFallback,
	);

	// ── Early exit: no case studies and fallback disabled ──
	if (caseStudies.length === 0 && !input.intelligentFallback) {
		const research = await runResearch(input, tavilyKey);
		return {
			research,
			caseStudyMatches: [],
			fallbackPath: "none" as FallbackPath,
			usedFallback: false,
			confidenceScore: 0.2,
			generatedContent: "",
			transparencyNote: null,
			featureNotAvailable: true,
			noMatchMessage: `No Searce case study exists for ${REGION_LABELS[input.region] ?? input.region} in ${INDUSTRY_LABELS[input.targetPersonaIndustry] ?? input.targetPersonaIndustry}. Enable "Intelligent Fallback" to use related regional examples.`,
		};
	}

	const fallbackPath: FallbackPath =
		caseStudies.length > 0
			? usedFallback
				? "similar_industry"
				: "exact_match"
			: "benchmark_only";

	// ── Phase 2: Live research (async — Tavily) ──
	const research = await runResearch(input, tavilyKey);

	// ── Phase 3: Compute confidence ──
	const confidenceScore = computeConfidence(research, caseStudies, usedFallback);

	const transparencyNote = usedFallback
		? `Referencing closely related regional success from ${REGION_LABELS[fallbackRegion!] ?? fallbackRegion} for ${REGION_LABELS[input.region] ?? input.region} market.`
		: null;

	// ── Phase 4: Build brief & generate with Gemini ──
	const brief: ContentBrief = {
		input,
		research,
		caseStudies,
		fallbackPath,
		usedFallback,
		fallbackRegion,
		confidenceScore,
		industryMetrics,
		sheetPainPoints,
	};

	const systemPrompt = buildSystemPrompt(brief, cloudContext);
	const userPrompt = buildContentPrompt(brief, cloudContext);

	const generatedContent = await generateForFormat({
		input,
		systemPrompt,
		userPrompt,
		geminiKey,
	});

	return {
		research,
		caseStudyMatches: caseStudies,
		fallbackPath,
		usedFallback,
		fallbackRegion,
		confidenceScore,
		generatedContent,
		transparencyNote,
	};
}

interface GenerateArgs {
	input: GenerationInput;
	systemPrompt: string;
	userPrompt: string;
	geminiKey: string;
}

/**
 * Format-aware generation pipeline.
 *
 * Email-style formats (cold/sales/nurture/inmail/sequence) use Gemini
 * structured output with a JSON schema, then we re-emit the marker-format
 * string the UI parser expects. The assembler also enforces hard word
 * caps by trimming trailing sentences. This is the only reliable way to
 * stop Gemini from reverting to free-form B2B email patterns.
 *
 * Conversation Ad and any other format we haven't schema-fied fall back to
 * the previous text-mode + compliance-retry pipeline.
 */
async function generateForFormat({
	input,
	systemPrompt,
	userPrompt,
	geminiKey,
}: GenerateArgs): Promise<string> {
	if (SINGLE_EMAIL_FORMATS.has(input.selectedFormat)) {
		try {
			const resp = await generateStructuredWithGemini<SingleEmailResponse>({
				apiKey: geminiKey,
				prompt: userPrompt,
				systemInstruction: systemPrompt,
				temperature: 0.35,
				maxOutputTokens: 2048,
				responseJsonSchema: SINGLE_EMAIL_SCHEMA,
				validate: isSingleEmailResponse,
			});
			return assembleSingleEmail(resp, input.selectedFormat);
		} catch (err) {
			console.warn(
				"Structured generation failed for single email; falling back to text mode.",
				err,
			);
			return textModeWithRetry({
				input,
				systemPrompt,
				userPrompt,
				geminiKey,
			});
		}
	}

	if (input.selectedFormat === "email_sequence") {
		try {
			const resp = await generateStructuredWithGemini<SequenceResponse>({
				apiKey: geminiKey,
				prompt: userPrompt,
				systemInstruction: systemPrompt,
				temperature: 0.35,
				maxOutputTokens: 4096,
				responseJsonSchema: SEQUENCE_SCHEMA,
				validate: isSequenceResponse,
			});
			return assembleSequence(resp);
		} catch (err) {
			console.warn(
				"Structured generation failed for sequence; falling back to text mode.",
				err,
			);
			return textModeWithRetry({
				input,
				systemPrompt,
				userPrompt,
				geminiKey,
			});
		}
	}

	// Conversation Ad and anything else — keep the previous text + compliance
	// retry pipeline. Schema for the multi-message branching flow is more
	// involved and not worth doing until that format is actually used.
	return textModeWithRetry({ input, systemPrompt, userPrompt, geminiKey });
}

/**
 * Override that flips the prompt out of "return JSON" mode and tells the
 * model to use the marker format the UI parser knows. Critical: without
 * this override the user's last fallback runs produced raw JSON in the UI
 * (because the schema-mode prompt told Gemini to return JSON).
 */
const TEXT_MODE_OVERRIDE = `
## OVERRIDE — TEXT MODE
This run does NOT use a JSON schema. DO NOT return JSON. Output PLAIN TEXT in the marker format below. Anything that looks like a JSON object or array is a hard failure.

Use this exact layout (and only these labels):

SUBJECT OPTION A: <subject>
PREVIEW A: <preview>
SUBJECT OPTION B: <subject>
PREVIEW B: <preview>
SUBJECT OPTION C: <subject>
PREVIEW C: <preview>
(Optional SUBJECT OPTION D / PREVIEW D)

---
===VERSION:LONG===
Hi [FirstName],

<paragraph 1>

<paragraph 2>

<optional paragraph 3 — bullets allowed using "•">

<paragraph 3 or 4: peer-style low-friction ask>

[Your Name] | Searce
===VERSION:SHORT===
Hi [FirstName],

<paragraph 1>

<paragraph 2 with one Searce anchor>

<optional CTA>

[Your Name] | Searce

---
STRATEGIST NOTE:
<2–3 sentences>

Rules: only Searce-domain Markdown anchors in the body, no external links. No "Hi [FirstName]" inside body paragraphs (it's already on its own line). No "[Your Name] | Searce" inside body paragraphs.
`;

async function textModeWithRetry({
	input,
	systemPrompt,
	userPrompt,
	geminiKey,
}: GenerateArgs): Promise<string> {
	const textPrompt = `${userPrompt}\n${TEXT_MODE_OVERRIDE}`;

	let generatedContent = await generateWithGemini({
		apiKey: geminiKey,
		prompt: textPrompt,
		systemInstruction: systemPrompt,
		temperature: 0.4,
		maxOutputTokens: 2048,
	});

	const compliance = checkCompliance(generatedContent, input.selectedFormat);
	if (!compliance.ok) {
		const corrective = buildCorrectivePrompt(compliance.reasons);
		try {
			const rewritten = await generateWithGemini({
				apiKey: geminiKey,
				prompt: `${textPrompt}\n\n## PREVIOUS DRAFT (FOR REFERENCE — DO NOT REPEAT IT)\n${generatedContent}\n${corrective}`,
				systemInstruction: systemPrompt,
				temperature: 0.25,
				maxOutputTokens: 2048,
			});
			const recheck = checkCompliance(rewritten, input.selectedFormat);
			if (recheck.reasons.length <= compliance.reasons.length) {
				generatedContent = rewritten;
			}
		} catch {
			/* fall through with the original draft */
		}
	}
	return generatedContent;
}

// ─── Type guards ───────────────────────────────────────────────────────────

function isSingleEmailResponse(value: unknown): value is SingleEmailResponse {
	if (!value || typeof value !== "object") return false;
	const v = value as Record<string, unknown>;
	return (
		Array.isArray(v.subjects) &&
		Array.isArray(v.longParagraphs) &&
		Array.isArray(v.shortParagraphs) &&
		typeof v.strategistNote === "string"
	);
}

function isSequenceResponse(value: unknown): value is SequenceResponse {
	if (!value || typeof value !== "object") return false;
	const v = value as Record<string, unknown>;
	return Array.isArray(v.emails) && typeof v.strategistNote === "string";
}
