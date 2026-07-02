# Architecture

## High-Level Design

The frontend is a Next.js App Router application responsible for the public Blocklog website.

It consists of two primary layers:

1. **Presentation Layer**
   - Pages under `app/`
   - Reusable UI components in `components/`
   - Static assets in `public/`

2. **Integration Layer**
   - API helpers in `lib/`
   - Communication with the Blocklog backend for deployment request submission

## Request Flow

```text
Browser
      │
      ▼
Next.js Marketing Site
      │
      ▼
Blocklog Backend (/api/v1/deployment-request)
```

The backend must be reachable from the browser and configured to allow requests from the frontend origin.

## Route Groups

### Public Pages

- `/`
- `/pricing`
- `/docs`
- `/status`
- `/deployment`
- `/contact`

## Project Structure

```text
app/
├── docs/
├── pricing/
├── deployment/
├── status/
└── page.tsx

components/
lib/
public/
```

## Backend Integration

The marketing site communicates with a single backend endpoint:

```
POST /deployment-request
```

This endpoint processes Enterprise/VPC deployment inquiries submitted through the website.

## Environment Configuration

The backend API base URL is configured with:

```bash
NEXT_PUBLIC_BLOCKLOG_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

## Operational Considerations

The primary operational risks are:

- Incorrect backend API URL configuration
- CORS preventing browser requests
- Backend downtime or network connectivity issues
- Validation failures when submitting deployment request forms