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
	LayoutGrid,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStrategistStore } from "@/lib/store/useStrategistStore";
import { confidenceLabel } from "@/lib/constants";
import { strategistPanelCardClass } from "@/lib/strategist-panel";
import { VERIFIED_SEARCE_LINKS } from "./research-data";
import { cn } from "@/lib/utils";

/** Tab body: tall minimum scroll area; grows with content if needed. */
const feedScrollRegionClass = "min-h-[min(32rem,48dvh)] w-full overflow-y-auto overscroll-contain";

export default function ResearchPanel() {
	const {
		research,
		caseStudyMatches: rawCaseStudies,
		fallbackPath,
		confidenceScore,
		transparencyNote,
		isGenerating,
		input,
	} = useStrategistStore();
	const caseStudyMatches = rawCaseStudies ?? [];

	if (isGenerating) {
		return <LoadingSkeleton />;
	}

	if (!research) {
		return <EmptyState />;
	}

	const confLabel = confidenceLabel(confidenceScore);
	const searceLinks = buildSearceLinks(input.targetPersonaIndustry);
	const metricsWithUrls = research.metricsWithUrls ?? [];
	const newsWithUrls = research.newsWithUrls ?? [];
	const painPointsWithUrls = research.painPointsWithUrls ?? [];
	const hasMetrics = metricsWithUrls.length > 0;
	const hasNews = newsWithUrls.length > 0;
	const hasPain = painPointsWithUrls.length > 0;
	const hasProof = caseStudyMatches.length > 0 || searceLinks.length > 0;

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
				defaultValue="overview"
				className="flex min-h-0 w-full flex-1 flex-col overflow-hidden"
			>
				<div className="shrink-0 border-b px-3 pt-1">
					<TabsList
						variant="line"
						className="h-auto w-full flex-wrap justify-start gap-1 bg-transparent p-0 pb-1.5"
					>
						<TabsTrigger value="overview" className="text-xs">
							<LayoutGrid className="size-3.5" />
							Overview
						</TabsTrigger>
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
					</TabsList>
				</div>

				<div className={feedScrollRegionClass}>
					<TabsContent value="overview" className="m-0 mt-0">
						<CardContent className="space-y-4 p-4">
							{transparencyNote && (
								<div className="rounded-lg border border-yellow-300/50 bg-yellow-50/50 p-3 dark:border-yellow-700/50 dark:bg-yellow-950/30">
									<p className="text-xs text-yellow-700 dark:text-yellow-300">
										{transparencyNote}
									</p>
								</div>
							)}

							<div className="grid gap-4 md:grid-cols-2">
								<div className="space-y-2 rounded-lg border bg-muted/20 p-3">
									<div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
										<TrendingUp className="size-3.5 text-primary" />
										Metrics snapshot
									</div>
									{hasMetrics ? (
										<ul className="space-y-2 text-sm">
											{metricsWithUrls.slice(0, 2).map((m, i) => (
												<li key={i} className="leading-snug">
													<a
														href={m.sourceUrl}
														target="_blank"
														rel="noopener noreferrer"
														className="text-foreground underline-offset-2 hover:underline"
													>
														{m.value.slice(0, 120)}
														{m.value.length > 120 ? "…" : ""}
													</a>
													<span className="mt-0.5 block font-mono text-[10px] text-muted-foreground">
														{m.source}
													</span>
												</li>
											))}
										</ul>
									) : (
										<p className="text-xs text-muted-foreground">
											No live metrics yet.
										</p>
									)}
								</div>

								<div className="space-y-2 rounded-lg border bg-muted/20 p-3">
									<div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
										<Newspaper className="size-3.5 text-primary" />
										Latest signal
									</div>
									{hasNews ? (
										<ul className="space-y-2">
											{newsWithUrls.slice(0, 2).map((n, i) => (
												<li key={i}>
													<a
														href={n.url}
														target="_blank"
														rel="noopener noreferrer"
														className="text-sm font-medium leading-snug text-foreground underline-offset-2 hover:underline line-clamp-2"
													>
														{n.title}
													</a>
												</li>
											))}
										</ul>
									) : (
										<p className="text-xs text-muted-foreground">
											No news hits.
										</p>
									)}
								</div>
							</div>

							<div className="grid gap-4 md:grid-cols-2">
								<div className="space-y-2 rounded-lg border bg-muted/20 p-3">
									<div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
										<AlertTriangle className="size-3.5 text-primary" />
										Pain themes
									</div>
									{hasPain ? (
										<ul className="space-y-1.5 text-sm">
											{painPointsWithUrls.slice(0, 2).map((p, i) => (
												<li
													key={i}
													className="leading-snug text-muted-foreground"
												>
													{p.text}
												</li>
											))}
										</ul>
									) : (
										<p className="text-xs text-muted-foreground">
											No pain signals.
										</p>
									)}
								</div>

								<div className="space-y-2 rounded-lg border bg-muted/20 p-3">
									<div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
										<CheckCircle2 className="size-3.5 text-primary" />
										Proof at a glance
									</div>
									{hasProof ? (
										<ul className="space-y-1.5 text-sm">
											{caseStudyMatches.slice(0, 2).map((cs) => (
												<li key={cs.id} className="truncate font-medium">
													<a
														href={cs.url}
														target="_blank"
														rel="noopener noreferrer"
														className="hover:underline"
													>
														{cs.title}
													</a>
												</li>
											))}
											{caseStudyMatches.length === 0 &&
												searceLinks.slice(0, 2).map((sl, i) => (
													<li key={i} className="truncate font-medium">
														<a
															href={sl.url}
															target="_blank"
															rel="noopener noreferrer"
															className="hover:underline"
														>
															{sl.title}
														</a>
													</li>
												))}
										</ul>
									) : (
										<p className="text-xs text-muted-foreground">
											No matched stories.
										</p>
									)}
								</div>
							</div>

							<p className="text-center text-[10px] text-muted-foreground">
								Use the tabs above for full lists and links.
							</p>
						</CardContent>
					</TabsContent>

					<TabsContent value="metrics" className="m-0 mt-0">
						<CardContent className="p-4">
							<FeedSection
								icon={TrendingUp}
								title={`${new Date().getFullYear()} industry metrics`}
							>
								<div className="space-y-2">
									{metricsWithUrls.map((metric, i) => (
										<a
											key={i}
											href={metric.sourceUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="block rounded-lg border bg-background p-3 transition-all hover:bg-accent hover:shadow-sm"
										>
											<p className="text-sm leading-relaxed text-foreground">
												{metric.value}
											</p>
											<div className="mt-2 flex items-center justify-between">
												<span className="max-w-[70%] truncate font-mono text-[10px] text-muted-foreground">
													{metric.source}
												</span>
												<ExternalLink className="size-3 text-muted-foreground" />
											</div>
										</a>
									))}
								</div>
							</FeedSection>
						</CardContent>
					</TabsContent>

					<TabsContent value="news" className="m-0 mt-0">
						<CardContent className="p-4">
							<FeedSection icon={Newspaper} title="News pulse">
								<div className="space-y-2">
									{newsWithUrls.slice(0, 4).map((news, i) => (
										<a
											key={i}
											href={news.url}
											target="_blank"
											rel="noopener noreferrer"
											className="flex items-start gap-2 rounded-lg border bg-background p-2.5 transition-all hover:bg-accent hover:shadow-sm"
										>
											<div className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
											<div className="min-w-0 flex-1">
												<p className="text-sm font-medium leading-snug text-foreground line-clamp-2">
													{news.title}
												</p>
												{news.content && (
													<p className="mt-1 text-xs text-muted-foreground line-clamp-2">
														{news.content}
													</p>
												)}
											</div>
											<ExternalLink className="mt-0.5 size-3 shrink-0 text-muted-foreground" />
										</a>
									))}
								</div>
							</FeedSection>
						</CardContent>
					</TabsContent>

					<TabsContent value="pain" className="m-0 mt-0">
						<CardContent className="p-4">
							<FeedSection icon={AlertTriangle} title="Industry pain points">
								<div className="space-y-2">
									{painPointsWithUrls.slice(0, 6).map((point, i) => (
										<a
											key={i}
											href={point.sourceUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="block rounded-lg border bg-background p-2.5 transition-all hover:bg-accent hover:shadow-sm"
										>
											<p className="text-sm text-foreground">{point.text}</p>
											<div className="mt-1.5 flex items-center justify-between">
												<span className="font-mono text-[10px] text-muted-foreground">
													{point.source}
												</span>
												<ExternalLink className="size-3 text-muted-foreground" />
											</div>
										</a>
									))}
								</div>
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
