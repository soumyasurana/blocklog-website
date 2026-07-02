# Blocklog Frontend

Production-facing Next.js application for the Blocklog marketing website, documentation, public verification interface, and developer resources.

This repository contains only the public-facing website. It integrates with the Blocklog backend API where required for public verification and developer documentation.

## What This Repo Contains

- Landing page
- Product overview
- Pricing
- Documentation
- Status page
- Developer resources

## Documentation Map

- [Local Development](docs/LOCAL_DEVELOPMENT.md)
- [Environment Configuration](docs/ENVIRONMENT.md)
- [Architecture](docs/ARCHITECTURE.md)
- [API Integration](docs/API_INTEGRATION.md)
- [Deployment](docs/DEPLOYMENT.md)
- [Troubleshooting](docs/TROUBLESHOOTING.md)

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Vercel-ready deployment model

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

**Important**

- `npm run dev` uses Webpack mode intentionally.
- `npm run dev:turbo` exists, but Turbopack has previously hung on `/` in this project.

## Backend Dependency

By default, the frontend expects the backend at:

```bash
http://127.0.0.1:8000/api/v1
```

Configure with:

```bash
NEXT_PUBLIC_BLOCKLOG_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

## Key Behavior

- Public verification pages communicate directly with the backend.
- Documentation includes API references and integration guides.
- Interactive examples use the configured backend base URL.

## Repository Structure

```text
app/
  docs/                 # Documentation pages
  verify/               # Public verification UI
components/             # Shared UI components
lib/                    # Utilities and API helpers
public/                 # Static assets
```

## Current Integration Status

This frontend integrates with the current Blocklog backend for public verification functionality and developer-facing API documentation. Interactive pages communicate directly with the configured backend API using the public base URL.