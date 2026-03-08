# Blocklog Website + Console

Next.js app for the Blocklog marketing site and developer dashboard, connected to Blocklog Security APIs.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API connection

This app proxies all API calls through `app/api/blocklog/[...path]/route.ts`.

Set your backend URL in `.env.local`:

```bash
BLOCKLOG_API_BASE_URL=https://api.blocklogsecurity.com/api/v1
```

If you run Blocklog backend locally, use:

```bash
BLOCKLOG_API_BASE_URL=http://localhost:8000/api/v1
```

## Auth/session flow

- Signup/Login call `/auth/signup` and `/auth/login`
- Returned `token`, `company_id`, and `api_key` are stored in `localStorage`
- All dashboard requests automatically send `Authorization`, `X-Company-ID`, and `X-API-Key` headers

## Main routes

- `/` marketing site
- `/auth/*` authentication
- `/dashboard/*` product console
- `/docs/*` docs pages
- `/status` status page
- `/verify` public verifier
