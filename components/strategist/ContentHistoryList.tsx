"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { History, Loader2, Search, Star } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useStrategistStore } from "@/lib/store/useStrategistStore";
import { fetchUserSessions, toggleFavorite, fetchSessionById } from "@/lib/firebase/firestore";
import { normalizeGenerationInput } from "@/lib/default-generation-input";
import HistoryCard from "./HistoryCard";
import type { SessionSummary } from "@/lib/types";

export default function ContentHistoryList() {
	const { user } = useAuthStore();
	const { sessions, sessionsLoading, setSessions, setSessionsLoading } = useStrategistStore();
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState("");
	const [tab, setTab] = useState<"all" | "favorites">("all");

	const favorites = useMemo(() => sessions.filter((s) => s.isFavorite), [sessions]);

	const loadSessions = useCallback(async () => {
		if (!user) {
			useStrategistStore.setState({ sessions: [], sessionsLoading: false });
			return;
		}
		setSessionsLoading(true);
		try {
			const data = await fetchUserSessions(user.uid);
			setSessions(data);
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Unknown error";
			toast.error("Failed to load history", { description: msg });
			setSessionsLoading(false);
		}
	}, [user, setSessions, setSessionsLoading]);

	useEffect(() => {
		loadSessions();
	}, [loadSessions]);

	const handleOpen = useCallback(
		async (sessionId: string) => {
			try {
				const session = await fetchSessionById(sessionId);
				if (!session) {
					toast.error("Session not found");
					return;
				}
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
				await loadSessions();
				toast.success(currentFav ? "Removed from favorites" : "Added to favorites");
			} catch {
				toast.error("Failed to update favorite");
			}
		},
		[loadSessions],
	);

	const activeList = tab === "favorites" ? favorites : sessions;
	const filtered = searchQuery
		? activeList.filter(
				(s) =>
					s.targetCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
					s.targetPersonaJobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
					s.region.toLowerCase().includes(searchQuery.toLowerCase()),
			)
		: activeList;

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h1 className="flex items-center gap-2 text-xl font-bold">
					<History className="size-5 text-primary" />
					Content History
				</h1>
				<Button
					variant="outline"
					size="sm"
					onClick={loadSessions}
					className="cursor-pointer"
				>
					Refresh
				</Button>
			</div>

			<div className="relative">
				<Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					className="pl-9"
					placeholder="Search by company, title, or region…"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
			</div>

			<Tabs value={tab} onValueChange={(v) => setTab(v as "all" | "favorites")}>
				<TabsList>
					<TabsTrigger value="all" className="cursor-pointer">
						All
					</TabsTrigger>
					<TabsTrigger value="favorites" className="cursor-pointer">
						<Star className="mr-1 size-3" />
						Favorites
					</TabsTrigger>
				</TabsList>

				<TabsContent value="all" className="mt-4">
					<SessionGrid
						sessions={filtered}
						loading={sessionsLoading}
						onOpen={handleOpen}
						onToggleFavorite={handleToggleFavorite}
					/>
				</TabsContent>

				<TabsContent value="favorites" className="mt-4">
					<SessionGrid
						sessions={filtered}
						loading={false}
						onOpen={handleOpen}
						onToggleFavorite={handleToggleFavorite}
						emptyMessage="No favorites yet. Star sessions to save them here."
					/>
				</TabsContent>
			</Tabs>
		</div>
	);
}

function SessionGrid({
	sessions,
	loading,
	onOpen,
	onToggleFavorite,
	emptyMessage = "No sessions found.",
}: {
	sessions: SessionSummary[];
	loading: boolean;
	onOpen: (id: string) => void;
	onToggleFavorite: (id: string, current: boolean) => void;
	emptyMessage?: string;
}) {
	if (loading) {
		return (
			<div className="flex items-center justify-center py-12">
				<Loader2 className="size-6 animate-spin text-primary" />
			</div>
		);
	}

	if (sessions.length === 0) {
		return (
			<div className="flex flex-col items-center gap-2 py-12 text-center">
				<History className="size-8 text-muted-foreground/40" />
				<p className="text-sm text-muted-foreground">{emptyMessage}</p>
			</div>
		);
	}

	return (
		<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
			{sessions.map((s) => (
				<HistoryCard
					key={s.id}
					session={s}
					onOpen={onOpen}
					onToggleFavorite={onToggleFavorite}
				/>
			))}
		</div>
	);
}
