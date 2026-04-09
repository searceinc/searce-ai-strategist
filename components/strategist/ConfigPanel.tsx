"use client";

import { useEffect } from "react";
import {
	Building2,
	Globe,
	Link2,
	User,
	Briefcase,
	MapPin,
	Settings2,
	FileText,
	StickyNote,
	Loader2,
	Sparkles,
	Cloud,
	Target,
	Shield,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStrategistStore } from "@/lib/store/useStrategistStore";
import { callGenerateContent, callRegenerateContent } from "@/lib/firebase/firestore";
import {
	CONTENT_FORMATS,
	EMAIL_SEQUENCE_LENGTH_OPTIONS,
	LINKEDIN_INMAIL_VARIATION_OPTIONS,
	NURTURE_TEMPLATE_OPTIONS,
	SEARCE_SERVICES,
	REGIONS,
	PERSONA_FUNCTIONS,
	INDUSTRIES,
	SUB_FUNCTIONS,
	CLOUD_ECOSYSTEMS,
	STRATEGIC_ANGLES,
} from "@/lib/constants";
import type {
	ContentFormat,
	EmailSequenceLength,
	SearceService,
	StrategicAngle,
} from "@/lib/types";

/** SelectTrigger applies row flex to SelectValue by default; use this for label + subtitle stacks. */
const stackedSelectTriggerClass =
	"w-full h-auto min-h-10 whitespace-normal py-2.5 text-left [&_[data-slot=select-value]]:!line-clamp-none [&_[data-slot=select-value]]:!flex [&_[data-slot=select-value]]:!flex-col [&_[data-slot=select-value]]:!items-start [&_[data-slot=select-value]]:gap-0.5 [&_[data-slot=select-value]]:text-left [&_[data-slot=select-value]]:leading-tight data-[size=default]:!h-auto";

const stackedSelectItemClass = "items-start py-2";

export default function ConfigPanel() {
	const {
		input,
		setInput,
		isGenerating,
		currentSessionId,
		setGenerating,
		setGenerationResult,
		setGenerationError,
	} = useStrategistStore();

	useEffect(() => {
		if (input.targetPersonaFunction) {
			const subs = SUB_FUNCTIONS[input.targetPersonaFunction];
			if (subs) {
				const validValues = subs.map((s) => s.value);
				if (!validValues.includes(input.targetPersonaSubFunction)) {
					setInput({ targetPersonaSubFunction: "" });
				}
			} else {
				setInput({ targetPersonaSubFunction: "" });
			}
		}
	}, [input.targetPersonaFunction]); // eslint-disable-line react-hooks/exhaustive-deps

	const canGenerate =
		input.targetCompany.trim() &&
		input.targetPersonaIndustry.trim() &&
		input.targetPersonaFunction.trim() &&
		input.targetPersonaJobTitle.trim() &&
		input.region.trim() &&
		input.selectedService.trim();

	async function handleGenerate() {
		if (!canGenerate) {
			toast.error("Fill in all required fields");
			return;
		}

		setGenerating(true);

		try {
			let result;
			if (currentSessionId) {
				result = await callRegenerateContent(currentSessionId, input);
			} else {
				result = await callGenerateContent(input);
			}

			if (result.featureNotAvailable) {
				setGenerationError(result.noMatchMessage ?? "No matching case studies found.");
				toast.error(
					result.noMatchMessage ??
						"No matching case studies. Enable Intelligent Fallback.",
				);
				return;
			}

			setGenerationResult({ ...result, sessionId: result.sessionId });
			toast.success("Content generated successfully");
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Generation failed";
			setGenerationError(msg);
			toast.error(msg);
		}
	}

	const currentSubFunctions = SUB_FUNCTIONS[input.targetPersonaFunction] ?? [];

	return (
		<Card className="flex h-full flex-col overflow-hidden">
			<CardHeader className="shrink-0 border-b">
				<CardTitle className="flex items-center gap-2 text-base">
					<Settings2 className="size-4 text-primary" />
					Configuration
				</CardTitle>
				<p className="text-xs text-muted-foreground">Target your prospect with precision</p>
			</CardHeader>

			<div className="min-h-0 flex-1 overflow-y-auto">
				<CardContent className="space-y-5 pt-4">
					{/* ── Company Intel ── */}
					<fieldset className="space-y-3">
						<legend className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
							<Building2 className="size-3.5" />
							Company Intel
						</legend>

						<FormField icon={Building2} label="Company Name" required>
							<Input
								placeholder="e.g. Acme Corp"
								value={input.targetCompany}
								onChange={(e) => setInput({ targetCompany: e.target.value })}
							/>
						</FormField>

						<FormField icon={Globe} label="Website / Domain">
							<Input
								placeholder="e.g. acmecorp.com"
								value={input.targetDomain}
								onChange={(e) => setInput({ targetDomain: e.target.value })}
							/>
						</FormField>

						<FormField icon={Link2} label="LinkedIn URL">
							<Input
								placeholder="e.g. linkedin.com/company/acme"
								value={input.targetLinkedInUrl}
								onChange={(e) => setInput({ targetLinkedInUrl: e.target.value })}
							/>
						</FormField>
					</fieldset>

					<Separator />

					{/* ── Target Persona ── */}
					<fieldset className="space-y-3">
						<legend className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
							<User className="size-3.5" />
							Target Persona
						</legend>

						<FormField icon={Briefcase} label="Industry" required>
							<Select
								value={input.targetPersonaIndustry}
								onValueChange={(v) => setInput({ targetPersonaIndustry: v })}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select industry" />
								</SelectTrigger>
								<SelectContent>
									{INDUSTRIES.map((i) => (
										<SelectItem key={i.value} value={i.value}>
											{i.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</FormField>

						<FormField icon={User} label="Function" required>
							<Select
								value={input.targetPersonaFunction}
								onValueChange={(v) => setInput({ targetPersonaFunction: v })}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select function" />
								</SelectTrigger>
								<SelectContent>
									{PERSONA_FUNCTIONS.map((f) => (
										<SelectItem key={f.value} value={f.value}>
											{f.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</FormField>

						{currentSubFunctions.length > 0 && (
							<FormField icon={User} label="Sub-Function">
								<Select
									value={input.targetPersonaSubFunction}
									onValueChange={(v) => setInput({ targetPersonaSubFunction: v })}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select sub-function" />
									</SelectTrigger>
									<SelectContent>
										{currentSubFunctions.map((sf) => (
											<SelectItem key={sf.value} value={sf.value}>
												{sf.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</FormField>
						)}

						<FormField icon={User} label="Job Title" required>
							<Input
								placeholder="e.g. VP of Engineering"
								value={input.targetPersonaJobTitle}
								onChange={(e) =>
									setInput({ targetPersonaJobTitle: e.target.value })
								}
							/>
						</FormField>
					</fieldset>

					<Separator />

					{/* ── Region ── */}
					<fieldset className="space-y-3">
						<legend className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
							<MapPin className="size-3.5" />
							Target Region
						</legend>

						<FormField icon={MapPin} label="Region" required>
							<Select
								value={input.region}
								onValueChange={(v) => setInput({ region: v })}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select region" />
								</SelectTrigger>
								<SelectContent>
									{REGIONS.map((r) => (
										<SelectItem key={r.value} value={r.value}>
											{r.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</FormField>
					</fieldset>

					<Separator />

					{/* ── Searce Service ── */}
					<fieldset className="space-y-3">
						<legend className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
							<Briefcase className="size-3.5" />
							Searce Service
						</legend>

						<FormField icon={Settings2} label="Service" required>
							<Select
								value={input.selectedService}
								onValueChange={(v) =>
									setInput({ selectedService: v as SearceService })
								}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select service" />
								</SelectTrigger>
								<SelectContent>
									{SEARCE_SERVICES.map((s) => (
										<SelectItem key={s.value} value={s.value}>
											{s.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</FormField>
					</fieldset>

					<Separator />

					{/* ── Cloud Ecosystem ── */}
					<fieldset className="space-y-3">
						<legend className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
							<Cloud className="size-3.5" />
							Cloud Ecosystem
						</legend>

						<div className="flex gap-2">
							{CLOUD_ECOSYSTEMS.map((eco) => (
								<button
									key={eco.value}
									type="button"
									onClick={() => setInput({ cloudEcosystem: eco.value })}
									className={`flex-1 cursor-pointer rounded-md border-2 px-3 py-2 text-xs font-medium transition-colors ${
										input.cloudEcosystem === eco.value
											? "border-primary bg-primary text-primary-foreground"
											: "border-border bg-background hover:bg-muted"
									}`}
								>
									<span className="mr-1">{eco.icon}</span>
									{eco.label}
								</button>
							))}
						</div>
					</fieldset>

					<Separator />

					{/* ── Strategic Angle ── */}
					<fieldset className="space-y-3">
						<legend className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
							<Target className="size-3.5" />
							Strategic Angle
						</legend>

						<div className="grid grid-cols-2 gap-2">
							{STRATEGIC_ANGLES.map((angle) => (
								<button
									key={angle.value}
									type="button"
									onClick={() =>
										setInput({ strategicAngle: angle.value as StrategicAngle })
									}
									className={`cursor-pointer rounded-md border-2 px-3 py-2.5 text-left transition-colors ${
										input.strategicAngle === angle.value
											? "border-primary bg-primary/10 text-primary"
											: "border-border bg-background hover:bg-muted"
									}`}
								>
									<p className="text-xs font-semibold">{angle.label}</p>
									<p className="mt-0.5 text-[10px] text-muted-foreground">
										{angle.description}
									</p>
								</button>
							))}
						</div>
					</fieldset>

					<Separator />

					{/* ── Intelligent Fallback ── */}
					<fieldset className="space-y-3">
						<legend className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
							<Shield className="size-3.5" />
							Case Study Matching
						</legend>

						<div className="flex items-center justify-between rounded-md border-2 border-border bg-muted/30 p-3">
							<div className="space-y-0.5">
								<Label className="text-xs font-medium">Intelligent Fallback</Label>
								<p className="text-[10px] text-muted-foreground">
									Use similar region data if no exact match
								</p>
							</div>
							<Switch
								checked={input.intelligentFallback}
								onCheckedChange={(checked) =>
									setInput({ intelligentFallback: checked })
								}
							/>
						</div>
					</fieldset>

					<Separator />

					{/* ── Content Format ── */}
					<fieldset className="space-y-3">
						<legend className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
							<FileText className="size-3.5" />
							Content Format
						</legend>

						<FormField icon={FileText} label="Format" required>
							<Select
								value={input.selectedFormat}
								onValueChange={(v) =>
									setInput({ selectedFormat: v as ContentFormat })
								}
							>
								<SelectTrigger className={stackedSelectTriggerClass}>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{CONTENT_FORMATS.map((f) => (
										<SelectItem
											key={f.value}
											value={f.value}
											title={f.description}
											className={stackedSelectItemClass}
										>
											<div className="flex w-full min-w-0 flex-col gap-0.5 pr-1 text-left">
												<span className="text-sm font-medium leading-snug">
													{f.label}
												</span>
												<span className="text-[10px] font-normal leading-snug text-muted-foreground">
													{f.description}
												</span>
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</FormField>

						{input.selectedFormat === "nurture_email" && (
							<FormField icon={FileText} label="Nurture template">
								<Select
									value={input.nurtureTemplate}
									onValueChange={(v) =>
										setInput({
											nurtureTemplate: v as (typeof input)["nurtureTemplate"],
										})
									}
								>
									<SelectTrigger className={stackedSelectTriggerClass}>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{NURTURE_TEMPLATE_OPTIONS.map((opt) => (
											<SelectItem
												key={opt.value}
												value={opt.value}
												className={stackedSelectItemClass}
											>
												<div className="flex w-full min-w-0 flex-col gap-0.5 pr-1 text-left">
													<span className="text-sm font-medium leading-snug">
														{opt.label}
													</span>
													<span className="text-[10px] font-normal leading-snug text-muted-foreground">
														{opt.description}
													</span>
												</div>
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</FormField>
						)}

						{input.selectedFormat === "email_sequence" && (
							<FormField icon={FileText} label="Sequence length">
								<Select
									value={String(input.emailSequenceLength)}
									onValueChange={(v) =>
										setInput({
											emailSequenceLength: Number(v) as EmailSequenceLength,
										})
									}
								>
									<SelectTrigger className="w-full">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{EMAIL_SEQUENCE_LENGTH_OPTIONS.map((opt) => (
											<SelectItem key={opt.value} value={String(opt.value)}>
												{opt.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</FormField>
						)}

						{input.selectedFormat === "linkedin_inmail" && (
							<FormField icon={FileText} label="InMail variation">
								<Select
									value={input.linkedinInmailVariation}
									onValueChange={(v) =>
										setInput({
											linkedinInmailVariation:
												v as (typeof input)["linkedinInmailVariation"],
										})
									}
								>
									<SelectTrigger className={stackedSelectTriggerClass}>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{LINKEDIN_INMAIL_VARIATION_OPTIONS.map((opt) => (
											<SelectItem
												key={opt.value}
												value={opt.value}
												className={stackedSelectItemClass}
											>
												<div className="flex w-full min-w-0 flex-col gap-0.5 pr-1 text-left">
													<span className="text-sm font-medium leading-snug">
														{opt.label}
													</span>
													<span className="text-[10px] font-normal leading-snug text-muted-foreground">
														{opt.description}
													</span>
												</div>
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</FormField>
						)}

						<FormField icon={StickyNote} label="Notes / Campaign Goal">
							<Textarea
								placeholder="Optional context for the generation..."
								rows={3}
								value={input.notes}
								onChange={(e) => setInput({ notes: e.target.value })}
							/>
						</FormField>
					</fieldset>
				</CardContent>
			</div>

			{/* ── Generate Button ── */}
			<div className="shrink-0 border-t p-4">
				<Button
					className="w-full cursor-pointer"
					size="lg"
					disabled={!canGenerate || isGenerating}
					onClick={handleGenerate}
				>
					{isGenerating ? (
						<>
							<Loader2 className="size-4 animate-spin" />
							Researching with Tavily…
						</>
					) : currentSessionId ? (
						<>
							<Sparkles className="size-4" />
							Regenerate
						</>
					) : (
						<>
							<Sparkles className="size-4" />
							Generate Content
						</>
					)}
				</Button>
			</div>
		</Card>
	);
}

function FormField({
	icon: Icon,
	label,
	required,
	children,
}: {
	icon: React.ComponentType<{ className?: string }>;
	label: string;
	required?: boolean;
	children: React.ReactNode;
}) {
	return (
		<div className="space-y-1.5">
			<Label className="flex items-center gap-1.5 text-xs font-medium">
				<Icon className="size-3.5 text-muted-foreground" />
				{label}
				{required && <span className="text-destructive">*</span>}
			</Label>
			{children}
		</div>
	);
}
