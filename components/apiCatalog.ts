import type { HttpMethod } from "@/lib/blocklog";

export type ApiEndpointDefinition = {
  category: string;
  label: string;
  method: HttpMethod;
  path: string;
  description: string;
  pageHref?: string;
  liveOnly?: boolean;
  samplePayload?: string;
};

export const apiCatalog: ApiEndpointDefinition[] = [
  {
    category: "Authentication",
    label: "Login",
    method: "POST",
    path: "/auth/login",
    description: "Exchange credentials for an access token and company scope.",
    samplePayload:
      '{\n  "email": "you@company.com",\n  "password": "super-secure-password"\n}',
  },
  {
    category: "Authentication",
    label: "Signup",
    method: "POST",
    path: "/auth/signup",
    description: "Create a user account and initialize the session for the console.",
    samplePayload:
      '{\n  "email": "you@company.com",\n  "password": "super-secure-password",\n  "company_id": "cmp_84f02"\n}',
  },
  {
    category: "Authentication",
    label: "Forgot Password",
    method: "POST",
    path: "/auth/forgot-password",
    description: "Trigger a password reset workflow for an existing user.",
    samplePayload: '{\n  "email": "you@company.com"\n}',
  },
  {
    category: "Authentication",
    label: "Reset Password",
    method: "POST",
    path: "/auth/reset-password",
    description: "Apply a password reset token and replace the stored password.",
    samplePayload:
      '{\n  "token": "reset-token",\n  "password": "new-super-secure-password"\n}',
  },
  {
    category: "Authentication",
    label: "Current User",
    method: "GET",
    path: "/auth/me",
    description: "Return the authenticated user profile and company association.",
    pageHref: "/dashboard/settings",
  },
  {
    category: "Authentication",
    label: "List API Keys",
    method: "GET",
    path: "/auth/api_keys",
    description: "List provisioned API keys for the current account.",
    pageHref: "/dashboard/api-keys",
  },
  {
    category: "Authentication",
    label: "Create API Key",
    method: "POST",
    path: "/auth/api_keys",
    description: "Create an API key with a configurable rate limit.",
    pageHref: "/dashboard/api-keys",
    samplePayload:
      '{\n  "name": "Production API",\n  "rate_limit_per_minute": 1000\n}',
  },
  {
    category: "Authentication",
    label: "Revoke API Key",
    method: "DELETE",
    path: "/auth/api_keys/{key_id}",
    description: "Revoke a specific API key by its identifier.",
    pageHref: "/dashboard/api-keys",
  },
  {
    category: "Tenant",
    label: "Create Company",
    method: "POST",
    path: "/companies",
    description: "Provision a company or project namespace for new workloads.",
    samplePayload:
      '{\n  "company_id": "cmp_84f02",\n  "company_name": "Acme Financial"\n}',
  },
  {
    category: "Tenant",
    label: "Get Company",
    method: "GET",
    path: "/companies/{company_id}",
    description: "Load tenant metadata, region, and account status.",
    pageHref: "/dashboard/settings",
  },
  {
    category: "Tenant",
    label: "Retention Policy",
    method: "GET",
    path: "/policy/retention",
    description: "Read the active retention policy for the current company.",
    pageHref: "/dashboard/settings",
  },
  {
    category: "Integrity",
    label: "Health",
    method: "GET",
    path: "/health",
    description: "Return current API service health.",
    pageHref: "/dashboard/notifications",
  },
  {
    category: "Integrity",
    label: "Metrics",
    method: "GET",
    path: "/metrics",
    description: "Return aggregate request and ingestion metric series.",
  },
  {
    category: "Integrity",
    label: "Usage",
    method: "GET",
    path: "/usage",
    description: "Return ingestion and verification usage totals.",
    pageHref: "/dashboard",
  },
  {
    category: "Integrity",
    label: "Integrity Status",
    method: "GET",
    path: "/integrity/status",
    description: "Return current chain and verification health indicators.",
    pageHref: "/dashboard",
  },
  {
    category: "Integrity",
    label: "Integrity Report",
    method: "GET",
    path: "/integrity/report",
    description: "Return deeper continuity diagnostics and recent batch issues.",
    pageHref: "/dashboard/errors",
  },
  {
    category: "Logs",
    label: "Create Log",
    method: "POST",
    path: "/logs",
    description: "Ingest a single event into the sealed audit trail.",
    pageHref: "/dashboard/logs",
    samplePayload:
      '{\n  "event_type": "payment.created",\n  "source": "payments-api",\n  "payload": {\n    "user_id": "123",\n    "amount": 2000,\n    "currency": "USD"\n  }\n}',
  },
  {
    category: "Logs",
    label: "Get Log",
    method: "GET",
    path: "/logs/{log_id}",
    description: "Retrieve canonical details for a specific log record.",
    pageHref: "/dashboard/logs",
  },
  {
    category: "Logs",
    label: "Verify Log",
    method: "GET",
    path: "/logs/{log_id}/verify",
    description: "Run verification checks for an existing log record.",
    pageHref: "/dashboard/verify",
  },
  {
    category: "Logs",
    label: "Verify Log (POST)",
    method: "POST",
    path: "/logs/{log_id}/verify",
    description: "Request explicit verification execution for a log record.",
    pageHref: "/dashboard/verify",
  },
  {
    category: "Logs",
    label: "Export Proof",
    method: "GET",
    path: "/logs/export-proof?from={iso_from}&to={iso_to}",
    description: "Export a proof bundle for a time-bounded set of logs.",
    pageHref: "/dashboard/audit-trail",
  },
  {
    category: "Logs",
    label: "Stream Logs",
    method: "GET",
    path: "/logs/stream",
    description: "Read summarized log stream lines and status percentages.",
    pageHref: "/dashboard/ingestion-monitor",
  },
  {
    category: "Logs",
    label: "Log Errors",
    method: "GET",
    path: "/logs/errors",
    description: "Inspect recent log ingestion or schema-related failures.",
    pageHref: "/dashboard/errors",
  },
  {
    category: "Logs",
    label: "Hash Chain",
    method: "GET",
    path: "/logs/chain",
    description: "Inspect the current chain sequence for recent records.",
    pageHref: "/dashboard/audit-trail",
  },
  {
    category: "Verification",
    label: "Public Verify",
    method: "GET",
    path: "/public/verify/{hash}",
    description: "Verify a public payload hash without an authenticated session.",
    pageHref: "/dashboard/verify",
  },
  {
    category: "Verification",
    label: "Verify by Hash",
    method: "GET",
    path: "/verify/log/{hash}",
    description: "Resolve verification state by a known hash identifier.",
  },
  {
    category: "Operations",
    label: "Notifications",
    method: "GET",
    path: "/notifications",
    description: "Return platform notifications and alert summaries.",
    pageHref: "/dashboard/notifications",
  },
  {
    category: "Operations",
    label: "Webhook Events",
    method: "GET",
    path: "/webhooks/events",
    description: "Inspect inbound webhook event deliveries and recent activity.",
    pageHref: "/dashboard/notifications",
    liveOnly: true,
  },
  {
    category: "Operations",
    label: "Status",
    method: "GET",
    path: "/status",
    description: "Return the status page service matrix and uptime values.",
  },
];

export const apiCategories = Array.from(new Set(apiCatalog.map((endpoint) => endpoint.category)));
