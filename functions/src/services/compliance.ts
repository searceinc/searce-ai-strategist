/**
 * Server-side compliance check for Gemini output.
 *
 * The prompt asks for strict sentence/word counts but at temperature ≥ 0.4,
 * Gemini will sometimes ignore them. We verify the structure here and, when
 * it busts, the orchestrator retries ONCE with a corrective instruction at
 * an even lower temperature. This is the only reliable way to enforce hard
 * length limits on a free-form LLM.
 */

import type { ContentFormat } from "../types.js";

export interface ComplianceResult {
	ok: boolean;
	reasons: string[];
}

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
		return { longWordMax: 75, shortWordMax: 35 };
	}
	return { longWordMax: 90, shortWordMax: 50 };
}

const SEQUENCE_LONG_WORD_MAX = 90;
const SEQUENCE_FINAL_WORD_MAX = 70;

export function checkCompliance(content: string, format: ContentFormat): ComplianceResult {
	const reasons: string[] = [];
	const text = (content ?? "").replace(/\r\n/g, "\n");

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
	} else if (format === "email_sequence") {
		const emails = sliceSequenceEmails(text);
		if (emails.length === 0) {
			reasons.push(
				`No "EMAIL N" sections found. Each email must start with an "EMAIL N — title" header.`,
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
		if (bodyParas.length > 3) {
			out.push(
				`${label} body has ${bodyParas.length} paragraphs; must be exactly 3 (1–2 / 2–3 / 1–2 sentences).`,
			);
		} else if (bodyParas.length === 3) {
			const [p1, p2, p3] = bodyParas as [string, string, string];
			const s1 = countSentences(p1);
			const s2 = countSentences(p2);
			const s3 = countSentences(p3);
			if (s1 > 2) out.push(`${label} paragraph 1 has ${s1} sentences; cap is 2.`);
			if (s2 > 3) out.push(`${label} paragraph 2 has ${s2} sentences; cap is 3.`);
			if (s3 > 2) out.push(`${label} paragraph 3 has ${s3} sentences; cap is 2.`);
		}
	} else if (bodyParas.length > 3) {
		out.push(`${label} body has ${bodyParas.length} paragraphs; SHORT must be 1–3 paragraphs.`);
	}

	for (const p of bodyParas) {
		for (const sentence of splitSentences(p)) {
			const w = countWords(sentence);
			if (w > 22) {
				out.push(
					`${label} contains a ${w}-word sentence (cap 18). Split: "${truncate(sentence, 70)}"`,
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

function countSentences(paragraph: string): number {
	return splitSentences(paragraph).length;
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

Rewrite the deliverable NOW. Cut sentences until every check passes.
Follow the LONG/SHORT contract EXACTLY:
- LONG body: 3 paragraphs, sentence counts 1–2 / 2–3 / 1–2, total ≤ 80 words (≤ 65 for InMail).
- SHORT body: total ≤ 45 words (≤ 30 for InMail).
- Every sentence ≤ 18 words. Greeting and sign-off are SEPARATE single-line blocks, not part of the body word count.
- Keep the SAME subject options + STRATEGIST NOTE + ===VERSION markers.
Output ONLY the rewritten deliverable in the same structure as before.`;
}
