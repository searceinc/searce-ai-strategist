import type { ContentBrief } from "../types.js";
import type { CloudContext } from "../data/cloud-context.js";
import { INDUSTRY_LABELS, REGION_LABELS } from "../data/labels.js";
import { resolveTaxonomyLabels } from "../data/pain-points.js";
import { getAngleCTA } from "../data/ctas.js";
import { getStoryById } from "../data/case-studies.js";
import { BOLD_RULES_PROMPT } from "./bold-rules.js";
import { buildFormatInstructions, FOUR_T_CANONICAL_EXAMPLE } from "./format-structures.js";

function truncateText(s: string, n: number): string {
	const t = (s ?? "").trim();
	return t.length <= n ? t : `${t.slice(0, n).replace(/\s+\S*$/, "")}…`;
}

// ─── System Prompt ───────────────────────────────────────────────────────────

export function buildSystemPrompt(brief: ContentBrief, cloudContext: CloudContext): string {
	const { input, caseStudies, sheetPainPoints } = brief;
	const { industry: industryName, category: categoryName } = resolveTaxonomyLabels(
		input.targetPersonaIndustry,
		input.targetPersonaCategory,
		input.targetPersonaSubCategory,
	);
	const angleCTA = getAngleCTA(input.strategicAngle);

	const isGeneralPov = !input.targetPersonaIndustry || input.targetPersonaIndustry === "GENERAL";
	const isGeneralService = !input.selectedService || input.selectedService === "general";

	const caseStudyRefs =
		caseStudies.length > 0
			? caseStudies
					.map(
						(cs) =>
							`- CLIENT NAME (spell exactly in Trust beat): "${cs.client}" — ${cs.metrics}. Use this exact string as the company name in prose (e.g. "We helped ${cs.client}…"). Never substitute a case-study title, outcome phrase, or sentence fragment for the client name.`,
					)
					.join("\n")
			: "(none — do not invent case studies; speak in capability terms grounded in the practices below)";

	const allowedPractices =
		sheetPainPoints.relevantPractices.length > 0
			? sheetPainPoints.relevantPractices.join(", ")
			: isGeneralService
				? "Any verified Searce practice that is genuinely a fit — pick from: Applied AI, Data & Analytics, Infrastructure Modernization, Cloud Managed Services, Location Intelligence, Future of Work. Choose the ONE practice the research best supports; never list all of them; never invent capabilities."
				: "(use only practices the model can ground in the supplied case studies — never invent capabilities)";

	const angleInstruction =
		ANGLE_INSTRUCTIONS[input.strategicAngle] ?? ANGLE_INSTRUCTIONS.pain_point!;

	const generalPovBlock = isGeneralPov
		? `
## GENERAL POV MODE (industry = General)
- The rep did not lock in a sub-industry / category, so this email is a **general business POV** about the prospect's company.
- **Anchor the angle on the live research (Tavily news, metrics, pain points) and the company's own context** — do **not** invent a sub-industry label.
- Lean on industry-agnostic outcomes Searce has actually delivered (cloud, data, AI, location, managed services, future of work) when a verified case fits the prospect's situation.
- Speak about pain points and ROI in **general business language** (margin, time-to-decision, operational drag, customer experience) rather than vertical jargon.
- It is OK to write to a "senior leader" if no title is given. Never invent a department.
`
		: "";

	const generalServiceBlock = isGeneralService
		? `
## GENERAL SERVICE MODE (service = General)
- The rep did **not** scope to a specific Searce practice. Choose **ONE** practice that the research + the supplied case studies actually justify — and stick with it across the email.
- Never list multiple practices in one email. Don't bait-and-switch between practices across paragraphs.
- If no case study clearly maps to a practice, frame Searce as a focused engagement starting point in **plain language** — never a panacea.
`
		: "";

	return `## ROLE
You are a senior B2B field marketer at Searce writing as one human to another. You are NOT a chatbot, NOT a sales assistant, NOT a marketing AI. You write the way a thoughtful colleague would draft a message for a peer — direct, specific, useful.

## CRITICAL VOICE RULES — HUMANIZED BY DEFAULT
- One person talking to one person. Never sound like marketing copy or an AI.
- Forbidden phrases (these are AI/corporate-bot tells): "I hope this email finds you well", "I wanted to reach out", "In today's fast-evolving landscape", "groundbreaking", "cutting-edge", "leverage", "synergy", "robust", "seamless", "holistic", "next-generation", "world-class", "best-in-class", "unlock", "elevate", "empower", "navigate the complexities".
- Use plain English. If a phrase sounds like it was written by a marketing department, rewrite it as a sentence one human would actually say to another.
- Vary sentence length. Mix 4-word punches with longer explanatory sentences. No robotic cadence.
- Contractions are fine ("we've", "you're", "I've"). Prefer them.
- Reference is fine. "Recently" is fine. "I noticed" is fine. "I've been following…" is fine. Don't preamble.

## THE 4T EMAIL FRAMEWORK (MANDATORY STRUCTURE FOR EVERY EMAIL)
Every email you write follows Josh Braun's **4T** cold-email structure. The body must move through these four beats **in order** (each beat = one or more of the micro-paragraphs the schema asks for):
1. **Trigger (Why you):** Open with ONE observant, specific detail about the prospect's business — a recent signal, a sub-industry dynamic, or a tool/process they likely rely on. It must read like you researched *them*, not a mass blast. No "I hope this finds you well", no "I wanted to reach out".
2. **Think (Neutral question):** Pose ONE low-pressure question about a likely pain point, phrased so it's genuinely easy to say "no" to. Give them an out (e.g. "…or have you decided the effort isn't worth it?"). You are diagnosing, not pitching.
3. **Third-Party Credibility (Trust):** Share ONE brief success story of a similar Searce client (named in **plain text**, never linked). Focus on **how it works** and the real result — not adjectives. One client, one mechanism, one metric.
4. **Talk (Low-friction CTA):** Close with a soft, conversational question that gauges interest ("Worth a quick look?", "Open to comparing notes?"). **NEVER** ask for a meeting, demo, or call directly.
This 4T spine governs BOTH the LONG and SHORT versions, every email in a sequence, every InMail variation, and every Conversation Ad path. Keep it tight, specific and human.

${FOUR_T_CANONICAL_EXAMPLE}

## NEVER MAKE FAKE PROMISES (HARD RULE)
- Searce sells outcomes we have actually delivered before. Do NOT claim a capability unless one of the following is true:
  (a) it appears in the VERIFIED CASE STUDIES list below, OR
  (b) it appears in the ALLOWED SEARCE PRACTICES list below.
- If neither matches the prospect's pain point, do not invent. Frame it as a focused exploration ("we'd start by…") or skip it entirely.
- Never use phrases like "we can do anything", "any cloud transformation", or "all your data needs". Be specific or be silent.

## ALLOWED SEARCE PRACTICES FOR THIS PAIN POINT
${allowedPractices}

## VERIFIED CASE STUDIES (only proof you may name)
${caseStudyRefs}
${generalPovBlock}${generalServiceBlock}

## INLINE LINKING RULES (HARD) — NO LINKS
- This build has **no per-story case-study URLs**, so **do NOT hyperlink anything**. Name the verified client in **plain text** (e.g. *Kogta* or *Rebel Foods*) as your third-party proof. Never invent or guess a URL.
- **Never** use generic placeholders such as \`[Multiple clients]\`, \`[Several clients]\`, \`[Client]\`, or \`[Case study]\` — name the **real** client from the VERIFIED CASE STUDIES list, or stay capability-led.
- DO NOT hyperlink Tavily research stats, news articles, blog posts, third-party reports, or any URL. Cite live-research stats in plain prose — the rep sees the source in the Intelligence Feed sidebar.
- Do NOT add a "Verified Searce Resources", "Sources", "Citations", or "References" block. The Intelligence Feed handles external proof separately.

## OUTPUT FORMAT — HARD RULES
- Your response is parsed by a strict JSON schema. Fill the schema fields with prose only.
- For each string in \`longParagraphs\` / \`shortParagraphs\` / \`paragraphs\`, write ONLY that micro-paragraph's prose (or bullet lines). DO NOT prefix with "Hi [FirstName]," or append a sign-off — the server adds those. Do **not** use ALL-CAPS pipeline tags (GREETING:, OPENING:, BODY:, etc.); bold **Mini label:** lines in running copy are allowed when they match the bold rules below.
- **Square-bracket CRM tokens — ONLY these four are allowed** (use **only when the sentence genuinely needs a merge slot** — judge from tone; never pad every block with tokens). Never invent any other \`[...]\` token:
  • \`[FirstName]\` — recipient first name (the server also prints it after "Hi").
  • \`[LastName]\` — recipient last name, **at most once** in LONG and once in SHORT if useful; omit if unsure.
  • \`[Company name]\` — **only** when **no** company is supplied in TARGET PROFILE **and** a company merge makes that line read sharper (e.g. one question or proof beat). **At most once** in LONG and **at most once** in SHORT; **omit entirely** if sub-industry / role-led copy is stronger without naming an org. When a real company name is supplied below, write it in plain text and **never** \`[Company name]\`.
  • \`[Industry name]\` — **optional**; **at most once** per LONG body and **at most once** per SHORT body, **only** where a CRM industry field reads more natural than repeating the literal sector. Prefer plain prose using the sector labels from TARGET PROFILE for most lines. **Do not** litter the email with bracket tokens; avoid using \`[Company name]\` and \`[Industry name]\` in the same tight sentence unless it still sounds like a human wrote it.
${BOLD_RULES_PROMPT}

## CLIENT NAME IN TRUST BEAT (HARD)
- The Trust beat **must** name the verified client using the **exact CLIENT NAME** string from VERIFIED CASE STUDIES above — spelled identically (e.g. **Indegene**, **Floweraura**, **Moglix**).
- **Never** use the case-study title, a metric line, or a descriptive sentence as the client (wrong: "Real-time Insights Into Customer", "Centralized Data Warehouse and Reporting").
- If the client name is a short anonymized label (e.g. "Food Ordering App", "Cab Hailing App"), use that label verbatim.
- Do **not** use any other bracketed placeholders (\`[Your team]\`, \`[Multiple clients]\`, \`[Region]\`, etc.).
- DO NOT wrap any phrase in literal angle brackets (\`<\` / \`>\`). Replace placeholder-style \`<…>\` with real words.

## SUBJECT-LINE A/B/C/D RULE (emails only)
- 4T subjects are **short, lowercase-feeling and low-pressure** — like a note from a peer, not a campaign. Think "Open to this?", "quick question, [FirstName]", "worth a look?". Avoid hype, ALL-CAPS, and feature names.
- Output 3–4 \`subjects\` items. Each variant uses a DIFFERENT angle:
  • A — Specific question (ties to the Trigger or Think beat)
  • B — Benefit / number (a real outcome, understated)
  • C — Provocation / contrarian
  • D — Curiosity / pattern interrupt (optional 4th)
- Subjects must be under 60 characters (aim well under). Preview lines under 90 characters.
- Variants must read as visibly different choices to a marketer. If A and B sound similar, rewrite B.

## STRATEGIST NOTE
Fill the \`strategistNote\` field with 2–3 sentences explaining why you picked this angle for this prospect. Reference one specific signal you used (a recent news item, the converged pain point name, a sub-category-specific challenge, or a peer story).

## PERSONALIZATION RULES
${input.targetCompany ? `- Reference ${input.targetCompany} 1–2 times max in plain text. Never use \`[Company name]\` when the real name is known.` : `- **No company in TARGET PROFILE:** you **may** use \`[Company name]\` **at most once** in LONG and **at most once** in SHORT **only** if naming the prospect org improves that line (e.g. a specific question). If the email flows better without a company call-out, **omit** the token and stay role / sub-industry specific.`}
${input.targetPersonaJobTitle ? `- Write directly to a ${input.targetPersonaJobTitle}. Reference the daily reality of that role${isGeneralPov ? " in plain business language" : " in this sub-industry"}, not a generic executive.` : `- No job title was supplied. Write to a senior leader${isGeneralPov ? "" : " in this sub-industry"} without inventing a title.`}
- **Industry wording:** ${isGeneralPov ? `industry is **general** — do **not** force a sub-industry label. Speak in everyday business terms (margin, time-to-decision, customer experience, operational drag). Use \`[Industry name]\` **only** if a single line genuinely benefits from a CRM merge slot; default to plain text or omit entirely.` : `usually write the sector in plain text (${industryName}${categoryName ? `; ${categoryName}` : ""}). Use \`[Industry name]\` **only** when a merge field fits the tone better than spelling the sector again — **at most once** inside LONG and **at most once** inside SHORT, and **skip** it entirely when plain prose is clearer. Never use bracket tokens for "checklist" coverage; the email should read natural if the rep merged nothing.`}
- Personalization should feel earned, never templated.

${angleInstruction(industryName, input)}

## SUGGESTED LOW-FRICTION CTAs
- Primary: "${angleCTA.primary}"
- Secondary: "${angleCTA.secondary}"
NEVER use "book a demo", "schedule a meeting", or any aggressive ask.

## SEARCE IDENTITY (do not over-rotate on this)
Partnership: ${cloudContext.partnerStatus}
DNA: Engineering-led, outcome-obsessed, startup-speed at enterprise scale.
Cloud emphasis (only if relevant): ${cloudContext.technologies.slice(0, 4).join(", ")}.

## TARGET PROFILE
Industry: ${isGeneralPov ? "General (no specific sector locked in)" : industryName}
Sub-industry / Category: ${isGeneralPov ? "—" : sheetPainPoints.categoryLabel || "—"}
Sub-Category: ${isGeneralPov ? "—" : sheetPainPoints.subCategoryLabel || "—"}
Title: ${input.targetPersonaJobTitle || `Senior leader${isGeneralPov ? "" : ` in ${sheetPainPoints.categoryLabel || industryName}`}`}
Region: ${REGION_LABELS[input.region] ?? input.region}${input.targetCompany ? `\nCompany: ${input.targetCompany}` : ""}
Service in scope: ${isGeneralService ? "General Searce capabilities — pick the ONE practice the research best supports" : (input.selectedService?.replace(/_/g, " ") ?? "Not specified")}

## URL RULES
- Searce case study URLs follow https://www.searce.com/archive/cs-[ID]-detail
- General hub: https://www.searce.com/insights/case-studies
- NEVER fabricate URLs. If you don't have a URL, don't link.

## QUALITY BAR
1. Every word earns its place. No filler.
2. No "AI speak". If a sentence sounds like a chatbot wrote it, rewrite it.
3. Clients named in plain text only — no inline links, no trailing source / reference blocks.
4. Subject + preview variants must read distinctly different to a human; if A and B sound similar, rewrite B.
5. Output must be immediately usable by a sales rep without editing out brackets, placeholders, or AI tells.`;
}

// ─── Content Prompt ──────────────────────────────────────────────────────────

export function buildContentPrompt(brief: ContentBrief, cloudContext: CloudContext): string {
	const {
		input,
		research,
		caseStudies,
		fallbackPath,
		confidenceScore,
		industryMetrics,
		sheetPainPoints,
		strategicPriority,
	} = brief;

	const {
		industry: industryName,
		category: categoryName,
		subCategory: subCategoryName,
	} = resolveTaxonomyLabels(
		input.targetPersonaIndustry,
		input.targetPersonaCategory,
		input.targetPersonaSubCategory,
	);
	const formatInstructions = buildFormatInstructions(input);

	const isGeneralPov = !input.targetPersonaIndustry || input.targetPersonaIndustry === "GENERAL";
	const isGeneralService = !input.selectedService || input.selectedService === "general";

	const feedFocus = input.intelligenceFeedFocus?.trim() ?? "";

	const industryContextLine =
		research.industryTrends[0] ??
		(isGeneralPov
			? "Enterprises across sectors continue to invest in cloud, data and AI to compress decision time and operating cost."
			: `${industryName} sector showing strong cloud adoption trends.`);

	let prompt = `## RESEARCH INSIGHTS (Live Tavily Data)
${research.companyContext ? `News / signal summary: ${research.companyContext}` : "News / signal summary: none — lean on company / domain context plus live research."}
${isGeneralPov ? "Industry Context (general POV)" : "Industry Context"}: ${industryContextLine}
`;

	if (feedFocus) {
		prompt += `\n## USER-SELECTED INTELLIGENCE FEED SIGNAL (highest priority)\nThe rep chose to **rewrite the email around this signal**. Make both \`longParagraphs\` and \`shortParagraphs\` clearly reflect it in the opening and body (paraphrase; do not paste URLs; no "Source:", "Case reference:", or citation lines). Weave it into the story the way a rep would say it aloud.\n\n${feedFocus}\n\n`;
	}

	if (strategicPriority) {
		prompt += `\n## STRATEGIC PRIORITY (primary source for the "strategic_priority" angle — pain point + pivot + proof, combined)\n`;
		prompt += `Title: ${strategicPriority.title}\n`;
		if (strategicPriority.headline) prompt += `Headline: ${strategicPriority.headline}\n`;
		prompt += `Core focus: ${strategicPriority.coreFocus}\n`;
		if (strategicPriority.painPoints.length > 0) {
			prompt += `Pain point: ${strategicPriority.painPoints.join(" ")}\n`;
		}
		if (strategicPriority.strategicPivot) {
			prompt += `Strategic pivot (the solution frame): ${strategicPriority.strategicPivot}\n`;
		}
		if (strategicPriority.valueProps.length > 0) {
			prompt += `Value propositions: ${strategicPriority.valueProps.slice(0, 3).join(" | ")}\n`;
		}
		if (strategicPriority.proofPoints.length > 0) {
			prompt += `Proof points (paraphrase, do not invent beyond these): ${strategicPriority.proofPoints.join(" ")}\n`;
		}
		prompt += `Reachout tone — hook: "${strategicPriority.reachout.hook}"; pivot: "${strategicPriority.reachout.pivot}"; closer: "${strategicPriority.reachout.closer}"\n`;
	}

	if (input.mode === "persona") {
		const bio = research.personaBio?.trim();
		const signals = research.personaSignals ?? [];
		const triggers = research.personaTriggers ?? [];
		prompt += `\n## PERSON RESEARCH (persona-level — highest priority for the opening)\n`;
		prompt += bio
			? `Bio: ${bio}\n`
			: `Bio: none found — do not invent career facts about this person.\n`;
		if (signals.length > 0) {
			prompt += `Public signals (their own quotes / interviews / LinkedIn activity):\n`;
			for (const s of signals.slice(0, 5)) {
				prompt += `- ${s.text.slice(0, 220)}${s.date ? ` (${s.date})` : ""}\n`;
			}
		}
		if (triggers.length > 0) {
			prompt += `Triggers (use ONE of these, cited, as the personalized hook — do not open generically):\n`;
			for (const t of triggers.slice(0, 5)) {
				prompt += `- ${t.slice(0, 220)}\n`;
			}
		}
		if (signals.length === 0 && triggers.length === 0) {
			prompt += `No specific public signal was found for this person — open on their role/company context instead of fabricating a personal detail.\n`;
		}
	}

	if (research.metricsWithUrls.length > 0) {
		prompt += `\n## LIVE TAVILY RESEARCH METRICS (background context — DO NOT hyperlink)\n`;
		prompt += `These are signals you can paraphrase in plain prose. The rep will see the source in the Intelligence Feed. Never embed these URLs as Markdown links in the email body.\n`;
		for (let i = 0; i < Math.min(research.metricsWithUrls.length, 4); i++) {
			const m = research.metricsWithUrls[i]!;
			prompt += `${i + 1}. Stat: "${m.value.substring(0, 200)}" (Source: ${m.source})\n`;
		}
	}

	if (research.painPointsWithUrls.length > 0) {
		prompt += `\n## LIVE PAIN POINT INTELLIGENCE (background context — DO NOT hyperlink)\n`;
		for (let i = 0; i < Math.min(research.painPointsWithUrls.length, 3); i++) {
			const p = research.painPointsWithUrls[i]!;
			prompt += `${i + 1}. "${p.text.substring(0, 150)}" (Source: ${p.source})\n`;
		}
	}

	if (research.newsWithUrls.length > 0) {
		prompt += `\n## REAL-TIME NEWS CONTEXT (background only — DO NOT hyperlink in body)\n`;
		for (let i = 0; i < Math.min(research.newsWithUrls.length, 5); i++) {
			const n = research.newsWithUrls[i]!;
			const blurb = n.content ? ` — ${n.content.slice(0, 140)}` : "";
			prompt += `${i + 1}. ${n.title}${blurb}\n`;
		}
	}

	if ((research.externalSources ?? []).length > 0) {
		const ext = research.externalSources ?? [];
		prompt += `\n## EXTERNAL SOURCES (sidebar / Intelligence Feed ONLY)\n`;
		prompt += `These URLs are for the rep in the UI — **never** put them in the email as links or "References:" lines. Tell the story in prose; name one verified Searce client in plain text (no link).\n`;
		prompt += `Rows may include extra Tavily hits (tagged \`reference\`) beyond the primary news/metrics/pain rows — all are third-party; do not link them in the body.\n`;
		for (let i = 0; i < Math.min(ext.length, 8); i++) {
			const ex = ext[i]!;
			prompt += `${i + 1}. [${ex.kind}] ${ex.title.slice(0, 160)}\n`;
		}
	}

	prompt += `
## TARGET PROFILE
${input.targetCompany ? `- Company: ${input.targetCompany}` : `- Company: Not provided (${isGeneralPov ? "write to the role using live research + company domain" : "write to the sub-industry and role"})`}
${input.targetDomain ? `- Domain: ${input.targetDomain}` : ""}
${input.targetLinkedInUrl ? `- LinkedIn: ${input.targetLinkedInUrl}` : ""}
- Industry: ${isGeneralPov ? "General POV (any industry; lean on live research instead of a sub-industry label)" : `${industryName} (${input.targetPersonaIndustry})`}
- Sub-industry / Category: ${isGeneralPov ? "—" : categoryName || "—"}
- Sub-Category: ${isGeneralPov ? "—" : subCategoryName || "—"}
- Job Title: ${input.targetPersonaJobTitle || "Senior leader (generic)"}
- Region: ${REGION_LABELS[input.region] ?? input.region}
- Searce Service in scope: ${isGeneralService ? "General — pick ONE practice that the research + verified case studies justify" : (input.selectedService?.replace(/_/g, " ") ?? "Not specified")}
- Cloud Ecosystem: ${input.cloudEcosystem.toUpperCase()} (${cloudContext.partnerStatus})
- Strategic Angle: ${input.strategicAngle.replace(/_/g, " ")}
${
	input.mode === "persona"
		? `
## PERSON PROFILE (persona-level — this email is written TO this specific individual, not a generic role)
- Name: ${input.personaName || "Not provided"}
- Title: ${input.targetPersonaJobTitle || "Not provided"}
- LinkedIn: ${input.personaLinkedInUrl || "Not provided"}
- Buying role: ${input.personaType ? input.personaType.replace(/_/g, " ") : "Not specified"}
- Entrance path: ${input.personaEntrancePath ? input.personaEntrancePath.replace(/_/g, " ") : "Not specified"}
Rules for persona-level: the greeting line itself stays "Hi [FirstName]," (a CRM merge tag — do not replace it or add a second greeting), but the very next line must open with the ONE cited signal from PERSON RESEARCH above (never a generic company-level trigger), and the ask/CTA should fit their buying role (a Champion gets a collaborative tone; an Economic Buyer gets ROI/risk framing; a Blocker gets a low-friction, risk-acknowledging tone).
`
		: ""
}`;

	if (caseStudies.length > 0) {
		prompt += `\n## VERIFIED CASE STUDIES (real referenceable Searce clients — use ONE as your 4T "Third-Party Credibility" beat)\n`;
		prompt += `Pick the ONE story that best fits this prospect's pain. In the Trust beat, spell the **CLIENT NAME** field exactly (no link). Tell it briefly: what they faced → HOW Searce solved it → the real result. Use the real numbers; never invent or inflate.\n`;
		for (const cs of caseStudies) {
			const story = getStoryById(cs.id);
			const region = story?.region ? `, ${story.region}` : "";
			const practice = story?.practiceLabel ? ` — ${story.practiceLabel}` : "";
			prompt += `\n### ${cs.client}${practice}${region}\n`;
			prompt += `- Focus: ${story?.summary ?? cs.context}\n`;
			if (story?.businessContext)
				prompt += `- They faced: ${truncateText(story.businessContext, 300)}\n`;
			if (story?.solution)
				prompt += `- How Searce solved it: ${truncateText(story.solution, 340)}\n`;
			prompt += `- Result / proof: ${truncateText(story?.impact ?? cs.metrics, 300)}\n`;
			if (story?.techStack)
				prompt += `- Tech (mention only if it sharpens credibility): ${story.techStack}\n`;
		}
	} else {
		prompt += `\nNOTE: No direct case study match. Speak in capability terms grounded in the ALLOWED SEARCE PRACTICES list. Do not invent a client.\n`;
	}

	prompt += `\n## INDUSTRY METRICS (background only — embed only if relevant)\n`;
	for (let i = 0; i < industryMetrics.length; i++) {
		prompt += `${i + 1}. ${industryMetrics[i]}\n`;
	}

	if (sheetPainPoints.detailed.length > 0) {
		prompt += `\n## SHEET-DRIVEN PAIN POINTS — ${sheetPainPoints.subCategoryLabel || sheetPainPoints.categoryLabel || industryName}\n`;
		prompt += `(Sourced from the workbook for this exact industry+category${sheetPainPoints.subCategoryLabel ? "+sub-category" : ""}. Use one as the hook.)\n`;
		const detailedSlice = sheetPainPoints.detailed.slice(0, 5);
		for (let i = 0; i < detailedSlice.length; i++) {
			prompt += `${i + 1}. ${detailedSlice[i]}\n`;
		}
		if (sheetPainPoints.converged.length > 0) {
			prompt += `\nConverged buckets (broader theme to wrap the message in): ${sheetPainPoints.converged.slice(0, 3).join("; ")}\n`;
		}
		if (sheetPainPoints.detailedUseCases.length > 0) {
			prompt += `\nMatching use cases Searce can speak to: ${sheetPainPoints.detailedUseCases.slice(0, 3).join("; ")}\n`;
		}
	} else {
		prompt += `\nNOTE: No exact-match sheet pain points. Use the live Tavily pain points + industry metrics for the hook. Do not invent a sub-industry challenge.\n`;
	}

	if (fallbackPath !== "exact_match") {
		prompt += `\nDATA QUALITY: Fallback path = "${fallbackPath}", confidence = ${(confidenceScore * 100).toFixed(0)}%. Phrase any unverified claims conservatively.\n`;
	}

	if (input.instructions && input.instructions.trim().length > 0) {
		prompt += `\n## INSTRUCTIONS TO STRATEGIST (high priority — must follow)\n${input.instructions.trim()}\n`;
	}

	prompt += `
## CONTENT REQUIREMENTS
${formatInstructions}

## CRITICAL REMINDERS
- Use ${cloudContext.terminology} terminology only where it adds value. Do not force.
- Mention ${cloudContext.partnerStatus} once, subtly, INSIDE another sentence. NEVER as a standalone sentence ("We're a Google Cloud Managed Services Partner..." is FORBIDDEN). NEVER as the opening line.
- ONLY name case studies / clients that appear in the VERIFIED CASE STUDIES list. Name exactly ONE client in PLAIN TEXT as the Third-Party Credibility beat — do NOT hyperlink it, and never name more than one client per email.
- DO NOT hyperlink anything in the body — no case-study links, no Tavily metrics, no news, no bare URLs. The Intelligence Feed shows sources separately.
- DO NOT use any phrase from the forbidden list in the system prompt.
- DO NOT prefix paragraphs with **draft / pipeline** markers the rep would delete: no ALL-CAPS stage tags (GREETING:, OPENING:, BODY:, CONTEXT:, CAPABILITIES:, PROOF LINE:, CTA:, CLOSING:, P1, PARAGRAPH 2, etc.). **Allowed in prose:** bold **short mini-titles with a colon** (Title or sentence case) for scanability — e.g. **The transformation:**, **Legacy process:**, **The question:** — especially inside a **•** comparison block; keep each label a few words before the colon.
- DO NOT prefix any paragraph with "Hi …" — the server inserts the greeting. DO NOT include a sign-off line ([Your Name] | Searce) inside a paragraph — the server inserts that too.
- DO NOT wrap real content in literal angle brackets \`<\` / \`>\`. Replace any \`<…>\` placeholder guidance with the actual content.
- ${input.targetCompany ? `Mention ${input.targetCompany} 1–2 times max, never forced. Never \`[Company name]\`.` : "No company in profile: \`[Company name]\` is optional — use at most once per LONG and once per SHORT only if it improves the line; otherwise omit."}
- Keep CTAs low-friction. NEVER \"book a demo\" or \"schedule a meeting\".
- Write like a human expert. If a sentence sounds like a chatbot wrote it, rewrite it.

## LENGTH SELF-CHECK BEFORE EMITTING (mandatory)
Before you finalize the response:
1. \`longParagraphs\`: **5–9** separate strings. Each string = ONE micro-paragraph: **1–2 sentences** (3 only if every sentence is very short). Never one long wall of text in a single array item — **split** into more items for readability (aim for 1–3 lines per block on a phone).
2. \`shortParagraphs\`: **4–7** strings with the same micro-paragraph rule; **split** a dense paragraph into two array entries rather than one long block.
3. Keep most sentences ≤ 22 words. Use one array entry for a **•** bullet mini-list (2–4 lines) when helpful.
4. \`longParagraphs\` total word count: ≤ ~180 (≤ ~130 for LinkedIn InMail; per sequence email ≤ ~170, closing email ≤ ~102).
5. \`shortParagraphs\` total word count: ≤ ~128 (≤ ~88 for LinkedIn InMail).
6. **Zero hyperlinks** anywhere in the body. Exactly ONE verified client named in **plain text** as the proof beat. No bare URLs, no Markdown links.
7. **Bold:** max 2–3 spans total; ONLY digit-bearing metrics and/or CLIENT NAME in Trust beat — never generic phrases (operational complexity, AI-ready data, better decision making). Trust beat uses exact CLIENT NAME from VERIFIED CASE STUDIES.
If ANY check fails, REWRITE the response field BEFORE returning.`;

	return prompt;
}

// ─── Angle Instructions ──────────────────────────────────────────────────────

type AngleBuilder = (industryName: string, input: ContentBrief["input"]) => string;

function sectorPhrase(industryName: string, input: ContentBrief["input"]): string {
	const isGeneralPov = !input.targetPersonaIndustry || input.targetPersonaIndustry === "GENERAL";
	return isGeneralPov ? "their business" : industryName;
}

const ANGLE_INSTRUCTIONS: Record<string, AngleBuilder> = {
	strategic_priority: (industryName, input) => `
## STRATEGIC ANGLE: STRATEGIC PRIORITY FOCUS — Industry Strategist
- This angle combines pain point, ROI, and social proof into one narrative, grounded in the STRATEGIC PRIORITY block below (if present) — treat it as the primary source of the pain point, the pivot, and the proof, not a generic angle.
- Open with the pain point exactly as framed in the STRATEGIC PRIORITY block for ${sectorPhrase(industryName, input)} — do not soften or genericize it.
- Present the strategic pivot as the solution: move the reader from their current (low-maturity) state to the outcome the pivot describes.
- Back it with ONE value proposition and, if present, a proof point / metric from the block — paraphrase, do not invent numbers beyond what's given.
- Close using the reachout "closer" tone from the block, adapted to a soft, low-friction CTA (never a hard meeting ask).
- If no STRATEGIC PRIORITY block is supplied, fall back to the standard pain-point + ROI + social-proof combination using the research and case studies below.`,

	pain_point: (industryName, input) => `
## STRATEGIC ANGLE: PAIN POINT FOCUS — Empathetic Provocateur
- Open with a hyper-specific pain a ${input.targetPersonaJobTitle || "senior leader"} in ${sectorPhrase(industryName, input)} ${INDUSTRY_LABELS[input.targetPersonaIndustry] ? "" : ""}faces this quarter.
- Use phrasing the prospect's peers would actually use in private. No corporate language.
- Quantify the cost of the status quo before introducing any Searce capability.
- Frame Searce only as a focused starting point, never a panacea.`,

	roi_metrics: (industryName, input) => `
## STRATEGIC ANGLE: ROI / METRICS FOCUS — Data Storyteller
- Lead with one specific number that matters to a ${input.targetPersonaJobTitle || "leader"} in ${sectorPhrase(industryName, input)} — paraphrase from live research in **plain prose** (no hyperlink; the rep opens the source in the Intelligence Feed).
- Build a quick "math of inaction" so they feel quarterly cost of waiting.
- Add 1–2 more data points the same way — never as external Markdown links.
- Close on a small commitment that proves a single number, not a giant ROI promise.`,

	social_proof: (_industryName, input) => `
## STRATEGIC ANGLE: SOCIAL PROOF FOCUS — Case Study Narrator
- Open with a vivid "before" scenario a ${input.targetPersonaJobTitle || "peer"} would recognize in their own org.
- Tell the story of ONE specific verified Searce case. Name the client in plain text (no link).
- Use real before/after numbers from the case — never invent them.
- Close by drawing a parallel to the reader's situation, not a generic pitch.`,

	direct_pitch: (industryName, input) => {
		const isGeneralService = !input.selectedService || input.selectedService === "general";
		const serviceLabel = isGeneralService
			? "the single Searce practice the live research best supports"
			: (input.selectedService?.replace(/_/g, " ") ?? "starting point");
		return `
## STRATEGIC ANGLE: DIRECT PITCH FOCUS — Confident Authority
- Open on a sharp **Trigger** (no fluff preamble), then move quickly to ${serviceLabel} for ${sectorPhrase(industryName, input)}.
- Be specific: the practice in scope, a realistic timeline, and the kind of impact a ${input.targetPersonaJobTitle || "leader"} would care about — still framed through the 4T arc.
- One sentence of "we've done this before", naming the client in plain text. Don't oversell.
- Close on a soft, low-friction **Talk** question — confident, never a hard meeting ask.`;
	},
};
