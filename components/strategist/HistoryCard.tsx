"use client";

import { Star, Clock, MapPin, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { confidenceLabel, confidenceColor } from "@/lib/constants";
import type { SessionSummary } from "@/lib/types";

interface HistoryCardProps {
	session: SessionSummary;
	onOpen: (id: string) => void;
	onToggleFavorite: (id: string, current: boolean) => void;
}

export default function HistoryCard({ session, onOpen, onToggleFavorite }: HistoryCardProps) {
	const formatLabel = session.selectedFormat.replace(/_/g, " ");
	const serviceLabel = session.selectedService
		? session.selectedService.replace(/_/g, " ")
		: "Auto";

	const confLabel = confidenceLabel(session.confidenceScore);
	const confClr = confidenceColor(session.confidenceScore);

	const createdDate =
		typeof session.createdAt === "string"
			? new Date(session.createdAt)
			: (session.createdAt?.toDate?.() ?? new Date());

	return (
		<Card className="group transition-shadow hover:ring-2 hover:ring-primary/20">
			<CardContent className="flex flex-col gap-3 pt-4">
				<div className="flex items-start justify-between">
					<div className="space-y-1">
						<h3 className="font-semibold leading-tight">
							{session.targetCompany || serviceLabel || "Industry Campaign"}
						</h3>
						<p className="text-xs text-muted-foreground">
							{session.targetPersonaJobTitle || session.region || "General audience"}
						</p>
					</div>
					<Button
						variant="ghost"
						size="icon"
						className="size-7 cursor-pointer"
						onClick={() => onToggleFavorite(session.id, session.isFavorite)}
					>
						<Star
							className={cn(
								"size-4",
								session.isFavorite
									? "fill-yellow-400 text-yellow-400"
									: "text-muted-foreground",
							)}
						/>
					</Button>
				</div>

				<div className="flex flex-wrap gap-1.5">
					<Badge variant="secondary" className="text-xs capitalize">
						{formatLabel}
					</Badge>
					<Badge variant="outline" className="text-xs capitalize">
						{serviceLabel}
					</Badge>
				</div>

				<p className="line-clamp-2 text-sm text-muted-foreground">
					{session.contentPreview || "No preview available"}
				</p>

				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3 text-xs text-muted-foreground">
						<span className="flex items-center gap-1">
							<Clock className="size-3" />
							{createdDate.toLocaleDateString("en-US", {
								month: "short",
								day: "numeric",
							})}
						</span>
						<span className="flex items-center gap-1">
							<MapPin className="size-3" />
							{session.region}
						</span>
						<span className={cn("font-medium", confClr)}>{confLabel}</span>
					</div>

					<Button
						variant="ghost"
						size="sm"
						className="h-7 cursor-pointer text-xs opacity-0 group-hover:opacity-100 transition-opacity"
						onClick={() => onOpen(session.id)}
					>
						Open
						<ArrowRight className="size-3" />
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
