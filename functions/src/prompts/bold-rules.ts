import type { ContentFormat } from "../types.js";

/**
 * Shared bold guidance + post-processing. Bold should be rare: numbers and
 * client names the reader actually scans — not generic marketing phrases.
 */

export const BOLD_RULES_PROMPT = `## BOLD RULES (STRICT — when unsure, leave plain text)

Bold is **rare**. Most of the email stays unbolded. A busy reader scans **numbers** and **company names**, not adjectives.

**Bold ONLY these (hard caps below):**
1. **Hard metrics** — MUST contain a digit: **28% lower cost**, **10x faster queries**, **75–110% ROI**. Never bold a phrase that has no number.
2. **Verified client company name** — bold it **once**, in the Trust beat only, spelled **exactly** as in VERIFIED CASE STUDIES (e.g. **Indegene**, **Floweraura**, **Moglix**). Never bold a case-study title, outcome phrase, or sentence fragment as if it were a client.
3. **Prospect company** — optional, **once** in the whole email, only if TARGET PROFILE supplies a real company name.

**Caps:** LinkedIn InMail — **at most 2** bold spans in LONG, **1** in SHORT. Other emails — **at most 3** in LONG, **2** in SHORT. Never more than **one** bold span in the Trust beat.

**NEVER bold (common model mistakes — leave plain):**
operational complexity, heavy investment, AI-ready data, AI-ready, better decision making, real-time insights, real-time replication, secure environment, reduced setup time, central repository, rapid expansion, personalized experiences, generative AI, cloud infrastructure, data infrastructure, operational overhead, seamless experience, greater customer satisfaction, unexpected spending, or any generic adjective+noun phrase without a digit.

**Never bold:** Think-beat questions, Trigger observations, CTAs, or whole clauses/sentences. Never bold glue words (the, and, your, our, with, for, from, into, than, or, but).

**Trust beat pattern:** "We helped **Indegene** cut environment setup time by **40%**." — client name + one metric, not three bold phrases.`;

/** Phrases the model over-bolds — unwrap to plain text. */
const UNBOLD_PATTERNS: RegExp[] = [
	/operational complexity/i,
	/heavy investment/i,
	/secure environment/i,
	/AI[- ]ready(?:\s+data)?/i,
	/better decision[\s-]*making/i,
	/real[- ]time (?:insights|replication|analytics)/i,
	/secure environment/i,
	/reduced setup time/i,
	/central repository/i,
	/rapid expansion/i,
	/personalized experiences/i,
	/generative AI/i,
	/cloud infrastructure/i,
	/data infrastructure/i,
	/operational overhead/i,
	/seamless experience/i,
	/greater customer satisfaction/i,
	/unexpected spending/i,
	/operational drag/i,
	/data[- ]driven/i,
	/scalable (?:and|&) secure/i,
	/ready for AI/i,
	/insights into/i,
	/decision making/i,
	/infrastructure becoming/i,
	/keeping pace/i,
];

function boldSpanCount(text: string): number {
	return (text.match(/\*\*[^*]+\*\*/g) ?? []).length;
}

function shouldKeepBold(inner: string): boolean {
	const t = inner.trim();
	if (!t) return false;
	if (UNBOLD_PATTERNS.some((re) => re.test(t))) return false;
	// Long phrases (> 4 words) are almost never correct bold targets.
	if (t.split(/\s+/).length > 4) return false;
	// Keep: hard metrics, short proper nouns (client names), single focal tokens.
	if (/\d/.test(t)) return true;
	if (/^[A-Z][A-Za-z0-9]+(?:\s+[A-Z][A-Za-z0-9]+){0,2}$/.test(t)) return true;
	// Generic multi-word prose without a digit — unwrap.
	if (t.split(/\s+/).length >= 2) return false;
	return true;
}

/**
 * Strip incorrect bold and enforce per-format caps (keeps highest-priority spans).
 */
export function sanitizeBoldInText(text: string, format?: ContentFormat): string {
	const maxSpans =
		format === "linkedin_inmail"
			? 2
			: format === "cold_email" || format === "sales_email"
				? 3
				: 3;

	let out = text.replace(/\*\*([^*]+)\*\*/g, (full, inner: string) =>
		shouldKeepBold(inner) ? full : inner.trim(),
	);

	const spans: { start: number; end: number; match: string }[] = [];
	const re = /\*\*[^*]+\*\*/g;
	let m: RegExpExecArray | null;
	while ((m = re.exec(out)) !== null) {
		spans.push({ start: m.index, end: m.index + m[0].length, match: m[0] });
	}

	if (spans.length <= maxSpans) return out;

	const spanPriority = (inner: string): number => {
		if (/\d/.test(inner)) return 0; // keep metrics first
		if (/^[A-Z][A-Za-z0-9]+(?:\s+[A-Z][A-Za-z0-9]+){0,2}$/.test(inner.trim())) return 1; // client / proper noun
		if (UNBOLD_PATTERNS.some((re) => re.test(inner))) return 9; // drop generic first
		if (inner.split(/\s+/).length > 4) return 8;
		return 5;
	};

	const ranked = spans
		.map((s) => ({
			...s,
			inner: s.match.slice(2, -2),
			prio: spanPriority(s.match.slice(2, -2)),
		}))
		.sort((a, b) => b.prio - a.prio);

	const drop = new Set(ranked.slice(maxSpans).map((s) => s.start));
	// Rebuild from last to first so indices stay valid.
	const toDrop = ranked.filter((s) => drop.has(s.start)).sort((a, b) => b.start - a.start);
	for (const s of toDrop) {
		out = out.slice(0, s.start) + s.inner + out.slice(s.end);
	}

	return out;
}

export function bodyMissingVerifiedClient(body: string, clientNames: string[]): boolean {
	if (clientNames.length === 0) return false;
	const plain = body.replace(/\*\*/g, "");
	return !clientNames.some((name) => {
		const n = name.trim();
		if (n.length < 3) return false;
		// Skip sentence-fragment "clients" from bad data — don't require those.
		if (n.split(/\s+/).length > 4 && !/^(Food|Analytics|Retail|Cab|Flight)/i.test(n)) {
			return false;
		}
		return plain.toLowerCase().includes(n.toLowerCase());
	});
}

export function boldOveruse(body: string, format?: ContentFormat): boolean {
	const max = format === "linkedin_inmail" ? 3 : 4;
	return boldSpanCount(body) > max;
}
