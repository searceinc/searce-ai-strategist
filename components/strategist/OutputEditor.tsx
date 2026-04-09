"use client";

import { useCallback, useState } from "react";
import { Copy, Download, Save, Check, RefreshCw, Loader2, FileText, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

	const handleCopy = useCallback(async () => {
		await navigator.clipboard.writeText(editedContent);
		setCopied(true);
		toast.success("Copied to clipboard");
		setTimeout(() => setCopied(false), 2000);
	}, [editedContent]);

	const handleExport = useCallback(async () => {
		const blob = new Blob([editedContent], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${input.targetCompany.replace(/\s+/g, "-")}-${input.selectedFormat}.txt`;
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
					"flex min-h-[min(24rem,42dvh)] items-center justify-center",
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
					"flex min-h-[min(26rem,44dvh)] items-center justify-center",
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

	return (
		<Card
			className={cn(
				strategistPanelCardClass,
				"flex w-full min-h-[min(42rem,70dvh)] flex-col overflow-hidden",
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
							onClick={handleRegenerate}
							disabled={isGenerating}
						>
							<RefreshCw className="size-3.5" />
							Regenerate
						</Button>
					</div>
				</div>
			</CardHeader>

			<CardContent className="flex flex-col gap-3 pt-4">
				<Textarea
					className="field-sizing-fixed min-h-[min(28rem,52dvh)] w-full resize-y overflow-y-auto font-mono text-sm leading-relaxed"
					value={editedContent}
					onChange={(e) => setEditedContent(e.target.value)}
				/>

				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						className="cursor-pointer"
						onClick={handleCopy}
					>
						{copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
						{copied ? "Copied" : "Copy"}
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
						className="cursor-pointer"
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
