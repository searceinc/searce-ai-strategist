import { generateWithGemini } from "../gemini/client.js";
import { buildSystemPrompt, buildContentPrompt } from "../prompts/templates.js";
import { getVerifiedCaseStudies } from "../data/case-studies.js";
import { getCloudContext } from "../data/cloud-context.js";
import { getIndustryMetrics } from "../data/industry-metrics.js";
import { getFunctionPainPoints } from "../data/pain-points.js";
import { REGION_LABELS, INDUSTRY_LABELS } from "../data/labels.js";
import { runResearch } from "./research.js";
import type {
	ContentBrief,
	FallbackPath,
	GenerationInput,
	ResearchSnapshot,
	VerifiedCaseStudy,
} from "../types.js";

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
	input: GenerationInput,
	tavilyKey: string,
	geminiKey: string,
): Promise<GenerationResult> {
	// ── Phase 1: Hardcoded data (instant) ──
	const cloudContext = getCloudContext(input.cloudEcosystem);
	const industryMetrics = getIndustryMetrics(input.targetPersonaIndustry);
	const painPoints = getFunctionPainPoints(
		input.targetPersonaFunction,
		input.targetPersonaSubFunction,
		input.targetPersonaIndustry,
	);

	const {
		studies: caseStudies,
		usedFallback,
		fallbackRegion,
	} = getVerifiedCaseStudies(
		input.targetPersonaIndustry,
		input.region,
		input.targetPersonaFunction,
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
		painPoints,
	};

	const systemPrompt = buildSystemPrompt(brief, cloudContext);
	const userPrompt = buildContentPrompt(brief, cloudContext);

	const generatedContent = await generateWithGemini({
		apiKey: geminiKey,
		prompt: userPrompt,
		systemInstruction: systemPrompt,
		temperature: 0.85,
		maxOutputTokens: 4096,
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
