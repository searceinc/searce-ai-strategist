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
				"Use 5–9 array entries following the 4T arc (Trigger → Think → Trust → Talk). EACH entry is ONE micro-paragraph: at most 2 sentences (3 only if every sentence is very short). Total ≤ ~180 words (≤ ~130 InMail). BOLD: max 3 spans in LONG (max 2 in InMail) — ONLY hard metrics with a digit OR the verified CLIENT NAME once in Trust beat. Never bold generic phrases (operational complexity, AI-ready data, better decision making). Trust beat: spell CLIENT NAME exactly from VERIFIED CASE STUDIES; never use a title or sentence fragment as the client.",
		},
		shortParagraphs: {
			type: "array",
			items: { type: "string" },
			minItems: 4,
			maxItems: 7,
			description:
				"Use 4–7 micro-paragraphs following the tight 4T arc. ≤ ~128 words (≤ ~88 InMail). BOLD: max 2 spans (1 in InMail) — digit-bearing metrics and/or CLIENT NAME in Trust beat only. No generic phrase bolding. Name ONE verified client exactly as in VERIFIED CASE STUDIES.",
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
				"5–9 micro-paragraphs per email, each a full 4T arc. Total ≤ ~170 words (closing ≤ ~102). BOLD: max 2–3 spans — digit metrics and/or CLIENT NAME in Trust beat only. Spell CLIENT NAME exactly from VERIFIED CASE STUDIES per email.",
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
			minItems: 2,
			maxItems: 6,
			description:
				"Exactly the requested number of emails (2–6). Each must have a distinct hook and persona detail.",
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
