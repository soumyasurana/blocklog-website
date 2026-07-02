# Deployment

## Target Platform

This frontend is deployed as a Docker container on an AWS EC2 instance.

## Production Requirements

- Docker Engine
- Reachable Blocklog backend API
- Correct `NEXT_PUBLIC_BLOCKLOG_API_BASE_URL`
- Reverse proxy (recommended: Nginx)
- Valid TLS certificate for HTTPS

## Environment Variables

```bash
NEXT_PUBLIC_BLOCKLOG_API_BASE_URL=https://api.your-domain.com/api/v1
```

## Build the Image

```bash
docker build -t blocklog-frontend .
```

## Run the Container

```bash
docker run -d \
  --name blocklog-frontend \
  -p 3000:3000 \
  --env NEXT_PUBLIC_BLOCKLOG_API_BASE_URL=https://api.your-domain.com/api/v1 \
  blocklog-frontend
```

## Docker Compose Example

```yaml
services:
  frontend:
    build: .
    container_name: blocklog-frontend
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_BLOCKLOG_API_BASE_URL: https://api.your-domain.com/api/v1
```

## Reverse Proxy

In production, the frontend is typically served behind Nginx, which:

- Terminates HTTPS
- Serves the frontend under the primary domain
- Forwards requests to the frontend container
- Optionally redirects HTTP to HTTPS

Typical traffic flow:

```text
Browser
      │
      ▼
Nginx (HTTPS)
      │
      ▼
Blocklog Frontend Container
      │
      ▼
Blocklog Backend API
```

## Deployment Checklist

Before deploying:

- Docker image builds successfully
- Backend API is reachable
- Environment variables are configured correctly
- HTTPS certificates are valid
- Nginx configuration is updated (if applicable)
- Backend CORS allows requests from the frontend domain

## Local Production Test

```bash
docker build -t blocklog-frontend .
docker run -p 3000:3000 blocklog-frontend
```

Then visit:

```
http://localhost:3000
```

## Production Validation

After deployment:

1. Open the homepage.
2. Verify all public pages load correctly.
3. Submit a deployment request through the Enterprise/VPC form.
4. Confirm the request reaches the backend successfully.
5. Verify no browser console or network errors are present.

## Troubleshooting

Common deployment issues include:

- Incorrect backend API URL
- Missing environment variables
- Backend API unavailable
- CORS configuration blocking requests
- Reverse proxy misconfiguration
- SSL/TLS certificate issues