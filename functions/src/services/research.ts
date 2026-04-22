import { tavilySearch } from "../tavily/client.js";
import { INDUSTRY_LABELS, FUNCTION_LABELS } from "../data/labels.js";
import type {
	GenerationInput,
	MetricItem,
	NewsItem,
	PainPointItem,
	ResearchSnapshot,
	TavilyResult,
} from "../types.js";

/**
 * Tavily-powered live research: 4 parallel searches.
 *
 * 1. Company news       — topic:"news", advanced, 5 results, last 30 days
 * 2. Industry trends     — topic:"general", advanced, 5 results, last month
 * 3. Pain points         — topic:"general", advanced, 5 results
 * 4. Searce case studies — scoped to searce.com, basic, 4 results
 *
 * Query writing follows Tavily best practices:
 * - Under 400 chars, focused on ONE concept per search
 * - Natural-language phrasing (not keyword stuffing)
 * - Use `topic`, `time_range`, `days` for recency — not year in query text
 * - Use `include_domains` / `exclude_domains` for source control
 */
export async function runResearch(
	input: GenerationInput,
	tavilyKey: string,
): Promise<ResearchSnapshot> {
	const industryName =
		INDUSTRY_LABELS[input.targetPersonaIndustry] ?? input.targetPersonaIndustry;
	const functionName =
		FUNCTION_LABELS[input.targetPersonaFunction] ?? input.targetPersonaFunction;

	const searchPromises: Promise<Awaited<ReturnType<typeof tavilySearch>> | null>[] = [];

	// ── Search 1: Company news ──
	// Uses topic:"news" so Tavily returns actual press/news articles
	// with published_date metadata. `days: 30` ensures recency.
	// Do NOT put includeDomains: [targetDomain] — that limits results
	// to the company's OWN site. We want third-party news ABOUT them.
	if (input.targetCompany) {
		searchPromises.push(
			tavilySearch({
				query: `"${input.targetCompany}" recent news technology cloud digital transformation`,
				apiKey: tavilyKey,
				searchDepth: "advanced",
				maxResults: 5,
				topic: "news",
				days: 30,
			}).catch(() => null),
		);
	} else {
		searchPromises.push(Promise.resolve(null));
	}

	// ── Search 2: Industry trends & metrics ──
	// Natural-language query focused on one concept: industry transformation stats.
	// No analyst firm names — let Tavily find the best sources organically.
	// time_range:"month" gives recent data without hardcoding a year.
	searchPromises.push(
		tavilySearch({
			query: `${industryName} ${functionName} cloud and AI adoption statistics trends and ROI metrics`,
			apiKey: tavilyKey,
			searchDepth: "advanced",
			maxResults: 5,
			topic: "general",
			timeRange: "month",
		}).catch(() => null),
	);

	// ── Search 3: Pain points & challenges ──
	// Focused on the ACTUAL persona function — not hardcoded "CTO CIO".
	// A Marketing Director's pain points differ from a `CTO's.
	searchPromises.push(
		tavilySearch({
			query: `${industryName} ${functionName} biggest technology challenges and pain points`,
			apiKey: tavilyKey,
			searchDepth: "advanced",
			maxResults: 5,
			topic: "general",
			timeRange: "year",
		}).catch(() => null),
	);

	// ── Search 4: Searce case studies ──
	// Scoped to searce.com only. Finds relevant proof points for this industry.
	searchPromises.push(
		tavilySearch({
			query: `${industryName} cloud modernization case study`,
			apiKey: tavilyKey,
			searchDepth: "basic",
			maxResults: 4,
			includeDomains: ["searce.com"],
		}).catch(() => null),
	);

	const [companyResults, trendResults, painPointResults, searceResults] =
		await Promise.all(searchPromises);

	// ── Extract company news with URLs ──
	const newsWithUrls: NewsItem[] = [];
	let companyContext = "";
	const allSources: TavilyResult[] = [];
	const seenUrls = new Set<string>();

	if (companyResults?.results?.length) {
		const newsItems = companyResults.results.slice(0, 4);
		companyContext = companyResults.answer ?? newsItems[0]?.content?.substring(0, 300) ?? "";
		for (const item of newsItems) {
			newsWithUrls.push({
				title: item.title,
				url: item.url,
				content: item.content?.substring(0, 150) ?? "",
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

	if (trendResults?.results?.length) {
		if (trendResults.answer) {
			industryTrends.push(trendResults.answer.substring(0, 300));
		}
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

	// ── Merge Searce case study results as additional sources ──
	if (searceResults?.results?.length) {
		for (const item of searceResults.results) {
			if (!seenUrls.has(item.url)) {
				seenUrls.add(item.url);
				allSources.push(item);
			}
		}
	}

	// ── Extract trend snippets from source content ──
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

	// ── Extract metric snippets ──
	const metrics: string[] = [];
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

	allSources.sort((a, b) => b.score - a.score);

	return {
		companyContext,
		industryTrends: industryTrends.slice(0, 6),
		painPoints: painPoints.slice(0, 6),
		metrics: metrics.slice(0, 6),
		sources: allSources.slice(0, 12),
		tavilyAnswer: companyResults?.answer ?? trendResults?.answer,
		newsWithUrls,
		metricsWithUrls,
		painPointsWithUrls,
		isLiveData: true,
		timestamp: new Date().toISOString(),
	};
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
