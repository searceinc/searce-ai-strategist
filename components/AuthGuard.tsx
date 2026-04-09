"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";

export default function AuthGuard({ children }: { children: ReactNode }) {
	const { user, loading } = useAuthStore();
	const router = useRouter();

	useEffect(() => {
		if (!loading && !user) {
			router.push("/login");
		}
	}, [user, loading, router]);

	if (loading) {
		return (
			<div className="flex h-screen w-full items-center justify-center bg-background">
				<div className="flex flex-col items-center gap-4">
					<Loader2 className="size-8 animate-spin text-primary" />
					<p className="text-sm text-muted-foreground">Loading...</p>
				</div>
			</div>
		);
	}

	if (!user) return null;

	return <>{children}</>;
}
