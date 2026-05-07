import type { DocumentData } from "firebase-admin/firestore";
import { Timestamp } from "firebase-admin/firestore";
import { migrateLegacyInput } from "./data/legacy-codes.js";

/** Match client preview logic: prefer edited copy over generated. */
export function sessionContentPreview(data: Record<string, unknown>): string {
	const edited = data.editedContent;
	const generated = data.generatedContent;
	const text = (typeof edited === "string" && edited.length > 0 ? edited : generated) ?? "";
	return typeof text === "string" ? text.slice(0, 120) : "";
}

export function docToSessionSummary(id: string, data: DocumentData): Record<string, unknown> {
	const input = (data.input ?? {}) as Record<string, unknown>;
	return {
		id,
		userId: data.userId,
		createdAt: serializeField(data.createdAt),
		updatedAt: serializeField(data.updatedAt),
		targetCompany: input.targetCompany ?? "",
		targetPersonaJobTitle: input.targetPersonaJobTitle ?? "",
		selectedFormat: input.selectedFormat ?? "cold_email",
		strategicAngle: input.strategicAngle ?? "pain_point",
		selectedService: input.selectedService ?? "",
		region: input.region ?? "",
		confidenceScore: data.confidenceScore ?? 0,
		fallbackPath: data.fallbackPath ?? "none",
		isFavorite: data.isFavorite ?? false,
		contentPreview: sessionContentPreview(data as Record<string, unknown>),
	};
}

function serializeField(value: unknown): unknown {
	if (value instanceof Timestamp) return value.toDate().toISOString();
	return value;
}

/**
 * Deep-convert Firestore Timestamps for callable JSON response, then run the
 * legacy → canonical migration on the embedded `input` payload so the UI sees
 * the new field names regardless of when the session was first created.
 */
export function serializeSessionDocument(data: DocumentData): Record<string, unknown> {
	const out: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(data)) {
		out[key] = deepSerialize(value);
	}
	if (out.input && typeof out.input === "object") {
		out.input = migrateLegacyInput(out.input as Parameters<typeof migrateLegacyInput>[0]);
	}
	return out;
}

function deepSerialize(value: unknown): unknown {
	if (value instanceof Timestamp) return value.toDate().toISOString();
	if (Array.isArray(value)) return value.map(deepSerialize);
	if (value && typeof value === "object" && !(value instanceof Date)) {
		const o = value as Record<string, unknown>;
		const nested: Record<string, unknown> = {};
		for (const [k, v] of Object.entries(o)) nested[k] = deepSerialize(v);
		return nested;
	}
	return value;
}
