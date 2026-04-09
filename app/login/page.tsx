"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import AuthForm from "@/app/login/AuthForm";

export default function LoginPage() {
	const { user, loading } = useAuthStore();
	const router = useRouter();

	useEffect(() => {
		if (!loading && user) {
			router.push("/");
		}
	}, [user, loading, router]);

	if (loading) {
		return (
			<div className="flex h-[calc(100vh-4rem)] items-center justify-center">
				<Loader2 className="size-8 animate-spin text-primary" />
			</div>
		);
	}

	if (user) return null;

	return (
		<main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
			<div className="w-full max-w-md space-y-6">
				<div className="text-center">
					<h1 className="text-3xl font-bold tracking-tight">Searce AI Strategist</h1>
					<p className="mt-1 text-sm text-muted-foreground">
						AI Content Strategy & Creation
					</p>
				</div>
				<AuthForm />
			</div>
		</main>
	);
}
