/**
 * Legacy → canonical code migration (read-time only).
 *
 * Old Firestore sessions have:
 *   - industry codes from before the sheet alignment (MIC, NEU)
 *   - persona-function dropdown values (engineering, marketing, …) instead of
 *     industry-category values (banking, life-sciences, …)
 *   - a single `notes` field instead of `instructions` + `myNotes`
 *
 * We never rewrite the document — we just normalize on read so the new UI
 * shows correct labels and the prompt builder gets the new field names.
 *
 * Mirror this file in functions/src/data/legacy-codes.ts when adding entries
 * (the Cloud Function project can't import from lib/).
 */

import type { GenerationInput } from "@/lib/types";

const INDUSTRY_CODE_REMAP: Record<string, string> = {
	MIC: "MCM",
	NEU: "EUP",
};

export function migrateIndustryCode(code: string | undefined | null): string {
	if (!code) return "";
	return INDUSTRY_CODE_REMAP[code] ?? code;
}

/**
 * Legacy persona-function values that are now meaningless under the
 * industry-category model. We can't translate them to a real category, so we
 * blank them out and let the rep re-select; the UI will then re-driven by the
 * sheet's INDUSTRY_CATEGORIES map.
 */
const LEGACY_FUNCTION_VALUES = new Set([
	"cxo",
	"consulting",
	"data",
	"engineering",
	"entrepreneurship",
	"sales",
	"marketing",
	"it",
	"finance",
	"legal",
	"media-comms",
	"military-protective",
	"operations",
	"product-management",
	"program-project-mgmt",
	"purchasing",
	"quality-assurance",
	"research",
	"hr",
	"customer-success",
]);

export function isLegacyFunctionValue(value: string | undefined | null): boolean {
	return !!value && LEGACY_FUNCTION_VALUES.has(value);
}

/**
 * Read a session-shaped object that may carry old field names and produce a
 * payload safe for the new GenerationInput shape. Does not mutate the input.
 */
export function migrateLegacyInput(
	raw: Partial<GenerationInput> & {
		targetPersonaFunction?: string;
		targetPersonaSubFunction?: string;
		notes?: string;
	},
): Partial<GenerationInput> {
	const industry = migrateIndustryCode(raw.targetPersonaIndustry);
	const legacyCategory = (raw as { targetPersonaCategory?: string }).targetPersonaCategory;
	const legacyFn = raw.targetPersonaFunction;
	const targetPersonaCategory =
		legacyCategory && legacyCategory.length > 0
			? legacyCategory
			: isLegacyFunctionValue(legacyFn)
				? ""
				: (legacyFn ?? "");

	const legacySubCategory = (raw as { targetPersonaSubCategory?: string })
		.targetPersonaSubCategory;
	const legacySubFn = raw.targetPersonaSubFunction;
	const targetPersonaSubCategory =
		legacySubCategory && legacySubCategory.length > 0
			? legacySubCategory
			: isLegacyFunctionValue(legacyFn)
				? ""
				: (legacySubFn ?? "");

	const instructions = (raw as { instructions?: string }).instructions ?? raw.notes ?? "";
	const myNotes = (raw as { myNotes?: string }).myNotes ?? "";

	return {
		...raw,
		targetPersonaIndustry: industry,
		targetPersonaCategory,
		targetPersonaSubCategory,
		instructions,
		myNotes,
	} as Partial<GenerationInput>;
}
