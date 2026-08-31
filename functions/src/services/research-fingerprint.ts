import type { GenerationInput } from "../types.js";

/**
 * The only `GenerationInput` fields that change what Tavily is asked.
 *
 * Kept in lockstep with the `input.*` reads in services/research.ts — if a new
 * field starts shaping a query there, add it here or the reuse path will serve
 * stale research. Everything else on the input (format, angle, tone, sequence
 * length, instructions, intelligenceFeedFocus...) only shapes the Gemini
 * prompt, so changing it must NOT invalidate the research snapshot.
 */
const RESEARCH_INPUT_FIELDS = [
	"mode",
	"personaName",
	"targetCompany",
	"targetDomain",
	"targetPersonaIndustry",
	"targetPersonaCategory",
	"targetPersonaSubCategory",
] as const satisfies readonly (keyof GenerationInput)[];

/**
 * Stable key for "would re-running research produce the same queries?".
 *
 * Used to decide whether a regenerate can reuse the research already persisted
 * on the session. This matters for cost as much as latency: every Tavily call
 * is an `advanced` search (2 credits), so an account-mode run burns ~16 credits
 * and a persona-mode run ~28 against a 1,000/month free tier. Regenerating with
 * a tweaked tone used to re-pay that in full for identical results.
 */
export function researchFingerprint(input: Partial<GenerationInput>): string {
	return RESEARCH_INPUT_FIELDS.map((field) => {
		const value = input[field];
		return typeof value === "string" ? value.trim().toLowerCase() : "";
	}).join(" ");
}
