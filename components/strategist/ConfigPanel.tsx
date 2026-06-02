"use client";

import { useEffect, useRef, useState } from "react";
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
	HelpCircle,
	NotebookPen,
	Upload,
	X,
	FileSpreadsheet,
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useStrategistStore } from "@/lib/store/useStrategistStore";
import {
	callGenerateContent,
	callRegenerateContent,
	callSaveProspectUpload,
} from "@/lib/firebase/firestore";
import {
	parseProspectFile,
	getColumnValues,
	findRowByValue,
	PROSPECT_FIELDS,
	PROSPECT_FIELD_LABEL,
	ACCEPTED_FILE_EXTENSIONS,
	ACCEPTED_FILE_ACCEPT_ATTR,
	type ProspectField,
} from "@/lib/prospect-upload";
import {
	CONTENT_FORMATS,
	EMAIL_SEQUENCE_LENGTH_OPTIONS,
	LINKEDIN_INMAIL_VARIATION_OPTIONS,
	NURTURE_TEMPLATE_OPTIONS,
	SEARCE_SERVICES,
	REGIONS,
	INDUSTRIES,
	getCategoryOptions,
	getSubCategoryOptions,
	CLOUD_ECOSYSTEMS,
	STRATEGIC_ANGLES,
	SEQUENCE_COUNT_OPTIONS,
} from "@/lib/constants";
import type {
	ContentFormat,
	EmailSequenceLength,
	GenerationInput,
	SearceService,
	SequenceCount,
	StrategicAngle,
} from "@/lib/types";

/**
 * Formats that support the universal multi-touch selector. `email_sequence`
 * uses its own length dropdown; `linkedin_conversational_ad` is inherently
 * multi-message so we don't double-stack sequences there.
 */
const SEQUENCEABLE_FORMATS: ReadonlySet<ContentFormat> = new Set<ContentFormat>([
	"cold_email",
	"sales_email",
	"nurture_email",
	"linkedin_inmail",
	"linkedin_conversational_ad",
]);

const GENERAL_INDUSTRY_VALUE = "GENERAL";

/** Which GenerationInput field each detected sheet column feeds. */
const PROSPECT_FIELD_TO_INPUT: Record<
	ProspectField,
	"targetCompany" | "targetDomain" | "targetLinkedInUrl"
> = {
	company: "targetCompany",
	website: "targetDomain",
	linkedin: "targetLinkedInUrl",
};

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
		prospectUpload,
		setProspectUpload,
		clearProspectUpload,
	} = useStrategistStore();

	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isUploading, setIsUploading] = useState(false);

	useEffect(() => {
		const cats = getCategoryOptions(input.targetPersonaIndustry);
		const validCategoryValues = cats.map((c) => c.value);
		if (
			input.targetPersonaCategory &&
			!validCategoryValues.includes(input.targetPersonaCategory)
		) {
			setInput({ targetPersonaCategory: "", targetPersonaSubCategory: "" });
		}
	}, [input.targetPersonaIndustry]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		const subs = getSubCategoryOptions(
			input.targetPersonaIndustry,
			input.targetPersonaCategory,
		);
		const validValues = subs.map((s) => s.value);
		if (
			input.targetPersonaSubCategory &&
			!validValues.includes(input.targetPersonaSubCategory)
		) {
			setInput({ targetPersonaSubCategory: "" });
		}
	}, [input.targetPersonaIndustry, input.targetPersonaCategory]); // eslint-disable-line react-hooks/exhaustive-deps

	const canGenerate = input.region.trim() && input.selectedService.trim();

	async function handleGenerate() {
		if (!canGenerate) {
			toast.error("Please fill in Region and Service (Industry can be General)");
			return;
		}

		console.log("generating content");

		setGenerating(true);

		try {
			let result;
			if (currentSessionId) {
				result = await callRegenerateContent(currentSessionId, input);
			} else {
				console.log("before calling generate content");
				result = await callGenerateContent(input);
				console.log("after calling generate content");
			}

			if (result.featureNotAvailable) {
				setGenerationError(result.noMatchMessage ?? "No matching case studies found.");
				toast.error(
					result.noMatchMessage ??
						"No matching case studies. Enable Intelligent Fallback.",
				);
				return;
			}
			console.log("before setting generation result");
			setGenerationResult({ ...result, sessionId: result.sessionId });
			console.log("after setting generation result");
			toast.success("Content generated successfully");
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Generation failed";
			setGenerationError(msg);
			toast.error(msg);
		}
	}

	async function handleFileSelected(file: File | undefined) {
		if (!file) return;

		const dot = file.name.lastIndexOf(".");
		const ext = dot >= 0 ? file.name.slice(dot).toLowerCase() : "";
		if (!ACCEPTED_FILE_EXTENSIONS.includes(ext as (typeof ACCEPTED_FILE_EXTENSIONS)[number])) {
			toast.error("Unsupported file. Please upload a .csv or .xlsx file.");
			if (fileInputRef.current) fileInputRef.current.value = "";
			return;
		}

		setIsUploading(true);
		try {
			const parsed = await parseProspectFile(file);

			const matched = PROSPECT_FIELDS.filter((f) => parsed.matchedFields[f]);
			if (matched.length === 0) {
				toast.error(
					"No Company, Website, or LinkedIn columns found. Check your header row.",
				);
				return;
			}
			if (parsed.rows.length === 0) {
				toast.error("Couldn't find any data rows in this file.");
				return;
			}

			// Show dropdowns immediately, then persist to Firestore.
			setProspectUpload({ ...parsed, uploadId: null });

			const labels = matched.map((f) => PROSPECT_FIELD_LABEL[f]).join(", ");
			try {
				const uploadId = await callSaveProspectUpload(parsed);
				setProspectUpload({ ...parsed, uploadId });
				toast.success(`Loaded ${parsed.rows.length} rows · ${labels}`);
			} catch (saveErr) {
				const msg = saveErr instanceof Error ? saveErr.message : "save failed";
				toast.error(`List loaded, but saving to Firestore failed: ${msg}`);
			}
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Failed to read this file";
			toast.error(msg);
		} finally {
			setIsUploading(false);
			// Reset so selecting the same file again re-triggers onChange.
			if (fileInputRef.current) fileInputRef.current.value = "";
		}
	}

	function handleProspectSelect(field: ProspectField, value: string) {
		const patch: Partial<GenerationInput> = {};
		patch[PROSPECT_FIELD_TO_INPUT[field]] = value;

		// Selecting a company links its row, auto-filling the other detected fields.
		if (field === "company" && prospectUpload) {
			const row = findRowByValue(prospectUpload.rows, "company", value);
			if (row) {
				if (prospectUpload.matchedFields.website && row.website) {
					patch.targetDomain = row.website;
				}
				if (prospectUpload.matchedFields.linkedin && row.linkedin) {
					patch.targetLinkedInUrl = row.linkedin;
				}
			}
		}

		setInput(patch);
	}

	function handleClearUpload() {
		clearProspectUpload();
		if (fileInputRef.current) fileInputRef.current.value = "";
	}

	const currentCategories = getCategoryOptions(input.targetPersonaIndustry);
	const currentSubCategories = getSubCategoryOptions(
		input.targetPersonaIndustry,
		input.targetPersonaCategory,
	);

	/**
	 * Render a Company Intel field as a dropdown sourced from the uploaded list
	 * when that column was detected, otherwise fall back to the manual text input.
	 */
	function renderCompanyField(
		field: ProspectField,
		value: string,
		placeholder: string,
		manualInput: React.ReactNode,
	) {
		if (!prospectUpload || !prospectUpload.matchedFields[field]) {
			return manualInput;
		}
		const options = getColumnValues(prospectUpload.rows, field);
		return (
			<Select value={value} onValueChange={(v) => handleProspectSelect(field, v)}>
				<SelectTrigger className="w-full">
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent>
					{options.map((opt) => (
						<SelectItem key={opt} value={opt}>
							{opt}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		);
	}

	const matchedFieldLabels = prospectUpload
		? PROSPECT_FIELDS.filter((f) => prospectUpload.matchedFields[f]).map(
				(f) => PROSPECT_FIELD_LABEL[f],
			)
		: [];

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

						<FormField icon={Building2} label="Company Name">
							{renderCompanyField(
								"company",
								input.targetCompany,
								"Select a company from your list",
								<Input
									placeholder="e.g. Acme Corp (optional)"
									value={input.targetCompany}
									onChange={(e) => setInput({ targetCompany: e.target.value })}
								/>,
							)}
						</FormField>

						<FormField icon={Globe} label="Website / Domain">
							{renderCompanyField(
								"website",
								input.targetDomain,
								"Select a website from your list",
								<Input
									placeholder="e.g. acmecorp.com"
									value={input.targetDomain}
									onChange={(e) => setInput({ targetDomain: e.target.value })}
								/>,
							)}
						</FormField>

						<FormField icon={Link2} label="LinkedIn URL">
							{renderCompanyField(
								"linkedin",
								input.targetLinkedInUrl,
								"Select a LinkedIn URL from your list",
								<Input
									placeholder="e.g. linkedin.com/company/acme"
									value={input.targetLinkedInUrl}
									onChange={(e) =>
										setInput({ targetLinkedInUrl: e.target.value })
									}
								/>,
							)}
						</FormField>

						{/* ── Divider ── */}
						<div className="relative flex items-center justify-center py-0.5">
							<Separator className="absolute inset-x-0" />
							<span className="relative bg-card px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
								OR
							</span>
						</div>

						{/* ── Bulk upload (CSV / XLSX) ── */}
						<input
							ref={fileInputRef}
							type="file"
							accept={ACCEPTED_FILE_ACCEPT_ATTR}
							className="hidden"
							onChange={(e) => handleFileSelected(e.target.files?.[0])}
						/>

						{prospectUpload ? (
							<div className="space-y-2 rounded-md border-2 border-border bg-muted/30 p-3">
								<div className="flex items-center gap-2">
									<FileSpreadsheet className="size-4 shrink-0 text-primary" />
									<div className="min-w-0 flex-1">
										<p
											className="truncate text-xs font-medium"
											title={prospectUpload.fileName}
										>
											{prospectUpload.fileName}
										</p>
										<p className="text-[10px] text-muted-foreground">
											{prospectUpload.rows.length} rows ·{" "}
											{matchedFieldLabels.join(", ")}
											{prospectUpload.uploadId ? "" : " · saving…"}
										</p>
									</div>
									<Button
										type="button"
										variant="ghost"
										size="icon-sm"
										className="cursor-pointer"
										aria-label="Remove uploaded file"
										onClick={handleClearUpload}
									>
										<X className="size-4" />
									</Button>
								</div>
								<Button
									type="button"
									variant="outline"
									size="sm"
									className="w-full cursor-pointer"
									disabled={isUploading}
									onClick={() => fileInputRef.current?.click()}
								>
									{isUploading ? (
										<>
											<Loader2 className="size-3.5 animate-spin" />
											Reading…
										</>
									) : (
										<>
											<Upload className="size-3.5" />
											Replace file
										</>
									)}
								</Button>
							</div>
						) : (
							<div className="space-y-1.5">
								<Button
									type="button"
									variant="outline"
									className="w-full cursor-pointer"
									disabled={isUploading}
									onClick={() => fileInputRef.current?.click()}
								>
									{isUploading ? (
										<>
											<Loader2 className="size-4 animate-spin" />
											Reading file…
										</>
									) : (
										<>
											<Upload className="size-4" />
											Upload prospect list (CSV, XLSX)
										</>
									)}
								</Button>
								<p className="text-[10px] leading-snug text-muted-foreground">
									Include columns for Account Name, Website and LinkedIn — headers
									are matched automatically.
								</p>
							</div>
						)}
					</fieldset>

					<Separator />

					{/* ── Target Persona ── */}
					<fieldset className="space-y-3">
						<legend className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
							<User className="size-3.5" />
							Target Persona
						</legend>

						<FormField
							icon={Briefcase}
							label="Industry"
							help="Pick 'General' for a generic POV based on live research alone, or one of the workbook sectors (FSI, HLS, …) to unlock sub-categories below."
						>
							<Select
								value={input.targetPersonaIndustry}
								onValueChange={(v) => setInput({ targetPersonaIndustry: v })}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select industry (optional)" />
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

						<FormField
							icon={User}
							label="Category"
							help="Sub-industry within the chosen industry (e.g. Banking inside FSI). Optional — leave blank for a more general view. Hidden when Industry is 'General'."
						>
							<Select
								value={input.targetPersonaCategory}
								onValueChange={(v) => setInput({ targetPersonaCategory: v })}
								disabled={
									!input.targetPersonaIndustry ||
									input.targetPersonaIndustry === GENERAL_INDUSTRY_VALUE ||
									currentCategories.length === 0
								}
							>
								<SelectTrigger className="w-full">
									<SelectValue
										placeholder={
											!input.targetPersonaIndustry
												? "Pick an industry first"
												: input.targetPersonaIndustry ===
													  GENERAL_INDUSTRY_VALUE
													? "General POV — no category needed"
													: "Select category (optional)"
										}
									/>
								</SelectTrigger>
								<SelectContent>
									{currentCategories.map((c) => (
										<SelectItem key={c.value} value={c.value}>
											{c.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</FormField>

						{input.targetPersonaIndustry !== GENERAL_INDUSTRY_VALUE &&
							currentSubCategories.length > 0 && (
								<FormField
									icon={User}
									label="Sub-Category"
									help="Most specific level (e.g. Retail & Consumer inside Banking). The AI will pull pain points and use cases mapped exactly to this combination from Sheet 4."
								>
									<Select
										value={input.targetPersonaSubCategory}
										onValueChange={(v) =>
											setInput({ targetPersonaSubCategory: v })
										}
									>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Select sub-category" />
										</SelectTrigger>
										<SelectContent>
											{currentSubCategories.map((sc) => (
												<SelectItem key={sc.value} value={sc.value}>
													{sc.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</FormField>
							)}

						<FormField
							icon={User}
							label="Job Title"
							help="The recipient's actual role (e.g. CIO, VP Engineering, Marketing Director). The AI writes directly to this persona — be specific."
						>
							<Input
								placeholder="e.g. VP of Engineering (optional)"
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

						<FormField
							icon={MapPin}
							label="Region"
							required
							help="The recipient's region. Used for case-study matching — the AI prefers proof from the same region. With Intelligent Fallback on, related regions are tried if no exact match exists."
						>
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

						<FormField
							icon={Settings2}
							label="Service"
							required
							help="Which Searce practice you want to position. The AI is constrained to claim only what we've actually delivered for this combination — never invented capabilities."
						>
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
						<LegendWithHelp
							icon={Cloud}
							label="Cloud Ecosystem"
							help="Which cloud the message should reference. The AI uses this for partner-status copy (e.g. Google Cloud MSP, AWS Advanced Consulting Partner) and for terminology preferences."
						/>

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
						<LegendWithHelp
							icon={Target}
							label="Strategic Angle"
							help="The posture the message takes. Pain Point opens with empathy, ROI/Metrics leads with numbers, Social Proof tells a peer's story, Direct Pitch goes straight to the offer."
						/>

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
						<LegendWithHelp
							icon={Shield}
							label="Case Study Matching"
							help="Searce only claims what we've actually delivered. If no case study matches the region exactly, Intelligent Fallback substitutes the closest related region's story; otherwise the AI sticks to capability-only language."
						/>

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

						{SEQUENCEABLE_FORMATS.has(input.selectedFormat) && (
							<FormField
								icon={FileText}
								label="Sequence count"
								help='How many touches of the same format to generate. 1 = single email (default). 2–5 produces a multi-touch sequence like "Email Sequence", but staying in the chosen format (cold / sales / nurture / InMail / Conversation Ad).'
							>
								<Select
									value={String(input.sequenceCount ?? 1)}
									onValueChange={(v) =>
										setInput({
											sequenceCount: Number(v) as SequenceCount,
										})
									}
								>
									<SelectTrigger className="w-full">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{SEQUENCE_COUNT_OPTIONS.map((opt) => (
											<SelectItem key={opt.value} value={String(opt.value)}>
												{opt.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</FormField>
						)}

						<FormField
							icon={StickyNote}
							label="Instructions to Strategist"
							help={
								'Free-text directive the AI MUST follow. Examples: "make it short", "lead with ROI", "use British English", "mention our APAC office". Treated as a high-priority instruction inside the prompt, not just background context.'
							}
						>
							<Textarea
								placeholder='Directive the AI must follow (e.g. "make it short", "lead with ROI", "use British English")'
								rows={2}
								value={input.instructions}
								onChange={(e) => setInput({ instructions: e.target.value })}
							/>
						</FormField>

						<FormField
							icon={NotebookPen}
							label="My Notes (private)"
							help="Your own working notes about this prospect, this case, or follow-ups. Saved with the session for your future reference. NEVER sent to the AI."
						>
							<Textarea
								placeholder="Private notes for yourself. Never sent to the model."
								rows={2}
								value={input.myNotes}
								onChange={(e) => setInput({ myNotes: e.target.value })}
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

function LegendWithHelp({
	icon: Icon,
	label,
	help,
}: {
	icon: React.ComponentType<{ className?: string }>;
	label: string;
	help?: string;
}) {
	return (
		<legend className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
			<Icon className="size-3.5" />
			{label}
			{help && (
				<Tooltip>
					<TooltipTrigger asChild>
						<button
							type="button"
							aria-label={`Help: ${label}`}
							className="cursor-help text-muted-foreground/60 hover:text-muted-foreground"
						>
							<HelpCircle className="size-3.5" />
						</button>
					</TooltipTrigger>
					<TooltipContent side="right" className="max-w-xs text-left">
						{help}
					</TooltipContent>
				</Tooltip>
			)}
		</legend>
	);
}

function FormField({
	icon: Icon,
	label,
	required,
	help,
	children,
}: {
	icon: React.ComponentType<{ className?: string }>;
	label: string;
	required?: boolean;
	help?: string;
	children: React.ReactNode;
}) {
	return (
		<div className="space-y-1.5">
			<Label className="flex items-center gap-1.5 text-xs font-medium">
				<Icon className="size-3.5 text-muted-foreground" />
				{label}
				{required && <span className="text-destructive">*</span>}
				{help && (
					<Tooltip>
						<TooltipTrigger asChild>
							<button
								type="button"
								aria-label={`Help: ${label}`}
								className="cursor-help text-muted-foreground/60 hover:text-muted-foreground"
							>
								<HelpCircle className="size-3.5" />
							</button>
						</TooltipTrigger>
						<TooltipContent side="right" className="max-w-xs text-left">
							{help}
						</TooltipContent>
					</Tooltip>
				)}
			</Label>
			{children}
		</div>
	);
}
