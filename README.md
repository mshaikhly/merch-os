# Merch OS

An AI-powered merch workflow that turns a raw client brief into polished design directions and a fully scaffolded Notion workspace using Gemini, the Notion API, and optional Model Context Protocol (MCP) tooling.

# Demo Video

Watch the demo here:

https://www.loom.com/share/fe849b96e4a54130bb091880e7393fd2

## Contents

- [Merch OS](#merch-os)
- [Demo Video](#demo-video)
  - [Contents](#contents)
  - [Overview](#overview)
  - [Key Capabilities](#key-capabilities)
  - [Architecture](#architecture)
  - [Repository Layout](#repository-layout)
  - [Requirements](#requirements)
  - [Environment Variables](#environment-variables)
    - [Backend (`backend/.env`)](#backend-backendenv)
    - [Frontend (`frontend/.env.local`)](#frontend-frontendenvlocal)
  - [Setup](#setup)
  - [API Reference](#api-reference)
    - [`POST /api/generate-directions`](#post-apigenerate-directions)
    - [`POST /api/create-workspace`](#post-apicreate-workspace)
    - [`GET /api/mcp-tools`](#get-apimcp-tools)
    - [`POST /api/create-workspace-mcp`](#post-apicreate-workspace-mcp)
  - [Notion Workspace Blueprint](#notion-workspace-blueprint)
  - [Frontend Experience](#frontend-experience)
  - [Model Context Protocol Integration](#model-context-protocol-integration)
  - [Testing \& Verification](#testing--verification)
  - [Deployment Notes](#deployment-notes)
  - [Troubleshooting](#troubleshooting)
  - [Contributing \& Next Steps](#contributing--next-steps)
  - [License](#license)

## Overview

Merch OS is purpose-built for the Notion MCP Challenge. The workflow is intentionally short:

1. A merch lead fills in the client brief inside the Next.js UI.
2. The frontend calls `/api/generate-directions`, which forwards the structured brief to Gemini 2.5 Flash.
3. The backend returns three creative directions ready for internal review.
4. The user selects a direction, then calls `/api/create-workspace`.
5. The backend converts the brief and direction into a Notion parent page, sub-pages, and inline databases with seeded tasks & milestones.
6. (Optional) The same flow can be executed through the Notion MCP server for teams leaning on MCP tooling.

The project optimises for clarity and hackathon-friendly iteration: minimal dependencies, zero scaffolding hype, and a direct mapping from UI inputs to Notion artifacts.

## Key Capabilities

- Generate three on-brief merch directions with Gemini, including hooks, typography notes, palette suggestions, and rationale.
- One-click Notion workspace creation: brand brief page, design direction summary, reusable feedback section, production task database, and milestone tracker.
- Task and milestone seeding adapts to the selected direction (e.g., front/back print tasks, typography refinements, garment-specific mockups).
- Optional MCP transport lets you call Notion APIs through a remote tool server while still leveraging the existing workspace-creation logic.
- Fully client-side App Router experience with Tailwind styling and immediate feedback loops on success/error states.
- Lightweight directories (`docs/`, `examples/`, `prompts/`) for storing briefs, diagrams, and MCP prompt artifacts outside of runtime code.

## Architecture

```
Frontend (Next.js 16 App Router)
  |-- collects brief input, renders AI directions, drives Notion creation
  |-- uses fetch -> NEXT_PUBLIC_API_BASE_URL

Backend (Express 5)
  |-- /api/generate-directions -> Gemini 2.5 Flash
  |-- /api/create-workspace -> Notion API (pages + inline DBs)
  |-- /api/create-workspace-mcp and /api/mcp-tools -> MCP HTTP transport
  |-- services: geminiService, notionService, notionMcpService/client

External
  |-- Google Generative AI (Gemini) for creative copy + structure
  |-- Notion API and/or MCP tool server for workspace generation
```

`backend/src/services/notionService.js` hosts the data model for workspace setup. Databases are created inline beneath the generated parent page so creators can work without navigating elsewhere in Notion.

## Repository Layout

| Path | Purpose |
| --- | --- |
| `frontend/` | Next.js 16 App Router UI (TypeScript + Tailwind). Main screen lives in `app/page.tsx`. |
| `backend/` | Express API with Gemini + Notion integrations. Routes under `src/routes/`; integrations under `src/services/`. |
| `docs/`, `examples/`, `prompts/` | Optional references for briefs, diagrams, and MCP prompt assets. Keep curated artifacts only. |
| `AGENTS.md` | Repository-wide conventions for agents/contributors (coding style, testing policy, env notes). |
| `LICENSE` | MIT license for the project. |

## Requirements

- Node.js 20.x (Next.js 16 and Express 5 both target Node 18+, use 20.x for parity between apps).
- npm 10+ (bundled with Node 20).
- Access to Google Gemini (API key with the 2.5 Flash model).
- Notion API integration with access to the parent page where workspaces should be created.
- Optional: MCP server URL + bearer token if you plan on hitting Notion via Model Context Protocol.

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
| --- | --- | --- |
| `PORT` | No (default `4000`) | HTTP port for the Express server. |
| `GEMINI_API_KEY` | Yes | Google Generative AI key used by `geminiService.js`. Needs access to `gemini-2.5-flash`. |
| `NOTION_API_KEY` | Yes | Notion integration secret for `@notionhq/client`. |
| `NOTION_PARENT_PAGE_ID` | Yes | The Notion page ID under which all generated workspaces should be nested. |
| `MCP_SERVER_URL` | Optional | Base URL of the MCP-compatible Notion bridge. Required when calling `/api/create-workspace-mcp` or `/api/mcp-tools`. |
| `MCP_AUTH_TOKEN` | Optional | Bearer token sent to the MCP server. Matches whatever auth scheme that server expects. |

Example `.env` stub:

```bash
PORT=4000
GEMINI_API_KEY=sk-your-gemini-key
NOTION_API_KEY=secret_your_notion_key
NOTION_PARENT_PAGE_ID=xxxxxxxxxxxxxxxxxxxxxx
MCP_SERVER_URL=https://your-mcp-host.example.com
MCP_AUTH_TOKEN=notion-mcp-token
```

### Frontend (`frontend/.env.local`)

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | Yes | Base URL for API calls (e.g. `http://localhost:4000/api`). Must include `/api`. |

Example:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api
```

## Setup

1. **Clone & install dependencies**
   ```bash
   git clone https://github.com/your-org/merch-os.git
   cd merch-os
   cd backend && npm install
   cd ../frontend && npm install
   ```
2. **Configure environment files**
   - `backend/.env` with the Gemini + Notion secrets (see table above).
   - `frontend/.env.local` with `NEXT_PUBLIC_API_BASE_URL`.
3. **Run the backend**
   ```bash
   cd backend
   npm run dev   # nodemon with hot reload
   ```
   Visit `http://localhost:4000/` to confirm you receive `{ "message": "Merch OS API running" }`.
4. **Run the frontend**
   ```bash
   cd frontend
   npm run dev
   ```
   Open `http://localhost:3000` and ensure network calls hit the configured backend (`/api/generate-directions`, `/api/create-workspace`).

The standard flow is to keep both dev servers open in separate terminals while iterating on prompts or UI copy.

## API Reference

All endpoints live under `/api` (e.g. `http://localhost:4000/api/generate-directions`).

### `POST /api/generate-directions`

Creates three merch directions from the provided brief.

Request body:

```json
{
  "brandName": "North Collective",
  "audience": "Men aged 20-35 interested in modern streetwear and minimalist fashion",
  "brandValues": ["confidence", "discipline", "community", "self-improvement"],
  "stylePreferences": ["premium", "minimal", "bold", "modern streetwear"],
  "colourPreferences": ["black", "white", "stone", "earth tones"],
  "designNotes": "Designs should feel premium and identity-driven...",
  "garmentTypes": ["hoodie", "t-shirt"],
  "projectStartDate": "2024-04-01",
  "launchDate": "2024-05-15"
}
```

Response (abridged):

```json
{
  "directions": [
    {
      "id": "direction-1",
      "title": "Discipline in Motion",
      "hook": "Precision lines for daily momentum",
      "concept": "...",
      "visualStyle": "...",
      "typography": "...",
      "colourPalette": ["jet black", "bone"],
      "graphicElements": ["monoline crest"],
      "frontDesign": "...",
      "backDesign": "...",
      "placementNotes": "...",
      "printStyle": "puff print and gel overlays",
      "referenceVibe": "...",
      "rationale": "..."
    }
  ]
}
```

### `POST /api/create-workspace`

Uses the Notion API to generate the workspace under `NOTION_PARENT_PAGE_ID`.

```json
{
  "brief": { "...same shape as the generate-directions payload..." },
  "selectedDirection": { "...one object returned from /api/generate-directions..." }
}
```

Response:

```json
{
  "message": "Workspace created successfully",
  "workspace": {
    "pageId": "xxxxxxxxxxxxxxxxxxxxxx",
    "url": "https://www.notion.so/...",
    "title": "North Collective - Merch Workspace",
    "productionDatabaseUrl": "https://www.notion.so/...Production-Tasks...",
    "milestonesDatabaseUrl": "https://www.notion.so/...Project-Milestones..."
  }
}
```

Validation will reject empty briefs or missing `selectedDirection`.

### `GET /api/mcp-tools`

Quick liveness check against the configured MCP server. Returns the registered tool names so you can confirm the MCP host exposes endpoints such as `API-post-page`.

### `POST /api/create-workspace-mcp`

Same shape as `/api/create-workspace`, but the parent page and child pages are created through the MCP server (`notionMcpService.js`). Inline databases are still created via the native Notion SDK to reuse the seeding helpers.

## Notion Workspace Blueprint

`backend/src/services/notionService.js` defines the layout:

- **Parent page** titled `<Brand Name> - Merch Workspace`.
- **Brand Brief page** containing formatted bullets for all structured brief inputs.
- **Design Directions page** summarising the selected AI direction (hook, palette, typography, rationale).
- **Feedback page** with scaffolded sections for client/internal notes.
- **Production Tasks database** (inline) with fields: Name, Status, Category, Priority, Direction. Tasks are auto-generated based on garment types, typography, front/back art, and print style.
- **Project Milestones database** (inline) with Name, Status, Due Date. Due dates are interpolated between `projectStartDate` and `launchDate`; when dates are missing, the entries are left undated but still seeded.

Each database uses the new Notion "data source" creation flow so they remain inline beneath the parent workspace for easy access.

## Frontend Experience

`frontend/app/page.tsx` is a single `use client` component that manages:

- A split brief form with helpful placeholder copy and gradient styling (Tailwind 4 utility classes in `app/globals.css`).
- Local state for directions, selection, workspace metadata, error messaging, and loading states for each async step.
- A direction review grid showing summary chips (hook, palette, placements) so teams can compare directions before committing.
- Workspace success panel that surfaces quick links to the parent page, production tasks database, and milestones database when available.
- Lightweight helper components (`Field`, `Info`, `SuccessStat`) keep the markup legible while matching the high-contrast design defined in `globals.css`.

Because everything sits in `app/page.tsx`, iterating on copy or state is a single-file edit, ideal for hackathon speed.

## Model Context Protocol Integration

MCP support is optional but useful when you already have a Notion MCP bridge that encapsulates auth and auditing.

Configuration flow:

1. Populate `MCP_SERVER_URL` (base without `/mcp`) and `MCP_AUTH_TOKEN` in `backend/.env`.
2. Start the backend. On boot, nothing hits the MCP server yet.
3. Verify connectivity with `GET /api/mcp-tools`. You should see tool names like `API-post-page`.
4. Call `POST /api/create-workspace-mcp` with the same payload you would send to `/api/create-workspace`.

`notionMcpService.js` uses the MCP client to call `API-post-page` for the parent page and each child page. After the pages are created, the service falls back to `createProductionTasksDatabase` and `createMilestonesDatabase` (native Notion SDK) to keep inline database creation consistent.

## Testing & Verification

- **Automated**: `npm test` in `backend/` currently fails intentionally. Replace it with Jest/Vitest suites before claiming coverage in PRs.
- **Manual checks**:
  - `curl http://localhost:4000/` -> confirm base response.
  - Generate directions:
    ```bash
    curl -X POST http://localhost:4000/api/generate-directions \
      -H "Content-Type: application/json" \
      -d @brief.json
    ```
  - Create workspace:
    ```bash
    curl -X POST http://localhost:4000/api/create-workspace \
      -H "Content-Type: application/json" \
      -d @workspace-request.json
    ```
  - Hit `/api/mcp-tools` if using MCP.
  - Run `npm run lint` inside `frontend/` to ensure Next.js Core Web Vitals rules pass before deploying.
- Document any manual coverage (payloads used, Notion URLs verified) when opening a PR.

## Deployment Notes

- **Backend**: `npm run start` serves `src/server.js`. Behind a reverse proxy, expose `/api` and ensure the process has access to the required env vars. Rotate API keys frequently.
- **Frontend**: `npm run build && npm run start` produces an optimized Next.js server build suitable for Vercel, Fly, or a Node host. Override `NEXT_PUBLIC_API_BASE_URL` with your deployed backend URL.
- Keep secrets in platform-specific secret managers; never bake them into the repo.
- When updating env requirements, mirror the change in this README and in the `.env` template files you share privately.

## Troubleshooting

- **Gemini request fails / 500 from `/api/generate-directions`**  
  Check `GEMINI_API_KEY`, confirm the model `gemini-2.5-flash` is enabled, and inspect backend logs for quota or parsing errors. `parseJsonResponse` will strip Markdown fences, but malformed JSON from Gemini will still throw.

- **Notion workspace creation fails**  
  Ensure the integration owning `NOTION_API_KEY` has access to the `NOTION_PARENT_PAGE_ID`. If the parent is in another workspace, share it with the integration first. Errors often cite missing permissions.

- **Inline databases missing**  
  Notion recently rolled out the `initial_data_source` requirement. If the API version on your integration is outdated, upgrade the SDK or reissue the integration token. Our helper throws a descriptive error when the `data_source_id` is missing.

- **MCP errors**  
  Call `GET /api/mcp-tools` to verify connectivity. 401 errors indicate a bad `MCP_AUTH_TOKEN`; connection errors usually point to `MCP_SERVER_URL` missing the protocol or `/mcp` suffix.

- **CORS issues in development**  
  The backend enables `cors()` globally, so make sure you are pointing the frontend to the backend root (`http://localhost:4000/api`). Restart both dev servers after editing env files.

## Contributing & Next Steps

- Follow the coding style outlined in `AGENTS.md` (2-space indent, ES modules, PascalCase React components).
- Add future tests under `backend/src/__tests__` or Next.js colocated test folders.
- Use `docs/`, `examples/`, and `prompts/` for curated references (brief templates, MCP prompt experiments, flow diagrams). Avoid committing generated outputs in `node_modules/`.
- When opening PRs, document manual testing (payloads, Notion URLs, screenshots/Looms) and flag any new env variables.

## License

Merch OS is released under the [MIT License](LICENSE).
