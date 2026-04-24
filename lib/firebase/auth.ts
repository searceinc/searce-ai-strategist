import {
	signInWithPopup,
	GoogleAuthProvider,
	signOut as firebaseSignOut,
	onAuthStateChanged,
	type User,
	deleteUser,
} from "firebase/auth";
import { auth } from "./config";

const googleProvider = new GoogleAuthProvider();

const ALLOWED_EMAILS = new Set<string>([
	"rushil.jariwala@searce.com",
	"dhyey.shah@searce.com",
	"manya.satbhaiya@searce.com",
	"sambit.swain@searce.com",
	"soumya.jakati@searce.com",
	"zeal.gandhi@searce.com",
	"prachi.dabhade@searce.com",
]);

function isAllowed(email: string | null | undefined): boolean {
	return !!email && ALLOWED_EMAILS.has(email.trim().toLowerCase());
}

export async function signInWithGoogle() {
	const cred = await signInWithPopup(auth, googleProvider);
	if (!isAllowed(cred.user.email)) {
		// onAuthChange's filter will delete the user + reset the store.
		throw new Error("This account is not authorized to access this app.");
	}
	return cred;
}

export async function signOut() {
	return firebaseSignOut(auth);
}

export function onAuthChange(callback: (user: User | null) => void) {
	return onAuthStateChanged(auth, async (firebaseUser) => {
		if (!firebaseUser) {
			callback(null);
			return;
		}
		if (!isAllowed(firebaseUser.email)) {
			try {
				await deleteUser(firebaseUser);
			} catch {
				await firebaseSignOut(auth);
			}
			callback(null); // store sees null, never the bad user
			return;
		}
		callback(firebaseUser);
	});
}
