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

/**
 * Free text the rep can type into the Service combobox, mapped to the canonical
 * service key used to match stories.
 *
 * The dropdown only lists practices that exist in the services sheet, so a rep
 * after something like SecOps types it by hand. Without this, "SecOps" /
 * "Sec Ops" / "Security Operations" are three different strings that match no
 * story at all. Searce sells SecOps under Managed Services, so it resolves there.
 */
const SERVICE_SYNONYMS: Record<string, string> = {
	secops: "finops_cost_optimization",
	"sec ops": "finops_cost_optimization",
	"security operations": "finops_cost_optimization",
	"cloud security": "finops_cost_optimization",
	"security operations centre": "finops_cost_optimization",
	"security operations center": "finops_cost_optimization",
	soc: "finops_cost_optimization",
	"managed services": "finops_cost_optimization",
	"cloud managed services": "finops_cost_optimization",
	cybersecurity: "finops_cost_optimization",
	"cyber security": "finops_cost_optimization",
};

/**
 * Canonical service key for matching. Known values pass through; rep-typed text
 * is normalized (case/punctuation-insensitive) and resolved via SERVICE_SYNONYMS.
 * Unrecognized text returns as-is and simply matches no story — proof then comes
 * from region + industry, which is the intended degrade.
 */
export function canonicalServiceKey(service: string): string {
	const raw = (service ?? "").trim();
	if (!raw) return "";
	const normalized = raw
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, " ")
		.trim();
	return SERVICE_SYNONYMS[normalized] ?? raw;
}

/**
 * Service keys that should also match stories tagged under a sibling practice.
 *
 * Managed Services and SecOps share a bucket. Inert today — BOTH buckets are
 * empty in the story catalog — but wired so matching lights up the moment
 * SecOps/Managed Services rows land in scripts/referenceable-stories.csv.
 */
const SERVICE_MATCH_GROUPS: Record<string, readonly string[]> = {
	finops_cost_optimization: ["finops_cost_optimization", "secops"],
};

/** Every story-side service tag that should count as a hit for `service`. */
function serviceMatchSet(service: string): readonly string[] {
	return SERVICE_MATCH_GROUPS[service] ?? [service];
}

function scoreAndFilter(
	industryCode: string,
	region: string,
	cloudEcosystem: string,
	service: string,
): VerifiedCaseStudy[] {
	const canonical = canonicalServiceKey(service);
	const wantsService = !!canonical && canonical !== "general";
	const acceptedServices = serviceMatchSet(canonical);
	return REFERENCEABLE_STORIES.map((story) => {
		let score = 0;
		if (story.region === region) score += 50;
		if (migrateIndustryCode(story.industryCode) === industryCode) score += 40;
		if (wantsService && acceptedServices.includes(story.service)) score += 30;
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
