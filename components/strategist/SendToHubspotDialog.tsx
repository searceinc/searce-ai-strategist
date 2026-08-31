"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { pushToHubspotDrafts } from "@/lib/firebase/firestore";
import type { ExportTouch } from "@/lib/parse-generated-content";
import { cn } from "@/lib/utils";

interface SendToHubspotDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/** Every touch in the current output, in order. */
	touches: ExportTouch[];
	/** Index of the email the rep is currently looking at — the default selection. */
	activeTouchIndex: number;
	targetCompany: string;
	format: string;
}

/**
 * Picker for the HubSpot push.
 *
 * Previously "Send to HubSpot" pushed every EMAIL N block in one go, so a
 * 5-email sequence silently created 5 drafts. Reps asked to choose which
 * email(s) get imported, so this defaults to just the email they are viewing
 * and makes "all" an explicit action.
 *
 * The per-touch subject picker exists because each email carries its own A-D
 * subject/preview variants, and the editor's subject chips only ever show the
 * last email's options for a sequence.
 */
export default function SendToHubspotDialog({
	open,
	onOpenChange,
	touches,
	activeTouchIndex,
	targetCompany,
	format,
}: SendToHubspotDialogProps) {
	const [selected, setSelected] = useState<Set<number>>(new Set());
	const [variant, setVariant] = useState<Record<number, number>>({});
	const [pushing, setPushing] = useState(false);

	// Re-seed each time the dialog opens so it always reflects the current
	// output rather than a stale selection from a previous generation.
	useEffect(() => {
		if (!open) return;
		const fallback =
			activeTouchIndex >= 0 && activeTouchIndex < touches.length ? activeTouchIndex : 0;
		setSelected(new Set(touches.length > 0 ? [fallback] : []));
		setVariant({});
	}, [open, activeTouchIndex, touches.length]);

	const allSelected = touches.length > 0 && selected.size === touches.length;

	const payload = useMemo(
		() =>
			[...selected]
				.sort((a, b) => a - b)
				.map((i) => {
					const touch = touches[i];
					if (!touch) return null;
					const opt = touch.subjectOptions[variant[i] ?? -1];
					return {
						subject: opt?.subject ?? touch.subject,
						preview: opt?.preview ?? touch.preview,
						body: touch.body,
					};
				})
				.filter((t): t is { subject: string; preview: string; body: string } => t !== null),
		[selected, variant, touches],
	);

	function toggle(index: number) {
		setSelected((prev) => {
			const next = new Set(prev);
			if (next.has(index)) next.delete(index);
			else next.add(index);
			return next;
		});
	}

	async function handlePush() {
		if (payload.length === 0) {
			toast.error("Pick at least one email to import.");
			return;
		}
		setPushing(true);
		try {
			const { created, failed } = await pushToHubspotDrafts({
				touches: payload,
				targetCompany,
				format,
			});

			created.forEach((draft, i) => {
				toast.success(`Draft ${i + 1} of ${created.length} created in HubSpot`, {
					description: "Unpublished — assign a contact and send from HubSpot.",
					action: {
						label: "Open",
						onClick: () => window.open(draft.url, "_blank", "noopener"),
					},
				});
			});

			// Surfaced rather than swallowed: the drafts that did land are real and
			// the rep needs to know which ones to retry.
			(failed ?? []).forEach((f) => {
				toast.error(`HubSpot rejected "${f.subject || "untitled"}"`, {
					description: f.error,
				});
			});

			if (created.length > 0) onOpenChange(false);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Failed to send to HubSpot");
		} finally {
			setPushing(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-xl">
				<DialogHeader>
					<DialogTitle>Import to HubSpot</DialogTitle>
					<DialogDescription>
						Creates one unpublished draft marketing email per selected item. Nothing is
						sent — you assign a contact and send from HubSpot.
					</DialogDescription>
				</DialogHeader>

				<div className="flex items-center justify-between">
					<p className="text-xs text-muted-foreground">
						{selected.size} of {touches.length} selected
					</p>
					<Button
						variant="ghost"
						size="sm"
						className="h-7 cursor-pointer text-xs"
						onClick={() =>
							setSelected(allSelected ? new Set() : new Set(touches.map((_, i) => i)))
						}
					>
						{allSelected ? "Clear all" : "Select all"}
					</Button>
				</div>

				<div className="max-h-[45vh] space-y-2 overflow-y-auto pr-1">
					{touches.map((touch, i) => {
						const isOn = selected.has(i);
						const chosenIdx = variant[i] ?? -1;
						const chosen = touch.subjectOptions[chosenIdx];
						return (
							<div
								key={`${touch.label}-${i}`}
								className={cn(
									"rounded-lg border-2 p-3 transition-colors",
									isOn ? "border-primary bg-primary/5" : "border-border",
								)}
							>
								<label className="flex cursor-pointer items-start gap-2">
									<input
										type="checkbox"
										checked={isOn}
										onChange={() => toggle(i)}
										className="mt-1 size-4 cursor-pointer"
									/>
									<span className="min-w-0 flex-1">
										<span className="flex items-center gap-2">
											<Badge variant="secondary" className="text-[10px]">
												{touch.label}
											</Badge>
											<span className="truncate text-sm font-medium">
												{chosen?.subject || touch.subject || "(no subject)"}
											</span>
										</span>
										{(chosen?.preview || touch.preview) && (
											<span className="mt-0.5 block text-xs text-muted-foreground">
												{chosen?.preview || touch.preview}
											</span>
										)}
									</span>
								</label>

								{touch.subjectOptions.length > 1 && (
									<div className="mt-2 flex flex-wrap items-center gap-1 pl-6">
										<span className="text-[10px] uppercase tracking-wider text-muted-foreground">
											Subject
										</span>
										{touch.subjectOptions.map((opt, oi) => (
											<Button
												key={opt.letter}
												type="button"
												variant={
													(chosenIdx === -1 ? 0 : chosenIdx) === oi
														? "default"
														: "outline"
												}
												size="sm"
												className="size-6 cursor-pointer p-0 text-[10px]"
												onClick={() =>
													setVariant((prev) => ({ ...prev, [i]: oi }))
												}
											>
												{opt.letter}
											</Button>
										))}
									</div>
								)}
							</div>
						);
					})}
				</div>

				<DialogFooter>
					<Button
						variant="outline"
						className="cursor-pointer"
						onClick={() => onOpenChange(false)}
						disabled={pushing}
					>
						Cancel
					</Button>
					<Button
						className="cursor-pointer"
						onClick={handlePush}
						disabled={pushing || selected.size === 0}
					>
						{pushing ? (
							<Loader2 className="size-4 animate-spin" />
						) : (
							<Send className="size-4" />
						)}
						Import {selected.size > 0 ? selected.size : ""}{" "}
						{selected.size === 1 ? "email" : "emails"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
