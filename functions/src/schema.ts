import { z } from "zod";

/**
 * Pre-process callable payloads so legacy fields (targetPersonaFunction,
 * targetPersonaSubFunction, notes) coming from old client builds or replayed
 * sessions don't fail validation. Translation to canonical names happens
 * server-side in services/content.ts via migrateLegacyInput.
 */
const generationInputObjectSchema = z
	.object({
		targetCompany: z.string().optional().default(""),
		targetDomain: z.string().optional().default(""),
		targetLinkedInUrl: z.string().optional().default(""),
		targetPersonaIndustry: z.string().min(1),
		targetPersonaCategory: z.string().optional().default(""),
		targetPersonaSubCategory: z.string().optional().default(""),
		targetPersonaJobTitle: z.string().optional().default(""),
		region: z.string().min(1),
		selectedService: z.string(),
		selectedFormat: z.string().min(1),
		strategicAngle: z
			.enum(["pain_point", "roi_metrics", "social_proof", "direct_pitch"])
			.default("pain_point"),
		cloudEcosystem: z.string().optional().default("gcp"),
		intelligentFallback: z.boolean().optional().default(true),
		instructions: z.string().optional().default(""),
		myNotes: z.string().optional().default(""),
		nurtureTemplate: z.enum(["1", "2", "3"]).optional().default("1"),
		emailSequenceLength: z
			.union([z.literal(3), z.literal(5), z.literal(6)])
			.optional()
			.default(5),
		linkedinInmailVariation: z.enum(["1", "2"]).optional().default("1"),

		// Tolerated legacy fields. Discarded after parse.
		targetPersonaFunction: z.string().optional(),
		targetPersonaSubFunction: z.string().optional(),
		notes: z.string().optional(),
	})
	.passthrough();

export const generationInputSchema = generationInputObjectSchema.transform((data) => {
	const out = { ...data };
	if (!out.targetPersonaCategory && out.targetPersonaFunction) {
		out.targetPersonaCategory = "";
	}
	if (!out.targetPersonaSubCategory && out.targetPersonaSubFunction) {
		out.targetPersonaSubCategory = "";
	}
	if (!out.instructions && out.notes) {
		out.instructions = out.notes;
	}
	delete out.targetPersonaFunction;
	delete out.targetPersonaSubFunction;
	delete out.notes;
	return out;
});

export type GenerationInput = z.infer<typeof generationInputSchema>;
