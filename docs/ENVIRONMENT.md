# Environment Configuration

## Supported Environment Variables

### `NEXT_PUBLIC_BLOCKLOG_API_BASE_URL`

The base URL for the Blocklog backend API used by the frontend.

**Default (Local Development)**

```bash
http://127.0.0.1:8000/api/v1
```

**Examples**

```bash
NEXT_PUBLIC_BLOCKLOG_API_BASE_URL=http://127.0.0.1:8000/api/v1
NEXT_PUBLIC_BLOCKLOG_API_BASE_URL=https://api.blocklogsecurity.com/api/v1
```

## Recommended `.env.local`

```bash
NEXT_PUBLIC_BLOCKLOG_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

## Docker Environment

When running the frontend in Docker, provide the environment variable at runtime or through Docker Compose.

Example:

```yaml
services:
  frontend:
    environment:
      NEXT_PUBLIC_BLOCKLOG_API_BASE_URL: https://api.blocklogsecurity.com/api/v1
```

Or:

```bash
docker run \
  -e NEXT_PUBLIC_BLOCKLOG_API_BASE_URL=https://api.blocklogsecurity.com/api/v1 \
  blocklog-frontend
```

## Production Configuration

For production deployments, configure:

```bash
NEXT_PUBLIC_BLOCKLOG_API_BASE_URL=https://api.blocklogsecurity.com/api/v1
```

Ensure the configured backend:

- Is publicly reachable
- Serves the expected API version
- Allows requests from the frontend origin via CORS

## Notes

- Browser requests are sent directly to the configured backend API.
- Environment variable changes require rebuilding and redeploying the frontend.
- Keep the backend URL consistent across local, staging, and production environments where appropriate.