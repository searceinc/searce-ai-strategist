# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## What this is

Internal Searce tool: a rep fills in a target-account (or named-persona) form, the backend researches the
account live (Tavily) and matches it against a curated set of real Searce case studies, then Gemini drafts
outbound content (cold email, LinkedIn InMail, nurture sequence, conversation ad, etc.) grounded in that
research. Access is gated to a hardcoded allowlist of `@searce.com` emails (see Auth model below) — this is
not a public-facing product.

## Commands

Frontend (root):

```bash
npm run dev              # next dev — localhost:3000
npm run build             # next build — static export to out/ (see next.config.ts: output: "export")
npm run lint              # eslint
npm run format            # prettier --write .
npm run format:check
```

Cloud Functions (`functions/`):

```bash
cd functions && npm install
npm run build             # tsc → functions/out/ (main entrypoint, ESM)
npm run build:watch
```

Deploy (from repo root, after `cd functions && npm run build`):

```bash
firebase deploy --only functions,firestore   # functions + firestore.rules + firestore.indexes.json
firebase deploy --only functions             # functions ONLY — does not touch rules/indexes
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

There is no `hosting` block in `firebase.json` — the static `out/` export is not deployed via `firebase deploy`
in this config; treat the Next app and the Functions deploy as two separate concerns.

Data pipeline scripts (`scripts/`) — regenerate the case-study catalog from the source PDF/CSV:

```bash
npm run extract:referenceable-stories   # master-deck PDF → scripts/referenceable-stories.csv
npm run build:referenceable-stories     # CSV → functions/src/data/referenceable-stories.ts
npm run build:strategic-priorities      # scripts/strategic-priorities.source.json → functions/src/data/strategic-priorities.ts + lib/strategic-priorities-index.ts
```

No test runner is configured in this repo.

## Architecture

Two deployables, connected only through Firebase callable functions (`httpsCallable`):

```
Next.js static export (SPA)  →  httpsCallable  →  Cloud Functions (Gen 2, Node 22)  →  Firestore (named DB)
```

- **Frontend** (`app/`, `components/`, `lib/`): Next 16 App Router, but built with `output: "export"` —
  it's a static SPA, not an SSR app. State lives in Zustand (`lib/store/useStrategistStore.ts`), not URL/server
  state. `lib/firebase/` wraps the Firebase Auth + Firestore client SDKs.
- **Backend** (`functions/src/`): all business logic runs in Cloud Functions using the Admin SDK — the
  client never talks to Firestore directly except to read its own `strategist_sessions`/`prospect_uploads`
  (see `firestore.rules`; all writes are `allow ... : if false` and go through callables only).

### Auth model

`lib/firebase/auth.ts` hardcodes an `ALLOWED_EMAILS` set. Google sign-in succeeds at the Firebase Auth level
for anyone, but `onAuthChange`/`signInWithGoogle` immediately **deletes** the Firebase user (or signs them out)
if their email isn't on the list, so the app-level store never sees an unauthorized user. This is the only
access control on top of Firebase Auth — there is no backend-side email check, so don't rely on
`request.auth` alone in Cloud Functions as a business-authorization signal beyond "some allowed user is
signed in."

### Two generation modes

`GenerationInput.mode` is `"account"` (generic company POV, `app/strategist/page.tsx`) or `"persona"`
(named individual, `app/strategist/persona/page.tsx`). Both render the same `StrategistWorkspace` component;
persona mode adds extra Tavily searches for the named contact (bio, quotes, career triggers) — see
`functions/src/services/research.ts`.

### Generation pipeline (`functions/src/services/content.ts` → `orchestrateGeneration`)

1. **Instant/hardcoded lookups**: cloud-ecosystem context, industry metrics, sheet-sourced pain points
   (`functions/src/data/*.ts`), and a score-based match against `REFERENCEABLE_STORIES`
   (`data/case-studies.ts` — region +50 / industry +40 / service +30 / cloud +10, min score 50, top 3).
   If no case study matches and "Intelligent Fallback" is off, generation short-circuits with
   `featureNotAvailable: true` rather than producing ungrounded content — **before** any Tavily call, since
   that branch discards the research anyway. Note `SERVICE_MATCH_GROUPS` in `case-studies.ts`: `secops` also
   accepts stories tagged Managed Services (inert today — both buckets are empty — but wired for when SecOps
   stories land).
2. **Live research** (`services/research.ts`): 8 parallel Tavily searches in Account mode (company/industry
   news, trends+ROI, pain points, Searce-scoped case-study search, plus 4 company social-handle searches —
   LinkedIn, X/Twitter, Instagram, and a Reddit discussion/reviews search), plus 6 more in Persona mode
   (interview/quote search, general activity/keyword search, and 4 domain-scoped profile searches — LinkedIn,
   X/Twitter, Instagram, Reddit — for the named person). All social searches use `includeDomains` scoped to
   the platform; Reddit's query differs (`"<anchor> reviews OR experience OR discussion"`, since Reddit has
   no "company/profile page" the way the others do). The social searches were added after confirming
   empirically that Tavily's index already holds public LinkedIn/X/Instagram/Reddit pages and returns full
   content for them — **login walls are not a blocker for Tavily's retrieval**; the gap was simply that
   nothing searched those domains before. **Caveat found during verification**: Tavily's `include_domains` is
   a soft preference, not a hard filter — for niche/low-social-footprint targets (e.g. Searce itself on
   Reddit) it can backfill with off-domain results instead of returning empty. Harmless in practice (backfill
   results just get deduped against the other searches by URL), but means genuine novel social signal is
   inconsistent for small B2B accounts; works well for entities with real social presence (verified against
   Sundar Pichai for persona mode: real X profile + posts, real Reddit discussion threads). Instagram is
   weakest for individuals without a public personal account (falls back to Wikipedia/blog-type results).
   All non-Searce web searches opt into **deep extraction** (`includeRawContent: true` on `tavilySearch`) so
   Tavily returns each page's full cleaned body (`raw_content`), not just the snippet. Raw results are
   relevance-filtered through a cheap Gemini pass (`summarizeResearch`/`summarizePersonaResearch`, which read
   `raw_content ?? content`, ~2500 chars/source) with a regex/keyword fallback if that call fails.
   `raw_content` is **stripped from the returned `sources`** before persistence — it's summarizer-only, and
   full-page bodies for every source would bloat the Firestore session doc. The two summarizer passes run in
   one `Promise.all` (they read independently-built corpora and neither consumes the other's output).
   **Cost / reuse:** every search uses `searchDepth: "advanced"` = **2 Tavily credits**, so an account run is
   ~16 credits and a persona run ~28 against the 1,000/month free tier (~62 / ~36 generations a month).
   `regenerateContent` therefore **reuses the research snapshot already persisted on the session** whenever
   `researchFingerprint()` (`services/research-fingerprint.ts`) shows the research-shaping inputs are
   unchanged — that covers both a plain regenerate and the Intelligence-Feed refocus, which are pure
   prompt-level changes. If you add a `GenerationInput` field that shapes a Tavily query, add it to
   `RESEARCH_INPUT_FIELDS` or the reuse path will serve stale research. `tavilySearch` and the Gemini calls
   each carry an `AbortSignal.timeout()`; a timeout degrades to "that source returned nothing" rather than
   eating the callable's 120s budget.
3. **Confidence score** (0–1): additive score in `computeConfidence` based on source count, whether live data
   was found, and case-study match quality. Surfaced to the rep as High/Medium/Low.
4. **Prompt assembly + Gemini generation** (`prompts/templates.ts` builds system/user prompts from a
   `ContentBrief`). Generation is **format-aware**:
    - Single-touch email formats (cold/sales/nurture/InMail) and any sequence-capable format with
      `sequenceCount > 1` (or `email_sequence`) go through **structured JSON output**
      (`generateStructuredWithGemini` + `SEQUENCE_SCHEMA`/`SINGLE_EMAIL_SCHEMA` in `services/output-schemas.ts`),
      then get reassembled into the marker-format string the UI parser expects
      (`services/output-assembler.ts`).
    - If structured generation fails, or the assembled result is too thin (`singleEmailAssembledHasSubstance`),
      it falls back to **text mode**: a plain-text prompt with an explicit `OVERRIDE — TEXT MODE` block telling
      Gemini not to return JSON, followed by a compliance check (`services/compliance.ts` — enforces word
      caps, paragraph-count bounds, sentence-length caps, required `===VERSION:LONG/SHORT===` or
      `EMAIL N` markers) and a single corrective retry at lower temperature if it fails.
    - Conversation Ad (`linkedin_conversational_ad`) always uses text mode; its multi-message structure isn't
      schema-fied.
    - The structured calls pass `thinkingLevel: LOW` (the schema already pins the shape); text mode keeps the
      client default of `MEDIUM`.
    - **Length caps are overridable.** `services/length-override.ts` `detectLengthOverride()` reads the rep's
      "Instructions to Strategist" text for an explicit directive ("~350 words", "no length limit"); when it
      fires, `output-assembler.enforceParagraphLengths` and the `compliance` length reasons stand down.
      Without it the assembler silently truncated drafts the rep had explicitly asked to be longer. Subject
      and preview caps are inbox constraints and are never overridden.
5. Session is persisted to Firestore (`strategist_sessions`) via the Admin SDK; client reads go through
   `listStrategistSessions` / `listFavoriteStrategistSessions` / `getStrategistSession` callables, never
   direct Firestore queries for the list views (only per-doc security-rule reads are allowed client-side).

### Case-study data pipeline

`functions/src/data/referenceable-stories.ts` is **generated**, not hand-written — regenerate it via
`scripts/extract-referenceable-from-pdf.mjs` (master-deck PDF → CSV) then
`scripts/build-referenceable-stories.mjs` (CSV → TS). Every field must trace back to the sheet; the prompt
rules forbid the model inventing client names, metrics, or URLs, so treat this file as source-of-truth data,
not something to hand-edit.

The same build script emits two more generated files from `scripts/case-study-urls.csv` (136 live
`searce.com/cs-N-detail` pages, transcribed from the "Website All Pages List" sheet):

- `components/strategist/research-data.ts` → `VERIFIED_SEARCE_LINKS`, the Intelligence Feed "Proof" tab's
  per-industry links. Built by joining `scripts/industry-case-study-links.csv` (industry → case study,
  transcribed from the curated "4. Pain Point to Solution Mapping" sheet) against the URL list — **64 real
  detail URLs across 8 industries**. Previously every entry pointed at the generic hub.
- `functions/src/data/case-study-urls.ts` → `VALID_CASE_STUDY_PATHS`, a runtime allowlist consumed by
  `output-assembler.isSearceUrl`. A host-only check let a model-invented `searce.com/cs-9999-detail` ship
  verbatim into an email; now anything shaped like a case-study detail path must exist in the allowlist.

The 255 master-deck stories themselves still carry the **hub** URL: their `client`/`title` fields come from
PDF extraction and don't reliably match the website's titles (the title join currently resolves 0 of 255, and
the build logs that count). Don't "fix" this with fuzzy matching — a wrong case-study link in outbound is
worse than a generic one.

`functions/src/data/legacy-codes.ts` translates old industry/persona-function codes from previously-saved
sessions into current taxonomy — needed because `GenerationInput` shape has evolved and old Firestore
documents/replays must still parse.

> **Trap when adding a `GenerationInput` field:** `migrateLegacyInput` in that file returns an **explicit
> allowlist object literal with no `...raw` spread**, and it is the first thing `orchestrateGeneration` runs
> (`content.ts`). A new field passes Zod's `.passthrough()`, survives the frontend twin `lib/legacy-codes.ts`
> (which _does_ spread) and Firestore — then is silently dropped before the prompt builder ever sees it. Add
> the key to that literal, or you get a field that "works in the UI and is ignored by the model".

### Services / practices

`SEARCE_SERVICES` (`lib/constants.ts`) is the dropdown; `SearceService` is mirrored by hand in **both**
`lib/types.ts` and `functions/src/types.ts` (nothing enforces they stay in sync).

- `GenerationInput.selectedService` is a **free string**, not the union. The ConfigPanel pairs the `<Select>`
  with a "Custom service (if not listed)" `<Input>` writing the same field — the same two-controls-one-field
  pattern already used for the persona job title. That's why no `customService` field exists (and it sidesteps
  the `legacy-codes.ts` trap above).
- **Never build a display label from the value.** The keys are historical: `finops_cost_optimization` is shown
  as "Managed Services", `enterprise_transformation` as "Future of Work". The old `value.replace(/_/g, " ")`
  was telling the model "finops cost optimization" when the rep had picked "Managed Services". Use
  `serviceLabel()` — `lib/constants.ts` for the client, `functions/src/data/labels.ts` for the backend. Both
  pass unknown (rep-typed) values through verbatim.
- Case-study `service` tags only cover cloud_modernization (152), data_analytics (46), location_intelligence
  (22), ai_automation (22), devops_platform_engineering (9), enterprise_transformation (4).
  `finops_cost_optimization` and `secops` have **zero** stories, so picking either scores no `+30` and
  matching falls back to region + industry + cloud. Nothing breaks; proof is just not service-filtered.

### Strategic Priority angle (`strategicAngle: "strategic_priority"`)

A 5th `StrategicAngle` (alongside pain_point/roi_metrics/social_proof/direct_pitch) that combines all three
into one narrative, grounded in curated per-industry research transcribed from CES 2026 "Industry Messaging"
docs. Shown in **both** Account and Persona modes (shared `STRATEGIC_ANGLES` selector in `lib/constants.ts`),
but resolves different data per mode in `resolveStrategicPriority` (`functions/src/services/content.ts`):
Account mode uses the industry's account-level `StrategicPriority` (rep-picked via the ConfigPanel
sub-selector, bound to `selectedStrategicPriorityId`, or auto-matched by job title); Persona mode uses that
persona's `PersonaMessaging`, falling back to the account-level priority if no persona match exists.

- **Data**: `scripts/strategic-priorities.source.json` (hand-curated, human-verified transcription) →
  `scripts/build-strategic-priorities.mjs` → `functions/src/data/strategic-priorities.ts` (full records +
  resolvers: `getStrategicPriorities`, `getStrategicPriorityById`, `matchStrategicPriority`,
  `getPersonaMessaging`) + `lib/strategic-priorities-index.ts` (lightweight client index for the
  ConfigPanel sub-selector). Currently covers **MCM (Manufacturing)** only — a vertical-slice proof; other
  industries need the same source → build-script treatment. Industries with no entry simply disable the
  angle button in the UI ("Not yet available for this industry").
- **Self-grounding**: this angle bypasses the `featureNotAvailable` early-exit in `orchestrateGeneration`
  (no case-study match required) as long as a `StrategicPriority`/`PersonaMessaging` record resolved —
  see the `!strategicPriority` condition on that gate.
- **Display**: surfaced in the Intelligence Feed as a "Strategic Priority" tab (`ResearchPanel.tsx`),
  becomes the default tab when present. Persisted on `StrategistSession`/`GenerateContentResponse` as
  `strategicPriority: StrategicPriorityDisplay | null` (mode-agnostic shape shared by both data sources).

### HubSpot integration

`functions/src/hubspot/` + the `pushToHubspotDrafts` callable create **draft** marketing emails in HubSpot —
manual, rep-triggered only, never invoked from `generateContent`/`regenerateContent`. Requires
`HUBSPOT_ACCESS_TOKEN`; the callable throws `failed-precondition` if unset, so this integration is optional
per-deployment. This targets HubSpot **Marketing Email** (Integrations → legacy apps); Sequences live under
Sales and are deliberately not wired up.

- **The rep picks which emails go.** `components/strategist/SendToHubspotDialog.tsx` opens from the "Send to
  HubSpot" button and defaults to the email currently on screen; "Select all" restores the old behaviour.
  Previously one click on a 5-email sequence silently created 5 drafts.
- **Preview text** rides along as a hidden preheader `<div>` at the top of the body
  (`buildPreheaderHtml`). HubSpot's Marketing Emails API has **no preheader field** — verified against both
  the v3 and 2026-03 OpenAPI specs, where the only "preview" property is `previewKey` (a preview-link token).
  Don't go looking for one.
- The create loop wraps each touch in its own try/catch and returns `{ created, failed }`. An unhandled throw
  mid-loop used to abandon already-created drafts in HubSpot without returning their URLs.

### UI gotchas

- **Intelligence Feed scrolling.** `feedScrollRegionClass` in `ResearchPanel.tsx` must stay free of
  `overscroll-contain`, and the feed `Card` needs a real `max-h`. `overscroll-behavior: contain` disables
  scroll chaining, so with the cursor over the feed the wheel never reached the page container
  (`<main class="overflow-auto">` in `app/strategist/layout.tsx`) and the rep couldn't scroll the page at all.
  The sibling `ConfigPanel`/`OutputEditor` scroll regions deliberately don't set it either.
- **Subject/preview cards are `<div role="button">`, not `<button>`.** A native button makes its text
  unselectable, and reps need to copy the preview line. The click handler ignores clicks that end a text
  selection (`hasTextSelection()` in `OutputEditor.tsx`).
- **Proof-tab dedupe keys on title, not URL.** When every story shared the hub URL, a URL-keyed filter made
  the entire `VERIFIED_SEARCE_LINKS` block vanish the moment there was one live match.

### Known stale references

`README.md` documents **Firecrawl** website crawling as part of the research pipeline and `functions/.env.sample`
still lists `FIRECRAWL_API_KEY` — but no Firecrawl client exists in `functions/src/` and it's not called
anywhere. Research is Tavily-only currently; don't assume Firecrawl is wired up without checking.

`README.md` also describes case studies as coming from Firestore. They don't — they're in-memory TS arrays
(`functions/src/data/referenceable-stories.ts`). The only Firestore access during generation is the final
session write.

## Environment / deployment gotchas (from README, still accurate)

- Firestore uses a **named database** (`searce-marketing`, set in `firebase.json`), not `(default)`. Both
  `NEXT_PUBLIC_FIRESTORE_DATABASE_ID` (frontend) and `FIRESTORE_DATABASE_ID` (`functions/.env`) must match it.
- `firestore.rules` (client-read authorization) and `firestore.indexes.json` (composite indexes for the
  `userId ==` + `orderBy(createdAt)` queries) are independent concerns — deploying functions does not deploy
  either.
