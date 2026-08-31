import { db } from "../config.js";

// ─── Sessions ───────────────────────────────────────────────────────────────

export async function saveSession(
	userId: string,
	sessionData: Record<string, unknown>,
): Promise<string> {
	const now = new Date().toISOString();
	const ref = await db.collection("strategist_sessions").add({
		...sessionData,
		userId,
		createdAt: now,
		updatedAt: now,
		exportCount: 0,
		saveCount: 1,
		isFavorite: false,
	});
	return ref.id;
}

/**
 * The stored input + research snapshot for a session, used by regenerate to
 * decide whether it can skip the Tavily fan-out. Returns null when the session
 * is missing, belongs to someone else, or has no persisted research.
 */
export async function getSessionResearch(
	sessionId: string,
	userId: string,
): Promise<{ input: Record<string, unknown>; research: Record<string, unknown> } | null> {
	const snap = await db.collection("strategist_sessions").doc(sessionId).get();
	if (!snap.exists) return null;

	const data = snap.data();
	if (!data || data.userId !== userId) return null;
	if (!data.research || !data.input) return null;

	return {
		input: data.input as Record<string, unknown>,
		research: data.research as Record<string, unknown>,
	};
}

export async function updateSession(
	sessionId: string,
	data: Record<string, unknown>,
): Promise<void> {
	await db
		.collection("strategist_sessions")
		.doc(sessionId)
		.update({
			...data,
			updatedAt: new Date().toISOString(),
		});
}

// ─── Prospect uploads ─────────────────────────────────────────────────────────

export async function saveProspectUpload(
	userId: string,
	data: Record<string, unknown>,
): Promise<string> {
	const now = new Date().toISOString();
	const ref = await db.collection("prospect_uploads").add({
		...data,
		userId,
		createdAt: now,
		updatedAt: now,
	});
	return ref.id;
}
