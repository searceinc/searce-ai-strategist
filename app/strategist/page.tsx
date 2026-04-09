"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ConfigPanel, ResearchPanel, OutputEditor } from "@/components/strategist";
import { useStrategistStore } from "@/lib/store/useStrategistStore";

export default function StrategistPage() {
	const { activeTab, setActiveTab, generatedContent } = useStrategistStore();

	return (
		<div className="mx-auto max-w-7xl space-y-6">
			<div>
				<h1 className="text-2xl font-bold tracking-tight">Content Generator</h1>
				<p className="text-sm text-muted-foreground">
					Research target accounts, find proof points, and generate high-conversion
					outreach content.
				</p>
			</div>

			{/* Desktop: config column fixed height; output + research stack can grow taller (page scrolls) */}
			<div className="hidden lg:grid lg:grid-cols-[380px_1fr] lg:items-start lg:gap-6">
				<div className="h-[calc(100vh-12rem)] min-h-0">
					<ConfigPanel />
				</div>
				<div className="flex min-w-0 flex-col gap-8">
					{generatedContent ? (
						<>
							<OutputEditor />
							<ResearchPanel />
						</>
					) : (
						<OutputEditor />
					)}
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
