/**
 * Sheet-driven pain-point and use-case lookups.
 *
 * The hardcoded persona-function map this file used to expose has been replaced
 * with the workbook-grounded `industry → category → sub-category` keying from
 * Sheets 3 and 4. Each lookup returns:
 *   - detailed pain points (verbose, sub-category-specific)
 *   - converged pain points (deduped buckets across the workbook)
 *   - the matching detailed + converged use cases
 *   - the Searce practices that score >= 2 on the relevant DPPIDs (Sheet 6)
 *
 * Falls back gracefully if the sub-category isn't yet in the sheet:
 *   subCategory match → category match → industry match → empty bundle.
 */

import { SHEET_PAIN_POINTS, type SheetPainPointRow } from "./sheet-pain-points.js";
import {
	SHEET_PRACTICE_RELEVANCE,
	type PracticeRelevanceRow,
	type SearcePracticeKey,
} from "./sheet-practice-relevance.js";
import { CATEGORY_LABELS, SUB_CATEGORY_LABELS, INDUSTRY_LABELS } from "./labels.js";
import type { SheetPainPointBundle } from "../types.js";

const PRACTICE_LABELS: Record<SearcePracticeKey, string> = {
	ai: "Applied AI",
	da: "Data & Analytics",
	infraMod: "Infrastructure Modernization",
	cms: "Cloud Managed Services",
	li: "Location Intelligence",
	fow: "Future of Work",
};

const PRACTICE_KEYS: SearcePracticeKey[] = ["ai", "da", "infraMod", "cms", "li", "fow"];

const PRACTICE_BY_DPP_ID: Map<number, PracticeRelevanceRow> = new Map(
	SHEET_PRACTICE_RELEVANCE.map((row) => [row.dppId, row]),
);

function deriveRelevantPractices(rows: SheetPainPointRow[]): string[] {
	const aggregated: Record<SearcePracticeKey, number> = {
		ai: 0,
		da: 0,
		infraMod: 0,
		cms: 0,
		li: 0,
		fow: 0,
	};
	let counted = 0;
	for (const row of rows) {
		const score = PRACTICE_BY_DPP_ID.get(row.dppId);
		if (!score) continue;
		counted++;
		for (const key of PRACTICE_KEYS) aggregated[key] += score[key];
	}
	if (counted === 0) return [];
	// Threshold: average score >= 1.5 across the matched DPPIDs means Searce
	// genuinely delivers in this practice for these pain points. Any practice
	// below that line is omitted so the model can't claim it.
	return PRACTICE_KEYS.filter((key) => aggregated[key] / counted >= 1.5).map(
		(key) => PRACTICE_LABELS[key],
	);
}

function bundle(
	industryCode: string,
	category: string,
	subCategory: string,
	rows: SheetPainPointRow[],
): SheetPainPointBundle {
	const detailedSeen = new Set<string>();
	const convergedSeen = new Set<string>();
	const detailedUseCaseSeen = new Set<string>();
	const convergedUseCaseSeen = new Set<string>();

	const detailed: string[] = [];
	const converged: string[] = [];
	const detailedUseCases: string[] = [];
	const convergedUseCases: string[] = [];

	for (const row of rows) {
		if (!detailedSeen.has(row.detailed)) {
			detailedSeen.add(row.detailed);
			detailed.push(row.detailed);
		}
		if (!convergedSeen.has(row.converged)) {
			convergedSeen.add(row.converged);
			converged.push(row.converged);
		}
		if (!detailedUseCaseSeen.has(row.detailedUseCase)) {
			detailedUseCaseSeen.add(row.detailedUseCase);
			detailedUseCases.push(row.detailedUseCase);
		}
		if (!convergedUseCaseSeen.has(row.convergedUseCase)) {
			convergedUseCaseSeen.add(row.convergedUseCase);
			convergedUseCases.push(row.convergedUseCase);
		}
	}

	return {
		industryCode,
		category,
		subCategory,
		categoryLabel: CATEGORY_LABELS[category] ?? category,
		subCategoryLabel: SUB_CATEGORY_LABELS[subCategory] ?? subCategory,
		fullId: rows[0]?.fullId ?? null,
		detailed,
		converged,
		detailedUseCases,
		convergedUseCases,
		relevantPractices: deriveRelevantPractices(rows),
	};
}

/**
 * Returns the sheet-driven pain points + use cases for the supplied targeting.
 *
 * Resolution order:
 *   1. Exact (industry + category + sub-category)
 *   2. Industry + category (any sub-category)
 *   3. Industry only
 *   4. Empty bundle (caller should treat as "benchmark only")
 */
export function getSheetPainPoints(
	industryCode: string,
	category: string,
	subCategory: string,
): SheetPainPointBundle {
	if (industryCode && category && subCategory) {
		const exact = SHEET_PAIN_POINTS.filter(
			(r) =>
				r.industryCode === industryCode &&
				r.category === category &&
				r.subCategory === subCategory,
		);
		if (exact.length > 0) return bundle(industryCode, category, subCategory, exact);
	}

	if (industryCode && category) {
		const cat = SHEET_PAIN_POINTS.filter(
			(r) => r.industryCode === industryCode && r.category === category,
		);
		if (cat.length > 0) return bundle(industryCode, category, "", cat);
	}

	if (industryCode) {
		const ind = SHEET_PAIN_POINTS.filter((r) => r.industryCode === industryCode);
		if (ind.length > 0) return bundle(industryCode, "", "", ind);
	}

	return {
		industryCode,
		category,
		subCategory,
		categoryLabel: CATEGORY_LABELS[category] ?? "",
		subCategoryLabel: SUB_CATEGORY_LABELS[subCategory] ?? "",
		fullId: null,
		detailed: [],
		converged: [],
		detailedUseCases: [],
		convergedUseCases: [],
		relevantPractices: [],
	};
}

/** Friendly resolved labels for prompt headers. */
export function resolveTaxonomyLabels(
	industryCode: string,
	category: string,
	subCategory: string,
): { industry: string; category: string; subCategory: string } {
	return {
		industry: INDUSTRY_LABELS[industryCode] ?? industryCode,
		category: CATEGORY_LABELS[category] ?? category,
		subCategory: SUB_CATEGORY_LABELS[subCategory] ?? subCategory,
	};
}
