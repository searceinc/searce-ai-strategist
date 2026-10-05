# Searce AI Content Strategist — Project Dossier

> **Purpose.** Two jobs: (1) brief a fresh Claude session so it understands this project end to end,
> and (2) act as source material for resume bullets.
>
> **How to read the numbers.** Every figure is tagged:
>
> - `[MEASURED]` — counted directly in the codebase or produced by a command. Defensible verbatim.
> - `[DERIVED]` — arithmetic on measured facts (e.g. searches × credits). Defensible if you can
>   explain the arithmetic.
> - `[MODELLED]` — depends on an assumption, always stated inline. **Validate the assumption before
>   using it**, and quote it as a range, not a fact.
> - `[TODO]` — only you can supply this. Do not guess it.
>
> Nothing here is invented. Where a number could not be verified, it says so.

---

## 1. What it is

An internal B2B marketing tool for Searce. A rep fills in a target account (or a named individual,
or a segment); the system researches it live on the web, matches it against a curated catalogue of
real Searce case studies, and drafts grounded outbound content — cold emails, LinkedIn InMails,
multi-touch sequences, conversation ads — then pushes the chosen ones into HubSpot as draft
marketing emails.

The constraint that shapes everything: **the model is not allowed to invent proof.** Client names,
metrics and URLs must trace to curated data, and runtime guards strip fabrications before they reach
an email.

### Architecture — two deployables, no server between them

```
┌────────────────────────────────────────────┐
│  Browser — Next.js 16 static export (SPA)  │
│  app/ components/ lib/                     │
│  Zustand state · shadcn/ui · Tailwind 4    │
└───────────────────┬────────────────────────┘
                    │ httpsCallable (9 functions)
┌───────────────────▼────────────────────────┐
│  Firebase Cloud Functions Gen 2 · Node 22  │
│  functions/src/                            │
│                                            │
│   Tavily    ──► live web research          │
│   Gemini    ──► summarise + generate       │
│   HubSpot   ──► create email drafts        │
│   Firestore ──► session persistence        │
└────────────────────────────────────────────┘
```

`output: "export"` — **no Next.js server in production**. The frontend is a static bundle on
S3/CloudFront talking to Cloud Functions. `[MEASURED]`

---

## 2. Before vs after — the core of the resume story

**The "before" is not "a slower tool". It is "no tool".** Stated by the project owner:

> "There was nothing like this in-house — automation and creation of messages. People were drafting
> emails on their own using the previous company data and online sources. Nothing unified at one
> place that integrates with HubSpot and maintains a log of records."

| Dimension                   | Before                                                       | After                                                                                  |
| --------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| **Research**                | Rep manually googles the account, reads news, hunts LinkedIn | 8 parallel Tavily searches per account run, auto-summarised `[MEASURED]`               |
| **Proof points**            | Rep hunts a 255-story master deck by hand                    | Scored match over 255 stories, top 3 returned instantly `[MEASURED]`                   |
| **Pain points**             | Tribal knowledge / ad-hoc                                    | 330 curated pain points, 9 industries, 173 sub-categories `[MEASURED]`                 |
| **Messaging**               | Written from scratch each time                               | 35 curated strategic priorities across 7 industries `[MEASURED]`                       |
| **Consistency**             | Every rep's email differs                                    | One 4T framework, enforced by schema + compliance pass `[MEASURED]`                    |
| **Fabrication risk**        | Rep might misquote a metric                                  | Model forbidden from inventing; URLs checked against a 135-path allowlist `[MEASURED]` |
| **CRM**                     | Manual copy-paste into HubSpot                               | One click creates draft marketing emails via API `[MEASURED]`                          |
| **Record of what was sent** | None                                                         | Every run persisted as a replayable Firestore session `[MEASURED]`                     |
| **Reuse**                   | None                                                         | Session history + favourites, re-openable and regenerable `[MEASURED]`                 |
| **Time to first draft**     | See §6 Throughput                                            | `[MODELLED]` — assumption stated there                                                 |

---

## 3. How one generation actually works

What happens when a rep clicks **Generate**. Parallel vs sequential is marked — a common interview
question.

| #   | Step                                                                              | Parallel?                    | Cost                |
| --- | --------------------------------------------------------------------------------- | ---------------------------- | ------------------- |
| 1   | Validate input (Zod), migrate legacy field names                                  | —                            | instant             |
| 2   | In-memory lookups: cloud context, industry metrics, pain points, case-study match | —                            | instant, no network |
| 3   | Guard: no case study + fallback off → exit before spending anything               | —                            | instant             |
| 4   | Tavily searches — 8 account / 14 persona / 4 generic                              | **all parallel**             | 2 credits each      |
| 5   | Two Gemini passes summarise + relevance-filter the results                        | **parallel with each other** | 2 LLM calls         |
| 6   | Assemble system + user prompt from a `ContentBrief`                               | —                            | instant             |
| 7   | Gemini writes the content (schema-constrained JSON)                               | sequential, up to 3 attempts | 1–3 LLM calls       |
| 8   | Assemble to marker format, enforce length, strip fabricated links                 | —                            | instant             |
| 9   | Persist session to Firestore                                                      | —                            | 1 write             |

Steps 4 → 5 → 7 are inherently sequential — you cannot summarise searches before they return, or
write before you have research. Everything _within_ 4 and 5 is parallelised.

**Generation is format-aware** `[MEASURED]`: single emails and sequences use structured JSON output
against a JSON Schema, then get reassembled. If that fails or returns something too thin, it falls
back to text mode with an explicit override block, then a compliance check, then one corrective
retry at lower temperature. Conversation Ads always use text mode.

---

## 4. Feature inventory

### Three generation modes

| Mode                  | Target                                                             | Research    | Cost/run               |
| --------------------- | ------------------------------------------------------------------ | ----------- | ---------------------- |
| **Account**           | One named company                                                  | 8 searches  | 16 credits `[DERIVED]` |
| **Persona**           | A named individual — bio, quotes, career triggers                  | 14 searches | 28 credits `[DERIVED]` |
| **Generic / Segment** | A roster of companies sharing filters; names never reach the model | 4 searches  | 8 credits `[DERIVED]`  |

### Intelligence Feed

A live research panel beside the draft — company news, industry trends, ROI metrics, pain points,
social signals, and a **Proof tab** of verified Searce case studies. Clicking any signal refocuses
the email on it and regenerates the copy **without re-running research**.

### HubSpot integration

One endpoint: `POST /marketing/v3/emails` `[MEASURED]`. Creates **unpublished drafts only** — never
sends. The rep picks which emails go, with a per-email choice of subject/preview variant. Preview
text ships as a hidden preheader `div`, because HubSpot's Marketing Emails API has **no preheader
field** — verified against both the v3 and 2026-03 OpenAPI specs, where the only "preview" property
is `previewKey`, a preview-link token. `[MEASURED]`

### Bulk prospect upload

CSV/XLSX parsed client-side with fuzzy header matching (keyword + Levenshtein), up to 3,000 rows,
persisted to Firestore. Selecting a company auto-fills its website and LinkedIn. `[MEASURED]`

### Guardrails

- JSON Schema-constrained output for structural guarantees
- Compliance pass enforcing word caps, paragraph bounds, sentence-length caps, required markers
- `stripNonSearceLinks` + a 135-path allowlist that removes invented case-study URLs
- Prompt rules forbidding invented client names, metrics, URLs
- Length caps overridable only by an explicit rep instruction

---

## 5. The data foundation — why output is grounded, not generic

Four source documents were transcribed, scripted into build pipelines, and made queryable. **None of
this was accessible to a rep before.**

| Source                                      | What it became                           | Size `[MEASURED]`                                                                                     |
| ------------------------------------------- | ---------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| "Mapped Pain Points and Use Cases" workbook | Industry taxonomy + pain-point catalogue | 9 industries · 39 categories · 173 sub-categories · **330 pain points**                               |
| Same workbook, Sheet 6                      | Practice-relevance scoring               | 330 rows × 6 practices                                                                                |
| Master deck PDF (Solution Stories)          | Referenceable case-study catalogue       | **255 stories**, 243 distinct clients                                                                 |
| CES 2026 Industry Messaging docs            | Strategic-priority messaging             | **35 priorities · 67 persona-messaging records · 37 use cases · 43 case studies** across 7 industries |
| "Website All Pages List" sheet              | Live case-study URL map                  | 136 URLs → 64 curated per-industry links + a 135-path allowlist                                       |

**Case-study breakdown** `[MEASURED]` — every dimension sums to 255:

- Region: APAC 165 · AMER 72 · EMEA 14 · India 4
- Service: Cloud Modernisation 152 · Data & Analytics 46 · Applied AI 22 · Location Intelligence 22 · Software Engineering 9 · Future of Work 4
- Cloud: GCP 244 · AWS 9 · multicloud 2

**Matching** is an additive score `[MEASURED]`: region +50, industry +40, service +30, cloud +10;
keep ≥50, top 3. Region fallback (e.g. EMEA → India) when nothing matches.

**Three build pipelines** turn source sheets into typed TypeScript so nothing is hand-edited:
`build-sheet-data.mjs`, `build-referenceable-stories.mjs`, `build-strategic-priorities.mjs` —
1,704 lines of build tooling. `[MEASURED]`

---

## 6. The numbers

### Scale `[MEASURED]`

| Metric                       | Value                                                          |
| ---------------------------- | -------------------------------------------------------------- |
| Total lines (TS/TSX/MJS)     | 37,165 across 99 files                                         |
| **Hand-written**             | **15,733**                                                     |
| Generated data files         | 21,432 across 8 files                                          |
| Prompt engineering           | 995 lines across 3 files                                       |
| Backend service layer        | 2,714 lines across 9 files                                     |
| Cloud Functions              | 9, all Gen 2 callables                                         |
| Firestore collections        | 2                                                              |
| Frontend routes              | 7                                                              |
| First-party React components | 13 (+16 shadcn primitives)                                     |
| External APIs integrated     | 3 (Gemini, Tavily, HubSpot) + Firebase                         |
| Duration                     | 5 months (2026-03-31 → 2026-08-31), 17 commits, sole developer |

**Configuration surface** `[MEASURED]`: 6 content formats · 5 strategic angles · 8 services · 4
regions · 3 cloud ecosystems · 11 industries · 39 persona titles across 11 categories · 4 buying
roles · 3 nurture templates · 3 sequence lengths · 2 InMail variations.
`GenerationInput` has 26 fields, of which **~15 are rep-facing in a standard run** (4
mode-conditional, 3 format-conditional, 1 angle-conditional, 2 never reach the model).

### Cost engineering

All 16 Tavily call sites use `searchDepth: "advanced"` = **2 credits per search** `[MEASURED]`.

| Mode    | Searches | Credits/run `[DERIVED]` | Runs on the 1,000/mo free tier `[DERIVED]` |
| ------- | -------- | ----------------------- | ------------------------------------------ |
| Account | 8        | 16                      | ~62                                        |
| Persona | 14       | 28                      | ~36                                        |
| Generic | 4        | 8                       | ~125                                       |

**The optimisation that matters:** Regenerate and Intelligence-Feed refocus are _prompt-level_
changes — same company, same research — yet previously re-ran the full fan-out. A 7-field
fingerprint over the inputs that actually shape a query now lets them reuse the persisted snapshot,
**eliminating 16–28 credits and the entire research phase per repeat action** `[DERIVED]`. Reps
iterate on tone repeatedly, so this is the dominant saving.

Generic mode additionally skips the 4 company-social searches (searching LinkedIn for
"Manufacturing" is noise), **halving cost from 16 to 8 credits** `[DERIVED]`.

### Performance work `[MEASURED]` (structural; wall-clock not instrumented — see §11)

| Change                         | Before                                                      | After                               |
| ------------------------------ | ----------------------------------------------------------- | ----------------------------------- |
| Research on regenerate         | Full 8–14 search fan-out + 2 LLM passes                     | Reused from session                 |
| Two summariser passes          | Sequential                                                  | One `Promise.all`                   |
| No-match early exit            | Ran all research, then discarded it                         | Exits before spending               |
| Tavily timeout                 | **none** — a hang could eat the 120s budget                 | 12s, degrades to "no result"        |
| Gemini timeout                 | **none**                                                    | 45s                                 |
| Structured-generation thinking | MEDIUM (~2,000 tokens on reasoning alone, per code comment) | LOW — schema already pins the shape |
| History list query             | Fetched **whole** session docs incl. full research snapshot | Projects 9 fields                   |
| Favourites query               | **No limit** — every favourite, full size                   | Capped at 100, projected            |

### Quality / anti-fabrication `[MEASURED]`

- **135-path runtime allowlist** — an invented `searce.com/cs-9999-detail` is stripped; a real
  `cs-70-detail` passes. Verified by direct test.
- **64 verified case-study URLs** across 8 industries replaced 27 generic hub links.
- Prompt rules forbid inventing client names, metrics, or URLs.
- Fixed a dedupe bug that made the entire verified-links block vanish whenever there were live
  matches.

### Throughput `[MODELLED]` — validate before using

> **Assumption (yours to confirm):** manually researching an account and drafting a 5-email
> sequence — reading news, finding a relevant case study in a 255-story deck, checking pain-point
> material, writing and editing — took a rep **60–90 minutes**.

Against that assumption, a generated draft arrives in roughly **1–2 minutes** plus review — a
**~95% reduction in time-to-first-draft**. **The 60–90 minute figure is load-bearing: if you cannot
defend it in an interview, quote the capability instead of the percentage.**

`[TODO]` Reps actively using it · emails generated to date · accounts targeted · campaigns shipped.

---

## 7. Engineering decisions worth discussing in an interview

These are the judgement calls, and they interview better than a feature list.

1. **Refused a fuzzy join rather than ship wrong data.** Matching 255 deck stories to 136 live
   case-study pages resolved 0/255 by title; a company-name join produced false positives (a story
   labelled "Reduction" matching another client's page). A wrong case-study link in a sales email is
   worse than a generic one, so the join was left unused and _logged_, and the problem solved from a
   different, human-curated source. **Knowing when not to ship a heuristic.**

2. **Closed a live fabrication path.** The prompt advertised a URL pattern (`/archive/cs-[ID]-detail`)
   that no data backed, while the link filter allowlisted _any_ `searce.com` host — so an invented ID
   shipped verbatim into outbound. Fixed at both ends.

3. **Chose lookup over pattern-matching for LinkedIn URLs.** The obvious approach — derive
   `linkedin.com/company/<name>` — is wrong: Searce's slug is `searceinc`. A guessed URL is
   indistinguishable from a real one until a prospect clicks it. The URL is instead _found_ in
   search results already being paid for, filtered to `/company/` paths, and left blank if absent.

4. **Cache invalidation via input fingerprinting.** Only 7 of 26 input fields shape a Tavily query.
   Fingerprinting exactly those lets prompt-level changes reuse research while genuine target changes
   correctly refetch. Subtle bug caught: autofilling a domain back into the input would change the
   fingerprint and silently re-spend credits — handled by persisting the enriched input.

5. **A data-layer trap, documented rather than papered over.** The server-side legacy-input migrator
   is an explicit allowlist with no spread, while its client twin _does_ spread — so a new field
   works in the browser, saves to Firestore, and vanishes server-side. Documented in `CLAUDE.md` as
   the highest-risk trap in the codebase.

6. **Schema-constrained generation with a graceful ladder.** Structured JSON first (guarantees
   shape), text-mode fallback if it fails, compliance check, one corrective retry at lower
   temperature. Reliability without hard failure.

7. **Honest degradation everywhere.** Every Tavily call is wrapped so a failure becomes "that source
   returned nothing" rather than a failed generation.

---

## 8. Tech stack `[MEASURED]`

**Frontend** — Next.js 16.2.1 (App Router, `output: "export"`) · React 19.2.4 · TypeScript 5 ·
Tailwind CSS 4 · shadcn/ui on Radix · Zustand 5 · Zod 4 · `sonner` · `lucide-react` · `next-themes`
· SheetJS (`xlsx`) for CSV/XLSX parsing.

**Backend** — Firebase Cloud Functions Gen 2 · Node 22 · TypeScript 6 · ESM · `@google/genai` 1.48 ·
`firebase-admin` 13.7 · Zod 4.

**AI / data** — Google Gemini (`gemini-3.5-flash`, temp 0.4 / 0.25 on retry, 4096–6144 max output
tokens, JSON-Schema structured output) · Tavily Search API (advanced depth, deep extraction via
`include_raw_content`) · HubSpot Marketing Emails API v3.

**Infra** — Firestore (named database) · Firebase Auth (Google OAuth) · S3 + CloudFront static
hosting · GitHub.

**Tooling** — ESLint 9 · Prettier 3.8.1 · Husky · lint-staged · custom Node build scripts.

---

## 9. Resume bullets — ready to paste

Each traces to a tagged number above. Pick 4–6.

**Strongest (all `[MEASURED]` or `[DERIVED]`):**

- Built and shipped an internal AI content-generation platform end to end — Next.js 16 static SPA +
  9 Firebase Gen 2 Cloud Functions — replacing a fully manual outbound-drafting process with no
  prior in-house tooling; 15,733 hand-written lines over 5 months as sole developer.

- Designed a retrieval-grounded generation pipeline over **255 curated case studies, 330 industry
  pain points and 35 strategic-priority messaging records**, so AI-generated outbound cites only
  verified client proof instead of plausible-sounding invention.

- Cut repeat-generation cost by **16–28 API credits per action (100% of the research phase)** by
  fingerprinting the 7 of 26 input fields that actually shape a search query, letting prompt-level
  regenerations reuse a persisted research snapshot.

- Eliminated a live content-fabrication path where model-invented case-study URLs shipped into
  customer-facing email, by generating a **135-path runtime allowlist** from source-of-truth data
  and rewriting a link filter that had allowlisted any company-domain URL.

- Integrated the HubSpot Marketing Emails API for one-click draft creation with per-email selection,
  replacing manual copy-paste; added per-touch error isolation so a partial failure returns the
  drafts that succeeded instead of orphaning them.

- Reduced list-view payloads by projecting **9 fields instead of whole session documents** — the
  query had been transferring full research snapshots to render a 120-character preview.

- Engineered a 3-mode generation system (account / named-persona / industry-segment) across 6
  content formats and 5 strategic angles, with schema-constrained JSON output, a compliance
  validator, and a graceful text-mode fallback.

**Use only if you can defend the assumption (`[MODELLED]`):**

- Reduced time-to-first-draft for a researched, proof-backed outbound sequence from ~60–90 minutes
  of manual work to ~2 minutes of generation plus review (~95%).

**Fill in, then use (`[TODO]`):**

- Adopted by **[N]** sales and marketing users across **[N]** industry verticals, generating **[N]**
  outbound assets.

---

## 10. What is explicitly NOT built

Read this before an interview — do not over-claim.

| Not built                        | Reality                                                                                                                                                                                                                      |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Image / creative generation**  | None. Only `gemini-3.5-flash`, text and JSON. The "banner" in the HubSpot template is a hardcoded static PNG.                                                                                                                |
| **HubSpot Sequences**            | Not integrated. Only `POST /marketing/v3/emails`. ⚠️ The codebase's `email_sequence` / `sequenceCount` are _content-format_ concepts (how many touches of copy the model writes) — unrelated to HubSpot's Sequences product. |
| **Sending email**                | Drafts only. A human sends from HubSpot.                                                                                                                                                                                     |
| **Firecrawl / website crawling** | Never wired up, despite `README.md` listing it in the tech-stack table. Research is Tavily-only.                                                                                                                             |
| **Anthropic SDK**                | In `package.json`, imported nowhere. Dead dependency.                                                                                                                                                                        |
| **Automated tests**              | None — no test file, runner, or script. Quality is ESLint + Prettier + Husky + lint-staged + TypeScript strictness.                                                                                                          |
| **Server-side authorisation**    | The 15-email allowlist is **client-side only** and ships in the browser bundle. Server-side, callables check only that a user is authenticated. Describe it as a UI gate, not access control.                                |

---

## 11. Known limitations and honest gaps

- **No production telemetry.** Latency and token spend were never instrumented, so speed claims are
  structural ("this step no longer runs"), not measured wall-clock. Adding timing logs would convert
  several `[MODELLED]` numbers into `[MEASURED]` ones — a good next step to mention in an interview.
- **255/255 case-study records still carry the generic hub URL.** The master-deck PDF extraction put
  project titles in the client-name column, so no safe join exists. Only the curated per-industry
  list has deep links.
- **Generic mode assumes a single-industry roster.** A mixed list produces copy for whichever
  industry was selected; nothing enforces this yet.
- **Two of nine industries** (Energy/Utilities, Public Sector) have no strategic-priority data.
- **Managed Services and SecOps have zero tagged case studies**, so those selections fall back to
  region + industry matching.
- **No test suite.**
- **`README.md` is stale** — claims Firecrawl and Firestore-sourced case studies, both false.
  `CLAUDE.md` is the accurate reference.

---

## 12. Repo orientation for a future Claude session

```
app/                        7 routes; static export, no server
components/strategist/      ConfigPanel (form) · ResearchPanel (Intelligence Feed)
                            OutputEditor (draft) · SendToHubspotDialog
lib/                        types · constants · Zustand store · Firebase client · parsers
functions/src/
  index.ts                  9 callables
  services/research.ts      Tavily fan-out + Gemini summarisers (902 lines)
  services/content.ts       orchestrateGeneration — the pipeline (695 lines)
  prompts/                  system + content prompts, 4T framework (995 lines)
  services/output-*.ts      JSON schemas, assembly, length enforcement
  services/compliance.ts    validation + corrective retry
  hubspot/                  Marketing Email draft creation
  data/                     generated catalogues + hand-maintained lookups
scripts/                    3 data build pipelines (sheets/PDF → typed TS)
```

**Read `CLAUDE.md` first** — it documents the architecture, pipeline and known traps accurately.
Do **not** trust `README.md`.
