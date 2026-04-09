"use client";

import { useEffect } from "react";
import { onAuthChange } from "@/lib/firebase/auth";
import { useAuthStore } from "@/lib/store/useAuthStore";

export default function AuthListener() {
	const { setUser, setLoading } = useAuthStore();

	useEffect(() => {
		const unsubscribe = onAuthChange((firebaseUser) => {
			setUser(firebaseUser);
			setLoading(false);
		});
		return unsubscribe;
	}, [setUser, setLoading]);

	return null;
}
