import type { GenerationInput } from "../types.js";

/**
 * Per-format CONTENT guidance.
 *
 * Structural concerns (paragraph count, subject options, marker layout,
 * version split, sequence headers) are enforced by the JSON response schema
 * in `services/output-schemas.ts` and the assembler in
 * `services/output-assembler.ts`. So this file only describes WHAT each
 * paragraph should accomplish per format, not HOW to format it.
 */
export function buildFormatInstructions(input: GenerationInput): string {
	switch (input.selectedFormat) {
		case "cold_email":
			return coldEmailContent();
		case "sales_email":
			return salesEmailContent();
		case "nurture_email":
			return nurtureEmailContent(input.nurtureTemplate);
		case "email_sequence":
			return emailSequenceContent(input.emailSequenceLength);
		case "linkedin_inmail":
			return linkedinInmailContent(input.linkedinInmailVariation);
		case "linkedin_conversational_ad":
			return linkedinConversationAdContent();
		default:
			return coldEmailContent();
	}
}

const COMMON_PARAGRAPH_GUIDANCE = `
PARAGRAPH / WHITE-SPACE GUIDANCE FOR \`longParagraphs\` (single-email + sequence emails):
- Output **5–9** strings in the array. **Each string is exactly ONE visual paragraph** the rep will see (separated by a blank line in the final email).
- **Micro-paragraph rule:** each string should be **1–2 sentences** (add a 3rd **only** if all sentences are very short). On screen that is usually **1–3 lines** — never a dense 4-line block in a single string. When you have more to say, **add another array item** instead of chaining sentences in one entry.
- Typical flow (flexible): hook micro-block → second micro-block (tension) → optional **•** bullet block as its own array entry (2–4 bullet lines) → proof micro-block with the single Searce Markdown anchor → CTA micro-block.
- **LONG** total: ≤ ~180 words (≤ ~130 InMail). One Searce anchor in LONG. Zero third-party links.
- **Bold:** use \`**…**\` **4–7** times in LONG and **3–5** in SHORT. Spread across different entries. Combine **numbers with the words that make them meaningful** (e.g. **60% improvement in delivery accuracy**), add **2–4 word tension phrases** (**unified visibility**, **manual reconciliation drag**), **proper nouns** when focal, and in **•** blocks use **short Label:** patterns (**Legacy process:** … **Result:** …). **Never** bold connector words alone (before, after, when, while, the, we, our, your, this, that, and, or, but, if, also, just, very, here, there). **Never** open a plain prose sentence with bold unless the first token is a **number**, a **proper noun**, or a deliberate **Label:** line.

PARAGRAPH GUIDANCE FOR \`shortParagraphs\`:
- **4–7** strings, same micro-paragraph rule: **1–2 sentences per entry**; **split** a long thought into two entries rather than one long paragraph.
- **SHORT** total: ≤ ~128 words (≤ ~88 InMail). One Searce anchor.

DO NOT include "Hi [FirstName]," or "[Your Name] | Searce" inside any paragraph — the server adds those automatically.
`;

function coldEmailContent(): string {
	return `## COLD EMAIL (first-touch outbound)

${COMMON_PARAGRAPH_GUIDANCE}

ANGLE FOR THIS FORMAT:
- P1 = a sharp opener tied to a real signal in their sub-industry (recent news, sub-category dynamic, or a peer's situation).
- P2 = the sub-category-specific pain, mapped to ONE verified Searce client outcome (anchor on the client name).
- P3 = a peer-style low-friction ask ("worth a 10-minute exchange of notes?" type).
`;
}

function salesEmailContent(): string {
	return `## SALES EMAIL (post-discovery, solution-oriented)

${COMMON_PARAGRAPH_GUIDANCE}

ANGLE FOR THIS FORMAT:
- P1 = reference the recent conversation or a shared signal. No corporate preamble.
- P2 = ONE relevant Searce practice + one verified outcome anchored on the client name. Use ONLY practices from ALLOWED SEARCE PRACTICES. If you genuinely need a transformation contrast, you may render it inline as up to 2 short bullets using "•" (each ≤ 12 words) — but bullets count toward the word total and the sentence cap.
- P3 = a specific, low-friction ask: 30-minute working session OR send a one-pager.
`;
}

function nurtureEmailContent(template: GenerationInput["nurtureTemplate"]): string {
	const angleByTemplate = {
		"1": `Template 1 — INTRODUCTION & RELEVANCE:
- P1 = open with a real signal (no "I came across…").
- P2 = sub-category-specific challenge → Searce capability you can actually prove, anchored on a verified client name.
- P3 = low-friction CTA.`,
		"2": `Template 2 — POST-CALL / CAPABILITIES:
- P1 = thank-you that reuses one specific detail they said.
- P2 = ONE relevant Searce practice + verified outcome anchored on the client name. Use only ALLOWED SEARCE PRACTICES.
- P3 = low-friction CTA (30-min working session OR a one-pager).`,
		"3": `Template 3 — INDUSTRY / STRATEGIC HOOK:
- P1 = one specific industry shift (not generic) — straight in.
- P2 = position Searce only via a verified client type, with the verified outcome anchored on the client name.
- P3 = 10-minute intro ask.`,
	} as const;

	return `## NURTURE EMAIL (value-first; template ${template})

${COMMON_PARAGRAPH_GUIDANCE}

ANGLE FOR THIS FORMAT:
${angleByTemplate[template] ?? angleByTemplate["1"]}
`;
}

function emailSequenceContent(length: GenerationInput["emailSequenceLength"]): string {
	const n = length;
	const beats: Record<number, string> = {
		1: `EMAIL 1 — Hindsight trap: open with a daily-reality question for a [Job Title] in this sub-category about reporting lag / operational visibility. Pain → ONE verified Searce before/after metric anchored on the client name. CTA = peer-style ask.`,
		2: `EMAIL 2 — Infrastructure anchor: open with one operational/strategic constraint a [Job Title] lives with, framed as a provocative question. Tell ONE secure cloud foundation outcome from a verified case (Searce anchor). CTA = peer-style ask.`,
		3: `EMAIL 3 — Predictive edge: tie the [Job Title]'s asset/risk reality to predicting failures before they happen. ONE verified monitoring-at-scale outcome (anchor on client name). CTA = peer-style ask.`,
		4: `EMAIL 4 — Documentation bottleneck: what would the [Job Title] do with reclaimed hours? ONE verified AI/automation outcome with anchor on client name. CTA = peer-style ask.`,
		5: `EMAIL 5 — Strategic closer: tie to a strategic objective the [Job Title] is measured on this year. Compound advantage from ONE verified sub-industry outcome. CTA = peer-style ask.`,
		6: `EMAIL 6 — Cost of inaction (shortest, ≤ 60 words): candid question on margin lost to inefficiency, tied to a current operating constraint. ONE verified Searce example. CTA = peer-style ask.`,
	};

	const beatsList = Array.from({ length: n }, (_, i) => beats[i + 1] ?? "")
		.filter(Boolean)
		.join("\n");

	return `## EMAIL SEQUENCE (${n} emails)

For \`emails\`, output exactly ${n} email objects. Each email follows the same paragraph rhythm as a single email:

${COMMON_PARAGRAPH_GUIDANCE}

PER-EMAIL ANGLES (apply each beat to the matching email index):
${beatsList}

OPTIONAL \`cadenceLine\` field: a single positive-string cadence suggestion like "Day 1 / Day 4 / Day 7 / Day 14 / Day 21". Do NOT prefix with "-" or any other character. Leave empty if unsure.

PER-EMAIL RULES:
- Each email needs a DISTINCT hook AND distinct persona detail in P1 (bake the [Job Title] reality into the first sentence — never label it).
- Per-email word total: ≤ ~170 words (the closing email may run ≤ ~102 words).
- ONE Searce anchor per email max. No external-source anchors.
- 3 subject options per email (the first email may use 4).
`;
}

function linkedinInmailContent(variation: GenerationInput["linkedinInmailVariation"]): string {
	const angleByVariation = {
		"1": `Variation 1 — STRATEGIC LEADERSHIP (job-title centric):
- P1 = sharp [Job Title]-centric contrast on AI-native vs working-with-AI.
- P2 = one insight tied to this sub-category + ONE verified Searce outcome anchored on the client name.
- P3 = book a 1:1 OR reply with availability.`,
		"2": `Variation 2 — VIP / QUIET 1:1:
- P1 = acknowledge noise at large events; offer a dedicated 1:1 tied to one sub-category challenge.
- P2 = up to TWO bullets using "•" for demos / strategy / thought-leadership offers (each ≤ 12 words). Bullets count toward sentence cap.
- P3 = ask to reserve a 20-minute slot.`,
	} as const;

	return `## LINKEDIN INMAIL (variation ${variation})

${COMMON_PARAGRAPH_GUIDANCE}

LENGTH OVERRIDE FOR INMAIL:
- Same micro-paragraph discipline: **5–8** \`longParagraphs\` entries preferred; **1–2 sentences** per entry.
- \`longParagraphs\` total: ≤ ~130 words.
- \`shortParagraphs\`: **4–6** entries, ≤ ~88 words total.
- Native to LinkedIn. No "I came across your profile."

ANGLE FOR THIS VARIATION:
${angleByVariation[variation] ?? angleByVariation["1"]}
`;
}

/**
 * Conversation Ad still uses text-mode generation (it has a branching
 * multi-message structure that doesn't fit the single/sequence schema). The
 * compliance-retry loop handles it.
 */
function linkedinConversationAdContent(): string {
	return `## LINKEDIN CONVERSATION AD (Sponsored Messaging — choose-your-own-path)

This format uses text mode (not the single-email schema). Output the structure below, with each MESSAGE as natural prose. NO structural labels other than the MESSAGE / BUTTON markers.

CONVERSATION AD — OVERVIEW
Banner headline + one-line value prop. Headline < 70 chars.

---
MESSAGE 1 (OPENING)
Two to three sentences, sharp hook or stat (in plain prose — never link external sources). Mobile-first.

BUTTON A: <under 25 chars, e.g. "Tell me more">
BUTTON B: <under 25 chars, e.g. "Not for us">

---
MESSAGE 2A (IF BUTTON A — INTEREST)
Acknowledge interest; one verified Searce outcome as inline anchor on the client name.

BUTTON A: <e.g. "See a demo">
BUTTON B: <e.g. "Send details">

---
MESSAGE 2B (IF BUTTON B — POLITE EXIT)
One gracious line; leave door open.

---
MESSAGE 3 (IF DEEP INTEREST FROM 2A)
Specific offer — assessment / workshop / 1:1; 2 sentences.

BUTTON A: <e.g. "Book 15 min">
BUTTON B: <e.g. "Email me">

OPTIONAL LEAD GEN FORM LINE:
If using a Lead Gen Form, list field labels only — never invent form URLs.

---
STRATEGIST NOTE:
Two to three sentences on the angle of the flow + the specific signal that drove it.

RULES:
- Whole flow under ~280 words.
- Buttons must be ultra-short; conversational tone; no corporate jargon walls.
- Inline anchors only on verified Searce client names. No external-source anchors. No trailing source block.`;
}
