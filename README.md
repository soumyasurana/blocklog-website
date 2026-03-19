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
- Direct backend integration:
  - browser requests go straight to the backend API
  - `lib/blocklog.ts` injects auth headers and retries failed requests

## Documentation Map

- [LOCAL_DEVELOPMENT.md](LOCAL_DEVELOPMENT.md)
- [ENVIRONMENT.md](ENVIRONMENT.md)
- [ARCHITECTURE.md](ARCHITECTURE.md)
- [API_INTEGRATION.md](API_INTEGRATION.md)
- [DEPLOYMENT.md](DEPLOYMENT.md)
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

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

Preferred frontend env var:

```bash
NEXT_PUBLIC_BLOCKLOG_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

## Key Behavior

- User auth uses bearer tokens.
- Most product data routes require an API key.
- After login/signup, the frontend attempts to create a default API key automatically so the dashboard can function.
- Browser requests go directly to the configured backend base URL.

## Repository Structure

```text
app/
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

These are documented in more detail in [API_INTEGRATION.md](API_INTEGRATION.md).
