"use client";

import { useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ConfigPanel from "./ConfigPanel";
import ResearchPanel from "./ResearchPanel";
import OutputEditor from "./OutputEditor";
import { useStrategistStore } from "@/lib/store/useStrategistStore";
import type { GenerationMode } from "@/lib/types";

const COPY: Record<GenerationMode, { title: string; description: string }> = {
	account: {
		title: "Content Generator",
		description:
			"Research target accounts, find proof points, and generate high-conversion outreach content.",
	},
	persona: {
		title: "Persona Content Generator",
		description:
			"Research one named contact's public signals — quotes, LinkedIn activity, career moves — and generate content personalized to them.",
	},
};

/**
 * Shared workspace for both the account-level (`/strategist`) and
 * persona-level (`/strategist/persona`) routes. `mode` drives which sections
 * ConfigPanel/ResearchPanel render internally (via `input.mode`); this
 * component's only job is to keep `input.mode` in sync with the active route.
 */
export default function StrategistWorkspace({ mode }: { mode: GenerationMode }) {
	const { activeTab, setActiveTab, input, setInput, resetAll } = useStrategistStore();

	// Switching between Account and Persona level is a hard context switch —
	// clear the form, prospect upload, and any generated content/research
	// rather than carrying it across, since the two levels target different
	// things (a company vs. a named individual).
	useEffect(() => {
		if (input.mode !== mode) {
			resetAll();
			setInput({ mode });
		}
	}, [mode, input.mode, setInput, resetAll]);

	const copy = COPY[mode];

	return (
		<div className="mx-auto max-w-[1400px] space-y-6">
			<div>
				<h1 className="text-2xl font-bold tracking-tight">{copy.title}</h1>
				<p className="text-sm text-muted-foreground">{copy.description}</p>
			</div>

			{/*
			 * Desktop layout (lg+):
			 *   ┌──────────┬──────────────────────────────────────────────────┐
			 *   │  Config  │  Generated Content                               │
			 *   └──────────┴──────────────────────────────────────────────────┘
			 *   ┌──────────────────────────────────────────────────────────────┐
			 *   │  Intelligence Feed (full width below the two top blocks)    │
			 *   └──────────────────────────────────────────────────────────────┘
			 */}
			<div className="hidden lg:flex lg:flex-col lg:gap-6">
				<div className="grid grid-cols-[380px_1fr] gap-6 h-[calc(100vh-12rem)]">
					<div className="min-h-0 min-w-0">
						<ConfigPanel />
					</div>
					<div className="min-h-0 min-w-0">
						<OutputEditor />
					</div>
				</div>
				<div className="min-w-0">
					<ResearchPanel />
				</div>
			</div>

			{/* Mobile / tablet: tabbed layout */}
			<div className="lg:hidden">
				<Tabs
					value={activeTab}
					onValueChange={(v) => setActiveTab(v as "config" | "research" | "output")}
				>
					<TabsList className="w-full">
						<TabsTrigger value="config" className="flex-1 cursor-pointer">
							Configure
						</TabsTrigger>
						<TabsTrigger value="research" className="flex-1 cursor-pointer">
							Research
						</TabsTrigger>
						<TabsTrigger value="output" className="flex-1 cursor-pointer">
							Output
						</TabsTrigger>
					</TabsList>

					<TabsContent value="config" className="mt-4">
						<ConfigPanel />
					</TabsContent>
					<TabsContent value="research" className="mt-4">
						<ResearchPanel />
					</TabsContent>
					<TabsContent value="output" className="mt-4">
						<OutputEditor />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
