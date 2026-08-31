/**
 * Detects when the rep has explicitly asked for a length in the
 * "Instructions to Strategist" box, so the mechanical word caps get out of
 * the way.
 *
 * Background: `output-assembler.enforceParagraphLengths` silently pops trailing
 * sentences until a draft fits `singleEmailCaps`, and `compliance` re-checks the
 * same caps on the text-mode path. That happened even when the rep had written
 * "make this 400 words" — the instruction reached the model, the model complied,
 * and then the assembler truncated it back down. Reps read that as the tool
 * ignoring them.
 *
 * Deliberately conservative: only an explicit length instruction counts. Vague
 * praise for detail ("be thorough", "add more value") must NOT unlock the caps,
 * because the caps are what keep cold emails short by default.
 */

export interface LengthOverride {
	/** True when the caps should be skipped for this generation. */
	override: boolean;
	/**
	 * An explicit word target when the rep named one ("around 350 words").
	 * Undefined means "no cap at all" — the rep asked for length without a number.
	 */
	wordCap?: number;
}

const NO_OVERRIDE: LengthOverride = { override: false };

/** "350 words", "~400 word", "up to 250 words". */
const WORD_COUNT = /(\d{2,4})\s*(?:\+\s*)?word/i;

/**
 * Phrases that mean "stop truncating me". Kept explicit rather than fuzzy so a
 * passing mention of "long-term roadmap" doesn't disable the caps.
 */
const UNCAPPED_PHRASES = [
	"no length limit",
	"no word limit",
	"no character limit",
	"no limit on length",
	"ignore the length",
	"ignore length",
	"don't truncate",
	"do not truncate",
	"dont truncate",
	"no truncation",
	"remove the cap",
	"remove the limit",
	"as long as needed",
	"longer email",
	"longer emails",
	"make it longer",
	"make them longer",
	"full length",
];

/**
 * Read an explicit length instruction out of the rep's free-text notes.
 *
 * Returns `{ override: false }` for empty input or anything that isn't an
 * unmistakable length directive.
 */
export function detectLengthOverride(instructions: string | undefined | null): LengthOverride {
	const text = (instructions ?? "").trim().toLowerCase();
	if (!text) return NO_OVERRIDE;

	const counted = text.match(WORD_COUNT);
	if (counted) {
		const wordCap = Number.parseInt(counted[1]!, 10);
		if (Number.isFinite(wordCap) && wordCap > 0) {
			return { override: true, wordCap };
		}
	}

	if (UNCAPPED_PHRASES.some((phrase) => text.includes(phrase))) {
		return { override: true };
	}

	return NO_OVERRIDE;
}

/**
 * Apply an override to a default cap.
 *
 * `Infinity` disables `enforceParagraphLengths` / the compliance length reason
 * without any special-casing at the call sites, since every comparison against
 * it is false.
 */
export function effectiveWordCap(defaultCap: number, override: LengthOverride): number {
	if (!override.override) return defaultCap;
	return override.wordCap ?? Number.POSITIVE_INFINITY;
}
