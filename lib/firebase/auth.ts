import {
	signInWithPopup,
	GoogleAuthProvider,
	signOut as firebaseSignOut,
	onAuthStateChanged,
	type User,
} from "firebase/auth";
import { auth } from "./config";

const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle() {
	return signInWithPopup(auth, googleProvider);
}

export async function signOut() {
	return firebaseSignOut(auth);
}

export function onAuthChange(callback: (user: User | null) => void) {
	return onAuthStateChanged(auth, callback);
}
