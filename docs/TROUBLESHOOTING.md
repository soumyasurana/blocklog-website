# Troubleshooting

## Frontend cannot connect to the backend

Verify the API base URL is configured correctly.

```bash
NEXT_PUBLIC_BLOCKLOG_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

If you recently changed the environment variable, restart the development server or rebuild the Docker image.

## Deployment request returns `422 Unprocessable Entity`

The backend validates that the submitted email address belongs to a business domain.

Using personal email providers (such as Gmail, Outlook, or Yahoo) will result in:

```json
{
  "detail": "Please use a work email address."
}
```

Use a valid work email address and try again.

## `404 Not Found`

Common causes include:

- Incorrect backend API URL
- Backend not running
- Endpoint not available in the deployed backend version

Verify the configured API base URL and ensure the backend exposes:

```
POST /deployment-request
```

## Network request fails

Check that:

- The backend is running.
- The backend is publicly reachable (or reachable from your local machine).
- The API URL is correct.
- Browser developer tools do not show network or DNS errors.

## CORS Errors

If the browser reports CORS errors, ensure the backend allows requests from the frontend origin.

For local development this is typically:

```
http://localhost:3000
```

## Docker deployment issues

If the frontend is deployed in Docker:

- Verify the container is running.
- Confirm the environment variables are passed into the container.
- Check container logs for startup errors.

Example:

```bash
docker logs blocklog-frontend
```

## Development server issues

If development compilation appears to hang, use:

```bash
npm run dev
```

Use Turbopack only for testing:

```bash
npm run dev:turbo
```

## Verify Backend Health

Confirm the backend is running:

```bash
curl http://127.0.0.1:8000/api/v1/health
```

## Test the Deployment Endpoint

You can verify the backend directly with:

```bash
curl -X POST http://127.0.0.1:8000/api/v1/deployment-request \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Jane Doe",
    "company":"Acme Inc.",
    "work_email":"jane@acme.com",
    "job_title":"Platform Engineer",
    "deployment_type":"vpc",
    "message":"Interested in deploying Blocklog."
  }'
```

## Useful Debugging Steps

1. Verify the backend is running.
2. Confirm the API base URL is correct.
3. Check the browser's Network tab for failed requests.
4. Inspect backend logs for validation or server errors.
5. Ensure the backend CORS configuration includes the frontend origin.