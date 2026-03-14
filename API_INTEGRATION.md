# API Integration

## Backend Contract Used By Frontend

The frontend is wired to these backend route families:

### Health and status

- `GET /health`
- `GET /metrics`
- `GET /integrity/status`
- `GET /integrity/report`
- `GET /usage`

### Auth

- `POST /auth/signup`
- `POST /auth/login`
- `GET /auth/me`
- `POST /auth/api_keys`
- `GET /auth/api_keys`
- `DELETE /auth/api_keys/{key_id}`

### Company and policy

- `POST /companies`
- `GET /companies/{company_id}`
- `GET /policy/retention`

### Logs and verification

- `POST /logs`
- `POST /logs/batch`
- `GET /logs/export-proof`
- `GET /logs/{log_id}`
- `GET /logs/{log_id}/verify`
- `GET /public/verify/{proof_id}`
- `GET /verify/log/{log_id}`

## Payload Shapes That Matter

### Signup request

```json
{
  "username": "pilot",
  "email": "pilot@example.com",
  "password": "ChangeMe123!",
  "company_id": "pilot-co"
}
```

### Login response

```json
{
  "access_token": "jwt",
  "token_type": "bearer",
  "expires_in": 3600,
  "user_id": 1,
  "company_id": "pilot-co"
}
```

### Create API key request

```json
{
  "name": "dashboard-default",
  "rate_limit_per_minute": 1000
}
```

### Create API key response

```json
{
  "key_id": "uuid",
  "name": "dashboard-default",
  "api_key": "plaintext-only-returned-once"
}
```

## Header Strategy

### Bearer token

Used for:

- `/auth/me`
- `/auth/api_keys`

### API key

Used for:

- `/logs/*`
- `/companies/{company_id}`
- `/policy/retention`
- `/verify/*`
- `/integrity/*`
- `/usage`

## Frontend Integration Notes

### Auth bootstrap

After login/signup:

1. store bearer token
2. store company ID
3. create a default API key if no plaintext key is already stored
4. use that key for dashboard APIs

### Log explorer

Because the backend does not expose a list endpoint, the UI derives the table from:

1. `GET /logs/export-proof?from=...&to=...`
2. `GET /logs/{log_id}` for each returned log

This is intentionally documented here because it is a non-obvious integration detail.

## Expected Failure Modes

### `422 Unprocessable Entity`

Usually means request body fields do not match backend schema exactly.

### `401 Unauthorized`

Bearer token invalid, expired, or missing.

### `403 Forbidden`

Most often company mismatch or resource access control.

### `404 Not Found`

Resource genuinely missing, or frontend calling an endpoint that is not implemented in the backend version being used.
