"use client";

import { httpsCallable } from "firebase/functions";
import { functions } from "./config";
import type {
	GenerateContentRequest,
	GenerateContentResponse,
	SessionSummary,
	StrategistSession,
} from "@/lib/types";

// ─── Cloud Function Calls ───────────────────────────────────────────────────

const generateContentFn = httpsCallable<GenerateContentRequest, GenerateContentResponse>(
	functions,
	"generateContent",
);

const regenerateContentFn = httpsCallable<
	{ sessionId: string; input: GenerateContentRequest["input"] },
	GenerateContentResponse
>(functions, "regenerateContent");

const updateSessionFn = httpsCallable<
	{ sessionId: string; data: Record<string, unknown> },
	{ success: boolean }
>(functions, "updateSessionData");

const listStrategistSessionsFn = httpsCallable<
	{ maxResults?: number },
	{ sessions: SessionSummary[] }
>(functions, "listStrategistSessions");

const listFavoriteStrategistSessionsFn = httpsCallable<
	Record<string, never>,
	{ sessions: SessionSummary[] }
>(functions, "listFavoriteStrategistSessions");

const getStrategistSessionFn = httpsCallable<
	{ sessionId: string },
	{ session: StrategistSession | null }
>(functions, "getStrategistSession");

export async function callGenerateContent(
	input: GenerateContentRequest["input"],
): Promise<GenerateContentResponse> {
	const result = await generateContentFn({ input });
	return result.data;
}

export async function callRegenerateContent(
	sessionId: string,
	input: GenerateContentRequest["input"],
): Promise<GenerateContentResponse> {
	const result = await regenerateContentFn({ sessionId, input });
	return result.data;
}

export async function callUpdateSession(
	sessionId: string,
	data: Record<string, unknown>,
): Promise<void> {
	await updateSessionFn({ sessionId, data });
}

// ─── Content History (via Cloud Functions + Admin SDK) ────────────────────
// Same database as generate/save; works even when client Firestore rules deny reads
// or when troubleshooting index issues (indexes still required server-side).

/**
 * @param userId Kept for API compatibility; the callable uses the signed-in user only.
 */
export async function fetchUserSessions(
	_userId: string,
	maxResults = 50,
): Promise<SessionSummary[]> {
	const result = await listStrategistSessionsFn({ maxResults });
	return result.data.sessions ?? [];
}

export async function fetchRecentSessions(userId: string, daysBack = 4): Promise<SessionSummary[]> {
	const all = await fetchUserSessions(userId, 100);
	const cutoff = Date.now() - daysBack * 24 * 60 * 60 * 1000;
	return all.filter((s) => {
		const raw = s.createdAt as unknown;
		const ms =
			typeof raw === "string"
				? new Date(raw).getTime()
				: raw && typeof raw === "object" && "toDate" in (raw as object)
					? (raw as { toDate: () => Date }).toDate().getTime()
					: 0;
		return ms >= cutoff;
	});
}

export async function fetchSessionById(sessionId: string): Promise<StrategistSession | null> {
	const result = await getStrategistSessionFn({ sessionId });
	return result.data.session ?? null;
}

export async function toggleFavorite(sessionId: string, isFavorite: boolean): Promise<void> {
	await callUpdateSession(sessionId, { isFavorite });
}

export async function updateEditedContent(sessionId: string, editedContent: string): Promise<void> {
	await callUpdateSession(sessionId, { editedContent });
}

export async function incrementExportCount(sessionId: string): Promise<void> {
	await callUpdateSession(sessionId, { _incrementExport: true });
}

export async function deleteSession(sessionId: string): Promise<void> {
	const deleteSessionFn = httpsCallable<{ sessionId: string }, { success: boolean }>(
		functions,
		"deleteSessionData",
	);
	await deleteSessionFn({ sessionId });
}

/** @param userId Kept for API compatibility; the callable uses the signed-in user only. */
export async function fetchFavoriteSessions(_userId?: string): Promise<SessionSummary[]> {
	const result = await listFavoriteStrategistSessionsFn({});
	return result.data.sessions ?? [];
}
