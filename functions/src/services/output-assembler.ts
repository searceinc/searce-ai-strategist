/**
 * Reassembles structured Gemini output into the marker-format string the
 * existing UI parser (`lib/parse-generated-content.ts`) understands.
 *
 * We keep the marker format intact so the frontend doesn't need to care
 * whether the model produced free-form text or structured JSON. All length
 * enforcement happens here before we hand the string back.
 */

import type { SequenceResponse, SingleEmailResponse, SubjectOption } from "./output-schemas.js";
import type { ContentFormat } from "../types.js";

interface SingleEmailCaps {
	longWordMax: number;
	shortWordMax: number;
}

function singleEmailCaps(format: ContentFormat): SingleEmailCaps {
	// SHORT ≈ prior LONG depth; LONG is an expanded pass (caps enforced in assembler + compliance).
	if (format === "linkedin_inmail") {
		return { longWordMax: 130, shortWordMax: 88 };
	}
	return { longWordMax: 180, shortWordMax: 128 };
}

const SEQUENCE_LONG_WORD_MAX = 170;
const SEQUENCE_FINAL_WORD_MAX = 102;
/** Prose blocks: keep each visual paragraph to 1–2 sentences (rarely 3 if very short). */
const PROSE_MAX_SENTENCES_PER_BLOCK = 2;
/** Bullet blocks: cap lines per JSON block (bullets are one "paragraph" entry). */
const BULLET_MAX_LINES_PER_BLOCK = 4;
const MAX_PARAGRAPHS = 9;

// ─── Public API ────────────────────────────────────────────────────────────

export function assembleSingleEmail(resp: SingleEmailResponse, format: ContentFormat): string {
	const sanitizedSubjects = sanitizeSubjects(resp.subjects);
	const caps = singleEmailCaps(format);

	const longParagraphs = enforceParagraphLengths(
		(resp.longParagraphs ?? []).slice(0, MAX_PARAGRAPHS).map(sanitizeParagraph).filter(Boolean),
		caps.longWordMax,
	);

	const shortParagraphs = enforceTotalWordCap(
		(resp.shortParagraphs ?? [])
			.slice(0, MAX_PARAGRAPHS)
			.map(sanitizeParagraph)
			.filter(Boolean),
		caps.shortWordMax,
	);

	const out: string[] = [];
	out.push(renderSubjects(sanitizedSubjects));
	out.push("---");
	out.push("===VERSION:LONG===");
	out.push("Hi [FirstName],");
	out.push("");
	out.push(longParagraphs.join("\n\n"));
	out.push("");
	out.push("[Your Name] | Searce");
	out.push("===VERSION:SHORT===");
	out.push("Hi [FirstName],");
	out.push("");
	out.push(shortParagraphs.join("\n\n"));
	out.push("");
	out.push("[Your Name] | Searce");
	out.push("---");
	out.push("STRATEGIST NOTE:");
	out.push(sanitizeParagraph(resp.strategistNote));

	return out.join("\n");
}

export function assembleSequence(resp: SequenceResponse): string {
	const out: string[] = [];

	const cadence = (resp.cadenceLine ?? "").replace(/^[\s\-–—:]+/g, "").trim();
	if (cadence) out.push(cadence);

	const emails = (resp.emails ?? []).slice(0, 6);
	for (let i = 0; i < emails.length; i++) {
		const e = emails[i]!;
		const isFinal = i === emails.length - 1 && emails.length >= 5;
		const cap = isFinal ? SEQUENCE_FINAL_WORD_MAX : SEQUENCE_LONG_WORD_MAX;

		const paragraphs = enforceParagraphLengths(
			(e.paragraphs ?? []).slice(0, MAX_PARAGRAPHS).map(sanitizeParagraph).filter(Boolean),
			cap,
		);

		const subjects = sanitizeSubjects(e.subjects);

		if (out.length > 0 && i === 0) out.push("");
		if (i > 0) {
			out.push("");
			out.push("---");
			out.push("");
		}
		out.push(`EMAIL ${i + 1} — ${(e.title ?? "").trim() || "Untitled"}`);
		out.push("");
		out.push(renderSubjects(subjects));
		out.push("");
		out.push("Hi [FirstName],");
		out.push("");
		out.push(paragraphs.join("\n\n"));
		out.push("");
		out.push("[Your Name] | Searce");
	}

	out.push("");
	out.push("STRATEGIST NOTE:");
	out.push(sanitizeParagraph(resp.strategistNote));

	return out.join("\n");
}

// ─── Subject rendering ─────────────────────────────────────────────────────

function sanitizeSubjects(subjects: SubjectOption[] | undefined): SubjectOption[] {
	if (!Array.isArray(subjects)) return [];
	const seen = new Set<string>();
	const out: SubjectOption[] = [];
	for (const s of subjects) {
		if (!s || typeof s !== "object") continue;
		const letter = (s.letter ?? "").toString().trim().toUpperCase();
		if (!["A", "B", "C", "D"].includes(letter)) continue;
		if (seen.has(letter)) continue;
		seen.add(letter);
		out.push({
			letter: letter as "A" | "B" | "C" | "D",
			subject: stripDecorators(s.subject ?? "").slice(0, 80),
			preview: stripDecorators(s.preview ?? "").slice(0, 110),
		});
	}
	return out.sort((a, b) => a.letter.localeCompare(b.letter));
}

function renderSubjects(subjects: SubjectOption[]): string {
	if (subjects.length === 0) {
		return "SUBJECT OPTION A: \nPREVIEW A: ";
	}
	const lines: string[] = [];
	for (let i = 0; i < subjects.length; i++) {
		const s = subjects[i]!;
		if (i > 0) lines.push("");
		lines.push(`SUBJECT OPTION ${s.letter}: ${s.subject}`);
		lines.push(`PREVIEW ${s.letter}: ${s.preview}`);
	}
	return lines.join("\n");
}

// ─── Paragraph + length enforcement ────────────────────────────────────────

function sanitizeParagraph(input: string): string {
	if (typeof input !== "string") return "";
	let p = input.replace(/\r\n/g, "\n").trim();

	// Drop a leading "Hi …" greeting if the model snuck it into a paragraph.
	p = p.replace(/^(Hi|Hello|Hey)\s+\[?[^,\n]{0,40}\]?\s*,\s*/i, "").trim();
	// Drop a trailing sign-off the model may have put inside a paragraph.
	p = p.replace(/\n+\[?[^\]\n]{1,40}\]?\s*\|\s*Searce\s*$/i, "").trim();

	// Strip stray <…> or <…] artifacts the model leaks for "placeholders".
	// Keep proper Markdown links untouched.
	p = p.replace(/<([^<>\n\]]{2,300})[\]>]/g, (_full, inner: string) => {
		if (/^https?:\/\//i.test(inner) || /^mailto:/i.test(inner)) return _full;
		return inner;
	});

	// HARD RULE: only Searce-domain Markdown links survive. Any other
	// [text](url) is unwrapped to plain text. Tavily metric quotes,
	// LinkedIn posts, news sites, blog posts — all become prose.
	p = stripNonSearceLinks(p);
	p = stripBogusSquareBracketPlaceholders(p);

	// Strip residual "WHY YOU:" / "AS A LEADER:" / structural-style label
	// prefixes the model sometimes inserts at the start of a line.
	p = p
		.split("\n")
		.map((line) =>
			line.replace(
				/^\s*(?:WHY\s+YOU|AS\s+A\s+LEADER|OUR\s+APPROACH|THE\s+QUESTION|THE\s+SEARCE\s+TRANSFORMATION|CAPABILITIES|CONTEXT|GREETING|OPENING|BODY|PROOF\s+LINE|PROOF|CTA|CTA\s+LINE|CLOSING|SIGN[-\s]?OFF|PERSONA\s+TOUCH|VALUE|BULLETS?|EVENT(?:\s*\/\s*BOOTH)?)\s*:\s*/i,
				"",
			),
		)
		.join("\n");

	// Drop standalone partner-status sentences (e.g. "As a Google Cloud
	// Managed Services Partner, …"). The system prompt forbids them but
	// the model leaks them anyway.
	p = dropPartnerStatusSentences(p);

	if (isBulletBlock(p)) {
		// Preserve bullet line breaks; just normalize whitespace within
		// each bullet and dedupe blank lines.
		p = p
			.split(/\r?\n/)
			.map((l) => l.replace(/\s{2,}/g, " ").trim())
			.filter(Boolean)
			.join("\n");
	} else {
		// Prose: collapse all whitespace runs (incl. internal blank lines)
		// so the model can't smuggle extra paragraphs into a single entry.
		p = p
			.replace(/\n{2,}/g, " ")
			.replace(/\s{2,}/g, " ")
			.trim();
	}
	return p;
}

/**
 * Remove fake "merge field" style brackets the model invents (not CRM tokens).
 * Allowed rep tokens are enforced in prompts; this catches common leaks.
 */
function stripBogusSquareBracketPlaceholders(text: string): string {
	return text
		.replace(/\[(?:Multiple|Several|Various|Many)\s+clients?\]/gi, "organizations like theirs")
		.replace(/\[(?:Your|Our)\s+organization\]/gi, "your organization")
		.replace(/\[(?:The\s+)?client(?:\s+name)?\]/gi, "the client");
}

/**
 * Walk the text and replace any `[label](url)` Markdown link with just
 * `label` unless the URL is a Searce-owned URL (searce.com / *.searce.com).
 */
function stripNonSearceLinks(text: string): string {
	const linkRe = /\[([^\]]+)\]\(([^)]+)\)/g;
	return text.replace(linkRe, (_full, label: string, url: string) => {
		if (isSearceUrl(url)) {
			return `[${label}](${url})`;
		}
		// Strip the link but keep the visible label as plain prose. Drop
		// the surrounding quote characters Gemini sometimes wraps quotes in
		// (e.g. ['Most healthcare AI projects fail…']) so the prose reads
		// cleanly without the bracketed-quote artifact.
		return label.replace(/^['"`]+|['"`]+$/g, "").trim();
	});
}

function isSearceUrl(url: string): boolean {
	const trimmed = (url ?? "").trim();
	if (!trimmed) return false;
	try {
		const parsed = new URL(trimmed);
		const host = parsed.hostname.toLowerCase();
		return host === "searce.com" || host.endsWith(".searce.com");
	} catch {
		return false;
	}
}

const PARTNER_STATUS_RE =
	/^\s*(?:as\s+a\s+)?(?:google\s+cloud\s+)?(?:managed\s+services?\s+)?partner[^.!?]*[.!?]\s*$/i;
const PARTNER_STATUS_LEAD_RE = /^\s*as\s+a\s+(?:google\s+cloud|aws|microsoft|azure)\s+[^,]+,\s*/i;

/**
 * Remove sentences that exist solely to flex partner status. We detect two
 * patterns:
 *   • "As a Google Cloud Managed Services Partner, we …"
 *   • "Searce is a Google Cloud Managed Services Partner."
 * In either case we drop the whole sentence.
 */
function dropPartnerStatusSentences(text: string): string {
	const sentences = splitSentences(text);
	const kept = sentences.filter((s) => {
		const lower = s.toLowerCase();
		if (PARTNER_STATUS_RE.test(s)) return false;
		if (PARTNER_STATUS_LEAD_RE.test(s)) return false;
		if (
			lower.includes("managed services partner") ||
			lower.includes("google cloud premier partner") ||
			lower.includes("aws advanced consulting partner")
		) {
			return false;
		}
		return true;
	});
	return kept.join(" ");
}

function stripDecorators(s: string): string {
	return (s ?? "")
		.replace(/^[<\[（]+|[>\]）]+$/g, "")
		.replace(/\s+/g, " ")
		.trim();
}

/**
 * Enforce a per-paragraph sentence cap, then enforce a total word cap on
 * the body by trimming trailing sentences from the longest paragraph.
 *
 * A "paragraph" here is one JSON array entry: either short prose (sentence-capped)
 * or a bullet block (line-capped).
 */
function enforceParagraphLengths(paragraphs: string[], totalWordCap: number): string[] {
	const out = paragraphs.slice(0, MAX_PARAGRAPHS).map((p) => {
		if (isBulletBlock(p)) {
			const bullets = p
				.split(/\r?\n/)
				.map((l) => l.trim())
				.filter(Boolean)
				.slice(0, BULLET_MAX_LINES_PER_BLOCK);
			return bullets.join("\n");
		}
		const sentences = splitSentences(p);
		const cap = proseSentenceCapForBlock(sentences);
		return sentences.slice(0, cap).join(" ");
	});

	let total = totalWords(out);
	let safety = 32;
	while (total > totalWordCap && safety > 0 && out.length > 0) {
		safety--;
		const longestIdx = longestParagraphIndex(out);
		const target = out[longestIdx] ?? "";
		if (isBulletBlock(target)) {
			const bullets = target.split(/\r?\n/).filter(Boolean);
			if (bullets.length <= 1) {
				out.splice(longestIdx, 1);
			} else {
				bullets.pop();
				out[longestIdx] = bullets.join("\n");
			}
		} else {
			const sentences = splitSentences(target);
			if (sentences.length <= 1) {
				out.splice(longestIdx, 1);
			} else {
				sentences.pop();
				out[longestIdx] = sentences.join(" ");
			}
		}
		total = totalWords(out);
	}

	return out.map((p) => p.trim()).filter(Boolean);
}

function longestParagraphIndex(paragraphs: string[]): number {
	let bestIdx = 0;
	let bestWords = -1;
	for (let i = 0; i < paragraphs.length; i++) {
		const w = totalWords([paragraphs[i] ?? ""]);
		if (w > bestWords) {
			bestWords = w;
			bestIdx = i;
		}
	}
	return bestIdx;
}

/**
 * Allow a 3rd sentence only when all sentences are very short (mobile-friendly micro-lines).
 */
function proseSentenceCapForBlock(sentences: string[]): number {
	if (sentences.length <= PROSE_MAX_SENTENCES_PER_BLOCK) return sentences.length;
	const allShort = sentences.slice(0, 3).every((s) => countWords(s) <= 14);
	return allShort ? Math.min(3, sentences.length) : PROSE_MAX_SENTENCES_PER_BLOCK;
}

function isBulletBlock(text: string): boolean {
	if (!text) return false;
	const lines = text.split(/\r?\n/).filter((l) => l.trim());
	if (lines.length < 2) return false;
	const bulletLines = lines.filter((l) => /^\s*[•▪●\-*]\s+/.test(l));
	return bulletLines.length >= Math.max(2, Math.floor(lines.length * 0.5));
}

function enforceTotalWordCap(paragraphs: string[], wordCap: number): string[] {
	const out = paragraphs.map((p) => p.trim()).filter(Boolean);
	let total = totalWords(out);
	let safety = 16;
	while (total > wordCap && safety > 0) {
		safety--;
		const longestIdx = out
			.map((_p, i) => i)
			.sort((a, b) => totalWords([out[b] ?? ""]) - totalWords([out[a] ?? ""]))[0];
		if (longestIdx === undefined) break;
		const sentences = splitSentences(out[longestIdx] ?? "");
		if (sentences.length <= 1) {
			out.splice(longestIdx, 1);
		} else {
			sentences.pop();
			out[longestIdx] = sentences.join(" ");
		}
		total = totalWords(out);
	}
	return out;
}

function splitSentences(text: string): string[] {
	if (!text) return [];
	return text
		.split(/(?<=[.!?])\s+(?=[A-Z[(•])/)
		.map((s) => s.trim())
		.filter(Boolean);
}

function totalWords(paragraphs: string[]): number {
	return paragraphs.reduce((acc, p) => acc + countWords(p), 0);
}

function countWords(text: string): number {
	const stripped = (text ?? "")
		.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
		.replace(/[*_`]/g, "")
		.trim();
	if (!stripped) return 0;
	return stripped.split(/\s+/).filter(Boolean).length;
}
