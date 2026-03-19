# Environment Configuration

## Supported Environment Variables

### `NEXT_PUBLIC_BLOCKLOG_API_BASE_URL`

Backend base URL used by the browser-side request client.

Default:

```bash
http://127.0.0.1:8000/api/v1
```

Examples:

```bash
NEXT_PUBLIC_BLOCKLOG_API_BASE_URL=http://127.0.0.1:8000/api/v1
NEXT_PUBLIC_BLOCKLOG_API_BASE_URL=https://api.blocklogsecurity.com/api/v1
```

### `BLOCKLOG_API_BASE_URL`

Optional compatibility fallback for server-side contexts. Prefer `NEXT_PUBLIC_BLOCKLOG_API_BASE_URL`.

Example:

```bash
BLOCKLOG_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

## Recommended `.env.local`

```bash
NEXT_PUBLIC_BLOCKLOG_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

## Vercel Environment Variables

Set these in Vercel project settings:

- `NEXT_PUBLIC_BLOCKLOG_API_BASE_URL`
- `BLOCKLOG_API_BASE_URL`

Production recommendation:

```bash
NEXT_PUBLIC_BLOCKLOG_API_BASE_URL=https://your-backend-domain/api/v1
```

## Notes

- Browser code calls the backend directly.
- The backend must allow the frontend origin in `CORS_ORIGINS`.
- After env changes, restart local dev or redeploy in Vercel.
