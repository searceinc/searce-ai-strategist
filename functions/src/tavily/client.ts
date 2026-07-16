import type { TavilyResponse } from "../types.js";

const TAVILY_API_URL = "https://api.tavily.com/search";

interface SearchOptions {
	query: string;
	apiKey: string;
	searchDepth?: "basic" | "advanced";
	maxResults?: number;
	topic?: "general" | "news";
	timeRange?: "day" | "week" | "month" | "year";
	days?: number;
	includeDomains?: string[];
	excludeDomains?: string[];
	/**
	 * When true, Tavily also returns the full cleaned page text per result
	 * (`raw_content`) instead of only the short snippet (`content`). Opt-in
	 * per search — heavier payload + slower, so callers enable it only where
	 * the extra grounding is worth it. Defaults to false to preserve prior
	 * snippet-only behavior.
	 */
	includeRawContent?: boolean;
}

export async function tavilySearch({
	query,
	apiKey,
	searchDepth = "advanced",
	maxResults = 5,
	topic = "general",
	timeRange,
	days,
	includeDomains,
	excludeDomains,
	includeRawContent = false,
}: SearchOptions): Promise<TavilyResponse> {
	const body: Record<string, unknown> = {
		query,
		api_key: apiKey,
		include_answer: true,
		search_depth: searchDepth,
		max_results: maxResults,
		topic,
		include_raw_content: includeRawContent,
	};

	if (timeRange) body.time_range = timeRange;
	if (days !== undefined) body.days = days;
	if (includeDomains?.length) body.include_domains = includeDomains;
	if (excludeDomains?.length) body.exclude_domains = excludeDomains;

	const response = await fetch(TAVILY_API_URL, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Tavily API error ${response.status}: ${errorText}`);
	}

	return response.json() as Promise<TavilyResponse>;
}
