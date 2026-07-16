// Regenerates functions/src/data/strategic-priorities.ts and
// lib/strategic-priorities-index.ts from scripts/strategic-priorities.source.json.
//
// Usage:
//   node scripts/build-strategic-priorities.mjs
//
// Source is a hand-curated (LLM-drafted, human-verified) JSON transcription of
// the CES 2026 "Industry Messaging" Google Docs (Strategic Priorities, Buyer
// Persona messaging, Use Cases, Case Studies per industry). Every field traces
// back to a source doc — no invented client names, metrics, or claims.
// Regenerate after strategic-priorities.source.json changes.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SOURCE_PATH = resolve(__dirname, "strategic-priorities.source.json");
const FUNCTIONS_OUT_PATH = resolve(__dirname, "../functions/src/data/strategic-priorities.ts");
const CLIENT_OUT_PATH = resolve(__dirname, "../lib/strategic-priorities-index.ts");

const source = JSON.parse(readFileSync(SOURCE_PATH, "utf-8"));
const industries = source.industries ?? {};
const industryCodes = Object.keys(industries);

// ─── functions/src/data/strategic-priorities.ts (full records, server-side) ──

const out = [];
out.push("// AUTO-GENERATED from scripts/strategic-priorities.source.json.");
out.push("// Regenerate with scripts/build-strategic-priorities.mjs after the source changes.");
out.push("// DO NOT EDIT BY HAND.");
out.push("//");
out.push('// Transcribed from the CES 2026 "Industry Messaging" Google Docs. Every field');
out.push("// traces back to a source doc — never invent client names, metrics, or claims");
out.push("// beyond what's captured here.");
out.push("");
out.push('import { migrateIndustryCode } from "./legacy-codes.js";');
out.push("");
out.push("export interface ReachoutScript {");
out.push("\thook: string;");
out.push("\tpivot: string;");
out.push("\tcloser: string;");
out.push("}");
out.push("");
out.push("export interface StrategicPriority {");
out.push("\tid: string;");
out.push("\tindustryCode: string;");
out.push("\ttitle: string;");
out.push("\ttargetPersonas: string[];");
out.push("\theadline: string;");
out.push("\tcoreFocus: string;");
out.push("\tpitch: string;");
out.push("\thowToAlign: string;");
out.push("\tpainPoints: string;");
out.push("\tunifiedCoreMessage: string;");
out.push("\tvalueProps: string[];");
out.push("\tprospectCurrentState?: string;");
out.push("\tbdrTriggers?: string[];");
out.push("\tstrategicPivot: string;");
out.push("\tbdrNextStep?: string;");
out.push("\tcta?: string | null;");
out.push("\tproofPoints?: string[];");
out.push("\treachout: ReachoutScript;");
out.push("}");
out.push("");
out.push("export interface PersonaMessaging {");
out.push("\tindustryCode: string;");
out.push("\tpersonaTitle: string;");
out.push("\tcoreFocus: string;");
out.push("\tcaresAbout?: string;");
out.push("\tpitch: string;");
out.push("\thowToAlign: string;");
out.push("\tpainPoints: string[];");
out.push("\tvalueProps: string[];");
out.push("\tproofPoints?: string[];");
out.push("\tcta?: string | null;");
out.push("\treachout: ReachoutScript;");
out.push("}");
out.push("");
out.push("export interface StrategicPriorityUseCase {");
out.push("\tindustryCode: string;");
out.push("\tpersonaTitle: string;");
out.push("\tuseCase: string;");
out.push("\twhatItSolves: string;");
out.push("\tbusinessOutcome: string;");
out.push("\tsearceSolutionProof: string;");
out.push("}");
out.push("");
out.push("export interface StrategicPriorityCaseStudy {");
out.push("\tindustryCode: string;");
out.push("\tpractice: string;");
out.push("\tclient: string;");
out.push("\ttitle: string;");
out.push("\tcoreChallenges: string;");
out.push("\tkeyPainPoints: string;");
out.push("\tvalueProposition: string;");
out.push("\tkeyMessage: string;");
out.push("\tsearceSolutions: string;");
out.push("\tproofPoints: string;");
out.push("}");
out.push("");

function emitArray(varName, typeName, rows) {
	out.push(`export const ${varName}: ${typeName}[] = [`);
	for (const rec of rows) {
		out.push("\t" + JSON.stringify(rec) + ",");
	}
	out.push("];");
	out.push("");
}

const allPriorities = [];
const allPersonaMessaging = [];
const allUseCases = [];
const allCaseStudies = [];

for (const code of industryCodes) {
	const entry = industries[code];
	for (const p of entry.strategicPriorities ?? []) {
		allPriorities.push({ ...p, industryCode: code });
	}
	for (const pm of entry.personaMessaging ?? []) {
		allPersonaMessaging.push({ ...pm, industryCode: code });
	}
	for (const uc of entry.useCases ?? []) {
		allUseCases.push({ ...uc, industryCode: code });
	}
	for (const cs of entry.caseStudies ?? []) {
		allCaseStudies.push({ ...cs, industryCode: code });
	}
}

emitArray("STRATEGIC_PRIORITIES", "StrategicPriority", allPriorities);
emitArray("PERSONA_MESSAGING", "PersonaMessaging", allPersonaMessaging);
emitArray("STRATEGIC_PRIORITY_USE_CASES", "StrategicPriorityUseCase", allUseCases);
emitArray("STRATEGIC_PRIORITY_CASE_STUDIES", "StrategicPriorityCaseStudy", allCaseStudies);

out.push("/** All strategic priorities for an industry (empty array if not covered yet). */");
out.push("export function getStrategicPriorities(industryCode: string): StrategicPriority[] {");
out.push("\tconst code = migrateIndustryCode(industryCode);");
out.push("\treturn STRATEGIC_PRIORITIES.filter((p) => p.industryCode === code);");
out.push("}");
out.push("");
out.push("export function getStrategicPriorityById(");
out.push("\tindustryCode: string,");
out.push("\tid: string,");
out.push("): StrategicPriority | null {");
out.push("\tconst code = migrateIndustryCode(industryCode);");
out.push(
	"\treturn STRATEGIC_PRIORITIES.find((p) => p.industryCode === code && p.id === id) ?? null;",
);
out.push("}");
out.push("");
out.push("/**");
out.push(" * Best-match strategic priority for a job title within an industry. Job");
out.push(" * title is often empty at account level (Strategic Priority IS the account");
out.push(" * angle) — deliberately simple substring match, falls back to the first");
out.push(" * priority for that industry so generation always has something to ground on.");
out.push(" */");
out.push("export function matchStrategicPriority(");
out.push("\tindustryCode: string,");
out.push("\tjobTitle: string | undefined | null,");
out.push("): StrategicPriority | null {");
out.push("\tconst all = getStrategicPriorities(industryCode);");
out.push("\tif (all.length === 0) return null;");
out.push('\tconst title = (jobTitle ?? "").trim().toLowerCase();');
out.push("\tif (title) {");
out.push("\t\tconst match = all.find((p) =>");
out.push("\t\t\tp.targetPersonas.some(");
out.push("\t\t\t\t(persona) =>");
out.push(
	"\t\t\t\t\ttitle.includes(persona.toLowerCase()) || persona.toLowerCase().includes(title),",
);
out.push("\t\t\t),");
out.push("\t\t);");
out.push("\t\tif (match) return match;");
out.push("\t}");
out.push("\treturn all[0]!;");
out.push("}");
out.push("");
out.push("/** Best-match persona messaging for a job title within an industry. */");
out.push("export function getPersonaMessaging(");
out.push("\tindustryCode: string,");
out.push("\tjobTitle: string | undefined | null,");
out.push("): PersonaMessaging | null {");
out.push("\tconst code = migrateIndustryCode(industryCode);");
out.push("\tconst all = PERSONA_MESSAGING.filter((p) => p.industryCode === code);");
out.push("\tif (all.length === 0) return null;");
out.push('\tconst title = (jobTitle ?? "").trim().toLowerCase();');
out.push("\tif (title) {");
out.push("\t\tconst match = all.find(");
out.push("\t\t\t(p) =>");
out.push("\t\t\t\ttitle.includes(p.personaTitle.toLowerCase()) ||");
out.push("\t\t\t\tp.personaTitle.toLowerCase().includes(title),");
out.push("\t\t);");
out.push("\t\tif (match) return match;");
out.push("\t}");
out.push("\treturn all[0]!;");
out.push("}");
out.push("");
out.push(
	"export function getStrategicPriorityUseCases(industryCode: string): StrategicPriorityUseCase[] {",
);
out.push("\tconst code = migrateIndustryCode(industryCode);");
out.push("\treturn STRATEGIC_PRIORITY_USE_CASES.filter((u) => u.industryCode === code);");
out.push("}");
out.push("");
out.push("export function getStrategicPriorityCaseStudies(");
out.push("\tindustryCode: string,");
out.push("): StrategicPriorityCaseStudy[] {");
out.push("\tconst code = migrateIndustryCode(industryCode);");
out.push("\treturn STRATEGIC_PRIORITY_CASE_STUDIES.filter((c) => c.industryCode === code);");
out.push("}");
out.push("");

writeFileSync(FUNCTIONS_OUT_PATH, out.join("\n"));
console.log(
	`Wrote ${allPriorities.length} priorities, ${allPersonaMessaging.length} persona profiles, ${allUseCases.length} use cases, ${allCaseStudies.length} case studies for industries [${industryCodes.join(", ")}] to ${FUNCTIONS_OUT_PATH}`,
);

// ─── lib/strategic-priorities-index.ts (lightweight client index) ──────────
// Mirrors the lib/sheet-taxonomy.ts "generated, do not hand-edit" pattern —
// enough for the ConfigPanel sub-selector + client-side auto-match without
// shipping the full reachout scripts to the browser bundle.

const cl = [];
cl.push("// AUTO-GENERATED from scripts/strategic-priorities.source.json.");
cl.push("// Regenerate with scripts/build-strategic-priorities.mjs after the source changes.");
cl.push("// DO NOT EDIT BY HAND.");
cl.push("//");
cl.push('// Lightweight client-side index for the ConfigPanel "Strategic Priority"');
cl.push("// sub-selector — titles + target personas only, not the full reachout copy.");
cl.push("");
cl.push("export interface StrategicPriorityIndexEntry {");
cl.push("\tindustryCode: string;");
cl.push("\tid: string;");
cl.push("\ttitle: string;");
cl.push("\ttargetPersonas: string[];");
cl.push("}");
cl.push("");
cl.push("export const STRATEGIC_PRIORITY_INDEX: StrategicPriorityIndexEntry[] = [");
for (const rec of allPriorities) {
	cl.push(
		"\t" +
			JSON.stringify({
				industryCode: rec.industryCode,
				id: rec.id,
				title: rec.title,
				targetPersonas: rec.targetPersonas,
			}) +
			",",
	);
}
cl.push("];");
cl.push("");
cl.push("/** All strategic priorities for an industry (empty if not covered yet). */");
cl.push(
	"export function getStrategicPrioritiesForIndustry(industryCode: string): StrategicPriorityIndexEntry[] {",
);
cl.push("\treturn STRATEGIC_PRIORITY_INDEX.filter((p) => p.industryCode === industryCode);");
cl.push("}");
cl.push("");
cl.push("/** Client-side mirror of the server auto-match, for the sub-selector default. */");
cl.push("export function matchStrategicPriorityId(");
cl.push("\tindustryCode: string,");
cl.push("\tjobTitle: string | undefined | null,");
cl.push("): string | null {");
cl.push("\tconst all = getStrategicPrioritiesForIndustry(industryCode);");
cl.push("\tif (all.length === 0) return null;");
cl.push('\tconst title = (jobTitle ?? "").trim().toLowerCase();');
cl.push("\tif (title) {");
cl.push("\t\tconst match = all.find((p) =>");
cl.push("\t\t\tp.targetPersonas.some(");
cl.push(
	"\t\t\t\t(persona) => title.includes(persona.toLowerCase()) || persona.toLowerCase().includes(title),",
);
cl.push("\t\t\t),");
cl.push("\t\t);");
cl.push("\t\tif (match) return match.id;");
cl.push("\t}");
cl.push("\treturn all[0]!.id;");
cl.push("}");
cl.push("");

writeFileSync(CLIENT_OUT_PATH, cl.join("\n"));
console.log(`Wrote ${allPriorities.length}-entry client index to ${CLIENT_OUT_PATH}`);
