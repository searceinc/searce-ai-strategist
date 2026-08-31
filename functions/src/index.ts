import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as z from "zod";
import { tavilyApiKey, geminiApiKey, hubspotAccessToken, db } from "./config.js";
import { orchestrateGeneration } from "./services/content.js";
import {
	saveSession,
	updateSession,
	getSessionResearch,
	saveProspectUpload as saveProspectUploadDoc,
} from "./services/db.js";
import { researchFingerprint } from "./services/research-fingerprint.js";
import type { GenerationInput, ResearchSnapshot } from "./types.js";
import { createDraftMarketingEmails, humanizeEmailLocalPart } from "./hubspot/marketing-email.js";
import {
	generationInputSchema,
	prospectUploadSchema,
	pushToHubspotDraftsSchema,
} from "./schema.js";
import { docToSessionSummary, serializeSessionDocument } from "./session-read.js";

/**
 * Gen 2 callables run on Cloud Run. Without a public invoker, browsers often fail the
 * OPTIONS preflight (misreported as CORS). Auth is still enforced inside each handler.
 */
const callableHttp = { cors: true as const, invoker: "public" as const };

function firestoreListError(err: unknown, hint: string): never {
	console.error(hint, err);
	const msg = err instanceof Error ? err.message : String(err);
	if (/index/i.test(msg)) {
		throw new HttpsError(
			"failed-precondition",
			`${hint}: deploy firestore.indexes.json to the database set in FIRESTORE_DATABASE_ID. ${msg}`,
		);
	}
	throw new HttpsError("internal", msg || hint);
}

function requireKeys(): { tavily: string; gemini: string } {
	if (!tavilyApiKey) throw new HttpsError("failed-precondition", "TAVILY_API_KEY not set.");
	if (!geminiApiKey) throw new HttpsError("failed-precondition", "GEMINI_API_KEY not set.");
	return { tavily: tavilyApiKey, gemini: geminiApiKey };
}

// ─── Generate Content ───────────────────────────────────────────────────────

export const generateContent = onCall(
	{
		...callableHttp,
		timeoutSeconds: 120,
		memory: "512MiB",
		// Deliberately NO minInstances: scale-to-zero is wanted here — an
		// always-warm instance bills 24/7 for an internal tool that is idle most
		// of the day. The trade is a Node 22 cold start on the first generation
		// after an idle period; the research-reuse path keeps regenerates fast.
	},
	async (request) => {
		if (!request.auth) {
			throw new HttpsError("unauthenticated", "Sign in required.");
		}

		const parsed = generationInputSchema.safeParse(request.data?.input);
		if (!parsed.success) {
			throw new HttpsError("invalid-argument", "Invalid input: " + parsed.error.message);
		}

		const input = parsed.data as z.infer<typeof generationInputSchema>;
		const keys = requireKeys();

		try {
			const result = await orchestrateGeneration(
				input as Parameters<typeof orchestrateGeneration>[0],
				keys.tavily,
				keys.gemini,
			);

			if (result.featureNotAvailable) {
				return {
					featureNotAvailable: true,
					noMatchMessage: result.noMatchMessage,
					research: result.research,
					sessionId: "",
					caseStudyMatches: [],
					fallbackPath: result.fallbackPath,
					confidenceScore: result.confidenceScore,
					generatedContent: "",
					transparencyNote: null,
					strategicPriority: null,
				};
			}

			// Fold anything research resolved into the input BEFORE persisting.
			// researchFingerprint() includes targetDomain, so if the client starts
			// sending a resolved domain the stored input lacks, the next regenerate
			// mismatches and re-spends the whole Tavily fan-out.
			const enrichedInput = {
				...input,
				intelligenceFeedFocus: "",
				targetDomain: input.targetDomain || (result.research.resolvedDomain ?? ""),
				targetLinkedInUrl:
					input.targetLinkedInUrl || (result.research.resolvedLinkedInUrl ?? ""),
			};

			const sessionId = await saveSession(request.auth.uid, {
				input: enrichedInput,
				research: result.research,
				caseStudyMatches: result.caseStudyMatches,
				fallbackPath: result.fallbackPath,
				confidenceScore: result.confidenceScore,
				generatedContent: result.generatedContent,
				editedContent: result.generatedContent,
				transparencyNote: result.transparencyNote,
				strategicPriority: result.strategicPriority ?? null,
			});

			return {
				sessionId,
				research: result.research,
				caseStudyMatches: result.caseStudyMatches,
				fallbackPath: result.fallbackPath,
				confidenceScore: result.confidenceScore,
				generatedContent: result.generatedContent,
				transparencyNote: result.transparencyNote,
				strategicPriority: result.strategicPriority ?? null,
			};
		} catch (err) {
			console.error("Generation failed:", err);
			throw new HttpsError(
				"internal",
				err instanceof Error ? err.message : "Content generation failed.",
			);
		}
	},
);

// ─── Regenerate Content ─────────────────────────────────────────────────────

export const regenerateContent = onCall(
	{
		...callableHttp,
		timeoutSeconds: 120,
		memory: "512MiB",
	},
	async (request) => {
		if (!request.auth) {
			throw new HttpsError("unauthenticated", "Sign in required.");
		}

		const { sessionId, input: rawInput } = request.data ?? {};
		if (!sessionId || !rawInput) {
			throw new HttpsError("invalid-argument", "sessionId and input required.");
		}

		const parsed = generationInputSchema.safeParse(rawInput);
		if (!parsed.success) {
			throw new HttpsError("invalid-argument", "Invalid input: " + parsed.error.message);
		}
		const input = parsed.data as Parameters<typeof orchestrateGeneration>[0];

		const keys = requireKeys();

		try {
			// Regenerate is almost always a prompt-level change (different tone,
			// angle, sequence length, or an Intelligence-Feed refocus) against an
			// unchanged target. Re-running research there re-spent 16-28 Tavily
			// credits and several seconds to rebuild an identical snapshot, so
			// reuse it whenever the research-shaping inputs actually match.
			const stored = await getSessionResearch(sessionId, request.auth.uid);
			const canReuseResearch =
				stored !== null &&
				researchFingerprint(stored.input as Partial<GenerationInput>) ===
					researchFingerprint(input as Partial<GenerationInput>);

			const result = await orchestrateGeneration(input, keys.tavily, keys.gemini, {
				reusedResearch: canReuseResearch
					? (stored.research as unknown as ResearchSnapshot)
					: undefined,
			});

			await updateSession(sessionId, {
				generatedContent: result.generatedContent,
				editedContent: result.generatedContent,
				research: result.research,
				caseStudyMatches: result.caseStudyMatches,
				fallbackPath: result.fallbackPath,
				confidenceScore: result.confidenceScore,
				transparencyNote: result.transparencyNote,
				strategicPriority: result.strategicPriority ?? null,
			});

			return {
				sessionId,
				research: result.research,
				caseStudyMatches: result.caseStudyMatches,
				fallbackPath: result.fallbackPath,
				confidenceScore: result.confidenceScore,
				generatedContent: result.generatedContent,
				transparencyNote: result.transparencyNote,
				strategicPriority: result.strategicPriority ?? null,
			};
		} catch (err) {
			console.error("Regeneration failed:", err);
			throw new HttpsError(
				"internal",
				err instanceof Error ? err.message : "Regeneration failed.",
			);
		}
	},
);

// ─── Read sessions (Admin SDK — same DB as writes; bypasses client rules) ───

/**
 * Fields the history/favourites lists actually render (see docToSessionSummary
 * + sessionContentPreview in session-read.ts).
 *
 * Projected with .select() so the list query stops pulling the whole session
 * document. Each doc also carries the full `research` snapshot, `caseStudyMatches`
 * and `strategicPriority` — none of which a list card shows — so fetching 50 of
 * them was downloading megabytes to render a dozen small fields, which is why
 * Content History was slow to appear.
 */
const SESSION_SUMMARY_FIELDS = [
	"userId",
	"createdAt",
	"updatedAt",
	"input",
	"confidenceScore",
	"fallbackPath",
	"isFavorite",
	"editedContent",
	"generatedContent",
] as const;

export const listStrategistSessions = onCall(callableHttp, async (request) => {
	if (!request.auth) {
		throw new HttpsError("unauthenticated", "Sign in required.");
	}
	const uid = request.auth.uid;
	const max = Math.min(Number(request.data?.maxResults) || 50, 100);

	try {
		const snap = await db
			.collection("strategist_sessions")
			.where("userId", "==", uid)
			.orderBy("createdAt", "desc")
			.limit(max)
			.select(...SESSION_SUMMARY_FIELDS)
			.get();

		const sessions = snap.docs.map((d) => docToSessionSummary(d.id, d.data()));
		return { sessions };
	} catch (err) {
		firestoreListError(err, "listStrategistSessions");
	}
});

export const listFavoriteStrategistSessions = onCall(callableHttp, async (request) => {
	if (!request.auth) {
		throw new HttpsError("unauthenticated", "Sign in required.");
	}

	const uid = request.auth.uid;
	try {
		const snap = await db
			.collection("strategist_sessions")
			.where("userId", "==", uid)
			.where("isFavorite", "==", true)
			.orderBy("createdAt", "desc")
			.limit(100)
			.select(...SESSION_SUMMARY_FIELDS)
			.get();

		const sessions = snap.docs.map((d) => docToSessionSummary(d.id, d.data()));
		return { sessions };
	} catch (err) {
		firestoreListError(err, "listFavoriteStrategistSessions");
	}
});

export const getStrategistSession = onCall(callableHttp, async (request) => {
	if (!request.auth) {
		throw new HttpsError("unauthenticated", "Sign in required.");
	}

	const sessionId = request.data?.sessionId as string | undefined;
	if (!sessionId) {
		throw new HttpsError("invalid-argument", "sessionId required.");
	}

	try {
		const docSnap = await db.collection("strategist_sessions").doc(sessionId).get();
		if (!docSnap.exists) {
			return { session: null };
		}

		const data = docSnap.data();
		if (data?.userId !== request.auth.uid) {
			throw new HttpsError("permission-denied", "Not your session.");
		}

		const session = {
			id: docSnap.id,
			...serializeSessionDocument(data!),
		};
		return { session };
	} catch (err) {
		if (err instanceof HttpsError) throw err;
		firestoreListError(err, "getStrategistSession");
	}
});

// ─── Update Session (edit content, toggle favorite, etc.) ───────────────────

export const updateSessionData = onCall(callableHttp, async (request) => {
	if (!request.auth) {
		throw new HttpsError("unauthenticated", "Sign in required.");
	}

	const { sessionId, data } = request.data ?? {};
	if (!sessionId || !data) {
		throw new HttpsError("invalid-argument", "sessionId and data required.");
	}

	const docRef = db.collection("strategist_sessions").doc(sessionId as string);
	const snap = await docRef.get();

	if (!snap.exists || snap.data()?.userId !== request.auth.uid) {
		throw new HttpsError("permission-denied", "Not your session.");
	}

	const updateData = { ...(data as Record<string, unknown>) };

	if (updateData._incrementExport) {
		delete updateData._incrementExport;
		const current = (snap.data()?.exportCount as number) ?? 0;
		updateData.exportCount = current + 1;
	}

	await updateSession(sessionId as string, updateData);
	return { success: true };
});

// ─── Save Prospect Upload (parsed CSV / XLSX prospect list) ─────────────────

export const saveProspectUpload = onCall(callableHttp, async (request) => {
	if (!request.auth) {
		throw new HttpsError("unauthenticated", "Sign in required.");
	}

	const parsed = prospectUploadSchema.safeParse(request.data?.upload);
	if (!parsed.success) {
		throw new HttpsError("invalid-argument", "Invalid upload: " + parsed.error.message);
	}

	const upload = parsed.data;
	if (upload.rows.length === 0) {
		throw new HttpsError("invalid-argument", "The uploaded file has no usable rows.");
	}

	try {
		const uploadId = await saveProspectUploadDoc(request.auth.uid, {
			fileName: upload.fileName,
			matchedHeaders: upload.matchedHeaders,
			matchedFields: upload.matchedFields,
			rows: upload.rows,
			rowCount: upload.rows.length,
		});
		return { uploadId };
	} catch (err) {
		console.error("saveProspectUpload failed:", err);
		throw new HttpsError(
			"internal",
			err instanceof Error ? err.message : "Failed to save the uploaded list.",
		);
	}
});

// ─── Delete Session ─────────────────────────────────────────────────────────

export const deleteSessionData = onCall(callableHttp, async (request) => {
	if (!request.auth) {
		throw new HttpsError("unauthenticated", "Sign in required.");
	}

	const { sessionId } = request.data ?? {};
	if (!sessionId) {
		throw new HttpsError("invalid-argument", "sessionId required.");
	}

	const docRef = db.collection("strategist_sessions").doc(sessionId as string);
	const snap = await docRef.get();

	if (!snap.exists || snap.data()?.userId !== request.auth.uid) {
		throw new HttpsError("permission-denied", "Not your session.");
	}

	await docRef.delete();
	return { success: true };
});

// ─── Push to HubSpot (Marketing Email drafts) ───────────────────────────────
// Manual, rep-triggered only — never called from generateContent/regenerateContent.
// Creates one unpublished draft per touch; the rep assigns a contact and sends
// from inside HubSpot.

export const pushToHubspotDrafts = onCall(callableHttp, async (request) => {
	if (!request.auth) {
		throw new HttpsError("unauthenticated", "Sign in required.");
	}
	if (!hubspotAccessToken) {
		throw new HttpsError("failed-precondition", "HubSpot is not configured.");
	}

	const parsed = pushToHubspotDraftsSchema.safeParse(request.data);
	if (!parsed.success) {
		throw new HttpsError("invalid-argument", "Invalid input: " + parsed.error.message);
	}
	const { touches, targetCompany, format } = parsed.data;

	const repEmail = request.auth.token.email;
	const repName = request.auth.token.name ?? humanizeEmailLocalPart(repEmail);

	try {
		const { created, failed } = await createDraftMarketingEmails(
			touches,
			targetCompany,
			format,
			repName,
			repEmail,
			hubspotAccessToken,
		);
		// Partial success is reported, not thrown: drafts that did land already
		// exist in HubSpot and the rep needs their URLs.
		return { created, failed };
	} catch (err) {
		console.error("pushToHubspotDrafts failed:", err);
		throw new HttpsError(
			"internal",
			err instanceof Error ? err.message : "Failed to create HubSpot drafts.",
		);
	}
});
