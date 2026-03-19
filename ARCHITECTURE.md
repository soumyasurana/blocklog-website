# Architecture

## High-Level Design

The frontend is a Next.js App Router application with two main layers:

1. Presentation layer
   - pages in `app/`
   - shared UI in `components/`
2. Client integration layer
   - `lib/blocklog.ts`
   - session handling
   - request retries
   - auth header injection

## Request Flow

```text
Browser
  -> Blocklog backend /api/v1/*
```

This requires the backend to allow the frontend origin via CORS and to be reachable from the browser.

## Auth Model

- User auth uses bearer token from `/auth/login` or `/auth/signup`
- Session is stored in local storage
- Dashboard routes are client-guarded
- Product APIs often require `X-API-Key`
- Frontend attempts to create a default API key after auth

## Route Groups

### Public

- `/`
- `/landing`
- `/pricing`
- `/docs`
- `/status`
- `/verify`

### Auth

- `/login`
- `/signup`
- `/logout`
- `/auth/forgot-password`
- `/auth/reset-password`

### Product

- `/dashboard`
- `/dashboard/logs`
- `/dashboard/logs/[id]`
- `/dashboard/verify`
- `/dashboard/api-keys`
- `/dashboard/settings`

## Important Implementation Constraints

### No direct log list endpoint

The backend currently does not provide `GET /logs`. Because of that:

- dashboard log explorer uses `GET /logs/export-proof`
- then fetches individual log details with `GET /logs/{log_id}`

This is functional but not ideal for scale. A dedicated list endpoint would simplify the UI and reduce request fan-out.

### API key plaintext visibility

The backend only returns plaintext API key material at creation time. Listed API keys do not expose the secret again. The frontend compensates by creating a default API key after auth when needed.

## Operational Risk Areas

- env misconfiguration causing the browser to target the wrong backend
- backend CORS or host configuration blocking browser requests
- backend reachable but auth payload shape out of sync
- bearer-token success but missing API key for dashboard routes
