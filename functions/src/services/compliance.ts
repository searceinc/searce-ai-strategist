/**
 * Server-side compliance check for Gemini output.
 *
 * The prompt asks for strict sentence/word counts but at temperature ≥ 0.4,
 * Gemini will sometimes ignore them. We verify the structure here and, when
 * it busts, the orchestrator retries ONCE with a corrective instruction at
 * an even lower temperature. This is the only reliable way to enforce hard
 * length limits on a free-form LLM.
 */

import type { ContentFormat, GenerationInput } from "../types.js";

export interface ComplianceResult {
	ok: boolean;
	reasons: string[];
}

function resolveSequenceCount(
	input: { selectedFormat: ContentFormat } & Partial<GenerationInput>,
): number {
	if (input.selectedFormat === "email_sequence") return input.emailSequenceLength ?? 5;
	const raw = (input.sequenceCount ?? 1) as number;
	if (raw < 1) return 1;
	if (raw > 5) return 5;
	return raw;
}

const SEQUENCE_CAPABLE_FORMATS_C: ReadonlySet<ContentFormat> = new Set([
	"cold_email",
	"sales_email",
	"nurture_email",
	"linkedin_inmail",
	"email_sequence",
]);

const LONG_HEADER = /^\s*={3}\s*VERSION\s*:\s*LONG\s*={3}\s*$/im;
const SHORT_HEADER = /^\s*={3}\s*VERSION\s*:\s*SHORT\s*={3}\s*$/im;
const STRATEGIST_HEADER = /^\s*STRATEGIST\s*NOTE\s*:?\s*$/im;
const EMAIL_HEADER = /^\s*EMAIL\s+(\d+)\b/gim;
const SUBJECT_OR_PREVIEW_LINE = /^\s*(?:SUBJECT\s+OPTION|PREVIEW)\s+[A-D]\s*[:\-—–]/i;
const SEPARATOR_LINE = /^\s*[-=]{3,}\s*$/;

const SINGLE_EMAIL_FORMATS: ReadonlySet<ContentFormat> = new Set([
	"cold_email",
	"sales_email",
	"nurture_email",
	"linkedin_inmail",
]);

interface LengthCaps {
	longWordMax: number;
	shortWordMax: number;
}

function lengthCapsFor(format: ContentFormat): LengthCaps {
	if (format === "linkedin_inmail") {
		return { longWordMax: 130, shortWordMax: 88 };
	}
	return { longWordMax: 180, shortWordMax: 128 };
}

const SEQUENCE_LONG_WORD_MAX = 170;
const SEQUENCE_FINAL_WORD_MAX = 102;

export function checkCompliance(
	content: string,
	formatOrInput: ContentFormat | ({ selectedFormat: ContentFormat } & Partial<GenerationInput>),
): ComplianceResult {
	const reasons: string[] = [];
	const text = (content ?? "").replace(/\r\n/g, "\n");

	const input =
		typeof formatOrInput === "string"
			? ({ selectedFormat: formatOrInput } as {
					selectedFormat: ContentFormat;
				} & Partial<GenerationInput>)
			: formatOrInput;
	const format = input.selectedFormat;
	const sequenceCount = resolveSequenceCount(input);

	// Conversation Ad has its own multi-message structure; we don't enforce
	// LONG/SHORT or per-email word caps on it. (Sequence variants are
	// rendered by the parser via EMAIL N — Variant N headers.)
	if (format === "linkedin_conversational_ad") {
		return { ok: true, reasons: [] };
	}

	const isSequenceRun =
		format === "email_sequence" ||
		(SEQUENCE_CAPABLE_FORMATS_C.has(format) && sequenceCount > 1);

	if (isSequenceRun) {
		const emails = sliceSequenceEmails(text);
		if (emails.length === 0) {
			reasons.push(
				`No "EMAIL N" sections found. Each touch must start with an "EMAIL N — title" header.`,
			);
		} else {
			emails.forEach((body, idx) => {
				const isFinal = idx === emails.length - 1 && emails.length >= 5;
				const cap = isFinal ? SEQUENCE_FINAL_WORD_MAX : SEQUENCE_LONG_WORD_MAX;
				checkSingleEmailBody({
					body,
					label: `EMAIL ${idx + 1}`,
					wordMax: cap,
					out: reasons,
				});
			});
		}
		return { ok: reasons.length === 0, reasons };
	}

	if (SINGLE_EMAIL_FORMATS.has(format)) {
		const long = sliceBetween(text, LONG_HEADER, [SHORT_HEADER, STRATEGIST_HEADER]);
		const short = sliceBetween(text, SHORT_HEADER, [LONG_HEADER, STRATEGIST_HEADER]);

		const caps = lengthCapsFor(format);

		if (long !== null) {
			checkSingleEmailBody({
				body: long,
				label: "LONG",
				wordMax: caps.longWordMax,
				out: reasons,
			});
		} else {
			reasons.push(
				`Missing ===VERSION:LONG=== marker. Output must use that exact separator.`,
			);
		}

		if (short !== null) {
			checkSingleEmailBody({
				body: short,
				label: "SHORT",
				wordMax: caps.shortWordMax,
				shortVariant: true,
				out: reasons,
			});
		} else {
			reasons.push(
				`Missing ===VERSION:SHORT=== marker. Output must use that exact separator.`,
			);
		}
	}

	return { ok: reasons.length === 0, reasons };
}

interface CheckBodyArgs {
	body: string;
	label: string;
	wordMax: number;
	shortVariant?: boolean;
	out: string[];
}

function checkSingleEmailBody({ body, label, wordMax, shortVariant, out }: CheckBodyArgs): void {
	const cleaned = stripScaffolding(body);
	const paragraphs = cleaned
		.split(/\n{2,}/)
		.map((p) => p.trim())
		.filter(Boolean);

	const greetingIdx = paragraphs.findIndex((p) => /^Hi\b/i.test(p));
	const signOffIdx = paragraphs.findIndex((p) => /\|\s*Searce\s*$/i.test(p));

	const bodyParas = paragraphs.filter((_p, i) => {
		if (greetingIdx >= 0 && i === greetingIdx) return false;
		if (signOffIdx >= 0 && i === signOffIdx) return false;
		return true;
	});

	const totalWords = bodyParas.reduce((acc, p) => acc + countWords(p), 0);
	if (totalWords > wordMax) {
		out.push(
			`${label} body is ${totalWords} words; cap is ${wordMax}. Cut sentences until it fits.`,
		);
	}

	if (!shortVariant) {
		if (bodyParas.length > 10) {
			out.push(
				`${label} body has ${bodyParas.length} paragraphs; use at most 10 short blocks (each 1–3 lines).`,
			);
		} else if (bodyParas.length < 3) {
			out.push(
				`${label} body has too few paragraph breaks; split into more short paragraphs (aim for 5–9 blocks for LONG).`,
			);
		}
	} else if (bodyParas.length > 7) {
		out.push(
			`${label} body has ${bodyParas.length} paragraphs; SHORT should use at most 7 short blocks.`,
		);
	} else if (bodyParas.length < 2) {
		out.push(`${label} SHORT body should use at least 2 short blocks.`);
	}

	for (const p of bodyParas) {
		for (const sentence of splitSentences(p)) {
			const w = countWords(sentence);
			if (w > 24) {
				out.push(
					`${label} contains a ${w}-word sentence (cap 24). Split: "${truncate(sentence, 70)}"`,
				);
				break;
			}
		}
	}
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function sliceBetween(text: string, startRe: RegExp, endRes: RegExp[]): string | null {
	const start = text.match(startRe);
	if (!start || typeof start.index !== "number") return null;
	const after = start.index + start[0].length;
	let end = text.length;
	for (const re of endRes) {
		const m = text.slice(after).match(re);
		if (m && typeof m.index === "number") {
			const candidate = after + m.index;
			if (candidate < end) end = candidate;
		}
	}
	return text.slice(after, end);
}

function sliceSequenceEmails(text: string): string[] {
	const headers: { idx: number; n: number }[] = [];
	let m: RegExpExecArray | null;
	const re = new RegExp(EMAIL_HEADER.source, EMAIL_HEADER.flags);
	while ((m = re.exec(text)) !== null) {
		headers.push({ idx: m.index + m[0].length, n: Number(m[1]) });
	}
	if (headers.length === 0) return [];
	const stratIdx = (() => {
		const sm = text.match(STRATEGIST_HEADER);
		return sm && typeof sm.index === "number" ? sm.index : text.length;
	})();
	const out: string[] = [];
	for (let i = 0; i < headers.length; i++) {
		const start = headers[i]!.idx;
		const end =
			i + 1 < headers.length ? text.indexOf(`EMAIL `, headers[i + 1]!.idx - 8) : stratIdx;
		const safeEnd = end > start ? end : stratIdx;
		out.push(text.slice(start, safeEnd));
	}
	return out;
}

function stripScaffolding(body: string): string {
	return body
		.split("\n")
		.filter((line) => {
			if (SUBJECT_OR_PREVIEW_LINE.test(line)) return false;
			if (SEPARATOR_LINE.test(line)) return false;
			return true;
		})
		.join("\n")
		.trim();
}

function countWords(text: string): number {
	const stripped = text
		.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
		.replace(/[*_`]/g, "")
		.trim();
	if (!stripped) return 0;
	return stripped.split(/\s+/).filter(Boolean).length;
}

function splitSentences(paragraph: string): string[] {
	return paragraph
		.split(/(?<=[.!?])\s+(?=[A-Z[(])/)
		.map((s) => s.trim())
		.filter(Boolean);
}

function truncate(s: string, n: number): string {
	return s.length <= n ? s : `${s.slice(0, n)}…`;
}

/**
 * Build the corrective system suffix that gets appended to the user prompt
 * for the single retry. We want it short, blunt, and listing exactly which
 * checks failed last time.
 */
export function buildCorrectivePrompt(reasons: string[]): string {
	const list = reasons.map((r) => `- ${r}`).join("\n");
	return `

## REWRITE REQUIRED — YOUR PREVIOUS OUTPUT FAILED THESE CHECKS
${list}

Rewrite the deliverable NOW. Cut or split sentences until every check passes.
Follow the LONG/SHORT contract EXACTLY:
- LONG body: many short paragraphs (aim 5–9 visual blocks), total within the word cap (≈180 words; ≈130 for InMail). Each block 1–3 lines. Greeting and sign-off are separate lines.
- SHORT body: aim 4–7 short blocks within the SHORT cap (≈128 words; ≈88 for InMail).
- Prefer sentences under 22 words. Keep ===VERSION markers and subject lines.
Output ONLY the rewritten deliverable in the same structure as before.`;
}
