import type { VerifiedCaseStudy } from "../types.js";
import { REFERENCEABLE_STORIES, type ReferenceableStory } from "./referenceable-stories.js";
import { REGION_FALLBACKS } from "./labels.js";
import { migrateIndustryCode } from "./legacy-codes.js";

/**
 * Case-study data is now sourced entirely from the curated "Referenceable
 * Solution Stories Master Sheet" (see `referenceable-stories.ts`). Every story
 * here is a real, publicly citable Searce engagement with verified business
 * context, solution and impact — these are the ONLY proof points the model may
 * name in generated outreach.
 *
 * We expose two views:
 *   - `VERIFIED_CASE_STUDIES`  — lean shape returned to the UI / persisted.
 *   - `getStoryById(id)`       — full story (context/solution/impact) for the
 *                                prompt builder to ground the email content.
 */

const STORY_BY_ID = new Map<string, ReferenceableStory>(
	REFERENCEABLE_STORIES.map((s) => [s.id, s]),
);

/** Full referenceable story (rich grounding fields) by id. Server-only. */
export function getStoryById(id: string): ReferenceableStory | undefined {
	return STORY_BY_ID.get(id);
}

/**
 * Project a rich story onto the lean `VerifiedCaseStudy` shape the UI + Firestore
 * expect. Heavy fields (businessContext/solution/impact) are intentionally left
 * out here to keep the session payload small — the prompt pulls them via id.
 */
function toLeanCaseStudy(s: ReferenceableStory): VerifiedCaseStudy {
	return {
		id: s.id,
		title: `${s.client}: ${s.title}`,
		client: s.client,
		metrics: s.metricHeadline,
		url: s.url,
		industries: [s.industryCode],
		regions: [s.region],
		categories: [],
		cloudProvider: s.cloudProvider,
		context: s.summary,
	};
}

export const VERIFIED_CASE_STUDIES: VerifiedCaseStudy[] =
	REFERENCEABLE_STORIES.map(toLeanCaseStudy);

interface CaseStudyMatch {
	studies: VerifiedCaseStudy[];
	usedFallback: boolean;
	fallbackRegion?: string;
}

/**
 * Score-based matcher over the referenceable stories.
 *
 * Dimensions (additive):
 *   region match      +50   (a region hit alone clears the bar)
 *   industry match    +40
 *   service match     +30   (only when a specific service is in scope)
 *   cloud match       +10   (exact provider or multicloud story)
 *
 * Same-industry / same-service stories therefore always outrank a bare
 * region hit, so cross-industry proof only surfaces when no closer story
 * exists. Region fallback (e.g. EMEA → India) kicks in when the primary
 * region returns nothing and the rep left Intelligent Fallback on.
 */
export function getVerifiedCaseStudies(
	industryCode: string,
	region: string,
	cloudEcosystem: string,
	useFallback: boolean,
	service: string = "",
): CaseStudyMatch {
	const canonicalIndustry = migrateIndustryCode(industryCode);
	let studies = scoreAndFilter(canonicalIndustry, region, cloudEcosystem, service);
	if (studies.length > 0) {
		return { studies, usedFallback: false };
	}

	if (useFallback) {
		const fallbackRegion = REGION_FALLBACKS[region];
		if (fallbackRegion) {
			studies = scoreAndFilter(canonicalIndustry, fallbackRegion, cloudEcosystem, service);
			if (studies.length > 0) {
				return { studies, usedFallback: true, fallbackRegion };
			}
		}
	}

	return { studies: [], usedFallback: false };
}

function scoreAndFilter(
	industryCode: string,
	region: string,
	cloudEcosystem: string,
	service: string,
): VerifiedCaseStudy[] {
	const wantsService = !!service && service !== "general";
	return REFERENCEABLE_STORIES.map((story) => {
		let score = 0;
		if (story.region === region) score += 50;
		if (migrateIndustryCode(story.industryCode) === industryCode) score += 40;
		if (wantsService && story.service === service) score += 30;
		if (story.cloudProvider === cloudEcosystem || story.cloudProvider === "multicloud") {
			score += 10;
		}
		return { story, score };
	})
		.filter((s) => s.score >= 50)
		.sort((a, b) => b.score - a.score)
		.slice(0, 3)
		.map((s) => toLeanCaseStudy(s.story));
}
