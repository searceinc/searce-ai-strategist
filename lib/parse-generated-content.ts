/**
 * Parses the model's generated content into structured pieces the UI can
 * render as A/B subject chips, Long/Short tabs, sequence emails, and a
 * separate Strategist Note panel.
 *
 * The model is instructed (in functions/src/prompts/format-structures.ts) to
 * emit:
 *   - SUBJECT OPTION A/B/C/D + PREVIEW A/B/C/D blocks
 *   - ===VERSION:LONG=== / ===VERSION:SHORT=== for single-email formats
 *   - "EMAIL N — …" headers separated by "---" for sequences
 *   - A trailing "STRATEGIST NOTE:" block
 *
 * The parser is intentionally tolerant: any of these may be missing, and we
 * fall back to "show the raw text in a single tab".
 */

export interface SubjectOption {
	letter: "A" | "B" | "C" | "D";
	subject: string;
	preview?: string;
}

export interface ParsedSection {
	/** "long" / "short" / "single" / "email-1" / "email-2" / … */
	id: string;
	label: string;
	body: string;
}

export interface ParsedContent {
	/** Always present — the rep's clipboard target if everything else fails. */
	raw: string;
	/** Subject + preview line variants (any number 0–4). */
	subjects: SubjectOption[];
	/**
	 * Body sections. For email formats: usually [{long}, {short}].
	 * For sequences: [{email-1}, {email-2}, …].
	 * For other formats: [{single, …}] with the entire body.
	 */
	sections: ParsedSection[];
	/** Trailing Strategist Note block (extracted, never duplicated in body). */
	strategistNote: string | null;
	/** True when we found at least one structured marker in the raw text. */
	isStructured: boolean;
}

const STRATEGIST_NOTE_RE = /(^|\n)\s*STRATEGIST\s*NOTE\s*:?\s*\n?/i;
const VERSION_LONG_RE = /^\s*={3}\s*VERSION\s*:\s*LONG\s*={3}\s*$/im;
const VERSION_SHORT_RE = /^\s*={3}\s*VERSION\s*:\s*SHORT\s*={3}\s*$/im;
const EMAIL_HEADER_RE = /^\s*EMAIL\s+(\d+)\b/im;

/**
 * Structural labels the prompt skeleton uses internally but the rep should
 * never see in the final email body. We strip the label prefix and keep the
 * value after the colon (e.g. `GREETING: Hi [FirstName],` → `Hi [FirstName],`).
 */
const STRUCTURAL_LABELS = [
	"GREETING",
	"OPENING",
	"BODY",
	"CONTEXT",
	"CAPABILITIES",
	"PROOF LINE",
	"PROOF",
	"CTA",
	"CTA LINE",
	"CLOSING",
	"SIGN-OFF",
	"SIGNOFF",
	"SIGN OFF",
	"PERSONA TOUCH",
	"VALUE",
	"BULLETS",
	"EVENT",
	"EVENT / BOOTH",
	"WHY YOU",
	"AS A LEADER",
	"OUR APPROACH",
	"THE QUESTION",
	"THE SEARCE TRANSFORMATION",
	"SEARCE TRANSFORMATION",
	"THE PAIN",
	"THE PROOF",
	"THE ASK",
	"THE OFFER",
	"NEXT STEP",
	"NEXT STEPS",
];
const STRUCTURAL_LABEL_RE = new RegExp(
	`^\\s*(?:${STRUCTURAL_LABELS.map((l) => l.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join(
		"|",
	)})\\s*:\\s*`,
	"i",
);

export function parseGeneratedContent(raw: string): ParsedContent {
	const trimmed = (raw ?? "").trim();
	if (!trimmed) {
		return {
			raw,
			subjects: [],
			sections: [],
			strategistNote: null,
			isStructured: false,
		};
	}

	// Defensive: if the model leaked raw JSON (the schema fallback failed
	// once and dumped the schema response into text), try to extract the
	// human-readable fields instead of rendering raw braces to the user.
	const recovered = recoverFromRawJson(trimmed);
	const working = recovered ?? trimmed;

	const { body, strategistNote } = splitStrategistNote(working);

	const subjects = extractSubjectOptions(body);
	const subjectStrippedBody = stripSubjectBlock(body);

	let sections: ParsedSection[] = [];
	let isStructured = subjects.length > 0;

	if (VERSION_LONG_RE.test(subjectStrippedBody) || VERSION_SHORT_RE.test(subjectStrippedBody)) {
		sections = parseLongShortVariants(subjectStrippedBody);
		isStructured = true;
	} else if (EMAIL_HEADER_RE.test(subjectStrippedBody)) {
		sections = parseSequenceEmails(subjectStrippedBody);
		isStructured = isStructured || sections.length > 1;
	}

	if (sections.length === 0) {
		sections = [
			{
				id: "single",
				label: "Content",
				body: subjectStrippedBody.trim(),
			},
		];
	}

	// Final defensive cleanup: strip structural labels and angle-bracket
	// placeholder leaks from every section body.
	sections = sections.map((s) => ({ ...s, body: cleanBody(s.body) }));

	return { raw, subjects, sections, strategistNote, isStructured };
}

// ─── Strategist Note ────────────────────────────────────────────────────────

function splitStrategistNote(text: string): { body: string; strategistNote: string | null } {
	const m = text.match(STRATEGIST_NOTE_RE);
	if (!m || typeof m.index !== "number") {
		return { body: text, strategistNote: null };
	}
	const headerStart = m.index + (m[1] ? m[1].length : 0);
	const headerEnd = m.index + m[0].length;
	const body = text.slice(0, headerStart).replace(/\s+$/, "");
	const note = text.slice(headerEnd).trim();
	// Drop a leading separator like "---" if the model added one before the note.
	const cleanedBody = body.replace(/\n+\s*-{3,}\s*$/m, "").trimEnd();
	return { body: cleanedBody, strategistNote: note.length > 0 ? note : null };
}

// ─── Subject options ────────────────────────────────────────────────────────

const SUBJECT_LINE_RE = /^\s*SUBJECT\s+OPTION\s+([A-D])\s*[:\-—–]\s*(.+?)\s*$/im;
const PREVIEW_LINE_RE = /^\s*PREVIEW\s+([A-D])\s*[:\-—–]\s*(.+?)\s*$/im;

function extractSubjectOptions(text: string): SubjectOption[] {
	const lines = text.split(/\r?\n/);
	const subjects = new Map<"A" | "B" | "C" | "D", SubjectOption>();

	for (const line of lines) {
		const sm = line.match(SUBJECT_LINE_RE);
		if (sm) {
			const letter = sm[1]!.toUpperCase() as "A" | "B" | "C" | "D";
			const subject = cleanField(sm[2] ?? "");
			if (subject && !isPlaceholder(subject)) {
				subjects.set(letter, { letter, subject });
			}
			continue;
		}
		const pm = line.match(PREVIEW_LINE_RE);
		if (pm) {
			const letter = pm[1]!.toUpperCase() as "A" | "B" | "C" | "D";
			const preview = cleanField(pm[2] ?? "");
			if (preview && !isPlaceholder(preview)) {
				const existing = subjects.get(letter);
				if (existing) {
					subjects.set(letter, { ...existing, preview });
				} else {
					subjects.set(letter, { letter, subject: "", preview });
				}
			}
		}
	}

	return ["A", "B", "C", "D"]
		.map((l) => subjects.get(l as "A" | "B" | "C" | "D"))
		.filter((opt): opt is SubjectOption => !!opt && (opt.subject.length > 0 || !!opt.preview));
}

function stripSubjectBlock(text: string): string {
	return text
		.split(/\r?\n/)
		.filter((line) => !SUBJECT_LINE_RE.test(line) && !PREVIEW_LINE_RE.test(line))
		.join("\n");
}

// ─── Long / Short ───────────────────────────────────────────────────────────

function parseLongShortVariants(text: string): ParsedSection[] {
	const longMatch = text.match(VERSION_LONG_RE);
	const shortMatch = text.match(VERSION_SHORT_RE);

	const longIdx = longMatch && typeof longMatch.index === "number" ? longMatch.index : -1;
	const shortIdx = shortMatch && typeof shortMatch.index === "number" ? shortMatch.index : -1;

	const sections: ParsedSection[] = [];

	if (longIdx !== -1 && shortIdx !== -1) {
		const [first, second] =
			longIdx < shortIdx
				? ["long" as const, "short" as const]
				: ["short" as const, "long" as const];
		const firstStart =
			(longIdx < shortIdx
				? longIdx + longMatch![0].length
				: shortIdx + shortMatch![0].length) || 0;
		const secondStart = longIdx < shortIdx ? shortIdx : longIdx;
		const secondEnd = text.length;
		const firstBody = text.slice(firstStart, secondStart).trim();
		const secondBody = text
			.slice(
				longIdx < shortIdx
					? shortIdx + shortMatch![0].length
					: longIdx + longMatch![0].length,
				secondEnd,
			)
			.trim();
		sections.push({
			id: first,
			label: first === "long" ? "Long" : "Short",
			body: firstBody,
		});
		sections.push({
			id: second,
			label: second === "long" ? "Long" : "Short",
			body: secondBody,
		});
	} else if (longIdx !== -1) {
		const start = longIdx + longMatch![0].length;
		sections.push({ id: "long", label: "Long", body: text.slice(start).trim() });
	} else if (shortIdx !== -1) {
		const start = shortIdx + shortMatch![0].length;
		sections.push({ id: "short", label: "Short", body: text.slice(start).trim() });
	}

	// Always order [Long, Short] when both are present so the rep sees Long first.
	const long = sections.find((s) => s.id === "long");
	const short = sections.find((s) => s.id === "short");
	const out: ParsedSection[] = [];
	if (long) out.push(long);
	if (short) out.push(short);
	return out;
}

// ─── Sequence emails ────────────────────────────────────────────────────────

function parseSequenceEmails(text: string): ParsedSection[] {
	// Find every "EMAIL N" header (with or without dash/title on the same line).
	const headerRe = /^\s*EMAIL\s+(\d+)\b.*$/gim;
	const headers: { index: number; lineEnd: number; n: number; titleLine: string }[] = [];
	let match: RegExpExecArray | null;
	while ((match = headerRe.exec(text)) !== null) {
		headers.push({
			index: match.index,
			lineEnd: match.index + match[0].length,
			n: Number(match[1]),
			titleLine: match[0].trim(),
		});
	}
	if (headers.length === 0) return [];

	const sections: ParsedSection[] = [];
	for (let i = 0; i < headers.length; i++) {
		const h = headers[i]!;
		const next = headers[i + 1];
		const rawBody = text.slice(h.lineEnd, next ? next.index : text.length);
		// Strip leading separator lines (---, ===) and surrounding whitespace.
		const body = rawBody
			.replace(/^\s*[-=]{3,}\s*/g, "")
			.replace(/\n\s*[-=]{3,}\s*$/g, "")
			.trim();
		sections.push({
			id: `email-${h.n}`,
			label: `Email ${h.n}`,
			body,
		});
	}
	return sections;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function cleanField(value: string): string {
	let v = value.trim();
	v = v.replace(/^[<\[（]+|[>\]）]+$/g, "").trim();
	return v;
}

function isPlaceholder(value: string): boolean {
	return /^(\.{2,}|…|optional|tbd|n\/a)$/i.test(value.trim()) || value.trim() === "";
}

/**
 * Clean a section body before display:
 *  - Strip structural label prefixes (GREETING:, OPENING:, BODY:, …) so the
 *    rep never sees scaffolding the model leaked from the template.
 *  - Unwrap stray `<phrase>` placeholders that aren't URLs (these are model
 *    leaks from the angle-bracket placeholder syntax in our skeleton).
 *  - Collapse 3+ blank lines to 2 so spacing stays clean after stripping.
 */
function cleanBody(body: string): string {
	if (!body) return body;
	const lines = body.split(/\r?\n/).map((line) => {
		const m = line.match(STRUCTURAL_LABEL_RE);
		if (!m) return line;
		// Drop the label prefix; keep whatever followed the colon.
		return line.slice(m[0].length);
	});
	let out = lines.join("\n");

	// Unwrap `<phrase>` and the model's mismatched `<phrase]` leaks (the
	// model sometimes corrupts a Markdown link into `<...]`). We treat it
	// as a leak only when the inner text is plain prose with no protocol.
	out = out.replace(/<([^<>\n\]]{2,300})[\]>]/g, (full, inner: string) => {
		if (/^https?:\/\//i.test(inner) || /^mailto:/i.test(inner)) return full;
		if (/^[A-Za-z][A-Za-z0-9-]*\s*\/?$/.test(inner)) return full; // HTML tag-looking
		if (/[<>]/.test(inner)) return full;
		return inner;
	});

	out = out.replace(/\n{3,}/g, "\n\n").trim();
	return out;
}

/**
 * If the model returned raw JSON (e.g. structured output failed and the
 * fallback prompt was still asking for JSON), try to extract the readable
 * pieces and re-emit them as the marker-format string the UI parser
 * understands. Returns null if the input is not recognizable JSON.
 */
function recoverFromRawJson(text: string): string | null {
	const stripped = text
		.replace(/^```(?:json)?\s*\n/, "")
		.replace(/\n```\s*$/, "")
		.trim();
	if (!(stripped.startsWith("{") || stripped.startsWith("["))) return null;

	let parsed: unknown;
	try {
		parsed = JSON.parse(stripped);
	} catch {
		return null;
	}
	if (!parsed || typeof parsed !== "object") return null;
	const obj = parsed as Record<string, unknown>;

	const out: string[] = [];

	const subjects = extractRecoveredSubjects(obj);
	if (subjects.length > 0) {
		for (const s of subjects) {
			out.push(`SUBJECT OPTION ${s.letter}: ${s.subject ?? ""}`);
			out.push(`PREVIEW ${s.letter}: ${s.preview ?? ""}`);
			out.push("");
		}
	}

	const longBody = recoveredBody(obj.longParagraphs ?? obj.long ?? obj.body);
	const shortBody = recoveredBody(obj.shortParagraphs ?? obj.short);

	if (longBody) {
		out.push("---");
		out.push("===VERSION:LONG===");
		out.push("Hi [FirstName],");
		out.push("");
		out.push(longBody);
		out.push("");
		out.push("[Your Name] | Searce");
	}
	if (shortBody) {
		out.push("===VERSION:SHORT===");
		out.push("Hi [FirstName],");
		out.push("");
		out.push(shortBody);
		out.push("");
		out.push("[Your Name] | Searce");
	}

	const note =
		typeof obj.strategistNote === "string"
			? obj.strategistNote
			: typeof obj.strategist_note === "string"
				? (obj.strategist_note as string)
				: null;
	if (note) {
		out.push("---");
		out.push("STRATEGIST NOTE:");
		out.push(note);
	}

	const reconstructed = out.join("\n").trim();
	return reconstructed.length > 0 ? reconstructed : null;
}

function extractRecoveredSubjects(
	obj: Record<string, unknown>,
): Array<{ letter: string; subject?: string; preview?: string }> {
	const list: Array<{ letter: string; subject?: string; preview?: string }> = [];

	const subjectsField = obj.subjects;
	const previewsField = obj.previewLines ?? obj.previews;

	if (Array.isArray(subjectsField)) {
		const allObjects = subjectsField.every(
			(s) => s && typeof s === "object" && !Array.isArray(s),
		);
		if (allObjects) {
			for (const s of subjectsField as Array<Record<string, unknown>>) {
				const letter = String(s.letter ?? "")
					.trim()
					.toUpperCase();
				if (!["A", "B", "C", "D"].includes(letter)) continue;
				list.push({
					letter,
					subject:
						typeof s.subject === "string"
							? s.subject
							: typeof s.text === "string"
								? (s.text as string)
								: undefined,
					preview: typeof s.preview === "string" ? (s.preview as string) : undefined,
				});
			}
		} else {
			const letters = ["A", "B", "C", "D"];
			subjectsField.slice(0, 4).forEach((subj, i) => {
				const previewArray = Array.isArray(previewsField)
					? (previewsField as unknown[])
					: [];
				list.push({
					letter: letters[i] ?? "A",
					subject: typeof subj === "string" ? subj : undefined,
					preview:
						typeof previewArray[i] === "string"
							? (previewArray[i] as string)
							: undefined,
				});
			});
		}
	}

	return list;
}

function recoveredBody(value: unknown): string {
	if (Array.isArray(value)) {
		return value
			.map((v) => (typeof v === "string" ? v : ""))
			.filter(Boolean)
			.join("\n\n");
	}
	if (typeof value === "string") return value;
	return "";
}
