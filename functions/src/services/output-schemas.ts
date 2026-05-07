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
 *   longParagraphs:  3–5 paragraph strings (target: 3–4 paragraphs)
 *   shortParagraphs: 2–4 paragraph strings (target: 2–3 paragraphs)
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
			minItems: 3,
			maxItems: 5,
			description:
				"Aim for 3–4 paragraphs. Each paragraph is 3–4 short sentences (≤ 18 words each). Greeting and sign-off lines are added by the server — do NOT include them. Bullets are encouraged where they help: write 2–3 lines starting with '•' inside a paragraph (e.g. 'Legacy Process: …', 'With Searce: …', 'Result: …'). Total ≤ ~150 words across all paragraphs. Recommended structure: P1 = signal-driven hook (1–2 sentences). P2 = the specific pain narrative (3–4 sentences). P3 (optional) = a 2–3 bullet 'Searce Transformation' mini-block OR a verified Searce proof anchored as Markdown link [Client](url). P4 = peer-style low-friction ask (1–2 sentences).",
		},
		shortParagraphs: {
			type: "array",
			items: { type: "string" },
			minItems: 2,
			maxItems: 4,
			description:
				"Aim for 2–3 paragraphs, ≤ 80 words total. P1 = greeting+hook in one sentence (without writing 'Hi …', the server adds that). P2 = the pain + ONE verified Searce proof anchored as Markdown link [Client](url) (1–2 sentences). P3 (optional) = low-friction CTA (1 sentence).",
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
			minItems: 3,
			maxItems: 5,
			description:
				"Aim for 3–4 paragraphs, 3–4 short sentences each. Greeting and sign-off added by the server. Bullets allowed inside a paragraph using '•'. Total ≤ ~140 words (closing email of a sequence may run ≤ 90). Recommended: P1 = persona-specific hook bake into prose. P2 = pain narrative. P3 (optional) = bullets OR a verified Searce proof anchored as Markdown link. P4 = peer-style low-friction ask.",
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
