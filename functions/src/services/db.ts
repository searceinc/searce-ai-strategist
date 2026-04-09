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
