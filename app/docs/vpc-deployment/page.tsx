"use client";

import Link from "next/link";

// ─── Code snippets ────────────────────────────────────────────────────────────

const cloneBackendCmd = `# You will receive the Docker image via email after license activation.
# Load the image, then set up your environment:
docker load -i blocklog-backend.tar
cp .env.example .env`;

const backendEnvConfig = `# License (provided via email — 30-day free trial, then paid)
BLOCKLOG_LICENSE_KEY=bl_live_your_key_here

# Security — generate long random strings for each
JWT_SECRET_KEY=generate_a_long_random_string
API_KEY_SALT=generate_another_random_string

# Database
DATABASE_URL=postgresql://user:password@db_host:5432/blocklog

# Redis
REDIS_URL=redis://redis_host:6379/0

# CORS — add your dashboard domain here
CORS_ORIGINS=http://localhost:3000,https://your-dashboard-domain.com
`;

const startBackendCmd = `# Run database migrations
make migrate

# Start the full stack
make prod-up`;

const dashboardEnvConfig = `# Load the dashboard image received via email:
docker load -i blocklog-dashboard.tar

# Configure backend URL
NEXT_PUBLIC_BLOCKLOG_API_BASE_URL=https://your-backend-url/api/v1`;

const startDashboardCmd = `docker-compose up -d
# Dashboard available at http://localhost:3000`;

const verifyDeployCmd = `# Check service health
docker compose ps
docker compose logs -f api

# Test the API
curl http://localhost:8000/health

# Open the dashboard
open http://localhost:3000`;

const updateCmd = `# Backend
docker load -i blocklog-backend-vX.Y.Z.tar
docker compose up -d

# Dashboard
docker load -i blocklog-dashboard-vX.Y.Z.tar
docker-compose up -d`;

const awsSecretCmd = `aws secretsmanager create-secret \\
  --name blocklog/jwt-secret \\
  --secret-string "your_jwt_secret"`;

const corsConfig = `CORS_ORIGINS=http://localhost:3000,https://your-dashboard-domain.com`;

const troubleshootCmds = {
  wontStart: `docker compose logs api
# Check for missing env variables or DB connection errors`,
  migrationFail: `docker compose logs db
make migrate`,
  licenseValidation: `# Ensure outbound access to licenses.blocklog.dev is not blocked
docker compose logs api | grep license`,
  corsError: `# Add your dashboard URL to CORS_ORIGINS in backend .env, then restart
docker compose restart api`,
  charts: `# Add to docker-compose.yml under the dashboard service:
mem_limit: 512m`,
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/30 p-4 text-sm leading-6 text-zinc-200 sm:p-5">
      <code>{code}</code>
    </pre>
  );
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-white/5 px-1.5 py-0.5 text-zinc-200">
      {children}
    </code>
  );
}

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="max-w-3xl">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">
        {title}
      </h2>
    </div>
  );
}

function StepCard({
  step,
  title,
  description,
  children,
}: {
  step: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
        {step}
      </p>
      <h3 className="text-base font-semibold tracking-tight text-white sm:text-lg">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-7 text-muted sm:text-[15px]">
        {description}
      </p>
      <div className="mt-4">{children}</div>
    </article>
  );
}

function InfoBox({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] px-5 py-4">
      <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
        {label}
      </p>
      <div className="text-sm leading-7 text-muted sm:text-[15px]">
        {children}
      </div>
    </div>
  );
}

function DataTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: (string | React.ReactNode)[][];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-white/10">
            {headers.map((h) => (
              <th
                key={h}
                className="pb-3 pr-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-white/[0.05] last:border-0">
              {row.map((cell, j) => (
                <td key={j} className="py-3 pr-6 leading-6 text-zinc-200">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TroubleshootItem({
  problem,
  code,
  note,
}: {
  problem: string;
  code: string;
  note?: string;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-zinc-200">{problem}</p>
      {note && <p className="text-sm text-muted">{note}</p>}
      <CodeBlock code={code} />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SelfHostingDocsPage() {
  return (
    <main
      className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
      style={{ position: "relative", zIndex: 1 }}
    >
      <div className="space-y-14">

        {/* ── Page Header ── */}
        <header className="max-w-3xl">
          <p className="eyebrow">Self-Hosting</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Run Blocklog in Your Own Infrastructure
          </h1>
          <p className="mt-4 text-base leading-8 text-muted">
            Deploy the backend and dashboard inside your own environment. Your logs
            never leave your infrastructure — Blocklog has no access to your data.
          </p>
        </header>

        {/* ── Data Guarantee ── */}
        <InfoBox label="Data guarantee">
          When self-hosted, all agent logs, trace data, and decision records stay
          entirely within your infrastructure. Blocklog only validates your license
          key against{" "}
          <InlineCode>licenses.blocklog.dev</InlineCode> — no log content is ever
          transmitted externally.
        </InfoBox>

        {/* ── License & Trial ── */}
        <section className="space-y-4">
          <SectionHeader eyebrow="Licensing" title="Free Trial, Then Paid" />
          <p className="text-sm leading-7 text-muted sm:text-[15px]">
            After signing up, you will receive an email containing:
          </p>
          <ul className="space-y-2 text-sm leading-7 text-muted sm:text-[15px] list-none pl-0">
            {[
              "blocklog-backend.tar — the backend Docker image",
              "blocklog-dashboard.tar — the dashboard Docker image",
              "Your BLOCKLOG_LICENSE_KEY — valid for 30 days free, then a paid plan",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent)]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <InfoBox label="Note">
            The backend and dashboard repos are private. You interact with Blocklog
            exclusively through the Docker images provided via email. Updates are
            delivered as new image files.
          </InfoBox>
        </section>

        {/* ── Prerequisites ── */}
        <section className="space-y-4">
          <SectionHeader eyebrow="Prerequisites" title="What You Need Before Starting" />
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                label: "Container runtime",
                value: "Docker & Docker Compose (single-node) or Kubernetes (scaled)",
              },
              {
                label: "Database",
                value: "PostgreSQL 14+",
              },
              {
                label: "Task queue",
                value: "Redis 6+",
              },
              {
                label: "License key",
                value: "Provided in your onboarding email",
              },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                  {label}
                </p>
                <p className="mt-1 text-sm text-zinc-200">{value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Architecture ── */}
        <section className="space-y-4">
          <SectionHeader eyebrow="Architecture" title="What Gets Deployed" />
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
            <DataTable
              headers={["Image", "Description", "Source"]}
              rows={[
                [
                  <InlineCode key="be">blocklog-backend.tar</InlineCode>,
                  "Core API, Celery workers, PostgreSQL adapter, Redis adapter",
                  "Delivered via email",
                ],
                [
                  <InlineCode key="dash">blocklog-dashboard.tar</InlineCode>,
                  "Engineer dashboard + compliance console",
                  "Delivered via email",
                ],
              ]}
            />
          </div>
          <p className="text-sm leading-7 text-muted">
            The backend exposes a FastAPI application on port{" "}
            <InlineCode>8000</InlineCode>. The dashboard is a Next.js app on port{" "}
            <InlineCode>3000</InlineCode>. Both are fronted by an nginx reverse proxy
            that handles TLS and traffic forwarding.
          </p>
        </section>

        {/* ── Docker Compose Quickstart ── */}
        <section className="space-y-6">
          <SectionHeader
            eyebrow="Docker Compose Quickstart"
            title="Deploy in 5 Steps"
          />

          <StepCard
            step="Step 1"
            title="Load the backend image"
            description="Load the Docker image from the file you received via email, then copy the example environment file."
          >
            <CodeBlock code={cloneBackendCmd} />
          </StepCard>

          <StepCard
            step="Step 2"
            title="Configure the backend environment"
            description="Edit .env and fill in the required values. The license key, JWT secret, database URL, and Redis URL are mandatory."
          >
            <CodeBlock code={backendEnvConfig} />
            <div className="mt-4">
              <InfoBox label="Security">
                Never store wallet private keys in a <InlineCode>.env</InlineCode>{" "}
                file in production. Use AWS Secrets Manager, HashiCorp Vault, or
                your cloud provider's secrets service instead.
              </InfoBox>
            </div>
          </StepCard>

          <StepCard
            step="Step 3"
            title="Start the backend stack"
            description="Run migrations and bring up all services. This starts the API, Celery workers, Celery scheduler, and the nginx proxy."
          >
            <CodeBlock code={startBackendCmd} />
            <div className="mt-4 space-y-2">
              {[
                { svc: "api", desc: "Core FastAPI application on port 8000" },
                {
                  svc: "worker",
                  desc: "Celery workers for hash chaining and log sealing",
                },
                {
                  svc: "beat",
                  desc: "Celery scheduler for periodic batch sealing",
                },
                {
                  svc: "nginx",
                  desc: "Reverse proxy handling TLS and traffic forwarding",
                },
              ].map(({ svc, desc }) => (
                <div key={svc} className="flex items-start gap-3 text-sm text-muted">
                  <InlineCode>{svc}</InlineCode>
                  <span className="leading-6">{desc}</span>
                </div>
              ))}
            </div>
          </StepCard>

          <StepCard
            step="Step 4"
            title="Load and start the dashboard"
            description="Load the dashboard image and point it at your backend URL."
          >
            <CodeBlock code={dashboardEnvConfig} />
            <div className="mt-4">
              <CodeBlock code={startDashboardCmd} />
            </div>
          </StepCard>

          <StepCard
            step="Step 5"
            title="Verify the deployment"
            description="Check that all services are healthy, test the API, and open the dashboard."
          >
            <CodeBlock code={verifyDeployCmd} />
          </StepCard>
        </section>

        {/* ── Updating ── */}
        <section className="space-y-4">
          <SectionHeader eyebrow="Updates" title="Upgrading to a New Version" />
          <p className="text-sm leading-7 text-muted sm:text-[15px]">
            When a new version is available, you will receive updated image files
            via email. Load and restart each service in place:
          </p>
          <CodeBlock code={updateCmd} />
        </section>

        {/* ── Secrets Management ── */}
        <section className="space-y-4">
          <SectionHeader
            eyebrow="Secrets Management"
            title="Keep Credentials Out of .env in Production"
          />
          <p className="text-sm leading-7 text-muted sm:text-[15px]">
            Storing credentials in <InlineCode>.env</InlineCode> is fine for
            evaluation. For production, move them to a dedicated secrets manager.
            Example using AWS Secrets Manager:
          </p>
          <CodeBlock code={awsSecretCmd} />
          <p className="text-sm leading-7 text-muted sm:text-[15px]">
            Reference secrets in your ECS task definition or inject them via your
            deployment pipeline. Never commit <InlineCode>.env</InlineCode> files
            containing real credentials to version control.
          </p>
        </section>

        {/* ── VPC Topology ── */}
        <section className="space-y-4">
          <SectionHeader eyebrow="Network" title="Deploying Inside a VPC" />
          <p className="text-sm leading-7 text-muted sm:text-[15px]">
            Recommended topology: place all Blocklog services in a private subnet
            behind an internal load balancer that accepts HTTPS only. Outbound
            access is required only for:
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                label: "License validation",
                value: (
                  <>
                    <InlineCode>licenses.blocklog.dev</InlineCode> — no log data
                    sent, only a valid/invalid response
                  </>
                ),
              },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                  {label}
                </p>
                <p className="mt-1 text-sm leading-6 text-zinc-200">{value}</p>
              </div>
            ))}
          </div>
          <p className="text-sm leading-7 text-muted">
            All customer log data stays within your subnet.
          </p>
        </section>

        {/* ── CORS ── */}
        <section className="space-y-4">
          <SectionHeader eyebrow="CORS" title="Allowing the Dashboard to Reach the Backend" />
          <p className="text-sm leading-7 text-muted sm:text-[15px]">
            Add your dashboard domain to <InlineCode>CORS_ORIGINS</InlineCode> in
            the backend <InlineCode>.env</InlineCode>. If you change the dashboard
            domain later, update this value and restart the backend.
          </p>
          <CodeBlock code={corsConfig} />
        </section>

        {/* ── Visibility Table ── */}
        <section className="space-y-4">
          <SectionHeader
            eyebrow="Data Access"
            title="What Blocklog Can and Cannot See"
          />
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
            <DataTable
              headers={["", "Blocklog (Cloud)", "Your Self-Hosted Instance"]}
              rows={[
                ["Your agent logs", "✗ Never", "✓ Yes"],
                ["Your trace data", "✗ Never", "✓ Yes"],
                ["Log content", "✗ Never", "✓ Yes"],
                ["Instance version", "✓ Telemetry only", "—"],
                ["License status", "✓ Valid / invalid", "—"],
              ]}
            />
          </div>
        </section>

        {/* ── Hardware ── */}
        <section className="space-y-4">
          <SectionHeader eyebrow="Infrastructure" title="Hardware Requirements" />
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                tier: "Evaluation",
                specs: ["2 vCPU", "4 GB RAM", "50 GB SSD"],
              },
              {
                tier: "Production",
                specs: ["4 vCPU", "8 GB RAM", "100+ GB SSD"],
              },
              {
                tier: "High-Volume",
                specs: ["8+ vCPU", "16+ GB RAM", "Managed PostgreSQL (RDS or equivalent)"],
              },
            ].map(({ tier, specs }) => (
              <div
                key={tier}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                  {tier}
                </p>
                <ul className="mt-3 space-y-1">
                  {specs.map((s) => (
                    <li key={s} className="flex items-center gap-2 text-sm text-zinc-200">
                      <span className="h-1 w-1 rounded-full bg-[var(--accent)]" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ── Backup ── */}
        <section className="space-y-4">
          <SectionHeader eyebrow="Backup" title="Recommended Backup Policy" />
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "Daily PostgreSQL backups",
              "Database replication for production",
              "Immutable ledger exports to WORM storage",
              "30+ day retention policy",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-5 py-3 text-sm text-zinc-200"
              >
                <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent)]" />
                {item}
              </div>
            ))}
          </div>
        </section>

        {/* ── Troubleshooting ── */}
        <section className="space-y-6">
          <SectionHeader eyebrow="Troubleshooting" title="Common Issues" />
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6 space-y-7">
            <TroubleshootItem
              problem="Services won't start"
              code={troubleshootCmds.wontStart}
              note="Check for missing environment variables or database connection errors."
            />
            <div className="border-t border-white/[0.05]" />
            <TroubleshootItem
              problem="Database migration fails"
              code={troubleshootCmds.migrationFail}
            />
            <div className="border-t border-white/[0.05]" />
            <TroubleshootItem
              problem="License validation fails"
              code={troubleshootCmds.licenseValidation}
              note="Ensure outbound access to licenses.blocklog.dev is not blocked by your firewall or VPC security groups."
            />
            <div className="border-t border-white/[0.05]" />
            <TroubleshootItem
              problem="Dashboard can't reach backend (CORS error)"
              code={troubleshootCmds.corsError}
              note="Add the dashboard URL to CORS_ORIGINS in the backend .env, then restart."
            />
            <div className="border-t border-white/[0.05]" />
            <TroubleshootItem
              problem="Charts not rendering in the dashboard"
              code={troubleshootCmds.charts}
              note="The dashboard container may be hitting its memory limit."
            />
          </div>
        </section>

        {/* ── Support ── */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
            Support
          </p>
          <p className="text-sm leading-7 text-muted sm:text-[15px]">
            For deployment help, email{" "}
            <a
              href="mailto:support@blocklog.dev"
              className="text-zinc-200 underline underline-offset-2 hover:text-white"
            >
              support@blocklog.dev
            </a>{" "}
            or open an issue at{" "}
            <a
              href="https://github.com/blocklog-sec/blocklog-dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-200 underline underline-offset-2 hover:text-white"
            >
              github.com/blocklog-sec/blocklog-dashboard
            </a>
            .
          </p>
        </section>

        {/* ── Nav ── */}
        <nav className="flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row">
          <Link
            className="inline-flex items-center justify-center rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            href="/docs/quickstart"
          >
            Quickstart
          </Link>
          <Link
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/[0.06]"
            href="/docs/concepts"
          >
            Core Concepts
          </Link>
          <Link
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/[0.06]"
            href="/docs/python-sdk"
          >
            Python SDK Reference
          </Link>
        </nav>
      </div>
    </main>
  );
}