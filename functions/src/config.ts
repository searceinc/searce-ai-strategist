import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

export const tavilyApiKey = process.env.TAVILY_API_KEY;
export const geminiApiKey = process.env.GEMINI_API_KEY;

/** Must match NEXT_PUBLIC_FIRESTORE_DATABASE_ID when using a non-(default) Native DB. */
const firestoreDatabaseId = process.env.FIRESTORE_DATABASE_ID?.trim();

const app = initializeApp();
export const db = firestoreDatabaseId ? getFirestore(app, firestoreDatabaseId) : getFirestore(app);
