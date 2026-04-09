import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
	measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const FIRESTORE_DATABASE_ID = process.env.NEXT_PUBLIC_FIRESTORE_DATABASE_ID?.trim();

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = FIRESTORE_DATABASE_ID ? getFirestore(app, FIRESTORE_DATABASE_ID) : getFirestore(app);

/** Must match the region where Cloud Functions are deployed (default project region is often us-central1). */
const FUNCTIONS_REGION = process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_REGION?.trim() || "us-central1";
const functions = getFunctions(app, FUNCTIONS_REGION);

export { app, auth, db, functions };
