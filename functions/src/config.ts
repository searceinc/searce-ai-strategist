import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

export const tavilyApiKey = process.env.TAVILY_API_KEY;
export const geminiApiKey = process.env.GEMINI_API_KEY;
export const hubspotAccessToken = process.env.HUBSPOT_ACCESS_TOKEN;

/** Must match NEXT_PUBLIC_FIRESTORE_DATABASE_ID when using a non-(default) Native DB. */
const firestoreDatabaseId = process.env.FIRESTORE_DATABASE_ID?.trim();

const app = initializeApp();
export const db = firestoreDatabaseId ? getFirestore(app, firestoreDatabaseId) : getFirestore(app);

// Optional fields on research/session documents (e.g. a source's `published_date`,
// a persona signal's `date`) are `undefined` whenever the source has no value —
// the Admin SDK rejects `undefined` on write and would throw for the whole doc.
// Dropping undefined values is the intended behavior here (absent == no value).
db.settings({ ignoreUndefinedProperties: true });
