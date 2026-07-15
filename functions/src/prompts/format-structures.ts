import type { GenerationInput } from "../types.js";
import { BOLD_RULES_PROMPT } from "./bold-rules.js";

/**
 * Per-format CONTENT guidance, built around Josh Braun's **4T** cold-email
 * framework:
 *   1. Trigger  — an observant, specific detail about the prospect (why you).
 *   2. Think    — a neutral, low-pressure question about a likely pain point.
 *   3. Trust    — ONE brief third-party success story (a referenceable Searce
 *                 client, named in plain text) focused on how it works.
 *   4. Talk     — a soft, conversational CTA that gauges interest (never a
 *                 meeting/demo ask).
 *
 * Structural concerns (paragraph count, subject options, marker layout,
 * version split, sequence headers) are enforced by the JSON response schema
 * in `services/output-schemas.ts` and the assembler in
 * `services/output-assembler.ts`. So this file only describes WHAT each
 * beat should accomplish per format, not HOW to format it.
 */
export function buildFormatInstructions(input: GenerationInput): string {
	const sequenceCount = resolveSequenceCount(input);

	// Conversation Ads keep their text-mode pipeline; for sequenceCount > 1
	// we render N variant flows tagged with EMAIL N headers so the parser
	// can show them as tabs.
	if (input.selectedFormat === "linkedin_conversational_ad") {
		return linkedinConversationAdContent(sequenceCount);
	}

	// Multi-touch path (cold/sales/nurture/inmail with sequenceCount > 1,
	// or the dedicated email_sequence format). Drives SEQUENCE_SCHEMA.
	if (sequenceCount > 1 || input.selectedFormat === "email_sequence") {
		return multiTouchSequenceContent(input, sequenceCount);
	}

	switch (input.selectedFormat) {
		case "cold_email":
			return coldEmailContent();
		case "sales_email":
			return salesEmailContent();
		case "nurture_email":
			return nurtureEmailContent(input.nurtureTemplate);
		case "linkedin_inmail":
			return linkedinInmailContent(input.linkedinInmailVariation);
		default:
			return coldEmailContent();
	}
}

function resolveSequenceCount(input: GenerationInput): number {
	if (input.selectedFormat === "email_sequence") return input.emailSequenceLength ?? 5;
	const raw = (input.sequenceCount ?? 1) as number;
	if (raw < 1) return 1;
	if (raw > 5) return 5;
	return raw;
}

/**
 * The 4T spine, written as paragraph guidance. Reused by every single-email
 * format so the four beats always appear in order.
 */
const FOUR_T_ARC = `THE 4T ARC (follow this order in BOTH the LONG and SHORT versions):
1. **Trigger (Why you):** open on ONE observant, specific detail about the prospect's business — a recent signal, a sub-industry dynamic, or a tool/process they likely rely on. It must feel researched, never mass-blasted. No "I hope this finds you well", no "I wanted to reach out".
2. **Think (Neutral question):** ask ONE low-pressure question about a likely pain point, phrased so "no" is easy ("…or have you decided the effort isn't worth it?"). Diagnose, don't pitch.
3. **Trust (Third-party credibility):** tell ONE brief success story of a similar Searce client (named in **plain text**, never linked). Focus on HOW it works + the real metric. One client, one mechanism, one number.
4. **Talk (Low-friction CTA):** close with a soft, conversational question that gauges interest ("Worth a quick look?", "Open to comparing notes?"). NEVER ask for a meeting, demo, or call.`;

/** Canonical Josh Braun 4T example — the model should mirror this rhythm, not copy it verbatim. */
export const FOUR_T_CANONICAL_EXAMPLE = `CANONICAL 4T EXAMPLE (structure reference — adapt to the prospect; do NOT copy verbatim):

Subject: Open to this?

Hi [Name],

Looks like you are currently using [Current Tool/Technology]. When chargebacks or disputes come in, do you spend a lot of time gathering evidence manually, or have you decided the effort isn't worth it?

[Company/Client Name] is using our platform to prevent fraudulent chargebacks. It pulls your transaction data and matches it with footage from existing store cameras so you can instantly watch the video tied to any specific sale or void.

Think this might help your team?

Map each beat to your micro-paragraphs:
- Trigger = observant detail about *them* (tool, signal, or sub-industry reality).
- Think = one neutral pain question with an easy "no" out.
- Trust = ONE verified Searce client + how it works + real metric (plain text, no link).
- Talk = soft interest-check question — never "book a demo" or "schedule a call".`;

const COMMON_PARAGRAPH_GUIDANCE = `
PARAGRAPH / WHITE-SPACE GUIDANCE FOR \`longParagraphs\` (single-email + sequence emails):
- Output **5–9** strings in the array. **Each string is exactly ONE visual paragraph** the rep will see (separated by a blank line in the final email).
- **Micro-paragraph rule:** each string should be **1–2 sentences** (add a 3rd **only** if all sentences are very short). On screen that is usually **1–3 lines** — never a dense 4-line block in a single string. When you have more to say, **add another array item** instead of chaining sentences in one entry.
- **Map the 4T beats onto the blocks:** Trigger (1 block) → Think (1 block) → optional **•** tension/contrast bullet block as its own array entry (2–4 lines) → Trust / proof block naming ONE verified client in **plain text** (no link) → Talk / CTA block.
- **LONG** total: ≤ ~180 words (≤ ~130 InMail). Name ONE verified client in plain text. **Zero hyperlinks of any kind.**

${BOLD_RULES_PROMPT}

PARAGRAPH GUIDANCE FOR \`shortParagraphs\`:
- **4–7** strings, same micro-paragraph rule: **1–2 sentences per entry**; **split** a long thought into two entries rather than one long paragraph. Keep the same 4T order, just tighter (Trigger → Think → Trust → Talk).
- **SHORT** total: ≤ ~128 words (≤ ~88 InMail). Name ONE verified client in plain text. Zero hyperlinks.

DO NOT include "Hi [FirstName]," or "[Your Name] | Searce" inside any paragraph — the server adds those automatically.`;

function coldEmailContent(): string {
	return `## COLD EMAIL (first-touch outbound, 4T framework)

${FOUR_T_ARC}

${FOUR_T_CANONICAL_EXAMPLE}

${COMMON_PARAGRAPH_GUIDANCE}

FORMAT NOTES:
- This is the prospect's FIRST contact, so the **Trigger** must do the heavy lifting — a real signal in their sub-industry (recent news, a sub-category dynamic, or a peer's situation). Earn the next sentence.
- The **Think** question should sound like something their own peer would ask in private.
- Keep it short and unhurried. The whole email reads like a note from one human to another.`;
}

function salesEmailContent(): string {
	return `## SALES EMAIL (post-discovery, solution-oriented, 4T framework)

${FOUR_T_ARC}

${COMMON_PARAGRAPH_GUIDANCE}

FORMAT NOTES:
- **Trigger:** reference the recent conversation or a shared signal — no corporate preamble.
- **Think:** reframe the specific pain they raised as a neutral question, not a pitch.
- **Trust:** ONE relevant Searce client + how it works + the real outcome (plain text). Use ONLY practices from ALLOWED SEARCE PRACTICES. If a transformation contrast helps, render up to 2 short "•" bullets (each ≤ 12 words) — they count toward the word and sentence caps.
- **Talk:** a low-friction next step (send a one-pager / compare notes) — never "book a demo".`;
}

function nurtureEmailContent(template: GenerationInput["nurtureTemplate"]): string {
	const angleByTemplate = {
		"1": `Template 1 — INTRODUCTION & RELEVANCE:
- **Trigger:** a real signal about them (no "I came across…").
- **Think:** a neutral question about the sub-category-specific challenge that signal implies.
- **Trust:** a Searce capability you can actually prove, told through ONE named verified client (plain text) + how it works.
- **Talk:** low-friction interest-check.`,
		"2": `Template 2 — POST-CALL / CAPABILITIES:
- **Trigger:** a thank-you that reuses one specific detail they said.
- **Think:** a neutral question that builds on what they raised on the call.
- **Trust:** ONE relevant Searce client + verified outcome (plain text, how it works). Use only ALLOWED SEARCE PRACTICES.
- **Talk:** low-friction CTA (a one-pager OR compare notes).`,
		"3": `Template 3 — INDUSTRY / STRATEGIC HOOK:
- **Trigger:** one specific industry shift (not generic) — straight in.
- **Think:** a provocative-but-neutral question that shift raises for them.
- **Trust:** position Searce via ONE verified client of a similar type, named in plain text, with the real outcome.
- **Talk:** a soft 10-minute-style interest check (no hard ask).`,
	} as const;

	return `## NURTURE EMAIL (value-first; template ${template}; 4T framework)

${FOUR_T_ARC}

${COMMON_PARAGRAPH_GUIDANCE}

ANGLE FOR THIS TEMPLATE:
${angleByTemplate[template] ?? angleByTemplate["1"]}`;
}

/**
 * Beat library for the dedicated `email_sequence` format. Each touch is its own
 * mini-4T email, with the Trigger angle rotating across the sequence.
 */
const EMAIL_SEQUENCE_BEATS: Record<number, string> = {
	1: `EMAIL 1 — Hindsight trap. Trigger: a daily-reality observation for a [Job Title] in this sub-category (reporting lag / operational visibility). Think: a neutral question about that drag. Trust: ONE verified Searce before/after metric, client named in plain text. Talk: peer-style interest check.`,
	2: `EMAIL 2 — Infrastructure angle. Trigger: an operational/strategic constraint a [Job Title] lives with. Think: a provocative-but-easy question about it. Trust: ONE secure cloud-foundation outcome from a verified client (plain text, how it works). Talk: peer-style ask.`,
	3: `EMAIL 3 — Predictive edge. Trigger: their asset/risk reality. Think: "what if you saw failures before they happen?" framed neutrally. Trust: ONE verified monitoring-at-scale outcome (client in plain text). Talk: peer-style ask.`,
	4: `EMAIL 4 — Reclaimed time. Trigger: a documentation/manual bottleneck. Think: "what would your team do with those hours back?" Trust: ONE verified AI/automation outcome (client in plain text). Talk: peer-style ask.`,
	5: `EMAIL 5 — Strategic closer. Trigger: an objective the [Job Title] is measured on this year. Think: a neutral question about compounding cost of waiting. Trust: ONE verified sub-industry outcome (client in plain text). Talk: peer-style ask.`,
	6: `EMAIL 6 — Cost of inaction (shortest, ≤ 60 words). Trigger + Think folded into one candid question about margin lost to inefficiency. Trust: ONE verified Searce example (plain text). Talk: single low-friction ask.`,
};

/**
 * Beat library used when the rep picks `sequenceCount > 1` on a single-email
 * format. Each touch is a full mini-4T email; the Trigger/Think angle rotates.
 */
const GENERIC_SEQUENCE_BEATS: Record<number, string> = {
	1: `TOUCH 1 — Trigger on a sharp, role-aware signal (recent news, sub-industry shift, or a peer pattern). Think: one neutral pain question. Trust: ONE verified Searce outcome, client named in plain text. Talk: peer-style interest check.`,
	2: `TOUCH 2 — Trigger from a different angle (cost / risk / margin / time). Think: reframe the pain as a new question. Trust: ONE different verified client if possible; else re-use the same one (plain text). Talk: small commitment (15-min exchange of notes / one-pager).`,
	3: `TOUCH 3 — Trigger: a legacy-way vs modern-way contrast (a 2-line **•** block helps: Legacy process / AI-native path / Result). Think: a neutral "which side are you on?" question. Trust: ONE verified client (plain text). Talk: exchange of notes.`,
	4: `TOUCH 4 — Trigger: an objective the [Job Title] is measured on this quarter. Think: neutral question about the gap. Trust: ONE verified Searce outcome (plain text). Talk: a specific but low-friction next step (one-pager).`,
	5: `TOUCH 5 — Final nudge (shortest, ≤ 90 words). Trigger + Think folded into one candid line on the cost of waiting. Trust: ONE verified client (plain text). Talk: single, low-friction ask.`,
};

function multiTouchSequenceContent(input: GenerationInput, count: number): string {
	const n = Math.max(1, Math.min(6, count));
	const isDedicated = input.selectedFormat === "email_sequence";
	const beatsSource = isDedicated ? EMAIL_SEQUENCE_BEATS : GENERIC_SEQUENCE_BEATS;
	const formatLabel = formatDisplayName(input.selectedFormat);

	const beatsList = Array.from({ length: n }, (_, i) => beatsSource[i + 1] ?? "")
		.filter(Boolean)
		.join("\n");

	const headline = isDedicated
		? `EMAIL SEQUENCE (${n} emails, each a mini-4T)`
		: `${formatLabel.toUpperCase()} SEQUENCE (${n} touches, each a mini-4T)`;

	const styleNote = isDedicated
		? ""
		: `STYLE FOR EVERY TOUCH: write each email as a ${formatLabel} (same voice, same hook style, same CTA register). The sequence is N touches of the SAME format — not a mix.\n`;

	return `## ${headline}

Every touch is its own complete 4T email (Trigger → Think → Trust → Talk). For \`emails\`, output exactly ${n} email objects, each following the paragraph rhythm below:

${FOUR_T_ARC}

${COMMON_PARAGRAPH_GUIDANCE}

${styleNote}PER-TOUCH ANGLES (apply each beat to the matching index — the Trigger/Think changes every touch, but all four T's must appear):
${beatsList}

OPTIONAL \`cadenceLine\` field: a single positive-string cadence suggestion like "Day 1 / Day 4 / Day 7 / Day 14 / Day 21". Do NOT prefix with "-" or any other character. Leave empty if unsure.

PER-TOUCH RULES:
- Each touch needs a DISTINCT Trigger AND distinct persona detail in the opening line (bake the [Job Title] reality into the first sentence — never label it).
- Per-touch word total: ≤ ~170 words (a final / closing touch may run ≤ ~102 words).
- Name ONE verified client per touch max, in plain text. No hyperlinks of any kind.
- 3 subject options per touch (the first touch may use 4).`;
}

function formatDisplayName(format: GenerationInput["selectedFormat"]): string {
	switch (format) {
		case "cold_email":
			return "Cold email";
		case "sales_email":
			return "Sales email";
		case "nurture_email":
			return "Nurture email";
		case "linkedin_inmail":
			return "LinkedIn InMail";
		case "linkedin_conversational_ad":
			return "LinkedIn Conversation Ad";
		case "email_sequence":
			return "Email";
		default:
			return "Email";
	}
}

function linkedinInmailContent(variation: GenerationInput["linkedinInmailVariation"]): string {
	const angleByVariation = {
		"1": `Variation 1 — STRATEGIC LEADERSHIP (job-title centric):
- **Trigger:** a sharp [Job Title]-centric observation on AI-native vs working-with-AI in their sub-category.
- **Think:** a neutral question tied to that shift.
- **Trust:** ONE verified Searce outcome, client named in plain text (how it works).
- **Talk:** soft interest check (reply with a thought, not "book a 1:1").`,
		"2": `Variation 2 — VIP / QUIET 1:1:
- **Trigger:** acknowledge the noise at large events; note one sub-category challenge worth a quieter exchange.
- **Think:** a neutral question about that challenge.
- **Trust:** up to TWO "•" bullets (each ≤ 12 words) on how Searce has helped peers (name ONE client in plain text). Bullets count toward the cap.
- **Talk:** a light, low-pressure question (not a hard slot request).`,
	} as const;

	return `## LINKEDIN INMAIL (variation ${variation}; 4T framework)

${FOUR_T_ARC}

${COMMON_PARAGRAPH_GUIDANCE}

LENGTH OVERRIDE FOR INMAIL:
- Same micro-paragraph discipline: **5–8** \`longParagraphs\` entries preferred; **1–2 sentences** per entry.
- \`longParagraphs\` total: ≤ ~130 words.
- \`shortParagraphs\`: **4–6** entries, ≤ ~88 words total.
- Native to LinkedIn. No "I came across your profile."

ANGLE FOR THIS VARIATION:
${angleByVariation[variation] ?? angleByVariation["1"]}`;
}

/**
 * Conversation Ad still uses text-mode generation (it has a branching
 * multi-message structure that doesn't fit the single/sequence schema). The
 * compliance-retry loop handles it. The 4T beats map onto the message flow:
 * MESSAGE 1 = Trigger + Think, MESSAGE 2A = Trust, MESSAGE 3 = Talk.
 *
 * When `sequenceCount > 1`, we ask the model to produce N distinct variant
 * flows, each headed with `EMAIL N — <variant title>` so the UI parser
 * surfaces them as separate tabs the rep can A/B between.
 */
function linkedinConversationAdContent(sequenceCount: number): string {
	const n = Math.max(1, Math.min(5, sequenceCount));
	const singleFlow = `CONVERSATION AD — OVERVIEW
Banner headline + one-line value prop. Headline < 70 chars.

---
MESSAGE 1 (OPENING — Trigger + Think)
Two to three sentences. Open on a Trigger (observant detail about their world), then a neutral Think question. Mobile-first, plain prose, no external links.

BUTTON A: <under 25 chars, e.g. "Tell me more">
BUTTON B: <under 25 chars, e.g. "Not for us">

---
MESSAGE 2A (IF BUTTON A — INTEREST → Trust)
Acknowledge interest; tell ONE verified Searce success story, client named in plain text (how it works + the metric). No links.

BUTTON A: <e.g. "See how">
BUTTON B: <e.g. "Send details">

---
MESSAGE 2B (IF BUTTON B — POLITE EXIT)
One gracious line; leave the door open.

---
MESSAGE 3 (IF DEEP INTEREST FROM 2A — Talk)
A soft, specific next step — a one-pager / a short look / compare notes; 2 sentences. Low-friction, never a hard demo ask.

BUTTON A: <e.g. "Send the one-pager">
BUTTON B: <e.g. "Email me">

OPTIONAL LEAD GEN FORM LINE:
If using a Lead Gen Form, list field labels only — never invent form URLs.`;

	if (n === 1) {
		return `## LINKEDIN CONVERSATION AD (Sponsored Messaging — choose-your-own-path, 4T framework)

This format uses text mode (not the single-email schema). Output the structure below, with each MESSAGE as natural prose mapped to the 4T beats. NO structural labels other than the MESSAGE / BUTTON markers.

${singleFlow}

---
STRATEGIST NOTE:
Two to three sentences on the angle of the flow + the specific Trigger signal that drove it.

RULES:
- Whole flow under ~280 words.
- Buttons must be ultra-short; conversational tone; no corporate jargon walls.
- Name verified Searce clients in plain text only. No links anywhere. No trailing source block.`;
	}

	return `## LINKEDIN CONVERSATION AD SEQUENCE — ${n} variant flows (each a 4T flow)

This format uses text mode (not the single-email schema). Output **${n} distinct conversation-ad variants**, each a complete 4T CYOP flow (banner + MESSAGE 1 Trigger/Think + branching 2A Trust / 2B exit + MESSAGE 3 Talk + optional Lead Gen Form). Each variant explores a different Trigger angle (e.g. pain question vs ROI hook vs social-proof story vs provocation).

OUTPUT STRUCTURE — exactly ${n} variants. Each MUST start with the header below so the rep sees them as separate tabs:

EMAIL 1 — <variant title (e.g. "Pain Question hook")>

${singleFlow}

---

EMAIL 2 — <variant title>

${singleFlow}

(…continue for a total of ${n} variants…)

---
STRATEGIST NOTE:
Two to three sentences on the angle of the SEQUENCE (why these ${n} variants together) + the specific Trigger signal that drove the angle.

RULES (every variant must obey):
- Each variant: whole flow under ~280 words.
- Each variant: name ONE verified Searce client in plain text (zero links anywhere).
- Buttons ultra-short; conversational; no corporate jargon walls.
- Variants must read distinctly different — never repeat the same hook with cosmetic tweaks.`;
}
