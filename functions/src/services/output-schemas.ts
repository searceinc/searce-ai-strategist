/**
 * Gemini structured-output schemas (JSON Schema format).
 *
 * These are sent through `config.responseJsonSchema` in the @google/genai
 * SDK (>= v1.9). Keeping the schema in standard JSON Schema vocabulary —
 * lowercase `type` values, `minItems`/`maxItems`, `enum`, `description` —
 * means Gemini's backend handles enforcement directly rather than relying
 * on the SDK's older client-side conversion path.
 *
 * Field shapes:
 *   subjects:        3–4 items, each {letter, subject, preview}
 *   longParagraphs:  5–9 short strings (micro-paragraphs; one visual block each)
 *   shortParagraphs: 4–7 short strings
 *   strategistNote:  separate string field
 *
 * Bullet lists are encouraged INSIDE a paragraph, written as Markdown lines
 * starting with "•" or "-" — the renderer renders them as <ul>.
 */

const subjectOptionSchema = {
	type: "object",
	properties: {
		letter: {
			type: "string",
			enum: ["A", "B", "C", "D"],
			description: "Subject variant letter A through D.",
		},
		subject: {
			type: "string",
			description:
				"Subject line ≤ 60 characters. Each variant uses a different angle (specific question, benefit/number, provocation, curiosity).",
		},
		preview: {
			type: "string",
			description: "Inbox preview line ≤ 90 characters.",
		},
	},
	required: ["letter", "subject", "preview"],
} as const;

const subjectsArraySchema = {
	type: "array",
	items: subjectOptionSchema,
	minItems: 3,
	maxItems: 4,
	description:
		"3 or 4 subject + preview variants. A=specific question, B=benefit/number, C=provocation, D=curiosity (optional).",
} as const;

export const SINGLE_EMAIL_SCHEMA = {
	type: "object",
	description:
		"A single email with A/B/C(/D) subject options, a LONG body, a SHORT body, and a strategist note.",
	properties: {
		subjects: subjectsArraySchema,
		longParagraphs: {
			type: "array",
			items: { type: "string" },
			minItems: 5,
			maxItems: 9,
			description:
				'Use 5–9 array entries. EACH entry is ONE micro-paragraph: at most 2 sentences (3 only if every sentence is very short). Prefer 1–2 sentences so each block is 1–3 lines on screen — use a NEW array item for each beat instead of stacking sentences in one string. One entry may be a 2–4 line bullet block using lines starting with \'•\'. Total ≤ ~180 words (≤ ~130 InMail). Use **bold** for scan-friendly emphasis (4–7 short spans): metric+noun phrases, 2–4 word pain hooks, proper nouns, and **Label:** prefixes on bullet lines where helpful — never bold glue words alone ("before", "after", "the", "we"). Spread bold across blocks. Exactly ONE Searce Markdown anchor [VerifiedClientName](searce url) using a real client from the list — never generic labels like [Multiple clients].',
		},
		shortParagraphs: {
			type: "array",
			items: { type: "string" },
			minItems: 4,
			maxItems: 7,
			description:
				"Use 4–7 micro-paragraphs: same rule — one short idea per array entry (1–2 sentences each, rarely 3 if all very short). Split dense paragraphs into more entries. ≤ ~128 words (≤ ~88 InMail). **Bold** 3–5 times: metric+context phrases, pain hooks, proper nouns, optional **Label:** on bullet lines — not glue words alone. One Searce anchor. No generic bracket link labels.",
		},
		strategistNote: {
			type: "string",
			description:
				"2–3 sentences explaining why you picked this angle and the specific signal that drove it. Plain prose. No labels.",
		},
	},
	required: ["subjects", "longParagraphs", "shortParagraphs", "strategistNote"],
} as const;

const sequenceEmailSchema = {
	type: "object",
	properties: {
		title: {
			type: "string",
			description:
				"Short title for this email (e.g. 'The Hindsight Trap'). Will be rendered as 'EMAIL N — title'.",
		},
		subjects: {
			...subjectsArraySchema,
			description:
				"3 (or 4 for the first email) subject + preview variants. Different angle per letter.",
		},
		paragraphs: {
			type: "array",
			items: { type: "string" },
			minItems: 5,
			maxItems: 9,
			description:
				"5–9 micro-paragraphs per email: 1–2 sentences per entry (rarely 3 if all short); one '•' bullet block allowed as a single entry. Total ≤ ~170 words (closing ≤ ~102). **Bold** 4–7 spans: keywords, metric+context, bullet labels — never connector words alone. One Searce anchor per email.",
		},
	},
	required: ["title", "subjects", "paragraphs"],
} as const;

export const SEQUENCE_SCHEMA = {
	type: "object",
	description:
		"Multi-touch email sequence with N emails. Each email follows the same paragraph rhythm as a single email's LONG body.",
	properties: {
		cadenceLine: {
			type: "string",
			description:
				"One-line cadence suggestion such as 'Day 1 / Day 4 / Day 7 / Day 14 / Day 21'. NEVER prefix with a leading minus or any other character. May be empty.",
		},
		emails: {
			type: "array",
			items: sequenceEmailSchema,
			minItems: 3,
			maxItems: 6,
			description:
				"Exactly the requested number of emails. Each must have a distinct hook and persona detail.",
		},
		strategistNote: {
			type: "string",
			description:
				"2–3 sentences on the angle of the sequence + the specific signal that drove it.",
		},
	},
	required: ["emails", "strategistNote"],
} as const;

// ─── TS types mirroring the schemas (for the assembler) ─────────────────────

export interface SubjectOption {
	letter: "A" | "B" | "C" | "D";
	subject: string;
	preview: string;
}

export interface SingleEmailResponse {
	subjects: SubjectOption[];
	longParagraphs: string[];
	shortParagraphs: string[];
	strategistNote: string;
}

export interface SequenceEmail {
	title: string;
	subjects: SubjectOption[];
	paragraphs: string[];
}

export interface SequenceResponse {
	cadenceLine?: string;
	emails: SequenceEmail[];
	strategistNote: string;
}
