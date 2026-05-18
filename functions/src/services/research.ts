import { tavilySearch } from "../tavily/client.js";
import { resolveTaxonomyLabels, getSheetPainPoints } from "../data/pain-points.js";
import type {
	ExternalSourceItem,
	GenerationInput,
	MetricItem,
	NewsItem,
	PainPointItem,
	ResearchSnapshot,
	TavilyResult,
} from "../types.js";

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

	const subIndustryLabel = [labels.subCategory, labels.category].filter(Boolean).join(", ");
	const taxonomyPhrase = subIndustryLabel
		? `${subIndustryLabel} (${labels.industry})`
		: labels.industry;
	const convergedSeed = sheet.converged[0] ?? "technology adoption";
	const detailedSeed = sheet.detailed[0] ?? "";

	const searchPromises: Promise<Awaited<ReturnType<typeof tavilySearch>> | null>[] = [];

	// ── Search 1: Company news (named account) OR industry news pulse (no company) ──
	if (input.targetCompany?.trim()) {
		searchPromises.push(
			tavilySearch({
				query: `"${input.targetCompany.trim()}" recent news technology cloud digital transformation`,
				apiKey: tavilyKey,
				searchDepth: "advanced",
				maxResults: 5,
				topic: "news",
				days: 30,
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
			}).catch(() => null),
		);
	}

	// ── Search 2: Industry trends + ROI metrics ──
	searchPromises.push(
		tavilySearch({
			query: `${taxonomyPhrase} cloud and AI adoption statistics, trends, and ROI metrics`,
			apiKey: tavilyKey,
			searchDepth: "advanced",
			maxResults: 5,
			topic: "general",
			timeRange: "month",
		}).catch(() => null),
	);

	// ── Search 3: Sub-category pain points (workbook-grounded) ──
	const painQuery = detailedSeed
		? `${taxonomyPhrase} ${convergedSeed} — "${detailedSeed.slice(0, 90)}"`
		: `${taxonomyPhrase} ${convergedSeed} biggest technology challenges`;
	searchPromises.push(
		tavilySearch({
			query: painQuery,
			apiKey: tavilyKey,
			searchDepth: "advanced",
			maxResults: 5,
			topic: "general",
			timeRange: "year",
		}).catch(() => null),
	);

	// ── Search 4: Searce case studies ──
	searchPromises.push(
		tavilySearch({
			query: `${taxonomyPhrase} cloud modernization case study`,
			apiKey: tavilyKey,
			searchDepth: "basic",
			maxResults: 4,
			includeDomains: ["searce.com"],
		}).catch(() => null),
	);

	const [newsResults, trendResults, painPointResults, searceResults] =
		await Promise.all(searchPromises);

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
		sources: allSources.slice(0, 12),
		tavilyAnswer: newsResults?.answer ?? trendResults?.answer,
		newsWithUrls,
		metricsWithUrls,
		painPointsWithUrls,
		externalSources,
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
