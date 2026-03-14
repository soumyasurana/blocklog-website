# Blocklog Frontend

Production-facing Next.js application for the Blocklog marketing website, auth flows, developer dashboard, public verification UI, and API-management console.

This repository is the frontend layer only. It depends on the Blocklog backend API for authentication, company setup, API-key lifecycle, ingestion workflows, verification, integrity, and usage data.

## What This Repo Contains

- Public website:
  - landing page
  - pricing
  - docs index
  - public verification
  - status page
- Product app:
  - signup / login / logout / password reset UI
  - overview dashboard
  - log explorer
  - verification tool
  - API key management
  - settings
- API proxy:
  - frontend never calls the backend directly from the browser
  - all requests are routed through `app/api/blocklog/[...path]/route.ts`

## Documentation Map

- [LOCAL_DEVELOPMENT.md](/Users/soumyasurana/Desktop/Website/blocklog-website/LOCAL_DEVELOPMENT.md)
- [ENVIRONMENT.md](/Users/soumyasurana/Desktop/Website/blocklog-website/ENVIRONMENT.md)
- [ARCHITECTURE.md](/Users/soumyasurana/Desktop/Website/blocklog-website/ARCHITECTURE.md)
- [API_INTEGRATION.md](/Users/soumyasurana/Desktop/Website/blocklog-website/API_INTEGRATION.md)
- [DEPLOYMENT.md](/Users/soumyasurana/Desktop/Website/blocklog-website/DEPLOYMENT.md)
- [TROUBLESHOOTING.md](/Users/soumyasurana/Desktop/Website/blocklog-website/TROUBLESHOOTING.md)

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4 runtime import
- Vercel-ready deployment model

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Important:
- `npm run dev` uses Webpack mode intentionally.
- `npm run dev:turbo` exists, but Turbopack has previously hung on `/` in this project.

## Backend Dependency

By default, the frontend expects the backend at:

```bash
http://127.0.0.1:8000/api/v1
```

If `BLOCKLOG_DEMO_MODE=true`, the proxy serves local demo responses instead of forwarding to the backend.

## Key Behavior

- User auth uses bearer tokens.
- Most product data routes require an API key.
- After login/signup, the frontend attempts to create a default API key automatically so the dashboard can function.
- Browser requests go to `/api/blocklog/*`; the server route proxies to the backend.

## Repository Structure

```text
app/
  api/blocklog/[...path]/route.ts   # backend proxy / demo mode
  auth/                             # auth pages
  dashboard/                        # product UI
  docs/                             # docs pages in app
components/                         # shared UI
lib/blocklog.ts                     # session + request client
public/                             # static assets
```

## Current Integration Status

This frontend is integrated against the current backend contract you provided. A few UI areas are shaped around backend limitations:

- There is no `GET /logs` list endpoint in the backend.
- The log explorer therefore builds its list from `GET /logs/export-proof` and then resolves per-log details with `GET /logs/{log_id}`.
- API key listing does not return plaintext API keys, so the frontend creates a fresh default key after auth when needed.

These are documented in more detail in [API_INTEGRATION.md](/Users/soumyasurana/Desktop/Website/blocklog-website/API_INTEGRATION.md).
