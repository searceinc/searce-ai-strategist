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
   `featureNotAvailable: true` rather than producing ungrounded content.
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
   full-page bodies for every source would bloat the Firestore session doc.
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
5. Session is persisted to Firestore (`strategist_sessions`) via the Admin SDK; client reads go through
   `listStrategistSessions` / `listFavoriteStrategistSessions` / `getStrategistSession` callables, never
   direct Firestore queries for the list views (only per-doc security-rule reads are allowed client-side).

### Case-study data pipeline

`functions/src/data/referenceable-stories.ts` is **generated**, not hand-written — regenerate it via
`scripts/extract-referenceable-from-pdf.mjs` (master-deck PDF → CSV) then
`scripts/build-referenceable-stories.mjs` (CSV → TS). Every field must trace back to the sheet; the prompt
rules forbid the model inventing client names, metrics, or URLs, so treat this file as source-of-truth data,
not something to hand-edit.

`functions/src/data/legacy-codes.ts` translates old industry/persona-function codes from previously-saved
sessions into current taxonomy — needed because `GenerationInput` shape has evolved and old Firestore
documents/replays must still parse.

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
per-deployment.

### Known stale reference

`README.md` documents **Firecrawl** website crawling as part of the research pipeline and `functions/.env.sample`
still lists `FIRECRAWL_API_KEY` — but no Firecrawl client exists in `functions/src/` and it's not called
anywhere. Research is Tavily-only currently; don't assume Firecrawl is wired up without checking.

## Environment / deployment gotchas (from README, still accurate)

- Firestore uses a **named database** (`searce-marketing`, set in `firebase.json`), not `(default)`. Both
  `NEXT_PUBLIC_FIRESTORE_DATABASE_ID` (frontend) and `FIRESTORE_DATABASE_ID` (`functions/.env`) must match it.
- `firestore.rules` (client-read authorization) and `firestore.indexes.json` (composite indexes for the
  `userId ==` + `orderBy(createdAt)` queries) are independent concerns — deploying functions does not deploy
  either.
