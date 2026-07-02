# Local Development

## Prerequisites

- Node.js 20+
- npm
- Blocklog backend running locally at `http://127.0.0.1:8000`

Recommended:

- Run the frontend and backend in separate terminals.
- Configure the backend API URL in `.env.local`.

## Installation

```bash
npm install
```

## Environment

Create a `.env.local` file:

```bash
NEXT_PUBLIC_BLOCKLOG_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

## Start the Frontend

```bash
npm run dev
```

The application will be available at:

```
http://localhost:3000
```

## Optional Turbopack

```bash
npm run dev:turbo
```

Use only if you specifically want to test Turbopack.

## Start the Backend

Refer to the backend repository for the complete setup instructions.

A typical local startup command is:

```bash
uvicorn app.main:app --reload
```

Expected API endpoint:

```text
http://127.0.0.1:8000/api/v1
```

## Verify the Backend

Confirm the backend is running before starting the frontend:

```bash
curl http://127.0.0.1:8000/api/v1/health
```

## Development Workflow

1. Start the backend.
2. Start the frontend.
3. Open `http://localhost:3000`.
4. Test the deployment request form.
5. Verify the request is successfully received by the backend.

## Code Quality

Run lint checks before committing:

```bash
npm run lint
```

## Notes

- The frontend communicates directly with the backend API from the browser.
- Ensure the backend allows requests from `http://localhost:3000` through its CORS configuration.
- Changes to `.env.local` require restarting the development server.