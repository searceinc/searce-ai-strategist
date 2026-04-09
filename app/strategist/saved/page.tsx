"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Star, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useStrategistStore } from "@/lib/store/useStrategistStore";
import { fetchFavoriteSessions, fetchSessionById, toggleFavorite } from "@/lib/firebase/firestore";
import { HistoryCard } from "@/components/strategist";
import { normalizeGenerationInput } from "@/lib/default-generation-input";
import type { SessionSummary } from "@/lib/types";

export default function SavedSessionsPage() {
	const { user } = useAuthStore();
	const router = useRouter();
	const [favorites, setFavorites] = useState<SessionSummary[]>([]);
	const [loading, setLoading] = useState(true);

	const load = useCallback(async () => {
		if (!user) return;
		setLoading(true);
		try {
			const data = await fetchFavoriteSessions(user.uid);
			setFavorites(data);
		} catch {
			toast.error("Failed to load saved sessions");
		} finally {
			setLoading(false);
		}
	}, [user]);

	useEffect(() => {
		load();
	}, [load]);

	const handleOpen = useCallback(
		async (sessionId: string) => {
			try {
				const session = await fetchSessionById(sessionId);
				if (!session) return;
				const store = useStrategistStore.getState();
				store.setInput(normalizeGenerationInput(session.input));
				store.hydrateFromSavedSession(session);
				router.push("/strategist");
			} catch {
				toast.error("Failed to open session");
			}
		},
		[router],
	);

	const handleToggleFavorite = useCallback(
		async (id: string, currentFav: boolean) => {
			try {
				await toggleFavorite(id, !currentFav);
				await load();
				toast.success(currentFav ? "Removed from favorites" : "Added to favorites");
			} catch {
				toast.error("Failed to update");
			}
		},
		[load],
	);

	return (
		<div className="mx-auto max-w-6xl space-y-4">
			<h1 className="flex items-center gap-2 text-xl font-bold">
				<Star className="size-5 fill-yellow-400 text-yellow-400" />
				Saved Sessions
			</h1>

			{loading ? (
				<div className="flex items-center justify-center py-12">
					<Loader2 className="size-6 animate-spin text-primary" />
				</div>
			) : favorites.length === 0 ? (
				<div className="flex flex-col items-center gap-2 py-12 text-center">
					<Star className="size-8 text-muted-foreground/40" />
					<p className="text-sm text-muted-foreground">
						No saved sessions yet. Star sessions from Content History.
					</p>
				</div>
			) : (
				<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
					{favorites.map((s) => (
						<HistoryCard
							key={s.id}
							session={s}
							onOpen={handleOpen}
							onToggleFavorite={handleToggleFavorite}
						/>
					))}
				</div>
			)}
		</div>
	);
}
