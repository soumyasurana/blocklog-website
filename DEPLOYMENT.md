# Deployment

## Target Platform

This frontend is designed to deploy cleanly to Vercel.

## Production Requirements

- reachable Blocklog backend
- correct `BLOCKLOG_API_BASE_URL`
- `BLOCKLOG_DEMO_MODE=false`
- Node-compatible Next.js runtime

## Vercel Setup

1. Import repository into Vercel.
2. Set project root to the repository root.
3. Add environment variables:

```bash
BLOCKLOG_API_BASE_URL=https://your-backend-domain/api/v1
BLOCKLOG_DEMO_MODE=false
```

4. Use default build command:

```bash
npm run build
```

5. Use default output behavior for Next.js.

## Pre-Deployment Checklist

- backend health endpoint responds
- auth signup/login works against production backend
- API key creation works with production auth token
- dashboard can load usage/integrity data
- public verify route works
- demo mode is disabled

## Local Production Build

```bash
npm run build
npm run start
```

## Vercel Notes

- browser traffic never talks to backend directly
- Vercel executes the Next.js proxy route server-side
- backend must be reachable from the Vercel deployment environment

## Recommended Production Validation

After deploy:

1. Visit `/`
2. Complete signup/login
3. Confirm dashboard loads
4. Create API key
5. Verify status and public verify routes

## Rollback Guidance

If production breaks after deploy:

- inspect Vercel runtime logs
- confirm backend base URL is correct
- confirm backend is reachable from Vercel
- confirm no stale demo-mode env var is enabled
