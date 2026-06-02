/**
 * Server-side mirror of lib/legacy-codes.ts (Functions can't import from lib).
 * Keep both files in sync when adding entries.
 *
 * Used in services/content.ts and session-read.ts to normalize old session
 * payloads on read so prompts always see the new field names.
 */

import type { GenerationInput } from "../types.js";

const INDUSTRY_CODE_REMAP: Record<string, string> = {
	MIC: "MCM",
	NEU: "EUP",
};

export function migrateIndustryCode(code: string | undefined | null): string {
	if (!code) return "";
	return INDUSTRY_CODE_REMAP[code] ?? code;
}

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

type LegacyShape = Partial<GenerationInput> & {
	targetPersonaFunction?: string;
	targetPersonaSubFunction?: string;
	notes?: string;
	sequenceCount?: number;
};

export function migrateLegacyInput(raw: LegacyShape): GenerationInput {
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
	const rawSeq = raw.sequenceCount;
	const sequenceCount: GenerationInput["sequenceCount"] =
		rawSeq === 2 || rawSeq === 3 || rawSeq === 4 || rawSeq === 5 ? rawSeq : 1;

	return {
		targetCompany: raw.targetCompany ?? "",
		targetDomain: raw.targetDomain ?? "",
		targetLinkedInUrl: raw.targetLinkedInUrl ?? "",
		targetPersonaIndustry: industry,
		targetPersonaCategory,
		targetPersonaSubCategory,
		targetPersonaJobTitle: raw.targetPersonaJobTitle ?? "",
		region: raw.region ?? "",
		selectedService: raw.selectedService ?? "",
		selectedFormat: raw.selectedFormat ?? "cold_email",
		strategicAngle: raw.strategicAngle ?? "pain_point",
		cloudEcosystem: raw.cloudEcosystem ?? "gcp",
		intelligentFallback: raw.intelligentFallback ?? true,
		instructions,
		myNotes,
		nurtureTemplate: raw.nurtureTemplate ?? "1",
		emailSequenceLength: raw.emailSequenceLength ?? 5,
		linkedinInmailVariation: raw.linkedinInmailVariation ?? "1",
		sequenceCount,
		intelligenceFeedFocus: raw.intelligenceFeedFocus ?? "",
	};
}
