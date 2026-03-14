# Local Development

## Prerequisites

- Node.js 20+
- npm
- Blocklog backend running locally at `http://127.0.0.1:8000`

Recommended:
- keep backend and frontend in separate terminals
- use a clean `.env.local` for frontend overrides

## Install

```bash
npm install
```

## Start Frontend

```bash
npm run dev
```

This starts the app in Webpack dev mode.

## Optional Turbopack Mode

```bash
npm run dev:turbo
```

Use only if you specifically want to test Turbopack. It has previously stalled during `/` compilation in this project.

## Start Backend

The backend README in the sibling backend repo should be treated as the source of truth. The common local startup flow is:

```bash
uvicorn app.main:app --reload
```

Expected backend base URL:

```bash
http://127.0.0.1:8000/api/v1
```

## Recommended Local Flow

1. Start backend.
2. Verify backend health:

```bash
curl http://127.0.0.1:8000/api/v1/health
```

3. Start frontend:

```bash
npm run dev
```

4. Open `http://localhost:3000`.

## Local Signup Flow

The backend requires:

- `username`
- `email`
- `password`
- `company_id`

If the company does not exist yet, the frontend can create it during signup if a company name is provided.

## Development Validation

Run lint before committing:

```bash
npm run lint
```

## Demo Mode

If you need the UI without a backend:

```bash
BLOCKLOG_DEMO_MODE=true
```

When demo mode is enabled, `app/api/blocklog/[...path]/route.ts` returns local mock data instead of proxying requests.
