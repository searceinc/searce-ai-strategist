import { ThinkingLevel } from "@google/genai";
import { tavilySearch } from "../tavily/client.js";
import { generateStructuredWithGemini } from "../gemini/client.js";
import { resolveTaxonomyLabels, getSheetPainPoints } from "../data/pain-points.js";
import type {
	ExternalSourceItem,
	GenerationInput,
	MetricItem,
	NewsItem,
	PainPointItem,
	PersonaSignalItem,
	ResearchSnapshot,
	TavilyResult,
} from "../types.js";

/**
 * Schema for the research-summarization pass — takes raw Tavily source
 * content plus known company/industry context and extracts only the facts
 * genuinely relevant to that context, instead of a fixed keyword/regex
 * filter over blindly truncated text.
 */
const RESEARCH_SUMMARY_SCHEMA = {
	type: "object",
	properties: {
		companyContext: {
			type: "string",
			description:
				"1-2 sentence grounding summary of the company/industry's current situation, based only on the sources given. Empty string if nothing relevant found.",
		},
		industryTrends: {
			type: "array",
			items: { type: "string" },
			maxItems: 6,
			description:
				"Up to 6 short, single-sentence industry/technology trend or adoption facts drawn directly from the sources. Paraphrase; do not invent.",
		},
		metrics: {
			type: "array",
			items: { type: "string" },
			maxItems: 6,
			description:
				"Up to 6 short sentences, each containing a concrete number/percentage/stat drawn directly from the sources.",
		},
		painPoints: {
			type: "array",
			items: { type: "string" },
			maxItems: 6,
			description:
				"Up to 6 short sentences describing a specific challenge/pain point relevant to the target company/industry, drawn directly from the sources.",
		},
	},
	required: ["companyContext", "industryTrends", "metrics", "painPoints"],
} as const;

interface ResearchSummary {
	companyContext: string;
	industryTrends: string[];
	metrics: string[];
	painPoints: string[];
}

function isResearchSummary(value: unknown): value is ResearchSummary {
	if (!value || typeof value !== "object") return false;
	const v = value as Record<string, unknown>;
	return (
		typeof v.companyContext === "string" &&
		Array.isArray(v.industryTrends) &&
		Array.isArray(v.metrics) &&
		Array.isArray(v.painPoints)
	);
}

/**
 * Relevance-filter raw Tavily results with a cheap, low-thinking Gemini pass
 * instead of a hand-written keyword list + regex. Returns null on any
 * failure so callers can fall back to the naive extraction.
 */
async function summarizeResearch(
	sources: TavilyResult[],
	tavilyAnswers: string[],
	context: { companyName: string; taxonomyPhrase: string },
	geminiKey: string,
): Promise<ResearchSummary | null> {
	if (sources.length === 0 && tavilyAnswers.length === 0) return null;

	const corpus = sources
		.slice(0, 10)
		.map(
			(s, i) => `[${i + 1}] ${s.title}\n${(s.raw_content ?? s.content ?? "").slice(0, 2500)}`,
		)
		.join("\n\n");
	const answerBlock = tavilyAnswers.length
		? `Search-engine summaries:\n${tavilyAnswers.map((a) => `- ${a}`).join("\n")}\n\n`
		: "";

	const prompt = `You are extracting sales-research facts for outbound email personalization.

Target: ${context.companyName || context.taxonomyPhrase}
Industry/segment context: ${context.taxonomyPhrase}

${answerBlock}Raw sources:
${corpus}

Extract ONLY facts that are actually present in the sources above and genuinely relevant to this specific target and industry context. Do not invent, generalize, or pad — if a category has no genuinely relevant facts, return an empty array for it.`;

	try {
		const summary = await generateStructuredWithGemini<ResearchSummary>({
			apiKey: geminiKey,
			prompt,
			model: "gemini-3.5-flash",
			temperature: 0.2,
			thinkingLevel: ThinkingLevel.LOW,
			maxOutputTokens: 1024,
			responseJsonSchema: RESEARCH_SUMMARY_SCHEMA,
			validate: isResearchSummary,
		});
		return summary;
	} catch (err) {
		console.warn("Research summarization failed; falling back to naive extraction.", err);
		return null;
	}
}

/** Persona-level: bio + triggers extracted from raw person-specific Tavily content. */
const PERSONA_SUMMARY_SCHEMA = {
	type: "object",
	properties: {
		bio: {
			type: "string",
			description:
				"1-3 sentence bio/career summary of this specific person, based only on the sources given. Empty string if nothing relevant found — do not invent career facts.",
		},
		triggers: {
			type: "array",
			items: { type: "string" },
			maxItems: 6,
			description:
				"Up to 6 short sentences, each a specific, citable fact about THIS person (a quote, stated priority, career move, conference appearance) that could anchor a personalized email opening. Grounded only in the sources given.",
		},
	},
	required: ["bio", "triggers"],
} as const;

interface PersonaSummary {
	bio: string;
	triggers: string[];
}

function isPersonaSummary(value: unknown): value is PersonaSummary {
	if (!value || typeof value !== "object") return false;
	const v = value as Record<string, unknown>;
	return typeof v.bio === "string" && Array.isArray(v.triggers);
}

async function summarizePersonaResearch(
	sources: TavilyResult[],
	personName: string,
	geminiKey: string,
): Promise<PersonaSummary | null> {
	if (sources.length === 0) return null;

	const corpus = sources
		.slice(0, 10)
		.map(
			(s, i) => `[${i + 1}] ${s.title}\n${(s.raw_content ?? s.content ?? "").slice(0, 2500)}`,
		)
		.join("\n\n");

	const prompt = `You are extracting person-specific facts for a personalized sales email to one named individual.

Person: ${personName}

Raw sources (may include unrelated same-name people or generic company pages — ignore anything not clearly about this specific person in this role):
${corpus}

Extract ONLY facts genuinely about ${personName} specifically. If the sources are mostly noise/unrelated, return an empty bio and empty triggers array rather than guessing.`;

	try {
		return await generateStructuredWithGemini<PersonaSummary>({
			apiKey: geminiKey,
			prompt,
			model: "gemini-3.5-flash",
			temperature: 0.2,
			thinkingLevel: ThinkingLevel.LOW,
			maxOutputTokens: 1024,
			responseJsonSchema: PERSONA_SUMMARY_SCHEMA,
			validate: isPersonaSummary,
		});
	} catch (err) {
		console.warn("Persona summarization failed.", err);
		return null;
	}
}

/**
 * Tavily-powered live research. Four parallel searches:
 *
 * 1. News pulse        — named company OR industry/taxonomy news (topic:"news")
 * 2. Industry trends + ROI — topic:"general", last month
 * 3. Sub-category pain points (workbook-grounded seed) — topic:"general", last year
 * 4. Searce case-study lookup scoped to searce.com
 *
 * `externalSources` lists non-Searce URLs for the Intelligence Feed: categorized
 * news/metrics/pain rows first, then any other Tavily hits in `allSources` as `reference`.
 */
export async function runResearch(
	input: GenerationInput,
	tavilyKey: string,
	geminiKey: string,
): Promise<ResearchSnapshot> {
	const labels = resolveTaxonomyLabels(
		input.targetPersonaIndustry,
		input.targetPersonaCategory,
		input.targetPersonaSubCategory,
	);
	const sheet = getSheetPainPoints(
		input.targetPersonaIndustry,
		input.targetPersonaCategory,
		input.targetPersonaSubCategory,
	);

	const isGeneralPov = !input.targetPersonaIndustry || input.targetPersonaIndustry === "GENERAL";

	// When the rep picks a real industry we anchor every query to that taxonomy.
	// For the General POV we lean on company / website / domain signals so the
	// research is still focused — without forcing a sub-industry we don't have.
	const companyNameRaw = input.targetCompany?.trim() ?? "";
	const companyName = companyNameRaw.length > 0 ? companyNameRaw : "";
	const domainRaw = input.targetDomain?.trim() ?? "";
	const domain = domainRaw.replace(/^https?:\/\//i, "").replace(/\/+$/g, "");
	const generalAnchor =
		companyName || domain || "modern enterprises across industries (cloud, data, AI adoption)";

	const subIndustryLabel = [labels.subCategory, labels.category].filter(Boolean).join(", ");
	const taxonomyPhrase = isGeneralPov
		? generalAnchor
		: subIndustryLabel
			? `${subIndustryLabel} (${labels.industry})`
			: labels.industry;
	const convergedSeed =
		sheet.converged[0] ?? (isGeneralPov ? "digital transformation" : "technology adoption");
	const detailedSeed = sheet.detailed[0] ?? "";

	const searchPromises: Promise<Awaited<ReturnType<typeof tavilySearch>> | null>[] = [];

	// ── Search 1: Company news (named account) OR industry / general pulse ──
	if (companyName) {
		searchPromises.push(
			tavilySearch({
				query: `"${companyName}" recent news technology cloud digital transformation`,
				apiKey: tavilyKey,
				searchDepth: "advanced",
				maxResults: 5,
				topic: "news",
				days: 30,
				includeRawContent: true,
			}).catch(() => null),
		);
	} else if (isGeneralPov && domain) {
		// General POV with a domain but no display name — search the brand domain.
		searchPromises.push(
			tavilySearch({
				query: `${domain} company news technology cloud AI digital transformation`,
				apiKey: tavilyKey,
				searchDepth: "advanced",
				maxResults: 5,
				topic: "news",
				days: 45,
				includeRawContent: true,
			}).catch(() => null),
		);
	} else {
		searchPromises.push(
			tavilySearch({
				query: `${taxonomyPhrase} sector news technology cloud AI digital transformation`,
				apiKey: tavilyKey,
				searchDepth: "advanced",
				maxResults: 5,
				topic: "news",
				days: 45,
				includeRawContent: true,
			}).catch(() => null),
		);
	}

	// ── Search 2: Industry / general trends + ROI metrics ──
	const trendsQuery = isGeneralPov
		? `${taxonomyPhrase} cloud, data and AI adoption statistics, trends, ROI benchmarks`
		: `${taxonomyPhrase} cloud and AI adoption statistics, trends, and ROI metrics`;
	searchPromises.push(
		tavilySearch({
			query: trendsQuery,
			apiKey: tavilyKey,
			searchDepth: "advanced",
			maxResults: 5,
			topic: "general",
			timeRange: "month",
			includeRawContent: true,
		}).catch(() => null),
	);

	// ── Search 3: Pain points (workbook seed when available, generic otherwise) ──
	const painQuery = detailedSeed
		? `${taxonomyPhrase} ${convergedSeed} — "${detailedSeed.slice(0, 90)}"`
		: isGeneralPov
			? `${taxonomyPhrase} biggest technology, data and AI challenges enterprises face today`
			: `${taxonomyPhrase} ${convergedSeed} biggest technology challenges`;
	searchPromises.push(
		tavilySearch({
			query: painQuery,
			apiKey: tavilyKey,
			searchDepth: "advanced",
			maxResults: 5,
			topic: "general",
			timeRange: "year",
			includeRawContent: true,
		}).catch(() => null),
	);

	// ── Search 4: Searce case studies (broader scope for general POV) ──
	const searceQuery = isGeneralPov
		? `Searce cloud, data, AI, location intelligence case study`
		: `${taxonomyPhrase} cloud modernization case study`;
	searchPromises.push(
		tavilySearch({
			query: searceQuery,
			apiKey: tavilyKey,
			searchDepth: "advanced",
			maxResults: 4,
			includeDomains: ["searce.com"],
		}).catch(() => null),
	);

	// ── Searches 5-8: company social handles (social signal, per 2026-07-15 ask) ──
	// Login walls are not the blocker here — Tavily's index already holds public
	// LinkedIn/X/Instagram pages and returns full raw_content for them (verified
	// via manual probes). Reddit has no "company page", so it searches for
	// discussion/reviews instead of a profile. Only run when we have a concrete
	// anchor to search for; skip (rather than break the positional destructuring
	// below) otherwise.
	const socialAnchor = companyName || (!isGeneralPov ? taxonomyPhrase : "");
	searchPromises.push(
		socialAnchor
			? tavilySearch({
					query: socialAnchor,
					apiKey: tavilyKey,
					searchDepth: "advanced",
					maxResults: 2,
					topic: "general",
					includeDomains: ["linkedin.com"],
					includeRawContent: true,
				}).catch(() => null)
			: Promise.resolve(null),
		socialAnchor
			? tavilySearch({
					query: socialAnchor,
					apiKey: tavilyKey,
					searchDepth: "advanced",
					maxResults: 2,
					topic: "general",
					includeDomains: ["x.com", "twitter.com"],
					includeRawContent: true,
				}).catch(() => null)
			: Promise.resolve(null),
		socialAnchor
			? tavilySearch({
					query: socialAnchor,
					apiKey: tavilyKey,
					searchDepth: "advanced",
					maxResults: 2,
					topic: "general",
					includeDomains: ["instagram.com"],
					includeRawContent: true,
				}).catch(() => null)
			: Promise.resolve(null),
		socialAnchor
			? tavilySearch({
					query: `${socialAnchor} reviews OR experience OR discussion`,
					apiKey: tavilyKey,
					searchDepth: "advanced",
					maxResults: 2,
					topic: "general",
					includeDomains: ["reddit.com"],
					includeRawContent: true,
				}).catch(() => null)
			: Promise.resolve(null),
	);

	// ── Persona-level only: person-specific searches (run alongside, not ──
	// mixed into the fixed-position searchPromises above, since they're
	// conditional and would break the positional destructuring below).
	const personaName = input.mode === "persona" ? (input.personaName?.trim() ?? "") : "";
	const personaSearchPromises: Promise<Awaited<ReturnType<typeof tavilySearch>> | null>[] = [];
	if (personaName) {
		const personaAnchor = companyName || taxonomyPhrase;
		personaSearchPromises.push(
			tavilySearch({
				query: `"${personaName}" ${personaAnchor} interview OR quote OR keynote OR podcast`,
				apiKey: tavilyKey,
				searchDepth: "advanced",
				maxResults: 5,
				topic: "general",
				timeRange: "year",
				includeRawContent: true,
			}).catch(() => null),
			tavilySearch({
				query: `"${personaName}" LinkedIn OR conference OR whitepaper OR appointed OR promoted`,
				apiKey: tavilyKey,
				searchDepth: "advanced",
				maxResults: 5,
				topic: "general",
				includeRawContent: true,
			}).catch(() => null),
			// Domain-scoped profile searches — target the person's actual
			// profile/activity page directly on each platform, rather than relying
			// on a platform name as a loose keyword in the general search above.
			tavilySearch({
				query: `"${personaName}" ${personaAnchor}`,
				apiKey: tavilyKey,
				searchDepth: "advanced",
				maxResults: 2,
				topic: "general",
				includeDomains: ["linkedin.com"],
				includeRawContent: true,
			}).catch(() => null),
			tavilySearch({
				query: `"${personaName}" ${personaAnchor}`,
				apiKey: tavilyKey,
				searchDepth: "advanced",
				maxResults: 2,
				topic: "general",
				includeDomains: ["x.com", "twitter.com"],
				includeRawContent: true,
			}).catch(() => null),
			tavilySearch({
				query: `"${personaName}" ${personaAnchor}`,
				apiKey: tavilyKey,
				searchDepth: "advanced",
				maxResults: 2,
				topic: "general",
				includeDomains: ["instagram.com"],
				includeRawContent: true,
			}).catch(() => null),
			tavilySearch({
				query: `"${personaName}" ${personaAnchor}`,
				apiKey: tavilyKey,
				searchDepth: "advanced",
				maxResults: 2,
				topic: "general",
				includeDomains: ["reddit.com"],
				includeRawContent: true,
			}).catch(() => null),
		);
	}

	const [
		[
			newsResults,
			trendResults,
			painPointResults,
			searceResults,
			linkedinCompanyResults,
			xCompanyResults,
			instagramCompanyResults,
			redditCompanyResults,
		],
		[
			personaInterviewResults,
			personaActivityResults,
			personaLinkedinResults,
			personaXResults,
			personaInstagramResults,
			personaRedditResults,
		],
	] = await Promise.all([Promise.all(searchPromises), Promise.all(personaSearchPromises)]);

	// ── Extract news with URLs (company-specific OR industry pulse) ──
	const newsWithUrls: NewsItem[] = [];
	let companyContext = "";
	const allSources: TavilyResult[] = [];
	const seenUrls = new Set<string>();

	if (newsResults?.results?.length) {
		const newsItems = newsResults.results.slice(0, 5);
		companyContext = newsResults.answer ?? newsItems[0]?.content?.substring(0, 320) ?? "";
		for (const item of newsItems) {
			newsWithUrls.push({
				title: item.title,
				url: item.url,
				content: item.content?.substring(0, 180) ?? "",
			});
			if (!seenUrls.has(item.url)) {
				seenUrls.add(item.url);
				allSources.push(item);
			}
		}
	}

	// ── Extract industry metrics with URLs ──
	const metricsWithUrls: MetricItem[] = [];
	const industryTrends: string[] = [];
	const metrics: string[] = [];
	const trendsAnswerText = trendResults?.answer?.substring(0, 300) ?? "";

	if (trendResults?.results?.length) {
		for (const item of trendResults.results.slice(0, 4)) {
			metricsWithUrls.push({
				value: item.content?.substring(0, 200) ?? item.title,
				source: extractHostname(item.url),
				sourceUrl: item.url,
			});
			if (!seenUrls.has(item.url)) {
				seenUrls.add(item.url);
				allSources.push(item);
			}
		}
	}

	// ── Extract pain points with URLs ──
	const painPointsWithUrls: PainPointItem[] = [];
	const painPoints: string[] = [];

	if (painPointResults?.results?.length) {
		for (const item of painPointResults.results.slice(0, 4)) {
			const text = item.content?.substring(0, 150) ?? item.title;
			painPointsWithUrls.push({
				text,
				source: extractHostname(item.url),
				sourceUrl: item.url,
			});
			painPoints.push(text);
			if (!seenUrls.has(item.url)) {
				seenUrls.add(item.url);
				allSources.push(item);
			}
		}
	}

	// ── Additional Tavily hits (for Intelligence Feed links beyond the primary slices) ──
	if (trendResults?.results?.length) {
		for (const item of trendResults.results.slice(4, 10)) {
			if (!item.url || seenUrls.has(item.url)) continue;
			seenUrls.add(item.url);
			allSources.push(item);
		}
	}
	if (painPointResults?.results?.length) {
		for (const item of painPointResults.results.slice(4, 10)) {
			if (!item.url || seenUrls.has(item.url)) continue;
			seenUrls.add(item.url);
			allSources.push(item);
		}
	}

	// ── Merge Searce case study results as additional sources ──
	if (searceResults?.results?.length) {
		for (const item of searceResults.results) {
			if (!seenUrls.has(item.url)) {
				seenUrls.add(item.url);
				allSources.push(item);
			}
		}
	}

	// ── Merge company social-handle results as additional sources ──
	for (const socialResult of [
		linkedinCompanyResults,
		xCompanyResults,
		instagramCompanyResults,
		redditCompanyResults,
	]) {
		if (!socialResult?.results?.length) continue;
		for (const item of socialResult.results) {
			if (!seenUrls.has(item.url)) {
				seenUrls.add(item.url);
				allSources.push(item);
			}
		}
	}

	allSources.sort((a, b) => b.score - a.score);

	// ── Persona-level only: build Public Signals directly from raw Tavily ──
	// items (deterministic — title/content/url/date straight from the
	// source, same pattern as metricsWithUrls/painPointsWithUrls) and run
	// one grounded LLM pass for the narrative bio + citable triggers.
	const personaRawSources: TavilyResult[] = [];
	const personaSeenUrls = new Set<string>();
	for (const item of [
		...(personaInterviewResults?.results ?? []),
		...(personaActivityResults?.results ?? []),
		...(personaLinkedinResults?.results ?? []),
		...(personaXResults?.results ?? []),
		...(personaInstagramResults?.results ?? []),
		...(personaRedditResults?.results ?? []),
	]) {
		if (!item.url || personaSeenUrls.has(item.url)) continue;
		personaSeenUrls.add(item.url);
		personaRawSources.push(item);
	}

	const personaSignals: PersonaSignalItem[] = personaRawSources.slice(0, 8).map((item) => ({
		text: item.content?.substring(0, 220) ?? item.title,
		source: extractHostname(item.url),
		sourceUrl: item.url,
		date: item.published_date,
	}));

	let personaBio = "";
	let personaTriggers: string[] = [];
	if (personaName) {
		const personaSummary = await summarizePersonaResearch(
			personaRawSources,
			personaName,
			geminiKey,
		);
		if (personaSummary) {
			personaBio = personaSummary.bio;
			personaTriggers = personaSummary.triggers;
		}
	}

	// ── Relevance-filter raw source content with a cheap Gemini pass, ──
	// grounded in the actual content instead of a fixed keyword list/regex.
	// Falls back to the naive extraction below only if the call fails.
	const tavilyAnswers = [
		newsResults?.answer,
		trendResults?.answer,
		painPointResults?.answer,
	].filter((a): a is string => Boolean(a));
	const summary = await summarizeResearch(
		allSources,
		tavilyAnswers,
		{ companyName, taxonomyPhrase },
		geminiKey,
	);

	if (summary) {
		if (summary.companyContext) companyContext = summary.companyContext;
		industryTrends.push(...summary.industryTrends);
		metrics.push(...summary.metrics);
		if (summary.painPoints.length) {
			painPoints.length = 0;
			painPoints.push(...summary.painPoints);
		}
	} else {
		if (trendsAnswerText) industryTrends.push(trendsAnswerText);

		// ── Fallback: keyword-based trend extraction ──
		const trendKeywords = [
			"trend",
			"growth",
			"adoption",
			"shift",
			"transformation",
			"emerging",
			"forecast",
			"prediction",
			"innovation",
			"disruption",
		];
		for (const source of allSources.slice(0, 10)) {
			const sentences = source.content.split(/[.!?]+/).filter((s) => s.trim().length > 20);
			for (const sentence of sentences) {
				if (trendKeywords.some((kw) => sentence.toLowerCase().includes(kw))) {
					industryTrends.push(sentence.trim());
					if (industryTrends.length >= 6) break;
				}
			}
			if (industryTrends.length >= 6) break;
		}

		// ── Fallback: regex-based metric extraction ──
		const metricPattern = /\d+[\d,.]*\s*(%|percent|x|million|billion|thousand)/gi;
		for (const source of allSources.slice(0, 10)) {
			const matches = source.content.match(metricPattern);
			if (matches) {
				for (const match of matches) {
					const context = extractSentence(source.content, match);
					if (context) metrics.push(context);
					if (metrics.length >= 6) break;
				}
			}
			if (metrics.length >= 6) break;
		}
	}

	const externalSources = buildExternalSources(
		newsWithUrls,
		metricsWithUrls,
		painPointsWithUrls,
		allSources,
	);

	return {
		companyContext,
		industryTrends: industryTrends.slice(0, 6),
		painPoints: painPoints.slice(0, 6),
		metrics: metrics.slice(0, 6),
		// Strip raw_content before it leaves the server — it was only needed for
		// the summarizer passes above. Persisting 12 full-page bodies would bloat
		// the Firestore session doc (and the client never uses it). Only emit
		// published_date when present — Tavily omits it for general/social results,
		// and an explicit `undefined` is rejected by the Firestore Admin SDK.
		sources: allSources.slice(0, 12).map((s) => ({
			title: s.title,
			url: s.url,
			content: s.content,
			score: s.score,
			...(s.published_date !== undefined ? { published_date: s.published_date } : {}),
		})),
		tavilyAnswer: newsResults?.answer ?? trendResults?.answer,
		newsWithUrls,
		metricsWithUrls,
		painPointsWithUrls,
		externalSources,
		personaBio,
		personaSignals,
		personaTriggers,
		isLiveData: true,
		timestamp: new Date().toISOString(),
	};
}

function isNonSearceHttpUrl(url: string): boolean {
	const u = (url ?? "").trim();
	if (!/^https?:\/\//i.test(u)) return false;
	try {
		const host = new URL(u).hostname.toLowerCase();
		return host !== "searce.com" && !host.endsWith(".searce.com");
	} catch {
		return false;
	}
}

/**
 * Deduplicated third-party links for the Intelligence Feed only.
 * Email bodies must not hyperlink these; prose + Searce anchors only.
 */
function buildExternalSources(
	news: NewsItem[],
	metrics: MetricItem[],
	pains: PainPointItem[],
	allRankedSources: TavilyResult[],
	maxItems = 40,
): ExternalSourceItem[] {
	const out: ExternalSourceItem[] = [];
	const seen = new Set<string>();

	const push = (url: string, title: string, kind: ExternalSourceItem["kind"]) => {
		const u = (url ?? "").trim();
		if (!u || seen.has(u) || !isNonSearceHttpUrl(u)) return;
		seen.add(u);
		const t = (title ?? "").replace(/\s+/g, " ").trim() || u;
		out.push({ url: u, title: t.slice(0, 220), kind });
	};

	for (const n of news) {
		push(n.url, n.title, "news");
		if (out.length >= maxItems) return out;
	}
	for (const m of metrics) {
		push(m.sourceUrl, m.value, "metric");
		if (out.length >= maxItems) return out;
	}
	for (const p of pains) {
		push(p.sourceUrl, p.text, "pain");
		if (out.length >= maxItems) return out;
	}

	for (const item of allRankedSources) {
		if (out.length >= maxItems) break;
		const title =
			item.title?.trim() ||
			item.content?.substring(0, 140).replace(/\s+/g, " ").trim() ||
			item.url;
		push(item.url, title, "reference");
	}

	return out;
}

function extractHostname(url: string): string {
	try {
		return new URL(url).hostname.replace("www.", "");
	} catch {
		return url;
	}
}

function extractSentence(text: string, match: string): string | null {
	const idx = text.indexOf(match);
	if (idx === -1) return null;
	const start = text.lastIndexOf(".", idx - 1) + 1;
	const end = text.indexOf(".", idx + match.length);
	if (end === -1) return null;
	const sentence = text.slice(start, end + 1).trim();
	return sentence.length > 20 && sentence.length < 300 ? sentence : null;
}
