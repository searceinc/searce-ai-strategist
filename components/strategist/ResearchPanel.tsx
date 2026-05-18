"use client";

import {
	TrendingUp,
	ExternalLink,
	Newspaper,
	AlertTriangle,
	Activity,
	CheckCircle2,
	Zap,
	Link2,
	MousePointerClick,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStrategistStore } from "@/lib/store/useStrategistStore";
import { confidenceLabel } from "@/lib/constants";
import { strategistPanelCardClass } from "@/lib/strategist-panel";
import { VERIFIED_SEARCE_LINKS } from "./research-data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { callGenerateContent, callRegenerateContent } from "@/lib/firebase/firestore";

/** Tab body: tall minimum scroll area; grows with content if needed. */
const feedScrollRegionClass = "min-h-[min(32rem,48dvh)] w-full overflow-y-auto overscroll-contain";

export default function ResearchPanel() {
	const {
		research,
		caseStudyMatches: rawCaseStudies,
		fallbackPath,
		confidenceScore,
		isGenerating,
		input,
		currentSessionId,
		setGenerating,
		setGenerationResult,
		setGenerationError,
	} = useStrategistStore();
	const caseStudyMatches = rawCaseStudies ?? [];

	if (isGenerating) {
		return <LoadingSkeleton />;
	}

	if (!research) {
		return <EmptyState />;
	}

	async function runFeedFocusedRewrite(signal: string) {
		const trimmed = signal.trim();
		if (!trimmed) return;
		setGenerating(true);
		try {
			const payload = { ...input, intelligenceFeedFocus: trimmed };
			const result = currentSessionId
				? await callRegenerateContent(currentSessionId, payload)
				: await callGenerateContent(payload);
			if (result.featureNotAvailable) {
				setGenerationError(result.noMatchMessage ?? "No matching case studies found.");
				toast.error(
					result.noMatchMessage ??
						"No matching case studies. Enable Intelligent Fallback.",
				);
				return;
			}
			setGenerationResult({ ...result, sessionId: result.sessionId });
			toast.success("Email refocused on that signal");
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Update failed";
			setGenerationError(msg);
			toast.error(msg);
		}
	}

	const confLabel = confidenceLabel(confidenceScore);
	const searceLinks = buildSearceLinks(input.targetPersonaIndustry);
	const metricsWithUrls = research.metricsWithUrls ?? [];
	const newsWithUrls = research.newsWithUrls ?? [];
	const painPointsWithUrls = research.painPointsWithUrls ?? [];
	const externalSources = research.externalSources ?? [];
	const hasMetrics = metricsWithUrls.length > 0;
	const hasNews = newsWithUrls.length > 0;
	const hasPain = painPointsWithUrls.length > 0;
	const hasProof = caseStudyMatches.length > 0 || searceLinks.length > 0;
	const hasExternal = externalSources.length > 0;

	return (
		<Card
			className={cn(
				strategistPanelCardClass,
				"flex w-full min-h-[min(38rem,56dvh)] min-w-0 flex-col gap-2 overflow-hidden",
			)}
		>
			<CardHeader className="shrink-0 border-b pb-2">
				<div className="flex flex-wrap items-center justify-between gap-2">
					<div className="flex items-center gap-2">
						<Activity className="size-5 text-primary" />
						<CardTitle className="text-base font-bold">Intelligence Feed</CardTitle>
					</div>
					<div className="flex flex-wrap items-center gap-2">
						<Badge
							variant={research.isLiveData ? "default" : "secondary"}
							className="gap-1 px-2 py-0.5 font-mono text-[10px]"
						>
							{research.isLiveData ? (
								<>
									<Zap className="size-2.5" />
									LIVE
								</>
							) : (
								"CACHED"
							)}
						</Badge>
						<Badge
							variant={confLabel === "High" ? "default" : "secondary"}
							className="text-[10px]"
						>
							{confLabel}
						</Badge>
						{fallbackPath !== "exact_match" && fallbackPath !== "none" && (
							<Badge variant="outline" className="text-[10px]">
								{fallbackPath.replace(/_/g, " ")}
							</Badge>
						)}
					</div>
				</div>
			</CardHeader>

			<Tabs
				defaultValue="metrics"
				className="flex min-h-0 w-full flex-1 flex-col overflow-hidden"
			>
				<div className="shrink-0 border-b px-3 pt-1">
					<TabsList
						variant="line"
						className="h-auto w-full flex-wrap justify-start gap-1 bg-transparent p-0 pb-1.5"
					>
						<TabsTrigger value="metrics" className="text-xs" disabled={!hasMetrics}>
							Metrics
							{hasMetrics && (
								<span className="ml-1 rounded-full bg-muted px-1.5 py-px text-[10px] tabular-nums">
									{metricsWithUrls.length}
								</span>
							)}
						</TabsTrigger>
						<TabsTrigger value="news" className="text-xs" disabled={!hasNews}>
							News
							{hasNews && (
								<span className="ml-1 rounded-full bg-muted px-1.5 py-px text-[10px] tabular-nums">
									{newsWithUrls.length}
								</span>
							)}
						</TabsTrigger>
						<TabsTrigger value="pain" className="text-xs" disabled={!hasPain}>
							Pain points
							{hasPain && (
								<span className="ml-1 rounded-full bg-muted px-1.5 py-px text-[10px] tabular-nums">
									{painPointsWithUrls.length}
								</span>
							)}
						</TabsTrigger>
						<TabsTrigger value="proof" className="text-xs" disabled={!hasProof}>
							Proof
						</TabsTrigger>
						<TabsTrigger value="links" className="text-xs" disabled={!hasExternal}>
							External links
							{hasExternal && (
								<span className="ml-1 rounded-full bg-muted px-1.5 py-px text-[10px] tabular-nums">
									{externalSources.length}
								</span>
							)}
						</TabsTrigger>
					</TabsList>
				</div>

				<div className={feedScrollRegionClass}>
					<TabsContent value="metrics" className="m-0 mt-0">
						<CardContent className="p-4">
							<FeedSection
								icon={TrendingUp}
								title={`${new Date().getFullYear()} industry metrics`}
							>
								<div className="space-y-2">
									{metricsWithUrls.map((metric, i) => (
										<div
											key={i}
											className="rounded-lg border bg-background p-3 transition-all hover:bg-accent/40"
										>
											<p className="text-sm leading-relaxed text-foreground">
												{metric.value}
											</p>
											<div className="mt-2 flex flex-wrap items-center justify-between gap-2">
												<span className="max-w-[55%] truncate font-mono text-[10px] text-muted-foreground">
													{metric.source}
												</span>
												<div className="flex flex-wrap gap-1.5">
													<Button
														variant="outline"
														size="sm"
														className="h-8 px-2"
														asChild
													>
														<a
															href={metric.sourceUrl}
															target="_blank"
															rel="noopener noreferrer"
															className="gap-1"
														>
															<ExternalLink className="size-3.5" />
														</a>
													</Button>
												</div>
											</div>
										</div>
									))}
								</div>
							</FeedSection>
						</CardContent>
					</TabsContent>

					<TabsContent value="news" className="m-0 mt-0">
						<CardContent className="p-4">
							<FeedSection icon={Newspaper} title="News pulse">
								<div className="space-y-2">
									{newsWithUrls.map((news, i) => (
										<div
											key={i}
											className="flex flex-col gap-2 rounded-lg border bg-background p-3 transition-all hover:bg-accent/40"
										>
											<div className="flex gap-2">
												<div className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
												<div className="min-w-0 flex-1">
													<p className="text-sm font-medium leading-snug text-foreground">
														{news.title}
													</p>
													{news.content && (
														<p className="mt-1 text-xs text-muted-foreground line-clamp-3">
															{news.content}
														</p>
													)}
												</div>
											</div>
											<div className="flex flex-wrap justify-end gap-1.5">
												<Button
													variant="outline"
													size="sm"
													className="h-8 px-2"
													asChild
												>
													<a
														href={news.url}
														target="_blank"
														rel="noopener noreferrer"
													>
														<ExternalLink className="size-3.5" />
													</a>
												</Button>
											</div>
										</div>
									))}
								</div>
							</FeedSection>
						</CardContent>
					</TabsContent>

					<TabsContent value="pain" className="m-0 mt-0">
						<CardContent className="p-4">
							<FeedSection icon={AlertTriangle} title="Industry pain points">
								<div className="space-y-2">
									{painPointsWithUrls.map((point, i) => (
										<div
											key={i}
											className="rounded-lg border bg-background p-3 transition-all hover:bg-accent/40"
										>
											<p className="text-sm text-foreground">{point.text}</p>
											<div className="mt-2 flex flex-wrap items-center justify-between gap-2">
												<span className="font-mono text-[10px] text-muted-foreground">
													{point.source}
												</span>
												<div className="flex flex-wrap gap-1.5">
													<Button
														type="button"
														variant="secondary"
														size="sm"
														className="h-8 gap-1 px-2 text-xs"
														onClick={() =>
															void runFeedFocusedRewrite(
																`Pain point (from feed): ${point.text}`,
															)
														}
													>
														<MousePointerClick className="size-3.5" />
														Refocus email
													</Button>
													<Button
														variant="outline"
														size="sm"
														className="h-8 px-2"
														asChild
													>
														<a
															href={point.sourceUrl}
															target="_blank"
															rel="noopener noreferrer"
														>
															<ExternalLink className="size-3.5" />
														</a>
													</Button>
												</div>
											</div>
										</div>
									))}
								</div>
							</FeedSection>
						</CardContent>
					</TabsContent>

					<TabsContent value="links" className="m-0 mt-0">
						<CardContent className="p-4">
							<FeedSection icon={Link2} title="External links / sources">
								{hasExternal ? (
									<div className="space-y-4">
										{(["news", "metric", "pain", "reference"] as const).map(
											(kind) => {
												const group = externalSources.filter(
													(e) => e.kind === kind,
												);
												if (group.length === 0) return null;
												const label =
													kind === "news"
														? "News"
														: kind === "metric"
															? "Metrics"
															: kind === "pain"
																? "Pain research"
																: "Other sources";
												return (
													<div key={kind}>
														<p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
															{label}
														</p>
														<ul className="space-y-2">
															{group.map((ex, i) => (
																<li key={`${ex.url}-${i}`}>
																	<a
																		href={ex.url}
																		target="_blank"
																		rel="noopener noreferrer"
																		className="flex items-start gap-2 rounded-lg border bg-background p-2.5 text-sm leading-snug transition-all hover:bg-accent hover:shadow-sm"
																	>
																		<ExternalLink className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
																		<span className="min-w-0 text-foreground">
																			{ex.title}
																		</span>
																	</a>
																</li>
															))}
														</ul>
													</div>
												);
											},
										)}
									</div>
								) : (
									<p className="text-xs text-muted-foreground">
										No third-party links collected for this run.
									</p>
								)}
							</FeedSection>
						</CardContent>
					</TabsContent>

					<TabsContent value="proof" className="m-0 mt-0">
						<CardContent className="p-4">
							<FeedSection icon={CheckCircle2} title="Verified Searce stories">
								<div className="space-y-2">
									{caseStudyMatches.map((cs) => (
										<a
											key={cs.id}
											href={cs.url}
											target="_blank"
											rel="noopener noreferrer"
											className="block rounded-lg border bg-background p-3 transition-all hover:bg-accent hover:shadow-sm"
										>
											<div className="flex items-start justify-between gap-2">
												<div className="min-w-0 flex-1">
													<p className="truncate text-sm font-bold text-foreground">
														{cs.title}
													</p>
													<p className="mt-0.5 text-xs text-muted-foreground">
														{cs.metrics}
													</p>
												</div>
												<Link2 className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
											</div>
										</a>
									))}
									{searceLinks
										.filter(
											(sl) =>
												!caseStudyMatches.some((cs) => cs.url === sl.url),
										)
										.map((link, i) => (
											<a
												key={`sl-${i}`}
												href={link.url}
												target="_blank"
												rel="noopener noreferrer"
												className="block rounded-lg border bg-background p-3 transition-all hover:bg-accent hover:shadow-sm"
											>
												<div className="flex items-start justify-between gap-2">
													<div className="min-w-0 flex-1">
														<p className="truncate text-sm font-bold text-foreground">
															{link.title}
														</p>
														<p className="mt-0.5 text-xs text-muted-foreground">
															{link.metrics}
														</p>
													</div>
													<Link2 className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
												</div>
											</a>
										))}
								</div>
							</FeedSection>
						</CardContent>
					</TabsContent>
				</div>
			</Tabs>
		</Card>
	);
}

function FeedSection({
	icon: Icon,
	title,
	children,
}: {
	icon: React.ComponentType<{ className?: string }>;
	title: string;
	children: React.ReactNode;
}) {
	return (
		<section>
			<div className="mb-2 flex items-center gap-2">
				<Icon className="size-4 text-primary" />
				<h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
					{title}
				</h3>
			</div>
			{children}
		</section>
	);
}

function LoadingSkeleton() {
	return (
		<Card
			className={cn(
				strategistPanelCardClass,
				"flex w-full min-h-[min(36rem,52dvh)] min-w-0 flex-col gap-2 overflow-hidden",
			)}
		>
			<CardHeader className="shrink-0 border-b pb-2">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Skeleton className="size-5 rounded" />
						<Skeleton className="h-5 w-32" />
					</div>
					<Skeleton className="h-5 w-16" />
				</div>
			</CardHeader>
			<CardContent className={cn(feedScrollRegionClass, "space-y-5 p-4")}>
				{[1, 2, 3, 4].map((i) => (
					<div key={i} className="space-y-2">
						<Skeleton className="h-4 w-28" />
						<Skeleton className="h-20 w-full rounded-lg" />
						<Skeleton className="h-16 w-full rounded-lg" />
					</div>
				))}
			</CardContent>
		</Card>
	);
}

function EmptyState() {
	return (
		<Card
			className={cn(
				strategistPanelCardClass,
				"flex w-full min-h-[min(28rem,44dvh)] flex-col gap-2 overflow-hidden",
			)}
		>
			<CardHeader className="shrink-0 border-b pb-2">
				<div className="flex items-center gap-2">
					<Activity className="size-5 text-primary" />
					<CardTitle className="text-base font-bold">Intelligence Feed</CardTitle>
				</div>
			</CardHeader>
			<CardContent className="flex flex-1 flex-col items-center justify-center px-6 py-10">
				<div className="text-center">
					<Zap className="mx-auto mb-3 size-12 text-muted-foreground/30" />
					<p className="text-sm font-medium">Ready for research</p>
					<p className="mt-1 text-xs text-muted-foreground">
						Configure your target and generate to see real-time Tavily intelligence
					</p>
				</div>
			</CardContent>
		</Card>
	);
}

function buildSearceLinks(industryCode: string) {
	return VERIFIED_SEARCE_LINKS[industryCode] ?? [];
}
