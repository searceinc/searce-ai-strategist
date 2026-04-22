import { z } from "zod";

export const generationInputSchema = z.object({
	targetCompany: z.string().optional().default(""),
	targetDomain: z.string().optional().default(""),
	targetLinkedInUrl: z.string().optional().default(""),
	targetPersonaIndustry: z.string().min(1),
	targetPersonaFunction: z.string().min(1),
	targetPersonaSubFunction: z.string().optional().default(""),
	targetPersonaJobTitle: z.string().optional().default(""),
	region: z.string().min(1),
	selectedService: z.string(),
	selectedFormat: z.string().min(1),
	strategicAngle: z
		.enum(["pain_point", "roi_metrics", "social_proof", "direct_pitch"])
		.default("pain_point"),
	cloudEcosystem: z.string().optional().default("gcp"),
	intelligentFallback: z.boolean().optional().default(true),
	notes: z.string(),
	nurtureTemplate: z.enum(["1", "2", "3"]).optional().default("1"),
	emailSequenceLength: z
		.union([z.literal(3), z.literal(5), z.literal(6)])
		.optional()
		.default(5),
	linkedinInmailVariation: z.enum(["1", "2"]).optional().default("1"),
});

export type GenerationInput = z.infer<typeof generationInputSchema>;
