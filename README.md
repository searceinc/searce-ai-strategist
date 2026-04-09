# Searce AI Strategist

Internal B2B marketing content strategist for Searce. Researches target accounts using **Tavily** (web search) + **Firecrawl** (website crawling), finds proof points from Searce case studies, and generates high-conversion outreach content using **Gemini**.

---

## How It Works (Simple)

1. **You fill a form** — company name, website, persona job title, industry, region, format
2. **System researches the company** —
    - **Tavily** searches the web for recent news, industry trends, pain points, and metrics about the company and industry
    - **Firecrawl** crawls the company's actual website to understand their products, positioning, and priorities
3. **System finds proof points** — queries Searce's case study catalog for relevant success stories
4. **Gemini generates the content** — using all the research + proof + a carefully crafted prompt
5. **You edit & export** — tweak the draft, copy it, or download as `.txt`

### Why Tavily + Firecrawl?

| Tool          | What it does                                                   | Think of it as                               |
| ------------- | -------------------------------------------------------------- | -------------------------------------------- |
| **Tavily**    | Searches the open web for information about a topic            | "Google search, but returns structured data" |
| **Firecrawl** | Crawls a specific website and extracts its content as markdown | "Read the company's entire website for me"   |

Together they give the AI two layers of context:

- **Broad context** (Tavily): "What's happening with Netflix in 2026? What are media industry trends?"
- **Deep context** (Firecrawl): "What does Netflix's website actually say about their products, tech, and priorities?"

This dual approach is why the content feels specific and credible rather than generic.

---

## Architecture

```
┌───────────────────────────────────────────────────────┐
│  BROWSER (Next.js App)                                │
│                                                       │
│  app/              → Pages & routing                  │
│  components/       → React UI (shadcn/ui + Tailwind)  │
│  lib/firebase/     → Firebase Client SDK              │
│  lib/store/        → Zustand state management         │
│  lib/types.ts      → Client-side TypeScript types     │
│  lib/constants.ts  → Dropdown options, labels          │
└──────────────────────┬────────────────────────────────┘
                       │ httpsCallable
┌──────────────────────▼────────────────────────────────┐
│  GOOGLE CLOUD (Cloud Functions)                       │
│                                                       │
│  functions/src/index.ts      → Callable functions     │
│  functions/src/services/     → Business logic         │
│  functions/src/tavily/       → Tavily search client   │
│  functions/src/firecrawl/    → Firecrawl scrape client│
│  functions/src/gemini/       → Gemini LLM client      │
│  functions/src/prompts/      → Prompt templates       │
└───────────────────────────────────────────────────────┘
```

---

## Setup

### Prerequisites

- Node.js 22+
- Firebase CLI: `npm i -g firebase-tools`
- A Firebase project with **Authentication** and **Firestore (Native mode)** enabled

### 1. Clone & Install

```bash
npm install
cd functions && npm install && cd ..
```

### 2. Environment Variables

**Root `.env.local`** (Next.js app):

```bash
# Firebase config (from Firebase Console → Project Settings → Web app)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...

# If using a named Firestore database (not "default")
NEXT_PUBLIC_FIRESTORE_DATABASE_ID=searce-marketing

# Region where Cloud Functions are deployed (must match Firebase console; often us-central1)
# NEXT_PUBLIC_FIREBASE_FUNCTIONS_REGION=us-central1
```

**`functions/.env`** (Cloud Functions):

```bash
TAVILY_API_KEY=tvly-...           # Get from https://tavily.com
GEMINI_API_KEY=...                # Get from https://aistudio.google.com/apikey
FIRECRAWL_API_KEY=fc-...          # Get from https://firecrawl.dev (optional but recommended)
FIRESTORE_DATABASE_ID=searce-marketing  # Must match the Next.js value
```

### 3. Get API Keys

| Key           | Where to get it                                                  | Cost                           |
| ------------- | ---------------------------------------------------------------- | ------------------------------ |
| **Tavily**    | [tavily.com](https://tavily.com) — sign up, get API key          | Free tier: 1000 searches/month |
| **Gemini**    | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) | Free tier available            |
| **Firecrawl** | [firecrawl.dev](https://firecrawl.dev) — sign up, get API key    | Free tier: 500 pages/month     |

Firecrawl is **optional** — the system works without it but produces better content when it can crawl the target company's website.

### 4. Firestore: `firestore.rules` vs `firestore.indexes.json`

| File                         | What it does                                                                                                                                                                                                                                              |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`firestore.rules`**        | **Security** — who may read/write which documents (e.g. users may read only their own `strategist_sessions`). Client SDK enforces this; Admin SDK does not.                                                                                               |
| **`firestore.indexes.json`** | **Query performance** — composite/sorted indexes Firestore needs for queries like `where("userId", "==", …)` + `orderBy("createdAt", "desc")`. Without the right index, those queries **fail** (with a link to create it). This is **not** authorization. |

Both are referenced from `firebase.json` under `firestore`.

**Named database:** This repo sets `"database": "searce-marketing"` in `firebase.json` so `firebase deploy --only firestore` applies rules and indexes to that database, **not** `(default)`. If you omit `database`, the CLI targets `(default)` only — which often fails with errors like `ANY_API ApiScope is not supported for Datastore Mode databases` when `(default)` is an old **Datastore mode** database while your app uses a **Native mode** database such as `searce-marketing`. Use the Native Firestore database ID that matches `NEXT_PUBLIC_FIRESTORE_DATABASE_ID` / `FIRESTORE_DATABASE_ID`.

### 5. Deploy (functions + rules + indexes)

`firebase deploy --only functions` **only** updates Cloud Functions. It does **not** deploy rules or indexes.

**First time / after changing rules, indexes, or function code**, build functions then deploy everything Firestore-related plus functions:

```bash
firebase login
cd functions && npm run build && cd ..
firebase deploy --only functions,firestore
```

`firestore` here deploys **both** `firestore.rules` and `firestore.indexes.json` (see `firebase.json`).

To deploy **only** one piece:

```bash
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
firebase deploy --only functions
```

If the `firebase` CLI is not on your PATH, use the same flags with **`npx firebase-tools`** (e.g. `npx firebase-tools deploy --only functions,firestore`).

Callable functions include **`listStrategistSessions`**, **`listFavoriteStrategistSessions`**, and **`getStrategistSession`**. **Set `FIRESTORE_DATABASE_ID` in `functions/.env` to match `NEXT_PUBLIC_FIRESTORE_DATABASE_ID`** in the Next.js app when using a non-default database.

### 6. Run Locally

```bash
npm run dev    # Starts Next.js at localhost:3000
```

### 7. Seed Firestore (Optional)

Populate these collections in your Firestore database for better results:

| Collection        | Purpose                                  | Required?                              |
| ----------------- | ---------------------------------------- | -------------------------------------- |
| `case_studies`    | Searce success stories (proof points)    | Optional — falls back to benchmarks    |
| `service_catalog` | Searce service descriptions & benefits   | Optional — auto-recommends still works |
| `persona_catalog` | Persona pain points & messaging patterns | Optional — research fills the gap      |

Without seed data the system still generates content — it just can't cite specific Searce case studies.

---

## Generation Pipeline

```
User clicks Generate
    │
    ▼ (Cloud Function)
Phase 1 — Parallel research (all run at the same time):
    ├─ Tavily: 4-5 web searches (company news, industry trends, pain points)
    ├─ Firecrawl: crawl company website (homepage, about, products, services)
    ├─ Firestore: find matching case studies (5-tier fallback)
    ├─ Firestore: get service info
    └─ Firestore: get persona info

Phase 2 — Build brief:
    ├─ Merge all research into a ContentBrief
    └─ Compute confidence score (0.0 → 1.0)

Phase 3 — Generate with Gemini:
    ├─ System prompt (writing rules, Searce voice)
    └─ User prompt (full brief with all context)

Phase 4 — Save & return:
    └─ Save session to Firestore, return content to browser
```

### Confidence Score

The confidence score (shown as High / Medium / Low) reflects how much supporting data was found:

| Factor                 | Points |
| ---------------------- | ------ |
| Base score             | +0.30  |
| 3+ research sources    | +0.15  |
| Company context found  | +0.10  |
| Pain points found      | +0.05  |
| Metrics found          | +0.05  |
| Exact case study match | +0.20  |
| Service catalog match  | +0.05  |
| Persona catalog match  | +0.05  |

Higher confidence = more specific, credible content.

---

## Firestore Collections

| Collection            | Written by      | Read by                     |
| --------------------- | --------------- | --------------------------- |
| `strategist_sessions` | Cloud Functions | Client (history, favorites) |
| `case_studies`        | Manual / seed   | Cloud Functions             |
| `service_catalog`     | Manual / seed   | Cloud Functions             |
| `persona_catalog`     | Manual / seed   | Cloud Functions             |

---

## Tech Stack

| Layer         | Technology                                       |
| ------------- | ------------------------------------------------ |
| Frontend      | Next.js (App Router) + TypeScript + Tailwind CSS |
| UI            | shadcn/ui (Radix primitives)                     |
| State         | Zustand                                          |
| Auth          | Firebase Authentication                          |
| Database      | Cloud Firestore (Native mode)                    |
| Server        | Cloud Functions for Firebase (Node.js 22)        |
| Web Search    | Tavily Search API                                |
| Website Crawl | Firecrawl API                                    |
| LLM           | Google Gemini (via @google/genai)                |
| Validation    | Zod                                              |
