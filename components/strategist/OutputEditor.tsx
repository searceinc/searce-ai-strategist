"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
	Copy,
	Download,
	Save,
	Check,
	RefreshCw,
	Loader2,
	FileText,
	Sparkles,
	Pencil,
	Eye,
	ChevronLeft,
	ChevronRight,
	Lightbulb,
	HelpCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { useStrategistStore } from "@/lib/store/useStrategistStore";
import { useAuthStore } from "@/lib/store/useAuthStore";
import {
	callRegenerateContent,
	fetchUserSessions,
	updateEditedContent,
	incrementExportCount,
} from "@/lib/firebase/firestore";
import { confidenceLabel } from "@/lib/constants";
import { strategistPanelCardClass } from "@/lib/strategist-panel";
import {
	parseGeneratedContent,
	type SubjectOption,
	type ParsedSection,
} from "@/lib/parse-generated-content";
import { MarkdownText } from "@/lib/render-markdown";
import { cn } from "@/lib/utils";

export default function OutputEditor() {
	const {
		generatedContent,
		editedContent,
		setEditedContent,
		currentSessionId,
		input,
		isGenerating,
		confidenceScore,
		setGenerating,
		setGenerationResult,
		setGenerationError,
		setSessions,
	} = useStrategistStore();
	const user = useAuthStore((s) => s.user);

	const [copied, setCopied] = useState(false);
	const [saving, setSaving] = useState(false);
	const [editMode, setEditMode] = useState(false);
	const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
	const [selectedSubjectLetter, setSelectedSubjectLetter] = useState<
		"A" | "B" | "C" | "D" | null
	>(null);

	const parsed = useMemo(() => parseGeneratedContent(editedContent), [editedContent]);
	const { sections, subjects, strategistNote } = parsed;

	// Keep activeSectionId in sync with parsed sections (e.g. when content changes).
	useEffect(() => {
		if (sections.length === 0) {
			setActiveSectionId(null);
			return;
		}
		if (!activeSectionId || !sections.some((s) => s.id === activeSectionId)) {
			setActiveSectionId(sections[0]!.id);
		}
	}, [sections, activeSectionId]);

	useEffect(() => {
		if (subjects.length === 0) {
			setSelectedSubjectLetter(null);
			return;
		}
		if (!selectedSubjectLetter || !subjects.some((s) => s.letter === selectedSubjectLetter)) {
			setSelectedSubjectLetter(subjects[0]!.letter);
		}
	}, [subjects, selectedSubjectLetter]);

	const handleCopy = useCallback(async () => {
		const activeSection = sections.find((s) => s.id === activeSectionId);
		const selectedSubject = subjects.find((s) => s.letter === selectedSubjectLetter);
		const parts: string[] = [];
		if (selectedSubject?.subject) {
			parts.push(`Subject: ${selectedSubject.subject}`);
			if (selectedSubject.preview) parts.push(`Preview: ${selectedSubject.preview}`);
			parts.push("");
		}
		if (activeSection?.body) {
			parts.push(activeSection.body);
		} else {
			parts.push(editedContent);
		}
		await navigator.clipboard.writeText(parts.join("\n"));
		setCopied(true);
		toast.success("Copied to clipboard");
		setTimeout(() => setCopied(false), 2000);
	}, [sections, subjects, activeSectionId, selectedSubjectLetter, editedContent]);

	const handleCopyAll = useCallback(async () => {
		await navigator.clipboard.writeText(editedContent);
		toast.success("Copied entire output");
	}, [editedContent]);

	const handleExport = useCallback(async () => {
		const blob = new Blob([editedContent], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${(input.targetCompany || "campaign").replace(/\s+/g, "-")}-${input.selectedFormat}.txt`;
		a.click();
		URL.revokeObjectURL(url);

		if (currentSessionId) {
			await incrementExportCount(currentSessionId);
		}
		toast.success("Exported");
	}, [editedContent, input.targetCompany, input.selectedFormat, currentSessionId]);

	const handleSave = useCallback(async () => {
		if (!currentSessionId) return;
		setSaving(true);
		try {
			await updateEditedContent(currentSessionId, editedContent);
			if (user) {
				try {
					const sessions = await fetchUserSessions(user.uid);
					setSessions(sessions);
				} catch {
					/* history list refresh is best-effort */
				}
			}
			toast.success("Saved");
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Unknown error";
			toast.error("Failed to save", { description: msg });
		} finally {
			setSaving(false);
		}
	}, [currentSessionId, editedContent, user, setSessions]);

	const handleRegenerate = useCallback(async () => {
		if (!currentSessionId) return;
		setGenerating(true);
		try {
			const result = await callRegenerateContent(currentSessionId, input);
			setGenerationResult({ ...result, sessionId: result.sessionId });
			toast.success("Content regenerated");
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Regeneration failed";
			setGenerationError(msg);
			toast.error(msg);
		}
	}, [currentSessionId, input, setGenerating, setGenerationResult, setGenerationError]);

	if (!generatedContent && !isGenerating) {
		return (
			<Card
				className={cn(
					strategistPanelCardClass,
					"flex h-full min-h-[min(24rem,42dvh)] items-center justify-center",
				)}
			>
				<div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
					<Sparkles className="size-10 text-muted-foreground/40" />
					<p className="text-sm text-muted-foreground">
						Generated content will appear here.
					</p>
					<p className="text-xs text-muted-foreground/60">
						Fill out the configuration and click Generate.
					</p>
				</div>
			</Card>
		);
	}

	if (isGenerating) {
		return (
			<Card
				className={cn(
					strategistPanelCardClass,
					"flex h-full min-h-[min(26rem,44dvh)] items-center justify-center",
				)}
			>
				<div className="flex flex-col items-center gap-4 px-6 py-12">
					<Loader2 className="size-8 animate-spin text-primary" />
					<div className="text-center">
						<p className="font-medium">Generating content…</p>
						<p className="mt-1 text-xs text-muted-foreground">
							Researching target account, finding proof points, crafting copy
						</p>
					</div>
				</div>
			</Card>
		);
	}

	const activeSection = sections.find((s) => s.id === activeSectionId) ?? sections[0];
	const isSequence = sections.length > 0 && sections.every((s) => s.id.startsWith("email-"));
	const sequenceIndex = isSequence ? sections.findIndex((s) => s.id === activeSectionId) : -1;

	function gotoSequence(delta: number) {
		if (!isSequence || sequenceIndex < 0) return;
		const next = sequenceIndex + delta;
		if (next < 0 || next >= sections.length) return;
		setActiveSectionId(sections[next]!.id);
	}

	return (
		<Card
			className={cn(
				strategistPanelCardClass,
				"flex h-full w-full min-h-[min(42rem,70dvh)] flex-col overflow-hidden",
			)}
		>
			<CardHeader className="shrink-0 border-b pb-3">
				<div className="flex items-center justify-between">
					<CardTitle className="flex items-center gap-2 text-base">
						<FileText className="size-4 text-primary" />
						Generated Content
					</CardTitle>
					<div className="flex items-center gap-1.5">
						<Badge variant="outline" className="text-xs">
							{confidenceLabel(confidenceScore)} confidence
						</Badge>
						<Button
							variant="ghost"
							size="sm"
							className="h-8 cursor-pointer"
							onClick={() => setEditMode((v) => !v)}
							title={editMode ? "Switch to preview" : "Edit raw text"}
						>
							{editMode ? (
								<>
									<Eye className="size-3.5" />
									Preview
								</>
							) : (
								<>
									<Pencil className="size-3.5" />
									Edit raw
								</>
							)}
						</Button>
						<Button
							variant="ghost"
							size="sm"
							className="h-8 cursor-pointer"
							onClick={handleRegenerate}
							disabled={isGenerating}
						>
							<RefreshCw className="size-3.5" />
							Regenerate
						</Button>
					</div>
				</div>
			</CardHeader>

			<CardContent className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden pt-4">
				<div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pr-1">
					{strategistNote && !editMode && <StrategistNoteCard text={strategistNote} />}

					{!editMode && subjects.length > 0 && (
						<SubjectOptions
							subjects={subjects}
							selected={selectedSubjectLetter}
							onSelect={setSelectedSubjectLetter}
						/>
					)}

					{editMode ? (
						<Textarea
							className="field-sizing-fixed min-h-[min(28rem,52dvh)] w-full resize-y overflow-y-auto text-sm leading-relaxed"
							value={editedContent}
							onChange={(e) => setEditedContent(e.target.value)}
						/>
					) : sections.length > 1 ? (
						<Tabs
							value={activeSectionId ?? sections[0]!.id}
							onValueChange={(v) => setActiveSectionId(v)}
							className="flex flex-col gap-3"
						>
							<div className="flex items-center justify-between gap-3">
								<TabsList variant="line" className="bg-transparent p-0">
									{sections.map((s) => (
										<TabsTrigger key={s.id} value={s.id} className="text-xs">
											{s.label}
										</TabsTrigger>
									))}
								</TabsList>

								{isSequence && sections.length > 1 && (
									<div className="flex items-center gap-1.5">
										<Button
											variant="ghost"
											size="sm"
											className="h-7 cursor-pointer"
											onClick={() => gotoSequence(-1)}
											disabled={sequenceIndex <= 0}
										>
											<ChevronLeft className="size-3.5" />
											Prev
										</Button>
										<span className="text-xs text-muted-foreground tabular-nums">
											{sequenceIndex + 1} / {sections.length}
										</span>
										<Button
											variant="ghost"
											size="sm"
											className="h-7 cursor-pointer"
											onClick={() => gotoSequence(1)}
											disabled={sequenceIndex >= sections.length - 1}
										>
											Next
											<ChevronRight className="size-3.5" />
										</Button>
									</div>
								)}
							</div>

							{sections.map((s) => (
								<TabsContent key={s.id} value={s.id} className="m-0">
									<RenderedSectionBody section={s} />
								</TabsContent>
							))}
						</Tabs>
					) : (
						<RenderedSectionBody section={activeSection} />
					)}
				</div>

				<div className="flex shrink-0 flex-wrap items-center gap-2 border-t pt-3">
					<Button
						variant="outline"
						size="sm"
						className="cursor-pointer"
						onClick={handleCopy}
					>
						{copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
						{copied ? "Copied" : "Copy current"}
					</Button>

					<Button
						variant="ghost"
						size="sm"
						className="cursor-pointer"
						onClick={handleCopyAll}
					>
						<Copy className="size-3.5" />
						Copy all
					</Button>

					<Button
						variant="outline"
						size="sm"
						className="cursor-pointer"
						onClick={handleExport}
					>
						<Download className="size-3.5" />
						Export
					</Button>

					<Button
						variant="default"
						size="sm"
						className="ml-auto cursor-pointer"
						onClick={handleSave}
						disabled={saving || !currentSessionId}
					>
						{saving ? (
							<Loader2 className="size-3.5 animate-spin" />
						) : (
							<Save className="size-3.5" />
						)}
						Save
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function StrategistNoteCard({ text }: { text: string }) {
	return (
		<div className="flex gap-3 rounded-lg border border-amber-200/70 bg-amber-50/60 p-3 dark:border-amber-900/50 dark:bg-amber-950/30">
			<Lightbulb className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
			<div className="min-w-0 flex-1">
				<div className="mb-1 flex items-center gap-1.5">
					<span className="text-xs font-semibold uppercase tracking-wide text-amber-900 dark:text-amber-200">
						Strategist Note
					</span>
					<Tooltip>
						<TooltipTrigger asChild>
							<button
								type="button"
								className="cursor-help text-amber-700/70 dark:text-amber-300/70"
							>
								<HelpCircle className="size-3.5" />
							</button>
						</TooltipTrigger>
						<TooltipContent side="top">
							Why the AI picked this angle, citing the specific signal that drove it.
							Useful for new reps learning the playbook.
						</TooltipContent>
					</Tooltip>
				</div>
				<MarkdownText text={text} className="text-amber-900/90 dark:text-amber-100/90" />
			</div>
		</div>
	);
}

function SubjectOptions({
	subjects,
	selected,
	onSelect,
}: {
	subjects: SubjectOption[];
	selected: "A" | "B" | "C" | "D" | null;
	onSelect: (letter: "A" | "B" | "C" | "D") => void;
}) {
	return (
		<div className="space-y-1.5">
			<div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
				Subject options (A/B testing)
				<Tooltip>
					<TooltipTrigger asChild>
						<button type="button" className="cursor-help">
							<HelpCircle className="size-3.5" />
						</button>
					</TooltipTrigger>
					<TooltipContent side="top">
						The AI proposes 3–4 subject + preview lines per email, each using a
						different angle (specific question, benefit, provocation, curiosity). Click
						one to make it the active subject for copy/export.
					</TooltipContent>
				</Tooltip>
			</div>
			<div className="grid gap-2 sm:grid-cols-2">
				{subjects.map((opt) => {
					const isActive = opt.letter === selected;
					return (
						<button
							key={opt.letter}
							type="button"
							onClick={() => onSelect(opt.letter)}
							className={cn(
								"flex flex-col gap-1 rounded-lg border-2 p-2.5 text-left transition-colors cursor-pointer",
								isActive
									? "border-primary bg-primary/5"
									: "border-border bg-background hover:bg-muted",
							)}
						>
							<div className="flex items-center gap-2">
								<Badge
									variant={isActive ? "default" : "secondary"}
									className="size-5 justify-center rounded-full p-0 text-[10px] font-bold"
								>
									{opt.letter}
								</Badge>
								<span className="text-sm font-medium leading-snug text-foreground">
									{opt.subject || (
										<em className="text-muted-foreground">(no subject)</em>
									)}
								</span>
							</div>
							{opt.preview && (
								<span className="text-xs leading-snug text-muted-foreground line-clamp-2 pl-7">
									{opt.preview}
								</span>
							)}
						</button>
					);
				})}
			</div>
		</div>
	);
}

function RenderedSectionBody({ section }: { section: ParsedSection | undefined }) {
	if (!section) {
		return <p className="text-sm text-muted-foreground">No content.</p>;
	}
	return (
		<div className="min-h-[min(24rem,46dvh)] w-full overflow-y-auto rounded-md border bg-background p-4">
			<MarkdownText text={section.body} />
		</div>
	);
}
