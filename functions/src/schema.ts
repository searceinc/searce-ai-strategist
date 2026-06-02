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
		// Industry is no longer hard-required: empty / "GENERAL" both signal a
		// general POV that leans on Tavily research instead of the workbook.
		targetPersonaIndustry: z.string().optional().default(""),
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
		sequenceCount: z
			.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)])
			.optional()
			.default(1),
		intelligenceFeedFocus: z.string().optional().default(""),

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
	// Empty industry → treat as GENERAL POV (lean on Tavily research).
	if (!out.targetPersonaIndustry || !out.targetPersonaIndustry.trim()) {
		out.targetPersonaIndustry = "GENERAL";
	}
	delete out.targetPersonaFunction;
	delete out.targetPersonaSubFunction;
	delete out.notes;
	return out;
});

export type GenerationInput = z.infer<typeof generationInputSchema>;

// ─── Prospect upload (CSV / XLSX → Company Intel dropdowns) ──────────────────

/** Max rows persisted per upload; keeps the Firestore doc under the 1 MB cap. */
const MAX_PROSPECT_ROWS = 3000;
const MAX_CELL = 2000;

const prospectFieldString = z.string().max(MAX_CELL).optional();

export const prospectUploadSchema = z.object({
	fileName: z.string().min(1).max(255),
	matchedHeaders: z
		.object({
			company: z.string().max(255).optional(),
			website: z.string().max(255).optional(),
			linkedin: z.string().max(255).optional(),
		})
		.partial()
		.optional()
		.default({}),
	matchedFields: z.object({
		company: z.boolean(),
		website: z.boolean(),
		linkedin: z.boolean(),
	}),
	rows: z
		.array(
			z.object({
				company: prospectFieldString,
				website: prospectFieldString,
				linkedin: prospectFieldString,
			}),
		)
		.max(MAX_PROSPECT_ROWS),
});

export type ProspectUploadPayload = z.infer<typeof prospectUploadSchema>;
