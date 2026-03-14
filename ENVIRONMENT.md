# Environment Configuration

## Supported Environment Variables

### `BLOCKLOG_API_BASE_URL`

Backend base URL used by the frontend proxy route.

Default:

```bash
http://127.0.0.1:8000/api/v1
```

Examples:

```bash
BLOCKLOG_API_BASE_URL=http://127.0.0.1:8000/api/v1
BLOCKLOG_API_BASE_URL=https://api.blocklogsecurity.com/api/v1
```

### `BLOCKLOG_DEMO_MODE`

When set to `true`, the frontend does not forward requests to the backend and instead serves demo responses from the proxy route.

Example:

```bash
BLOCKLOG_DEMO_MODE=true
```

Use this only for UI demos or offline exploration.

## Recommended `.env.local`

### Local backend

```bash
BLOCKLOG_API_BASE_URL=http://127.0.0.1:8000/api/v1
BLOCKLOG_DEMO_MODE=false
```

### Demo-only frontend

```bash
BLOCKLOG_DEMO_MODE=true
```

## Vercel Environment Variables

Set these in Vercel project settings:

- `BLOCKLOG_API_BASE_URL`
- `BLOCKLOG_DEMO_MODE`

Production recommendation:

```bash
BLOCKLOG_API_BASE_URL=https://your-backend-domain/api/v1
BLOCKLOG_DEMO_MODE=false
```

## Notes

- Browser code never calls the backend directly.
- The proxy route reads env vars server-side.
- After env changes, restart local dev or redeploy in Vercel.
