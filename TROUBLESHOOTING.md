# Troubleshooting

## Frontend starts but does not talk to backend

Check:

```bash
BLOCKLOG_API_BASE_URL
BLOCKLOG_DEMO_MODE
```

Expected local value:

```bash
BLOCKLOG_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

Restart dev server after changing env vars.

## Signup returns `422`

The backend requires:

- `username`
- `email`
- `password`
- `company_id`

If company does not exist, create it first or provide company name in the frontend signup flow.

## Login works but dashboard fails

This usually means bearer auth works but API-key-protected routes do not.

Check:

- `GET /auth/me` succeeds
- `POST /auth/api_keys` succeeds
- API key is stored after login

## `401 Unauthorized`

Common causes:

- expired token
- malformed bearer header
- missing API key on protected routes

## `403 Forbidden`

Common causes:

- company mismatch
- trying to access another tenant’s resource

## `404` on dashboard data

Confirm the backend version actually implements the endpoint being called. The frontend has already been aligned to the provided contract, but backend drift can still happen.

## `Compiling / ...` hangs in dev

Use:

```bash
npm run dev
```

Do not use Turbopack unless you are explicitly testing it:

```bash
npm run dev:turbo
```

Webpack mode is the stable path in this repo.

## Vercel deployment works but runtime requests fail

Check:

- backend is publicly reachable from Vercel
- backend allows requests from the deployment environment
- `BLOCKLOG_API_BASE_URL` is set in Vercel
- `BLOCKLOG_DEMO_MODE` is not `true`

## Useful Manual Checks

### Backend health

```bash
curl http://127.0.0.1:8000/api/v1/health
```

### Signup

```bash
curl -X POST http://127.0.0.1:8000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"pilot","email":"pilot@example.com","password":"ChangeMe123!","company_id":"pilot-co"}'
```

### Login

```bash
curl -X POST http://127.0.0.1:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"pilot@example.com","password":"ChangeMe123!"}'
```
