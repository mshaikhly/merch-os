# Repository Guidelines

## Project Structure & Module Organization
- `frontend/` is a Next.js 16 App Router UI (TypeScript + Tailwind). Screens live in `app/`, shared styles in `app/globals.css`, and static assets under `public/`. `NEXT_PUBLIC_API_BASE_URL` binds it to the backend.
- `backend/` hosts the Express API in `src/` with `server.js` bootstrapping `app.js`. HTTP handlers sit in `src/routes`, integrations in `src/services` (Gemini + Notion), and helpers in `src/utils`.
- `docs/`, `examples/`, and `prompts/` store briefs, diagrams, and MCP prompt assets; keep generated artifacts outside `node_modules/` and only commit curated references.

## Build, Test, and Development Commands
- Install dependencies per package (`cd backend && npm install`, same for `frontend`).
- Backend: `npm run dev` (Nodemon reload), `npm run start` (prod), `npm test` currently fails intentionally—replace it with real suites before merging code that claims coverage.
- Frontend: `npm run dev` (Next dev server), `npm run build && npm run start` (optimized preview), `npm run lint` (ESLint Core Web Vitals).
- Typical workflow: run backend and frontend dev servers in separate terminals, visit `http://localhost:3000`, and confirm calls hit `/api/generate-directions` and `/api/create-workspace`.

## Coding Style & Naming Conventions
- Use ES modules, TypeScript strict mode, and camelCase for functions/variables; PascalCase React components in `app/`. Backend routers end with `*.route.js`, services with `*Service.js`.
- Follow the established 2-space indentation, keep imports sorted by package → relative, and rely on the bundled ESLint config plus the `tsconfig` path alias `@/` for clean imports.
- Store environment secrets only in `.env`/`.env.local`; never hardcode API keys or Notion IDs.

## Testing Guidelines
- There is no default harness; prefer Jest/Vitest colocated under `src/__tests__` or `app/(tests)` and target at least the brief parsing helpers plus fetch wrappers.
- Until automated suites exist, document manual coverage in the PR (e.g., curl examples hitting `/api/generate-directions`).

## Commit & Pull Request Guidelines
- Existing commits use short, imperative subject lines with optional scopes (`Frontend demo: …`). Keep <72 chars and describe the user-facing change.
- PRs should explain the feature, list touched packages, link issues/briefs, attach UI screenshots or Looms, note backend test evidence, and flag any env var changes with matching docs updates.

## Security & Configuration
- Required vars: backend `GEMINI_API_KEY`, `NOTION_API_KEY`, `NOTION_PARENT_PAGE_ID`; frontend `NEXT_PUBLIC_API_BASE_URL`. Update `.env.example` files when they change.
- Scrub client briefs, Notion URLs, and API responses from logs and PR text; rotate tokens immediately if exposed.

## Architecture Overview

The core workflow of the system is:

1. User fills in a merch brief in the frontend
2. Frontend calls `/api/generate-directions`
3. Backend sends the brief to Gemini and returns structured design directions
4. User selects a direction in the UI
5. Frontend calls `/api/create-workspace`
6. Backend uses the Notion API to generate a workspace page

The main logic for Notion workspace generation lives in:

backend/src/services/notionService.js

## Agent Editing Rules

This repository is a small hackathon project with a simple architecture.

When modifying code:

- Avoid large refactors or renaming files
- Prefer minimal targeted changes
- Do not move folders or restructure the project
- Focus edits mainly inside existing service or route files
- Keep frontend changes small and localized
- Always inspect the existing implementation before proposing edits

Primary backend logic lives in:

backend/src/services/notionService.js
backend/src/routes/

Codex should propose an implementation plan before applying major changes.

## Project Goal

Merch OS converts a client merch brief into AI-generated design directions and automatically generates a Notion workspace for execution.

The system is designed for the Notion MCP Challenge and focuses on a fast, clear workflow from brief → design directions → workspace.