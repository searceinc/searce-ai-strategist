import { create } from "zustand";
import { DEFAULT_GENERATION_INPUT, normalizeGenerationInput } from "@/lib/default-generation-input";
import type { ParsedProspectUpload } from "@/lib/prospect-upload";
import {
	normalizeResearchSnapshot,
	type FallbackPath,
	type GenerateContentResponse,
	type GenerationInput,
	type ResearchSnapshot,
	type SessionSummary,
	type StrategistSession,
	type VerifiedCaseStudy,
} from "@/lib/types";

/** A parsed prospect list plus the Firestore doc id it was persisted under. */
export interface ProspectUploadState extends ParsedProspectUpload {
	/** Firestore document id (null while the upload is still saving). */
	uploadId: string | null;
}

interface StrategistState {
	// ── Config form ──
	input: GenerationInput;
	setInput: (partial: Partial<GenerationInput>) => void;
	resetInput: () => void;

	// ── Prospect upload (CSV / XLSX → Company Intel dropdowns) ──
	prospectUpload: ProspectUploadState | null;
	setProspectUpload: (upload: ProspectUploadState | null) => void;
	clearProspectUpload: () => void;

	// ── Generation state ──
	isGenerating: boolean;
	currentSessionId: string | null;
	research: ResearchSnapshot | null;
	caseStudyMatches: VerifiedCaseStudy[];
	fallbackPath: FallbackPath;
	confidenceScore: number;
	generatedContent: string;
	editedContent: string;
	transparencyNote: string | null;
	generationError: string | null;

	setGenerating: (v: boolean) => void;
	setGenerationResult: (result: GenerateContentResponse & { sessionId: string }) => void;
	setEditedContent: (content: string) => void;
	setGenerationError: (error: string | null) => void;
	clearGeneration: () => void;
	/** Load a saved session (history / favorites); always sets content + session id, even without research. */
	hydrateFromSavedSession: (session: StrategistSession) => void;

	// ── History ──
	sessions: SessionSummary[];
	sessionsLoading: boolean;
	setSessions: (sessions: SessionSummary[]) => void;
	setSessionsLoading: (v: boolean) => void;

	// ── UI ──
	activeTab: "config" | "research" | "output";
	setActiveTab: (tab: "config" | "research" | "output") => void;
	sidebarOpen: boolean;
	setSidebarOpen: (v: boolean) => void;
}

export const useStrategistStore = create<StrategistState>((set) => ({
	input: { ...DEFAULT_GENERATION_INPUT },
	setInput: (partial) => set((s) => ({ input: { ...s.input, ...partial } })),
	resetInput: () => set({ input: { ...DEFAULT_GENERATION_INPUT } }),

	prospectUpload: null,
	setProspectUpload: (upload) => set({ prospectUpload: upload }),
	clearProspectUpload: () => set({ prospectUpload: null }),

	isGenerating: false,
	currentSessionId: null,
	research: null,
	caseStudyMatches: [],
	fallbackPath: "none",
	confidenceScore: 0,
	generatedContent: "",
	editedContent: "",
	transparencyNote: null,
	generationError: null,

	setGenerating: (v) => set({ isGenerating: v, generationError: null }),
	setGenerationResult: (result) =>
		set((s) => ({
			currentSessionId: result.sessionId,
			research: normalizeResearchSnapshot(result.research),
			caseStudyMatches: result.caseStudyMatches ?? [],
			fallbackPath: result.fallbackPath,
			confidenceScore: result.confidenceScore,
			generatedContent: result.generatedContent,
			editedContent: result.generatedContent,
			transparencyNote: result.transparencyNote,
			isGenerating: false,
			activeTab: "output",
			input: { ...s.input, intelligenceFeedFocus: "" },
		})),
	setEditedContent: (content) => set({ editedContent: content }),
	setGenerationError: (error) => set({ generationError: error, isGenerating: false }),
	clearGeneration: () =>
		set({
			currentSessionId: null,
			research: null,
			caseStudyMatches: [],
			fallbackPath: "none",
			confidenceScore: 0,
			generatedContent: "",
			editedContent: "",
			transparencyNote: null,
			generationError: null,
		}),

	hydrateFromSavedSession: (session) =>
		set({
			currentSessionId: session.id,
			input: normalizeGenerationInput(session.input ?? {}),
			research: normalizeResearchSnapshot(session.research),
			caseStudyMatches: session.caseStudyMatches ?? [],
			fallbackPath: session.fallbackPath ?? "none",
			confidenceScore: session.confidenceScore ?? 0,
			generatedContent: session.generatedContent ?? "",
			editedContent: session.editedContent || session.generatedContent || "",
			transparencyNote: session.transparencyNote ?? null,
			isGenerating: false,
			generationError: null,
			activeTab: "output",
		}),

	sessions: [],
	sessionsLoading: false,
	setSessions: (sessions) => set({ sessions, sessionsLoading: false }),
	setSessionsLoading: (v) => set({ sessionsLoading: v }),

	activeTab: "config",
	setActiveTab: (tab) => set({ activeTab: tab }),
	sidebarOpen: true,
	setSidebarOpen: (v) => set({ sidebarOpen: v }),
}));
