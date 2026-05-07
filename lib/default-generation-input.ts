import { CONTENT_FORMATS } from "@/lib/constants";
import { migrateLegacyInput } from "@/lib/legacy-codes";
import type { ContentFormat, GenerationInput } from "@/lib/types";

const VALID_FORMATS = new Set<ContentFormat>(CONTENT_FORMATS.map((f) => f.value));

export const DEFAULT_GENERATION_INPUT: GenerationInput = {
	targetCompany: "",
	targetDomain: "",
	targetLinkedInUrl: "",
	targetPersonaIndustry: "",
	targetPersonaCategory: "",
	targetPersonaSubCategory: "",
	targetPersonaJobTitle: "",
	region: "",
	selectedService: "",
	selectedFormat: "cold_email",
	strategicAngle: "pain_point",
	cloudEcosystem: "gcp",
	intelligentFallback: true,
	instructions: "",
	myNotes: "",
	nurtureTemplate: "1",
	emailSequenceLength: 5,
	linkedinInmailVariation: "1",
};

/** Merge Firestore / partial payloads into a valid GenerationInput. Applies legacy migration first. */
export function normalizeGenerationInput(raw: Partial<GenerationInput>): GenerationInput {
	const migrated = migrateLegacyInput(raw);
	const merged: GenerationInput = {
		...DEFAULT_GENERATION_INPUT,
		...migrated,
	} as GenerationInput;
	if (!VALID_FORMATS.has(merged.selectedFormat)) {
		merged.selectedFormat = "cold_email";
	}
	if (
		merged.nurtureTemplate !== "1" &&
		merged.nurtureTemplate !== "2" &&
		merged.nurtureTemplate !== "3"
	) {
		merged.nurtureTemplate = "1";
	}
	if (
		merged.emailSequenceLength !== 3 &&
		merged.emailSequenceLength !== 5 &&
		merged.emailSequenceLength !== 6
	) {
		merged.emailSequenceLength = 5;
	}
	if (merged.linkedinInmailVariation !== "1" && merged.linkedinInmailVariation !== "2") {
		merged.linkedinInmailVariation = "1";
	}
	return merged;
}
