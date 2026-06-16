
import type { ReactNode } from "react";
import {
  BulletList,
  Callout,
  CodeBlock,
  DocsArticle,
  FactsGrid,
  MiniGrid,
  RouteTable,
  SectionCard,
  type DocLink,
  type RouteRow,
} from "./_components";

type SidebarGroup = {
  title: string;
  items: Array<{ label: string; href: string }>;
};

type DocEntry = {
  eyebrow: string;
  title: string;
  description: string;
  related?: DocLink[];
  body: ReactNode;
};

export const docsSidebarGroups: SidebarGroup[] = [
  {
    title: "Getting Started",
    items: [
      { label: "Introduction", href: "/docs/getting-started/introduction" },
      { label: "Quickstart", href: "/docs/getting-started/quickstart" },
      { label: "Installation", href: "/docs/getting-started/installation" },
      { label: "Authentication", href: "/docs/getting-started/authentication" },
      { label: "First Project", href: "/docs/getting-started/first-project" },
    ],
  },
  {
    title: "Backend",
    items: [
      { label: "Overview", href: "/docs/backend/overview" },
      { label: "Authentication", href: "/docs/backend/authentication" },
      { label: "Authorization", href: "/docs/backend/authorization" },
      { label: "Teams", href: "/docs/backend/teams" },
      { label: "Incidents", href: "/docs/backend/incidents" },
      { label: "Notifications", href: "/docs/backend/notifications" },
      { label: "Audit Trail", href: "/docs/backend/audit-trail" },
      { label: "Webhooks", href: "/docs/backend/webhooks" },
      { label: "Integrations", href: "/docs/backend/integrations" },
      { label: "Error Handling", href: "/docs/backend/error-handling" },
    ],
  },
  {
    title: "SDK",
    items: [
      { label: "Overview", href: "/docs/sdk/overview" },
      { label: "Python Installation", href: "/docs/sdk/python/installation" },
      { label: "Python Authentication", href: "/docs/sdk/python/authentication" },
      { label: "Python Teams", href: "/docs/sdk/python/teams" },
      { label: "Python Incidents", href: "/docs/sdk/python/incidents" },
      { label: "Python Notifications", href: "/docs/sdk/python/notifications" },
      { label: "Python Ownership", href: "/docs/sdk/python/ownership" },
      { label: "Python Async", href: "/docs/sdk/python/async" },
      { label: "Python Errors", href: "/docs/sdk/python/error-handling" },
      { label: "Python Examples", href: "/docs/sdk/python/examples" },
      { label: "TypeScript Installation", href: "/docs/sdk/typescript/installation" },
      { label: "TypeScript Authentication", href: "/docs/sdk/typescript/authentication" },
      { label: "TypeScript Teams", href: "/docs/sdk/typescript/teams" },
      { label: "TypeScript Incidents", href: "/docs/sdk/typescript/incidents" },
      { label: "TypeScript Notifications", href: "/docs/sdk/typescript/notifications" },
      { label: "TypeScript Ownership", href: "/docs/sdk/typescript/ownership" },
      { label: "TypeScript React", href: "/docs/sdk/typescript/react" },
      { label: "TypeScript Errors", href: "/docs/sdk/typescript/error-handling" },
      { label: "TypeScript Examples", href: "/docs/sdk/typescript/examples" },
    ],
  },
  {
    title: "API Reference",
    items: [
      { label: "Authentication", href: "/docs/api-reference/authentication" },
      { label: "Teams", href: "/docs/api-reference/teams" },
      { label: "Team Members", href: "/docs/api-reference/team-members" },
      { label: "Incidents", href: "/docs/api-reference/incidents" },
      { label: "Notifications", href: "/docs/api-reference/notifications" },
      { label: "Integrations", href: "/docs/api-reference/integrations" },
      { label: "Schemas", href: "/docs/api-reference/schemas" },
    ],
  },
  {
    title: "Architecture",
    items: [
      { label: "Overview", href: "/docs/architecture/overview" },
      { label: "Ownership Model", href: "/docs/architecture/ownership-model" },
      { label: "Permissions", href: "/docs/architecture/permissions" },
      { label: "Notification Routing", href: "/docs/architecture/notification-routing" },
      { label: "Incident Lifecycle", href: "/docs/architecture/incident-lifecycle" },
      { label: "SDK Architecture", href: "/docs/architecture/sdk-architecture" },
    ],
  },
  {
    title: "Examples",
    items: [
      { label: "Signup & Team Creation", href: "/docs/examples/signup-and-team-creation" },
      { label: "Incident Routing", href: "/docs/examples/incident-routing" },
      { label: "Team Management", href: "/docs/examples/team-management" },
      { label: "Notification Testing", href: "/docs/examples/notification-testing" },
      { label: "SDK Usage", href: "/docs/examples/sdk-usage" },
      { label: "Automation", href: "/docs/examples/automation" },
    ],
  },
  {
    title: "Troubleshooting",
    items: [
      { label: "Authentication Errors", href: "/docs/troubleshooting/authentication-errors" },
      { label: "Authorization Errors", href: "/docs/troubleshooting/authorization-errors" },
      { label: "SDK Errors", href: "/docs/troubleshooting/sdk-errors" },
      { label: "Notification Errors", href: "/docs/troubleshooting/notification-errors" },
      { label: "Migration Errors", href: "/docs/troubleshooting/migration-errors" },
    ],
  },
];

export const docsIndexGroups = [
  {
    title: "Platform Guides",
    items: [
      {
        eyebrow: "Getting Started",
        title: "Platform Orientation",
        description: "Understand the backend, SDKs, auth model, teams, incidents, and notification routing.",
        href: "/docs/getting-started/introduction",
      },
      {
        eyebrow: "Backend",
        title: "Service Surface",
        description: "Read the FastAPI route families, permission boundaries, and operational subsystems.",
        href: "/docs/backend/overview",
      },
    ],
  },
  {
    title: "SDK Guides",
    items: [
      {
        eyebrow: "Python SDK",
        title: "Sync and Async Python",
        description: "Work with decorators, auth, teams, incidents, and verification from Python services.",
        href: "/docs/sdk/python/installation",
      },
      {
        eyebrow: "TypeScript SDK",
        title: "Client, Queue, and Tracing",
        description: "Use the TypeScript client in Node or app backends with normalized models and lifecycle control.",
        href: "/docs/sdk/typescript/installation",
      },
    ],
  },
  {
    title: "Reference & Operations",
    items: [
      {
        eyebrow: "API Reference",
        title: "Route Contracts",
        description: "Authentication, teams, incidents, notifications, integrations, and shared schemas.",
        href: "/docs/api-reference/authentication",
      },
      {
        eyebrow: "Architecture",
        title: "Ownership and Routing",
        description: "Follow the platform ownership, permission, incident, and SDK layering model.",
        href: "/docs/architecture/overview",
      },
    ],
  },
];

const signupSnippet = `from blocklog import BlocklogClient

client = BlocklogClient(base_url="https://api.blocklog.example/api/v1")

signup = client.auth.signup(
    username="jane",
    email="jane@example.com",
    password="ChangeMe123!",
    workspace_name="Acme Security",
)

client.set_access_token(signup.token)
team = client.teams.get(signup.team.id)
print(team.owner_user_id)`;

const tsSnippet = `import { BlocklogClient } from "@blocklog/sdk";

const client = new BlocklogClient({
  apiKey: process.env.BLOCKLOG_API_KEY!,
  endpoint: "https://api.blocklog.example/api/v1",
});

await client.event("AGENT_RUN", {
  agent_id: "pricing-agent",
  input: { symbol: "TSLA" },
});`;

const authRoutes: RouteRow[] = [
  { method: "GET", path: "/api/v1/auth/companies/{company_id}/exists", auth: "Public", purpose: "Check whether a company slug already exists.", request: "Path param company_id.", response: "exists flag plus normalized company metadata." },
  { method: "POST", path: "/api/v1/auth/signup", auth: "Public", purpose: "Create a user, create a company if needed, create the default team, and return a bearer token.", request: "UserSignupRequest.", response: "UserTokenResponse with team_id." },
  { method: "POST", path: "/api/v1/auth/login", auth: "Public", purpose: "Issue a bearer token for an active user.", request: "UserLoginRequest.", response: "UserTokenResponse." },
  { method: "POST", path: "/api/v1/auth/forgot-password", auth: "Public", purpose: "Generate a password reset token when applicable.", request: "ForgotPasswordRequest.", response: "ForgotPasswordResponse." },
  { method: "POST", path: "/api/v1/auth/reset-password", auth: "Public", purpose: "Replace the password using a reset token.", request: "ResetPasswordRequest.", response: "ResetPasswordResponse." },
  { method: "GET", path: "/api/v1/auth/me", auth: "Bearer token", purpose: "Return the current user profile.", request: "Authorization header.", response: "UserPublic." },
  { method: "POST", path: "/api/v1/auth/api_keys", auth: "Bearer token", purpose: "Create a company API key with role-aware constraints.", request: "APIKeyCreateRequest.", response: "APIKeyCreateResponse." },
  { method: "GET", path: "/api/v1/auth/api_keys", auth: "Bearer token", purpose: "List visible API keys.", request: "Authorization header.", response: "list[APIKeyPublic]." },
  { method: "DELETE", path: "/api/v1/auth/api_keys/{key_id}", auth: "Bearer token", purpose: "Revoke an API key.", request: "Path param key_id.", response: "204 No Content." },
];

const teamRoutes: RouteRow[] = [
  { method: "POST", path: "/api/v1/teams", auth: "Bearer token", purpose: "Create a team and owner membership.", request: "TeamCreateRequest.", response: "TeamResponse." },
  { method: "GET", path: "/api/v1/teams", auth: "Bearer token", purpose: "List teams where the caller is a member.", request: "Authorization header.", response: "list[TeamResponse]." },
  { method: "GET", path: "/api/v1/teams/{team_id}", auth: "Bearer token", purpose: "Fetch a team within the same company and membership scope.", request: "Path param team_id.", response: "TeamResponse." },
  { method: "PATCH", path: "/api/v1/teams/{team_id}", auth: "Bearer token", purpose: "Update team metadata or delivery configuration.", request: "TeamUpdateRequest. Owner only.", response: "TeamResponse." },
  { method: "DELETE", path: "/api/v1/teams/{team_id}", auth: "Bearer token", purpose: "Delete a team.", request: "Path param team_id. Owner only.", response: "204 No Content." },
  { method: "POST", path: "/api/v1/teams/{team_id}/notify-test", auth: "Bearer token", purpose: "Send test notifications to configured channels.", request: "NotifyTestRequest.", response: "NotifyTestResponse." },
];

const teamMemberRoutes: RouteRow[] = [
  { method: "GET", path: "/api/v1/teams/{team_id}/members", auth: "Bearer token", purpose: "List team members.", request: "Path param team_id.", response: "list[TeamMemberResponse]." },
  { method: "POST", path: "/api/v1/teams/{team_id}/members", auth: "Bearer token", purpose: "Add an existing company user as reviewer, lead, or observer.", request: "TeamMemberAddRequest.", response: "TeamMemberResponse." },
  { method: "PATCH", path: "/api/v1/teams/{team_id}/members/{member_id}", auth: "Bearer token", purpose: "Update role or notification settings for a member.", request: "TeamMemberUpdateRequest.", response: "TeamMemberResponse." },
  { method: "DELETE", path: "/api/v1/teams/{team_id}/members/{member_id}", auth: "Bearer token", purpose: "Remove a member that is not the current owner.", request: "Path params team_id and member_id.", response: "204 No Content." },
];

const incidentRoutes: RouteRow[] = [
  { method: "GET", path: "/api/v1/incidents", auth: "API key or bearer token", purpose: "List incidents for the current company.", request: "Tenant auth header.", response: "list[IncidentResponse]." },
  { method: "POST", path: "/api/v1/incidents", auth: "API key or bearer token", purpose: "Create an incident and trigger escalation.", request: "IncidentCreate.", response: "IncidentResponse." },
  { method: "GET", path: "/api/v1/incidents/{incident_id}", auth: "API key or bearer token", purpose: "Read a single incident.", request: "Path param incident_id.", response: "IncidentResponse." },
  { method: "PATCH", path: "/api/v1/incidents/{incident_id}", auth: "API key or bearer token", purpose: "Apply partial updates.", request: "IncidentUpdate.", response: "IncidentResponse." },
  { method: "GET", path: "/api/v1/incidents/{incident_id}/workspace", auth: "API key or bearer token", purpose: "List workspace items.", request: "Path param incident_id.", response: "list[IncidentWorkspaceItemResponse]." },
  { method: "POST", path: "/api/v1/incidents/{incident_id}/workspace", auth: "API key or bearer token", purpose: "Attach evidence or metadata.", request: "IncidentWorkspaceItemCreate.", response: "IncidentWorkspaceItemResponse." },
  { method: "GET", path: "/api/v1/incidents/{incident_id}/annotations", auth: "API key or bearer token", purpose: "List incident annotations.", request: "Path param incident_id.", response: "list[IncidentAnnotationResponse]." },
  { method: "POST", path: "/api/v1/incidents/{incident_id}/annotations", auth: "API key or bearer token", purpose: "Create an annotation.", request: "IncidentAnnotationCreate.", response: "IncidentAnnotationResponse." },
  { method: "POST", path: "/api/v1/incidents/{incident_id}/assign", auth: "API key or bearer token", purpose: "Assign the incident owner.", request: "IncidentAssign.", response: "IncidentResponse." },
  { method: "POST", path: "/api/v1/incidents/{incident_id}/resolve", auth: "API key or bearer token", purpose: "Resolve the incident with root-cause and remediation notes.", request: "IncidentResolve.", response: "IncidentResponse." },
  { method: "POST", path: "/api/v1/incidents/{incident_id}/close", auth: "API key or bearer token", purpose: "Close the incident.", request: "IncidentClose.", response: "IncidentResponse." },
  { method: "POST", path: "/api/v1/incidents/{incident_id}/report", auth: "API key or bearer token", purpose: "Generate or refresh the investigation report.", request: "Path param incident_id.", response: "InvestigationReportResponse." },
  { method: "GET", path: "/api/v1/incidents/{incident_id}/report", auth: "API key or bearer token", purpose: "Fetch the current report artifact.", request: "Path param incident_id.", response: "InvestigationReportResponse." },
];

const notificationRoutes: RouteRow[] = [
  { method: "GET", path: "/api/v1/alerts/rules", auth: "API key or bearer token", purpose: "List alert rules.", request: "Tenant auth header.", response: "Alert rule collection." },
  { method: "POST", path: "/api/v1/alerts/rules", auth: "API key or bearer token", purpose: "Create an alert rule.", request: "Alert rule payload.", response: "Alert rule object." },
  { method: "GET", path: "/api/v1/alerts/events", auth: "API key or bearer token", purpose: "List alert events.", request: "Tenant auth header.", response: "Alert event collection." },
  { method: "POST", path: "/api/v1/alerts/events", auth: "API key or bearer token", purpose: "Emit an alert event directly.", request: "Alert event payload.", response: "Alert event object." },
  { method: "POST", path: "/api/v1/hitl/request", auth: "API key or bearer token", purpose: "Create a human review request.", request: "HITL request payload.", response: "HITLRequestResponse." },
  { method: "POST", path: "/api/v1/hitl/approve", auth: "API key or bearer token", purpose: "Approve a pending review.", request: "Approval payload.", response: "Approval result." },
  { method: "POST", path: "/api/v1/hitl/reject", auth: "API key or bearer token", purpose: "Reject a decision and record the reason.", request: "Decision or log identifiers plus rejection reason.", response: "HITLAuditLogResponse." },
  { method: "POST", path: "/api/v1/hitl/escalate", auth: "API key or bearer token", purpose: "Escalate a pending review.", request: "Escalation payload.", response: "Escalation result." },
  { method: "GET", path: "/api/v1/hitl/audit-trail", auth: "API key or bearer token", purpose: "Read the HITL audit history.", request: "Tenant auth header.", response: "list[HITLAuditLogResponse]." },
];

const integrationRoutes: RouteRow[] = [
  { method: "GET", path: "/api/v1/schemas", auth: "API key or bearer token", purpose: "List registered schemas.", request: "Tenant auth header.", response: "Schema collection." },
  { method: "POST", path: "/api/v1/schemas", auth: "API key or bearer token", purpose: "Register an event schema.", request: "Schema registration payload.", response: "Schema record." },
  { method: "GET", path: "/api/v1/onboarding/status", auth: "API key or bearer token", purpose: "Read onboarding readiness.", request: "Tenant auth header.", response: "Onboarding status." },
  { method: "GET", path: "/api/v1/onboarding/langchain", auth: "API key or bearer token", purpose: "Read LangChain integration hints.", request: "Tenant auth header.", response: "Integration guidance." },
  { method: "POST", path: "/api/v1/ai/actions", auth: "API key or bearer token", purpose: "Record AI provenance actions.", request: "AI provenance payload.", response: "Stored action." },
  { method: "POST", path: "/api/v1/execution/authorize", auth: "API key or bearer token", purpose: "Check execution policy before side effects occur.", request: "Execution authorization payload.", response: "Authorization verdict." },
];

const related = {
  auth: [
    { title: "Authentication API", href: "/docs/api-reference/authentication", description: "Inspect the route-level contracts for signup, login, and API keys." },
    { title: "Permissions", href: "/docs/architecture/permissions", description: "Understand how those credentials are interpreted later." },
  ],
  teams: [
    { title: "Team APIs", href: "/docs/api-reference/teams", description: "Review the team route contracts." },
    { title: "Ownership Model", href: "/docs/architecture/ownership-model", description: "See how ownership and membership are represented." },
  ],
};

function simpleDoc(
  eyebrow: string,
  title: string,
  description: string,
  body: ReactNode,
  docRelated?: DocLink[],
): DocEntry {
  return { eyebrow, title, description, body, related: docRelated };
}

export const docsContent: Record<string, DocEntry> = {
  "getting-started/introduction": simpleDoc(
    "Getting Started",
    "Introduction",
    "Understand the Blocklog platform, how the backend, SDKs, and governance workflows fit together, and where to start as a new engineer.",
    <>
      <FactsGrid
        items={[
          { label: "Backend", value: "FastAPI routers under /api/v1 with tenant-scoped auth and service layers." },
          { label: "SDKs", value: "Python and TypeScript clients with events, teams, incidents, replay, and approvals." },
          { label: "Ownership", value: "Signup creates a company workspace and an owned default team." },
          { label: "Notifications", value: "Slack, Teams, PagerDuty, custom webhook, and email." },
        ]}
      />
      <SectionCard title="What Blocklog is responsible for">
        <p>
          Blocklog combines tamper-evident logging, AI decision capture, human review, replay,
          compliance evidence, and incident routing in one platform. The operational backend
          stores the working dataset, while verification and export endpoints expose proof and
          investigation artifacts.
        </p>
      </SectionCard>
      <MiniGrid
        items={[
          { title: "Application developers", description: "Use the SDKs to emit logs, model decisions, request approvals, and create incidents." },
          { title: "Platform engineers", description: "Operate the FastAPI service, middleware, tenant context, and notification integrations." },
          { title: "Security and compliance", description: "Use incidents, replay, verification, and export jobs to investigate and prove behavior." },
        ]}
      />
    </>,
    [
      { title: "Installation", href: "/docs/getting-started/installation", description: "Set up local dependencies and environment variables." },
      { title: "Backend Overview", href: "/docs/backend/overview", description: "See how the API routers and services are organized." },
    ],
  ),
  "getting-started/quickstart": simpleDoc(
    "Getting Started",
    "Quickstart",
    "Install the SDK, load a key, emit an event, and confirm the platform is ready for richer team and incident workflows.",
    <>
      <SectionCard eyebrow="Step 1" title="Install and configure">
        <CodeBlock code={`pip install blocklog\nexport BLOCKLOG_API_KEY="blk_live_..."`} />
      </SectionCard>
      <SectionCard eyebrow="Step 2" title="Send the first authenticated request">
        <CodeBlock code={signupSnippet} />
      </SectionCard>
      <Callout label="What happens next">
        <p>
          Once authentication works, the same client can create decisions, request approvals,
          manage incidents, query traces, and interact with team APIs using the same company
          context.
        </p>
      </Callout>
    </>,
    [
      { title: "First Project", href: "/docs/getting-started/first-project", description: "Build the first end-to-end flow after the basic setup works." },
      { title: "Python Installation", href: "/docs/sdk/python/installation", description: "Go deeper on Python-specific setup and client usage." },
    ],
  ),
  "getting-started/installation": simpleDoc(
    "Getting Started",
    "Installation",
    "Set up the backend, the Python SDK, and the TypeScript SDK with the same naming and credential conventions used throughout the platform.",
    <>
      <MiniGrid
        items={[
          { title: "Backend", description: "Run the FastAPI app with the expected env vars for database, Redis, CORS, admin emails, and optional Sentry." },
          { title: "Python SDK", description: "Install from PyPI with pip and use BLOCKLOG_API_KEY, BLOCKLOG_ACCESS_TOKEN, and BLOCKLOG_BASE_URL." },
          { title: "TypeScript SDK", description: "Install with npm and use BLOCKLOG_API_KEY, BLOCKLOG_ACCESS_TOKEN, and BLOCKLOG_ENDPOINT." },
        ]}
      />
      <SectionCard title="Environment conventions">
        <BulletList
          items={[
            "Use API keys for service-to-service event ingestion and bearer tokens for dashboard-style or team-management workflows.",
            "Point SDK clients at the backend's /api/v1 prefix so route paths resolve consistently.",
            "Keep signing keys optional. They are only needed when client-side tamper evidence must be produced before transmission.",
          ]}
        />
      </SectionCard>
    </>,
    [
      { title: "SDK Overview", href: "/docs/sdk/overview", description: "See when to choose Python, TypeScript, or both." },
      { title: "Authentication Setup", href: "/docs/getting-started/authentication", description: "Choose API keys versus bearer tokens." },
    ],
  ),
  "getting-started/authentication": simpleDoc(
    "Getting Started",
    "Authentication",
    "Choose between API keys and bearer tokens, understand when each is accepted, and see how signup and login bootstrap team-aware user sessions.",
    <>
      <FactsGrid
        items={[
          { label: "API keys", value: "Accepted through X-API-Key and used for service traffic." },
          { label: "Bearer tokens", value: "Issued by /auth/signup and /auth/login and used for user-scoped operations." },
          { label: "Roles", value: "service and read-only are standard; admin and auditor depend on admin privileges." },
          { label: "Fallback", value: "Many tenant routes accept either a valid key or a valid bearer token." },
        ]}
      />
      <RouteTable title="Authentication endpoints" routes={authRoutes} />
    </>,
    related.auth,
  ),
  "getting-started/first-project": simpleDoc(
    "Getting Started",
    "First Project",
    "A practical path for a new engineer: create a workspace, authenticate a user, create a team, emit agent activity, and verify incident and notification flows.",
    <SectionCard title="Suggested milestone sequence">
      <BulletList
        items={[
          "Sign up a new user and confirm that team_id is returned.",
          "Switch the SDK into bearer mode and inspect the auto-created team.",
          "Emit AGENT_RUN or decision events and verify downstream traces appear.",
          "Configure a notification channel and run notify-test before enabling escalation.",
        ]}
      />
    </SectionCard>,
    [
      { title: "Signup Example", href: "/docs/examples/signup-and-team-creation", description: "Walk through the default company and team bootstrap." },
      { title: "Notification Testing", href: "/docs/examples/notification-testing", description: "Verify downstream delivery channels before shipping." },
    ],
  ),
  "backend/overview": simpleDoc(
    "Backend",
    "Backend Overview",
    "A code-oriented map of the FastAPI backend, including routers, middleware, auth boundaries, and the route families engineers use most often.",
    <>
      <FactsGrid
        items={[
          { label: "Entry point", value: "app.main.create_app wires middleware, lifespan hooks, and all /api/v1 routers." },
          { label: "Middleware", value: "Trusted hosts, security headers, structured logging, distributed rate limiting, tenant context, and CORS." },
          { label: "Auth deps", value: "require_api_key for tenant traffic and require_user_token for user actions." },
          { label: "Services", value: "Team, incident, notification, replay, verification, export, compliance, and execution services." },
        ]}
      />
      <MiniGrid
        items={[
          { title: "Operational APIs", description: "Logs, decisions, traces, batches, verification, export, integrity, and health endpoints make up the operational core." },
          { title: "Workflow APIs", description: "Teams, incidents, HITL, alerts, escalation routes, and onboarding support operational workflows." },
          { title: "Administrative APIs", description: "Auth, companies, licenses, usage, billing, admin, and compliance support platform administration." },
        ]}
      />
    </>,
    [
      { title: "Authorization", href: "/docs/backend/authorization", description: "Read how user and team checks are enforced." },
      { title: "Schemas", href: "/docs/api-reference/schemas", description: "Map routers to the primary request and response models." },
    ],
  ),
  "backend/authentication": simpleDoc(
    "Backend",
    "Backend Authentication",
    "See how the backend resolves API keys and bearer tokens, how admin-only endpoints are protected, and where auth context enters request handling.",
    <>
      <SectionCard title="Dependency model">
        <BulletList
          items={[
            "require_api_key accepts either X-API-Key or Bearer credentials and returns a tenant-scoped AuthContext.",
            "Bearer tokens are decoded, mapped to users, and normalized into user or admin roles.",
            "require_admin_api_key accepts only non-revoked admin API keys.",
            "User-token flows can layer require_company_admin, require_team_member, or require_team_owner checks afterward.",
          ]}
        />
      </SectionCard>
      <RouteTable title="Core auth routes" routes={authRoutes} />
    </>,
    related.auth,
  ),
  "backend/authorization": simpleDoc(
    "Backend",
    "Backend Authorization",
    "Understand the ownership and membership rules that govern company, team, and admin operations across the backend.",
    <>
      <MiniGrid
        items={[
          { title: "Company admin", description: "User role owner or admin is required for company-level administration." },
          { title: "Team member", description: "Listing or reading a team requires membership in the same company and matching team_id." },
          { title: "Team owner", description: "Updates, deletes, membership changes, and notification tests require the team owner." },
        ]}
      />
      <Callout label="Important guardrails">
        <p>
          The owner cannot be removed or demoted through the normal member update routes. The API
          explicitly blocks assigning owner through member add or update and expects ownership
          transfer logic instead.
        </p>
      </Callout>
    </>,
    [
      { title: "Backend Teams", href: "/docs/backend/teams", description: "See the concrete owner and member transitions." },
      { title: "Permissions Model", href: "/docs/architecture/permissions", description: "Read the platform-wide interpretation of these rules." },
    ],
  ),
  "backend/teams": simpleDoc(
    "Backend",
    "Teams & Ownership",
    "Document the backend team model, ownership creation at signup, member roles, slug uniqueness, and notification configuration storage.",
    <>
      <SectionCard title="What happens at signup">
        <p>
          When a user signs up without an existing company, the backend creates a company record,
          then creates a default team whose owner_user_id points at the new user. It also inserts a
          team member row with role=owner and returns team_id in the signup response.
        </p>
      </SectionCard>
      <MiniGrid
        items={[
          { title: "Slug generation", description: "Team slugs are normalized and de-duplicated per company." },
          { title: "Roles", description: "Supported team member roles are owner, reviewer, lead, and observer." },
          { title: "Channels", description: "Teams persist Slack, Teams, PagerDuty, custom webhook, and email configuration directly." },
        ]}
      />
    </>,
    related.teams,
  ),
  "backend/incidents": simpleDoc(
    "Backend",
    "Incidents",
    "Capture the incident lifecycle, workspace attachments, annotations, assignment, escalation, and report generation behavior implemented in the backend.",
    <RouteTable title="Incident routes" routes={incidentRoutes} />,
    [
      { title: "Incident APIs", href: "/docs/api-reference/incidents", description: "Read the exact routes and primary payload contracts." },
      { title: "Incident Lifecycle", href: "/docs/architecture/incident-lifecycle", description: "See how status changes and reporting fit together." },
    ],
  ),
  "backend/notifications": simpleDoc(
    "Backend",
    "Notifications",
    "Track how the backend dispatches Slack, Teams, PagerDuty, custom webhook, and email notifications from team configuration and escalation workflows.",
    <>
      <MiniGrid
        items={[
          { title: "Slack", description: "Posts a text payload to the configured team webhook and optional channel override." },
          { title: "Microsoft Teams", description: "Sends a simple text payload to the configured Teams webhook." },
          { title: "PagerDuty", description: "Calls the v2 Events API with severity from details or a warning default." },
          { title: "Custom webhook", description: "POSTs JSON plus any team-specific custom_webhook_headers." },
          { title: "Email", description: "Delegates to send_alert_email for every address in the team's email list." },
        ]}
      />
      <Callout label="Failure behavior">
        <p>
          Delivery helpers are intentionally non-throwing. They return per-channel booleans so test
          routes and escalation orchestrators can surface partial failure without crashing the main
          incident or review workflow.
        </p>
      </Callout>
    </>,
    [
      { title: "Notification APIs", href: "/docs/api-reference/notifications", description: "Review the routes that create alert and HITL traffic." },
      { title: "Notification Routing", href: "/docs/architecture/notification-routing", description: "Understand how team configuration turns into delivery behavior." },
    ],
  ),
  "backend/audit-trail": simpleDoc(
    "Backend",
    "Audit Trail",
    "See where the backend records administrative and human-review activity and how these records support evidence collection and incident investigation.",
    <BulletList
      items={[
        "Signup and password flows call log_admin_action for company creation, user creation, welcome email failures, and password reset events.",
        "HITL endpoints provide explicit audit-trail routes so approvals, rejections, overrides, and escalations can be reconstructed later.",
        "Incident annotations act as a second timeline for operational work, recording assignment, resolution, and closure messages.",
        "Verification, export, and report endpoints create durable artifacts that can be shared outside the operational database.",
      ]}
    />,
    [
      { title: "Schemas", href: "/docs/api-reference/schemas", description: "Map audit and incident entities to concrete models." },
      { title: "SDK Errors", href: "/docs/troubleshooting/sdk-errors", description: "Use audit and verification data when client behavior diverges." },
    ],
  ),
  "backend/webhooks": simpleDoc(
    "Backend",
    "Webhooks",
    "Document the webhook-facing endpoints and the team-level webhook delivery surfaces used by alerting and approval flows.",
    <RouteTable
      title="Webhook and delivery endpoints"
      routes={[
        { method: "GET", path: "/api/v1/webhooks/events", auth: "API key or bearer token", purpose: "List webhook events recorded by the platform.", request: "Tenant auth header.", response: "Webhook event collection." },
        { method: "POST", path: "/api/v1/webhooks", auth: "API key or bearer token", purpose: "Create an outbound webhook configuration.", request: "Webhook create payload.", response: "WebhookResponse." },
        { method: "POST", path: "/api/v1/billing/webhook", auth: "Provider-specific", purpose: "Receive subscription provider webhooks.", request: "Billing provider payload.", response: "Provider acknowledgement." },
      ]}
    />,
    [
      { title: "Notifications", href: "/docs/backend/notifications", description: "See how team webhooks are invoked." },
      { title: "Integrations", href: "/docs/backend/integrations", description: "Review schema registry, onboarding, provenance, and execution surfaces." },
    ],
  ),
  "backend/integrations": simpleDoc(
    "Backend",
    "Integrations",
    "The backend surfaces that support external frameworks, schema-aware ingestion, execution policy gateways, provenance capture, and onboarding helpers.",
    <RouteTable title="Integration-oriented routes" routes={integrationRoutes} />,
    [
      { title: "TypeScript Examples", href: "/docs/examples/sdk-usage", description: "See how external apps typically call these APIs." },
      { title: "API Integrations", href: "/docs/api-reference/integrations", description: "Read the concrete route families." },
    ],
  ),
  "backend/error-handling": simpleDoc(
    "Backend",
    "Error Handling",
    "Common backend failure modes, status code patterns, and where the service intentionally returns 400, 401, 403, 404, or 409 responses.",
    <BulletList
      items={[
        "400 is used for malformed transitions such as trying to assign owner through the member add route or reset a password with a bad token.",
        "401 covers invalid API keys, revoked keys, expired keys, and malformed bearer tokens.",
        "403 covers inactive users, inactive companies, admin-only endpoints, and team-owner restrictions.",
        "404 is returned when company, user, team, team member, incident, or report records are not found within the tenant scope.",
        "409 is used for conflicting uniqueness constraints such as duplicate team slugs or duplicate membership creation.",
      ]}
    />,
    [
      { title: "Authentication Errors", href: "/docs/troubleshooting/authentication-errors", description: "Troubleshoot invalid tokens and keys." },
      { title: "Authorization Errors", href: "/docs/troubleshooting/authorization-errors", description: "Troubleshoot membership and ownership failures." },
    ],
  ),
  "sdk/overview": simpleDoc(
    "SDK",
    "SDK Overview",
    "Compare the Python and TypeScript SDKs, understand the shared concepts, and choose the right client surface for your runtime and integration style.",
    <MiniGrid
      items={[
        { title: "Shared concepts", description: "Both SDKs expose decisions, incidents, approvals, replay, compliance, traces, teams, and auth clients." },
        { title: "Python", description: "Best when you want decorators, context managers, sync or async clients, and direct Pydantic model validation." },
        { title: "TypeScript", description: "Best when you need interceptors, queue-aware lifecycle control, and AsyncLocalStorage tracing." },
      ]}
    />,
    [
      { title: "Python SDK", href: "/docs/sdk/python/installation", description: "See the Python-specific sync and async client APIs." },
      { title: "TypeScript SDK", href: "/docs/sdk/typescript/installation", description: "See the TypeScript client, queueing, and tracing model." },
    ],
  ),
  "sdk/python/installation": simpleDoc("Python SDK", "Python Installation", "Install the Python SDK, configure environment variables, and understand the client entry points exposed by blocklog.init and BlocklogClient.", <>
    <CodeBlock code={`pip install blocklog\nexport BLOCKLOG_API_KEY="blk_live_..."`} />
    <BulletList items={["BlocklogClient is the main sync client. AsyncBlocklogClient mirrors the same domain clients for asyncio-based services.", "blocklog.init() stores a global client so decorators, decision helpers, approval helpers, replay, and verify modules share the same configuration.", "Core environment variables include BLOCKLOG_API_KEY, BLOCKLOG_ACCESS_TOKEN, BLOCKLOG_BASE_URL, BLOCKLOG_SDK_SIGNING_KEY, BLOCKLOG_TIMEOUT, and BLOCKLOG_MAX_RETRIES."]} />
  </>, [{ title: "Python Authentication", href: "/docs/sdk/python/authentication", description: "Use signup, login, and token handoff correctly." }, { title: "Python Examples", href: "/docs/sdk/python/examples", description: "Review runnable examples from the repository." }]),
  "sdk/python/authentication": simpleDoc("Python SDK", "Python Authentication", "Use the Python AuthClient for signup and login, then switch the client to bearer mode for team-aware dashboard APIs.", <>
    <SectionCard title="Auth client flow"><CodeBlock code={signupSnippet} /></SectionCard>
    <Callout label="Behavior to expect"><p>Signup returns token, expires_in, user, and team. Login returns token, user, and the primary team when one exists. Both methods fetch /auth/me internally after the initial credential exchange so callers get normalized user data immediately.</p></Callout>
  </>, related.auth),
  "sdk/python/teams": simpleDoc("Python SDK", "Python Teams", "Manage teams and memberships through the Python client and use the ownership helpers to make app or workflow decisions safely.", <BulletList items={["client.teams.list(), get(), create(), update(), delete(), and notify_test() mirror the REST team routes.", "client.teams.members.list(), add(), update(), and remove() normalize team roles and convert string user IDs back to backend integers.", "Helper utilities such as is_team_owner, can_manage_team, can_manage_members, and get_primary_team are designed for ownership-aware logic."]} />, related.teams),
  "sdk/python/incidents": simpleDoc("Python SDK", "Python Incidents", "Create incidents, attach workspace items, annotate investigations, and generate reports using the Python domain client.", <BulletList items={["The incidents client wraps list, get, create, update, assign, resolve, close, report, workspace, and annotation routes.", "Use incidents when you need an operational record and escalation path, not just low-level telemetry.", "Workspace items are a good place to attach evidence links, hashes, payload excerpts, and replay references during response work."]} />, [{ title: "Incident APIs", href: "/docs/api-reference/incidents", description: "Cross-reference the Python methods with backend routes." }, { title: "Incident Routing Example", href: "/docs/examples/incident-routing", description: "See the end-to-end operational workflow." }]),
  "sdk/python/notifications": simpleDoc("Python SDK", "Python Notifications", "Trigger test delivery, request human approval, and align Python-side workflow steps with backend notification and escalation behavior.", <BulletList items={["client.teams.notify_test(team_id) calls the same backend test endpoint used by the dashboard.", "blocklog.approval.request() and client.approval.* map Python workflows into HITL request, approve, reject, and escalation paths.", "The SDK itself does not send Slack or PagerDuty traffic directly; it invokes backend routes that use stored team configuration."]} />, [{ title: "Backend Notifications", href: "/docs/backend/notifications", description: "See what each downstream channel does on the server." }, { title: "Notification Testing Example", href: "/docs/examples/notification-testing", description: "Validate a channel before rollout." }]),
  "sdk/python/ownership": simpleDoc("Python SDK", "Python Ownership", "Interpret team and membership responses correctly so application code respects owner-only and member-only operations.", <MiniGrid items={[{ title: "Team.owner_user_id", description: "The canonical backend field that defines who can mutate a team or its membership." }, { title: "Team.current_user_is_owner", description: "A convenience boolean the backend includes when serializing the caller's team view." }, { title: "TeamMember.role", description: "A normalized SDK role that can differ slightly from backend enum strings in transitional compatibility code." }]} />, [{ title: "Permissions", href: "/docs/architecture/permissions", description: "See the shared backend and SDK mental model." }, { title: "Authorization Errors", href: "/docs/troubleshooting/authorization-errors", description: "Handle forbidden team operations cleanly." }]),
  "sdk/python/async": simpleDoc("Python SDK", "Python Async Support", "Use AsyncBlocklogClient and the async domain clients when your app already runs on asyncio and you want request concurrency without thread pools.", <BulletList items={["AsyncBlocklogClient exposes async versions of auth, teams, decisions, incidents, replay, compliance, traces, and verify.", "The async auth and team clients keep the same semantics as the sync versions, including the signup flow that hydrates user and team data.", "Context propagation relies on contextvars so decorator and session semantics survive across awaited boundaries."]} />, [{ title: "Python Installation", href: "/docs/sdk/python/installation", description: "Set up the base configuration first." }, { title: "SDK Architecture", href: "/docs/architecture/sdk-architecture", description: "See how the async transport fits into the overall stack." }]),
  "sdk/python/error-handling": simpleDoc("Python SDK", "Python Error Handling", "Handle transport and API failures consistently using the Python exception hierarchy and health helpers.", <BulletList items={["Use BlocklogError as the broad catch-all and narrower exceptions such as BlocklogAuthError, ValidationError, ConflictError, or RateLimitError where useful.", "DecisionContext wraps commit failures in BlocklogCommitError so silent decision persistence bugs do not disappear during instrumentation.", "blocklog.health() verifies basic API reachability, auth validity, signing-key state, and the SDK version in one call."]} />, [{ title: "SDK Errors", href: "/docs/troubleshooting/sdk-errors", description: "Troubleshoot common local configuration and runtime issues." }, { title: "Backend Error Handling", href: "/docs/backend/error-handling", description: "Map backend status codes to Python exceptions." }]),
  "sdk/python/examples": simpleDoc("Python SDK", "Python Examples", "Repository examples that cover quickstarts, trading agents, team management, approvals, incident investigation, decision comparison, and LangChain alerting.", <MiniGrid items={[{ title: "01_quickstart.py", description: "The smallest viable agent, tool, and decision flow." }, { title: "04_team_management.py", description: "Signup, token handoff, team ownership checks, and notify-test behavior." }, { title: "advanced/01_human_approval_workflow.py", description: "High-stakes approvals and reviewer routing." }, { title: "advanced/02_incident_investigation.py", description: "Incident creation, evidence capture, and report generation." }, { title: "advanced/03_decision_comparison.py", description: "Replay and comparison workflows for regressions or anomalies." }, { title: "advanced/langchain_alert_demo.py", description: "Framework instrumentation plus alert and incident flow." }]} />, [{ title: "SDK Usage Example", href: "/docs/examples/sdk-usage", description: "See a cross-SDK pattern library." }, { title: "Automation Example", href: "/docs/examples/automation", description: "Combine decisions, incidents, and approvals into an operational loop." }]),
  "sdk/typescript/installation": simpleDoc("TypeScript SDK", "TypeScript Installation", "Install the TypeScript SDK, configure endpoint and credentials, and understand the queue-aware client lifecycle.", <>
    <CodeBlock code={`npm install @blocklog/sdk\nexport BLOCKLOG_API_KEY="blk_live_..."`} />
    <CodeBlock code={tsSnippet} />
  </>, [{ title: "TypeScript Authentication", href: "/docs/sdk/typescript/authentication", description: "Use signup, login, and token upgrades." }, { title: "TypeScript Examples", href: "/docs/sdk/typescript/examples", description: "Review repository examples and guides." }]),
  "sdk/typescript/authentication": simpleDoc("TypeScript SDK", "TypeScript Authentication", "Use the TypeScript AuthClient for signup and login, then move into bearer-token team and dashboard operations without re-instantiating the client.", <BulletList items={["auth.signup() performs the signup request, then fetches /auth/me and /teams/{team_id} using tokenOverride so the caller receives hydrated user and team data.", "auth.login() performs the login request, then fetches /auth/me and /teams to derive a primary team when present.", "client.setAccessToken(token) switches subsequent requests into bearer mode without rebuilding transport or domain clients."]} />, related.auth),
  "sdk/typescript/teams": simpleDoc("TypeScript SDK", "TypeScript Teams", "Manage teams and memberships with normalized string IDs, role conversion helpers, and a nested team-members client.", <BulletList items={["TeamsClient exposes list, get, create, update, delete, and notifyTest methods.", "teams.members.add() and update() convert frontend role strings back into backend enum values and cast user IDs back to numbers for the API.", "normalizeTeam and normalizeTeamMember ensure the UI can consistently treat identifiers as strings."]} />, related.teams),
  "sdk/typescript/incidents": simpleDoc("TypeScript SDK", "TypeScript Incidents", "Create and manage incidents from web apps or services while keeping queueing, retries, and transport instrumentation under control.", <BulletList items={["Use the incidents client when you need structured operational work rather than passive telemetry alone.", "Incident reports, annotations, and workspace items are especially useful in frontend-led analyst tooling.", "The SDK lets you keep auth, transport interceptors, and trace context consistent across incident and event APIs."]} />, [{ title: "Incident APIs", href: "/docs/api-reference/incidents", description: "Cross-reference the methods with HTTP routes." }, { title: "Incident Example", href: "/docs/examples/incident-routing", description: "Walk through a concrete response flow." }]),
  "sdk/typescript/notifications": simpleDoc("TypeScript SDK", "TypeScript Notifications", "Trigger test notifications, approval workflows, and alert-adjacent operations from TypeScript applications.", <BulletList items={["teams.notifyTest(teamId) is the primary delivery validation hook for web apps and admin tooling.", "ApprovalClient and the hitl alias map business workflows into backend request, approve, reject, and escalate endpoints.", "Request and response interceptors are useful when notification workflows need custom headers, correlation IDs, or observability hooks."]} />, [{ title: "Backend Notifications", href: "/docs/backend/notifications", description: "Understand the server-side delivery implementations." }, { title: "Notification Testing Example", href: "/docs/examples/notification-testing", description: "Validate delivery channels before rollout." }]),
  "sdk/typescript/ownership": simpleDoc("TypeScript SDK", "TypeScript Ownership", "Use ownership helper utilities and normalized team models to keep frontend gating logic aligned with the backend.", <MiniGrid items={[{ title: "isTeamOwner", description: "Checks owner_user_id against the current user identifier." }, { title: "canManageTeam", description: "Currently mirrors ownership semantics for team mutation privileges." }, { title: "canManageMembers", description: "Lets apps reason about membership-edit UI based on normalized member roles." }]} />, [{ title: "Architecture Ownership Model", href: "/docs/architecture/ownership-model", description: "Review the authoritative ownership semantics." }, { title: "Authorization Errors", href: "/docs/troubleshooting/authorization-errors", description: "Handle forbidden UI transitions cleanly." }]),
  "sdk/typescript/react": simpleDoc("TypeScript SDK", "TypeScript React Patterns", "The SDK does not ship React-specific hooks, but it is designed to work cleanly in React and Next.js applications through stable client construction and typed async flows.", <BulletList items={["Create the client in a shared app service or stable module boundary rather than inside frequently re-rendered components.", "Use request interceptors for user correlation, tenant metadata, or auth refresh glue code inside web applications.", "Pair the SDK with server actions, route handlers, or dedicated API modules when sensitive API keys should not reach the browser."]} />, [{ title: "TypeScript Installation", href: "/docs/sdk/typescript/installation", description: "Set up the base client first." }, { title: "SDK Architecture", href: "/docs/architecture/sdk-architecture", description: "See the client, processor, queue, and transport layers." }]),
  "sdk/typescript/error-handling": simpleDoc("TypeScript SDK", "TypeScript Error Handling", "Work with the typed error classes, queue lifecycle, and health signals exposed by the TypeScript SDK.", <BulletList items={["Catch AuthenticationError, AuthorizationError, ValidationError, NotFoundError, RateLimitError, and related errors close to UI boundaries.", "Call client.flush() before shutdown-sensitive transitions and client.shutdown() during graceful app teardown.", "health() reports queueDepth, pendingEvents, and transport readiness so apps can surface operational state in diagnostics screens."]} />, [{ title: "SDK Errors", href: "/docs/troubleshooting/sdk-errors", description: "Troubleshoot common setup and runtime issues." }, { title: "Migration Errors", href: "/docs/troubleshooting/migration-errors", description: "Catch compatibility issues during upgrades." }]),
  "sdk/typescript/examples": simpleDoc("TypeScript SDK", "TypeScript Examples", "Example scripts and guide documents that show tracing, decisions, approvals, incidents, teams, and framework instrumentation in TypeScript.", <MiniGrid items={[{ title: "agent.ts and basic-agent.ts", description: "Minimal client setup and agent tracing." }, { title: "approval-workflow.ts", description: "Human review patterns and follow-up actions." }, { title: "incident-management.ts", description: "Incident creation, assignment, and lifecycle work." }, { title: "team-management.ts", description: "Signup, token upgrade, ownership checks, and notify-test behavior." }, { title: "docs/guides/*", description: "Narrative guides for tracing, tools, middleware, incidents, and replay." }, { title: "docs/integrations/*", description: "Framework-specific notes for LangChain, LangGraph, and OpenAI Agents." }]} />, [{ title: "SDK Usage Example", href: "/docs/examples/sdk-usage", description: "Compare patterns across the two SDKs." }, { title: "Automation Example", href: "/docs/examples/automation", description: "See a multi-step workflow composed from these primitives." }]),
  "api-reference/authentication": simpleDoc("API Reference", "Authentication API", "Detailed authentication, account bootstrap, and API key endpoints for user onboarding and service access.", <RouteTable title="Authentication endpoints" routes={authRoutes} />, related.auth),
  "api-reference/teams": simpleDoc("API Reference", "Teams API", "Team lifecycle, metadata, notification configuration, and owner-only operations.", <RouteTable title="Team endpoints" routes={teamRoutes} />, [{ title: "Team Members API", href: "/docs/api-reference/team-members", description: "Manage the member roster separately from team metadata." }, { title: "Backend Teams", href: "/docs/backend/teams", description: "Review the underlying ownership and slug logic." }]),
  "api-reference/team-members": simpleDoc("API Reference", "Team Members API", "Membership management routes and the backend constraints around owner transitions, role assignment, and removal.", <RouteTable title="Team member endpoints" routes={teamMemberRoutes} />, [{ title: "Teams API", href: "/docs/api-reference/teams", description: "Review the parent team lifecycle endpoints." }, { title: "Authorization", href: "/docs/backend/authorization", description: "Understand why some member transitions are forbidden." }]),
  "api-reference/incidents": simpleDoc("API Reference", "Incidents API", "Incident creation, assignment, workspace attachments, annotations, resolution, closure, and reporting.", <RouteTable title="Incident endpoints" routes={incidentRoutes} />, [{ title: "Incident Lifecycle", href: "/docs/architecture/incident-lifecycle", description: "Follow the intended state transitions." }, { title: "Examples", href: "/docs/examples/incident-routing", description: "See these APIs in a real operational sequence." }]),
  "api-reference/notifications": simpleDoc("API Reference", "Notifications & HITL API", "Alerting, human review, overrides, escalation, and delivery-validation endpoints.", <RouteTable title="Notification-oriented endpoints" routes={notificationRoutes} />, [{ title: "Notification Routing", href: "/docs/architecture/notification-routing", description: "Understand how these requests fan out to delivery channels." }, { title: "Backend Notifications", href: "/docs/backend/notifications", description: "See the concrete delivery behavior." }]),
  "api-reference/integrations": simpleDoc("API Reference", "Integrations API", "Schema registry, provenance, onboarding, execution gateway, and other platform surfaces used by external tools and framework integrations.", <RouteTable title="Integration endpoints" routes={integrationRoutes} />, [{ title: "Backend Integrations", href: "/docs/backend/integrations", description: "See how these routes are organized inside the service." }, { title: "Architecture Overview", href: "/docs/architecture/overview", description: "Place these APIs in the wider platform picture." }]),
  "api-reference/schemas": simpleDoc("API Reference", "Schemas & Models", "The most important request and response objects and persistence models across auth, teams, incidents, traces, and verification.", <MiniGrid items={[{ title: "Auth schemas", description: "UserSignupRequest, UserLoginRequest, UserTokenResponse, APIKeyCreateRequest, APIKeyPublic, and UserPublic." }, { title: "Team schemas", description: "TeamCreateRequest, TeamUpdateRequest, TeamResponse, TeamMemberAddRequest, TeamMemberUpdateRequest, and NotifyTestResponse." }, { title: "Incident schemas", description: "IncidentCreate, IncidentUpdate, IncidentAssign, IncidentResolve, IncidentClose, and InvestigationReportResponse." }, { title: "Workspace schemas", description: "IncidentWorkspaceItemCreate, IncidentWorkspaceItemResponse, IncidentAnnotationCreate, and IncidentAnnotationResponse." }, { title: "Runtime models", description: "Team, TeamMember, Incident, InvestigationReport, APIKey, User, Log, Trace, Batch, and replay-related entities." }, { title: "SDK models", description: "Python uses Pydantic models while TypeScript uses normalized interfaces and helper conversion functions." }]} />, [{ title: "Backend Overview", href: "/docs/backend/overview", description: "Connect schemas back to the route families." }, { title: "SDK Architecture", href: "/docs/architecture/sdk-architecture", description: "See how SDK models align with backend responses." }]),
  "architecture/overview": simpleDoc("Architecture", "Architecture Overview", "A high-level view of how identity, tenancy, logging, replay, verification, incidents, and notification routing connect across the platform.", <MiniGrid items={[{ title: "Identity & tenancy", description: "Users, companies, and API keys establish the company_id context used throughout the backend." }, { title: "Operational records", description: "Logs, decisions, traces, replay sessions, and incidents provide progressively richer investigative context." }, { title: "Governance layer", description: "Approvals, overrides, audit trails, compliance reports, and export flows turn operational data into evidence." }]} />, [{ title: "Ownership Model", href: "/docs/architecture/ownership-model", description: "Review how company and team control is represented." }, { title: "SDK Architecture", href: "/docs/architecture/sdk-architecture", description: "Follow the client-side path into the backend." }]),
  "architecture/ownership-model": simpleDoc("Architecture", "Ownership Model", "How companies, users, teams, and team members relate to each other and which fields define ownership in the live system.", <BulletList items={["Every user belongs to a company_id. If signup is self-serve, the company record is created automatically from workspace_name or a personal fallback.", "Every team belongs to a company and has exactly one owner_user_id, even though many members may exist.", "Team membership is recorded separately through TeamMember rows and carries role, on-call, and notification-channel overrides.", "Owner transitions are intentionally guarded and not modeled as a regular member-role update."]} />, related.teams),
  "architecture/permissions": simpleDoc("Architecture", "Permissions", "The shared mental model for API-key roles, user-token privileges, team membership checks, and owner-only actions.", <MiniGrid items={[{ title: "API key roles", description: "service and read-only are always available; admin and auditor are only creatable by admin users." }, { title: "User roles", description: "UserContext carries user_id, email, company_id, and a derived is_admin flag for admin-email users." }, { title: "Tenant scoping", description: "Queries always filter by company_id so IDs alone are not enough to cross tenants." }]} />, [{ title: "Backend Authorization", href: "/docs/backend/authorization", description: "See the concrete dependency functions." }, { title: "Troubleshooting Authorization", href: "/docs/troubleshooting/authorization-errors", description: "Resolve the most common forbidden transitions." }]),
  "architecture/notification-routing": simpleDoc("Architecture", "Notification Routing", "How incident triggers, HITL reviews, and test notifications route through team configuration into downstream channels.", <BulletList items={["Team records are the source of truth for Slack, Teams, PagerDuty, custom webhook, and email destinations.", "Incidents trigger escalation immediately after creation, using severity and company_id to decide the route.", "notify-test lets owners validate downstream configuration without waiting for a real incident or review task.", "Delivery returns channel-specific booleans so upstream flows can detect partial outages and continue collecting evidence."]} />, [{ title: "Backend Notifications", href: "/docs/backend/notifications", description: "See the delivery function implementations." }, { title: "Notification API", href: "/docs/api-reference/notifications", description: "Review the route families that initiate this work." }]),
  "architecture/incident-lifecycle": simpleDoc("Architecture", "Incident Lifecycle", "How an incident moves from creation through assignment, investigation, resolution, closure, and report export.", <BulletList items={["Creation stores severity, title, description, and open status, then triggers escalation.", "Assignment changes the owner and records an annotation when notes are provided.", "Resolution sets status=resolved, stores root cause plus remediation notes, and appends a system annotation.", "Closure sets status=closed and records closure metadata through a final annotation.", "Report generation creates or refreshes an InvestigationReport with export links and checksum material."]} />, [{ title: "Incident APIs", href: "/docs/api-reference/incidents", description: "Review the route contracts." }, { title: "Incident Example", href: "/docs/examples/incident-routing", description: "See the sequence in practice." }]),
  "architecture/sdk-architecture": simpleDoc("Architecture", "SDK Architecture", "How the Python and TypeScript SDKs layer configuration, transport, retry, buffering, context, and domain clients over the backend APIs.", <MiniGrid items={[{ title: "Configuration", description: "Both SDKs resolve env vars and constructor options into a single runtime config object." }, { title: "Transport", description: "Python uses sync or async HTTP transports; TypeScript uses a fetch-based transport abstraction with interceptors." }, { title: "Retry & buffering", description: "Both SDKs retry transient failures and provide buffered or batched event flows." }, { title: "Context", description: "Python uses contextvars; TypeScript uses AsyncLocalStorage-backed tracing state." }, { title: "Domain clients", description: "Teams, auth, incidents, decisions, replay, compliance, traces, and verification are layered over the shared transport." }]} />, [{ title: "SDK Overview", href: "/docs/sdk/overview", description: "Compare the two runtime implementations." }, { title: "Backend Overview", href: "/docs/backend/overview", description: "See where the SDKs ultimately send traffic." }]),
  "examples/signup-and-team-creation": simpleDoc("Examples", "Signup & Team Creation", "Follow the exact bootstrap path from user signup to company creation, default team ownership, and bearer-token upgrade.", <CodeBlock code={signupSnippet} />, [{ title: "Getting Started Authentication", href: "/docs/getting-started/authentication", description: "Understand the credential types used here." }, { title: "Team Management Example", href: "/docs/examples/team-management", description: "Continue from bootstrap into mutation workflows." }]),
  "examples/incident-routing": simpleDoc("Examples", "Incident Routing", "Create an incident, let escalation fire, attach evidence, and generate the report artifact that downstream responders can export.", <BulletList items={["POST /incidents with severity and context.", "Allow trigger_escalation to fan out according to routing configuration.", "Attach workspace items or annotations as responders gather evidence.", "Resolve, close, and POST /incidents/{id}/report once the investigation is ready for export."]} />, [{ title: "Incidents API", href: "/docs/api-reference/incidents", description: "See the endpoint contracts that power this flow." }, { title: "Notification Routing", href: "/docs/architecture/notification-routing", description: "Understand how severity turns into delivery." }]),
  "examples/team-management": simpleDoc("Examples", "Team Management", "A concrete team-management flow spanning signup, primary-team discovery, owner checks, team updates, membership access, and test notifications.", <BulletList items={["Find the primary team returned from signup or the first team in the team list after login.", "Gate edit UI and automation tasks on owner checks instead of membership alone.", "Treat ownership transfer as a distinct workflow from member-role mutation.", "Use notify-test after changing downstream destinations so the owner can verify delivery immediately."]} />, [{ title: "Python Teams", href: "/docs/sdk/python/teams", description: "See the Python client surface behind this example." }, { title: "TypeScript Teams", href: "/docs/sdk/typescript/teams", description: "See the equivalent TypeScript surface." }]),
  "examples/notification-testing": simpleDoc("Examples", "Notification Testing", "Validate Slack, Teams, PagerDuty, custom webhook, and email configuration before depending on them for incidents or approvals.", <BulletList items={["Persist the team's downstream configuration with the team update route.", "Run POST /teams/{team_id}/notify-test as the team owner.", "Inspect the per-channel boolean result and fix any provider-specific mismatch before rollout."]} />, [{ title: "Backend Notifications", href: "/docs/backend/notifications", description: "See what the backend sends to each provider." }, { title: "Notifications API", href: "/docs/api-reference/notifications", description: "Review related routing and review endpoints." }]),
  "examples/sdk-usage": simpleDoc("Examples", "SDK Usage", "Cross-SDK patterns for event emission, auth bootstrap, ownership-aware team work, and operational cleanup.", <CodeBlock code={tsSnippet} />, [{ title: "Python Examples", href: "/docs/sdk/python/examples", description: "See the Python repository scripts." }, { title: "TypeScript Examples", href: "/docs/sdk/typescript/examples", description: "See the TypeScript repository scripts." }]),
  "examples/automation": simpleDoc("Examples", "Automation", "Combine decisions, incidents, notifications, and approvals into a reliable operational control loop.", <BulletList items={["Emit telemetry or decision records as soon as the agent starts acting.", "Open an incident automatically when severity or policy thresholds are crossed.", "Request human approval for high-risk follow-up actions and record the outcome in the audit trail.", "Generate a report at the end of the workflow so compliance and response teams can consume the evidence package."]} />, [{ title: "Incident Lifecycle", href: "/docs/architecture/incident-lifecycle", description: "Understand the sequence of state changes." }, { title: "Approvals & Notifications", href: "/docs/api-reference/notifications", description: "Map the HITL and alert endpoints used in this flow." }]),
  "troubleshooting/authentication-errors": simpleDoc("Troubleshooting", "Authentication Errors", "Resolve invalid API keys, bearer-token parsing issues, revoked keys, expired credentials, and incorrect endpoint or environment-variable setup.", <BulletList items={["Verify you are sending X-API-Key for service flows and Authorization: Bearer for user flows.", "Check whether the backend expects /api/v1 in the configured base URL or endpoint.", "If signup or login works but later requests fail, ensure you called setAccessToken on the SDK client before team APIs.", "Revoked or expired keys return 401 from require_api_key even if the key format still looks valid."]} />, related.auth),
  "troubleshooting/authorization-errors": simpleDoc("Troubleshooting", "Authorization Errors", "Diagnose missing company-admin privileges, team membership problems, and owner-only route failures.", <BulletList items={["403 on a team read usually means the user is in the company but not in the team_members table for that team.", "403 on team mutation or notify-test usually means the caller is a member but not owner_user_id.", "400 when adding or updating a member to owner is expected; ownership transfer is intentionally not the same as role mutation."]} />, [{ title: "Permissions", href: "/docs/architecture/permissions", description: "Review the backend decision rules." }, { title: "Backend Authorization", href: "/docs/backend/authorization", description: "See the implementation details." }]),
  "troubleshooting/sdk-errors": simpleDoc("Troubleshooting", "SDK Errors", "Common local issues in the Python and TypeScript SDKs, including missing package resolution, path confusion, missing dependencies, and cleanup pitfalls.", <BulletList items={["For Python source checkouts, ensure tests import the local src tree and not an unrelated installed package copy.", "For TypeScript apps, call shutdown or flush when process lifetime matters so queued events do not remain in memory.", "Missing bearer tokens after signup or login usually surface later as team or /auth/me failures rather than during the initial auth call."]} />, [{ title: "Python Error Handling", href: "/docs/sdk/python/error-handling", description: "Review the Python exception model." }, { title: "TypeScript Error Handling", href: "/docs/sdk/typescript/error-handling", description: "Review the TypeScript runtime behavior." }]),
  "troubleshooting/notification-errors": simpleDoc("Troubleshooting", "Notification Errors", "Fix downstream delivery failures for Slack, Teams, PagerDuty, custom webhooks, and email.", <BulletList items={["Use notify-test first so you can inspect provider behavior without waiting for an actual incident.", "PagerDuty failures often come from invalid routing keys or unexpected severity formatting.", "Custom webhook failures often come from missing headers, incorrect endpoint URLs, or short provider timeouts.", "Email failures are delegated to the email service, so confirm send_alert_email configuration as well as team email_addresses."]} />, [{ title: "Backend Notifications", href: "/docs/backend/notifications", description: "Review the per-channel payload behavior." }, { title: "Notification Testing Example", href: "/docs/examples/notification-testing", description: "Reproduce and validate fixes quickly." }]),
  "troubleshooting/migration-errors": simpleDoc("Troubleshooting", "Migration Errors", "Migration and compatibility issues across backend schema changes, SDK route evolution, and auth or ownership model updates.", <BulletList items={["If SDK helpers expect a team from signup, confirm the backend still returns team_id in UserTokenResponse.", "Role-normalization helpers in both SDKs are the safest place to absorb backend enum naming changes.", "When route families move or new auth requirements are added, update the configured endpoint rather than hard-coding path prefixes in app code."]} />, [{ title: "Backend Overview", href: "/docs/backend/overview", description: "Review the current route organization." }, { title: "SDK Architecture", href: "/docs/architecture/sdk-architecture", description: "Check which client layer might still assume older behavior." }]),
};

export function renderDoc(slug: string) {
  const entry = docsContent[slug];
  if (!entry) {
    return null;
  }

  return (
    <DocsArticle
      eyebrow={entry.eyebrow}
      title={entry.title}
      description={entry.description}
      related={entry.related}
    >
      {entry.body}
    </DocsArticle>
  );
}
