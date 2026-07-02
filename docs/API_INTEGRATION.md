# API Integration

## Backend Contract

The marketing website integrates with a single backend endpoint for Enterprise/VPC deployment inquiries.

### Deployment Request

```
POST /deployment-request
```

Submits an Enterprise deployment request for the Blocklog team to review.

## Request Body

```json
{
  "name": "Jane Doe",
  "company": "Acme Inc.",
  "work_email": "jane@acme.com",
  "job_title": "Platform Engineer",
  "deployment_type": "vpc",
  "message": "We're interested in deploying Blocklog inside our infrastructure."
}
```

> The exact payload should match the `DeploymentRequestCreate` schema exposed by the backend.

## Response

```json
{
  "success": true,
  "message": "Deployment request submitted successfully."
}
```

The response follows the backend's `DeploymentRequestResponse` schema.

## Validation

The backend validates that the submitted email address belongs to a business domain.

Requests using personal email providers (such as Gmail, Outlook, or Yahoo) are rejected with:

```
422 Unprocessable Entity
```

Example response:

```json
{
  "detail": "Please use a work email address."
}
```

## Frontend Integration Notes

- The deployment request form sends a `POST` request directly to the configured backend API.
- Successful submissions display a confirmation message.
- Validation and API errors are surfaced to the user without exposing backend implementation details.

## Environment

Configure the backend URL using:

```bash
NEXT_PUBLIC_BLOCKLOG_API_BASE_URL=http://127.0.0.1:8000/api/v1
```