import type { GenerationInput } from "../types.js";

/**
 * Structured output instructions per content format.
 * Models must follow section labels exactly so sales can copy/paste into tools.
 */
export function buildFormatInstructions(input: GenerationInput): string {
	switch (input.selectedFormat) {
		case "cold_email":
			return coldEmailStructure();
		case "sales_email":
			return salesEmailStructure();
		case "nurture_email":
			return nurtureEmailStructure(input.nurtureTemplate);
		case "email_sequence":
			return emailSequenceStructure(input.emailSequenceLength);
		case "linkedin_inmail":
			return linkedinInmailStructure(input.linkedinInmailVariation);
		case "linkedin_conversational_ad":
			return linkedinConversationAdStructure();
		default:
			return coldEmailStructure();
	}
}

const STRUCTURE_RULES = `
STRUCTURE RULES (mandatory):
- Output plain text only. No preamble ("Here is your email").
- Start each major block with the EXACT label lines shown below (e.g. "SUBJECT:", "---", "EMAIL 1 —").
- Use real names only when provided; otherwise [FirstName], [CompanyName], [Job Title], [Your Name] placeholders.
- Weave metrics and proof into sentences; never paste raw Tavily bullets into the body.
- End with a "VERIFIED SEARCE RESOURCES" section listing only URLs from the verified case study list (or the hub URL).
`;

function coldEmailStructure(): string {
	return `## COLD EMAIL (first-touch outbound)

${STRUCTURE_RULES}

Use this layout:

SUBJECT:
<under 50 characters, pattern-interrupt, specific to their world>

---
GREETING:
Dear [FirstName],

OPENING PARAGRAPH:
Your name, title at Searce, one line on how Searce helps organizations like [CompanyName] in their industry (transformation, compliance, or speed — pick what fits research).

WHY YOU PARAGRAPH:
"I am reaching out to you specifically because…" Tie to 2–3 role-critical themes as short paragraphs (blank line between each). Mirror the "areas critical to your role" pattern.

PROOF LINE:
One concrete client outcome from verified case studies only (company type + metric). No invented names.

CTA:
Single low-friction ask (e.g. 15-minute virtual meeting next week). Respect their time.

SIGN-OFF:
Regards,
[Your Name] | Searce

VERIFIED SEARCE RESOURCES:
- <bullets with real URLs only>

LENGTH: roughly 180–220 words. Professional, human, zero clichés ("I hope this email finds you well").`;
}

function salesEmailStructure(): string {
	return `## SALES EMAIL (solution-oriented, post-discovery tone)

${STRUCTURE_RULES}

Use this layout:

SUBJECT:
<outcome-focused, specific>

---
GREETING:
Hi [FirstName],

THANK YOU / CONTEXT:
Thank them for time on the call (or assume recent conversation). One line re-introducing Searce and partnership with Google Cloud / AWS as relevant.

CAPABILITIES SECTION:
Intro line: "As a proud partner of Google Cloud, AWS, we offer:" then a labeled list (each on its own line) drawing from actual Searce services that fit the brief — e.g.
• Cloud Consulting: …
• Cloud Managed Services: …
• Data Analytics: …
• AI & ML: …
• DevOps: …
• Location Intelligence: …
• Infrastructure Migration: …
• Data Migration: …
(Include only pillars that fit; 5–8 bullets max.)

CTA BLOCK:
30-minute meeting suggestion OR direct line if provided in notes; optional one line on brochure / one-pager if appropriate.

CLOSING:
Best regards,
[Your Name] | Searce

VERIFIED SEARCE RESOURCES:
- <bullets with real URLs only>

LENGTH: roughly 200–280 words. Confident, specific, no hedge words.`;
}

function nurtureEmailStructure(template: GenerationInput["nurtureTemplate"]): string {
	const t1 = `TEMPLATE 1 — INTRODUCTION & RELEVANCE

SUBJECT:
<conversational, value-tinged>

---
GREETING:
Dear [FirstName],

BODY:
- Intro: your name, Senior Client Engagement Specialist (or appropriate title) at Searce; one line specialization for their industry.
- Bridge: "I am reaching out to you specifically because…" + 2–3 short paragraphs on areas that map to their function (e.g. operational efficiency, data foundation for AI).
- Proof: one verified outcome sentence (regional peer / sector-appropriate).
- CTA: brief 15-minute virtual meeting.

SIGN-OFF:
Regards,
[Your Name] | Searce`;

	const t2 = `TEMPLATE 2 — POST-CALL / CAPABILITIES

SUBJECT:
<reference prior conversation or shared goal>

---
GREETING:
Hi [FirstName],

OPENING:
Thank you for the conversation; re-introduce Searce and cloud partnership angle.

SERVICE PILLARS:
Bullet list of offerings (Cloud Consulting, Managed Services, Data Analytics, AI & ML, DevOps, Location Intelligence, Infra Migration, Data Migration) — tailor descriptions to persona; omit irrelevant lines.

CTA:
30-minute meeting window + optional direct phone if in campaign notes; mention attachment/brochure only if appropriate.

CLOSING:
Best regards,
[Your Name] | Searce`;

	const t3 = `TEMPLATE 3 — INDUSTRY / STRATEGIC HOOK

SUBJECT:
<provocative but professional>

---
GREETING:
Hi [FirstName],

BODY:
- Open with industry shift (e.g. API-first, data-rich economy, digital resilience) in 2–3 sentences.
- Position Searce with verified client types only (no invented logos).
- Tight CTA: ~10-minute intro, specific day optional.

CLOSING:
Best,
[Your Name] | Searce`;

	const chosen = template === "1" ? t1 : template === "2" ? t2 : t3;

	return `## NURTURE EMAIL (value-first; template ${template})

${STRUCTURE_RULES}

${chosen}

VERIFIED SEARCE RESOURCES:
- <bullets with real URLs only>

LENGTH: under ~220 words. Warm, human, not salesy.`;
}

/** Arc for multi-touch manufacturing-style sequence; adapt industry/case names to verified studies + research. */
const SEQUENCE_EMAIL_BLUEPRINTS: readonly string[] = [
	`EMAIL 1 — THE "HINDSIGHT" TRAP
CASE REFERENCE LINE: <use one verified client story; no invented names>
SUBJECT: <Does [CompanyName] manage by real-time data or by hindsight?>
PREVIEW TEXT: <~80 chars for inbox preview>
BODY:
Opening question about operational visibility / reporting lag.
Contrast "hindsight management" with a verified before→after metric from a similar engagement.
CTA LINE: [Book a Strategy Exchange] or equivalent low-friction label`,

	`EMAIL 2 — THE "INFRASTRUCTURE ANCHOR"
CASE REFERENCE LINE: <verified proof>
SUBJECT: <Making [CompanyName]'s infrastructure launch-ready>
PREVIEW TEXT: <legacy vs speed to market>
BODY:
Provocative question on provisioning / launch speed.
Narrative: secure cloud foundation, team shifted from maintenance to innovation — use verified metrics only.
CTA LINE: [Schedule an Infrastructure Briefing]`,

	`EMAIL 3 — THE "PREDICTIVE" EDGE
CASE REFERENCE LINE: <verified proof>
SUBJECT: <Reducing unplanned downtime / operational risk at [CompanyName]>
PREVIEW TEXT: <assets, cost, productivity angle>
BODY:
Question on predicting failures before they happen.
Story: monitoring at scale, remaining useful life / cost reduction — verified numbers only.
CTA LINE: [Request a Predictive Blueprint Session]`,

	`EMAIL 4 — THE "DOCUMENTATION" BOTTLENECK
CASE REFERENCE LINE: <verified proof>
SUBJECT: <Reclaiming engineering hours at [CompanyName]>
PREVIEW TEXT: <automation of manual work>
BODY:
Question on innovation pipeline if manual work disappeared.
AI/automation outcome with verified metric.
CTA LINE: [Schedule an Automation Briefing]`,

	`EMAIL 5 — THE STRATEGIC CLOSER
CASE REFERENCE LINE: <verified proof>
SUBJECT: <Short window to accelerate [CompanyName]'s roadmap?>
PREVIEW TEXT: <data-driven leadership gap>
BODY:
Future-looking stakes; compound advantage; verified sector outcomes.
CTA LINE: [Schedule an Executive Briefing]`,

	`EMAIL 6 — THE "COST OF INACTION" CHECK-IN
CASE REFERENCE LINE: <pattern across verified wins>
SUBJECT: <Is status quo becoming too expensive?>
PREVIEW TEXT: <2026 operational goals>
BODY:
Candid question on margin lost to inefficiency; tie back to earlier themes with verified examples only.
CTA LINE: [Re-open the Strategy Discussion]`,
];

function emailSequenceStructure(length: GenerationInput["emailSequenceLength"]): string {
	const n = length;
	const blocks = SEQUENCE_EMAIL_BLUEPRINTS.slice(0, n).join("\n\n---\n\n");

	return `## EMAIL SEQUENCE (${n} emails)

${STRUCTURE_RULES}

Generate exactly ${n} separate emails. Separate each email with a line containing only: ---

For EACH email use this skeleton (adapt titles and angles to the target industry and verified case studies):

${blocks}

After EMAIL ${n}, add:

VERIFIED SEARCE RESOURCES:
- <bullets with real URLs only>

RULES:
- Each email: distinct hook; progressive story; never desperate tone.
- ~150–200 words per email unless EMAIL 6 is shorter (~130).
- Spacing note at top: suggest Day 1, Day 4, Day 7… as guidance only (plain text line).`;
}

function linkedinInmailStructure(variation: GenerationInput["linkedinInmailVariation"]): string {
	const v1 = `VARIATION 1 — STRATEGIC LEADERSHIP (job-title centric)

SUBJECT:
<short; e.g. AI roadmap / event hook from notes>

---
BODY:
Hi [First Name],

Opening: As a [Job Title], contrast "working with AI" vs being AI-native (one sharp line).

VALUE: One insight + optional assessment / benchmark mention from notes.

EVENT / BOOTH (if in notes): What Searce brings — use 3 short bullets (e.g. agentic AI, industry demos, lightning talk).

CTA: Book 1:1 or reply with availability.

Best,
[Your Name] | Searce`;

	const v2 = `VARIATION 2 — VIP / QUIET 1:1

SUBJECT:
<e.g. Your 2026 strategy at [Event]>

---
BODY:
Hi [First Name],

Acknowledge noise at large events; offer dedicated 1:1 space for [Company Name] (from notes).

BULLETS: Use checkmark-style lines for demos, strategy sessions, thought leadership.

CTA: Ask to reserve a 20-minute slot.

Best,
[Your Name] | Searce`;

	const chosen = variation === "1" ? v1 : v2;

	return `## LINKEDIN INMAIL

${STRUCTURE_RULES}

${chosen}

VERIFIED SEARCE RESOURCES:
- <bullets with real URLs only>

LENGTH: under ~150 words. Short paragraphs; native to LinkedIn; no "I came across your profile."`;
}

function linkedinConversationAdStructure(): string {
	return `## LINKEDIN CONVERSATION AD (Sponsored Messaging — choose-your-own-path)

Reference format: LinkedIn Conversation Ads (Sponsored Messaging) — https://business.linkedin.com/advertise/ads/sponsored-messaging/conversation-ads — member-initiated feel, multiple CTA buttons, choose-your-own-path branching.

${STRUCTURE_RULES}

Output this structure:

CONVERSATION AD — OVERVIEW
<Banner headline + one line value prop — under 70 characters for headline if possible>

---
MESSAGE 1 (OPENING)
<body: 2–3 sentences, sharp hook or stat; mobile-first>

BUTTON A: <under 25 chars, e.g. "Tell me more">
BUTTON B: <under 25 chars, e.g. "Not for us">

---
MESSAGE 2A (IF BUTTON A — INTEREST)
<body: acknowledge interest; one verified Searce outcome sentence>

BUTTON A: <e.g. "See a demo">
BUTTON B: <e.g. "Send details">

---
MESSAGE 2B (IF BUTTON B — POLITE EXIT)
<body: one gracious line; leave door open>

---
MESSAGE 3 (IF DEEP INTEREST FROM 2A)
<body: specific offer — assessment / workshop / 1:1; 2 sentences>

BUTTON A: <e.g. "Book 15 min">
BUTTON B: <e.g. "Email me">

OPTIONAL LINE:
<If using Lead Gen Form, note field labels only — do not invent form URLs>

VERIFIED SEARCE RESOURCES:
- <bullets with real URLs only>

RULES:
- Entire flow under ~350 words total.
- Buttons must be ultra-short; conversational tone; no corporate jargon walls.`;
}
