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
// Always show the account chooser. Without this, Chrome silently reuses whatever
// Google account the profile is already signed into, so a rep with a personal
// gmail active gets rejected by the allowlist without ever seeing a picker.
googleProvider.setCustomParameters({ prompt: "select_account" });

const ALLOWED_EMAILS = new Set<string>([
	"rushil.jariwala@searce.com",
	"dhyey.shah@searce.com",
	"manya.satbhaiya@searce.com",
	"iniya.rathinavelu@searce.com",
	"soumya.jakati@searce.com",
	"zeal.gandhi@searce.com",
	"prachi.dabhade@searce.com",
	"ishita.jain@searce.com",
	"mitali.vishwakarma@searce.com",
	"parth.kaintura@searce.com",
	"partha.das@searce.com",
	"rashmi.kavali@searce.com",
	"sagar.porwal@searce.com",
	"gaurav.desai@searce.com",
	"sidhartha.sharma@searce.com",
]);

function isAllowed(email: string | null | undefined): boolean {
	return !!email && ALLOWED_EMAILS.has(email.trim().toLowerCase());
}

export async function signInWithGoogle() {
	const cred = await signInWithPopup(auth, googleProvider);
	if (!isAllowed(cred.user.email)) {
		// onAuthChange's filter will delete the user + reset the store.
		// Name the rejected address: the usual cause is signing in with the wrong
		// Google account, and showing it turns a support ticket into a self-fix.
		throw new Error(
			`${cred.user.email ?? "This account"} is not authorized to access this app.`,
		);
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
