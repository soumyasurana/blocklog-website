"use client";

import Link from "next/link";
import { Reveal } from "@/components/site/Primitives";

type EndpointProps = {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  title: string;
  description: string;
  request?: string;
  response?: string;
};

function MethodBadge({ method }: { method: EndpointProps["method"] }) {
  const styles = {
    GET: "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-400/20",
    POST: "bg-sky-500/10 text-sky-300 ring-1 ring-sky-400/20",
    PUT: "bg-amber-500/10 text-amber-300 ring-1 ring-amber-400/20",
    DELETE: "bg-rose-500/10 text-rose-300 ring-1 ring-rose-400/20",
  };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[0.12em] ${styles[method]}`}>
      {method}
    </span>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/30 p-4 text-sm leading-6 text-zinc-200 sm:p-5">
      <code>{code}</code>
    </pre>
  );
}

function EndpointCard({ method, path, title, description, request, response }: EndpointProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <MethodBadge method={method} />
          <code className="truncate text-sm text-[var(--accent)]">{path}</code>
        </div>
      </div>
      <h2 className="mt-4 text-lg font-semibold tracking-tight text-white">{title}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-muted sm:text-[15px]">{description}</p>
      <div className="mt-5 space-y-5">
        {request && (
          <div>
            <h3 className="text-sm font-semibold text-white">Request</h3>
            <div className="mt-3"><CodeBlock code={request} /></div>
          </div>
        )}
        {response && (
          <div>
            <h3 className="text-sm font-semibold text-white">Response · 200 OK</h3>
            <div className="mt-3"><CodeBlock code={response} /></div>
          </div>
        )}
      </div>
    </section>
  );
}

const endpoints: EndpointProps[] = [
  {
    method: "POST",
    path: "/api/v1/logs",
    title: "Ingest log",
    description: "Submit a single audit event payload to the secure ledger. Returns the generated UUID.",
    request: `Headers:\nX-API-Key: <your_api_key>\n\nBody (JSON):\n{\n  "event_type": "string",\n  "data": { ... },\n  "source": "string (optional)",\n  "trace_id": "string (UUID, optional)",\n  "session_id": "string (UUID, optional)"\n}`,
    response: `{\n  "log_id": "string (UUID)",\n  "company_id": "string",\n  "event_type": "string",\n  "created_at": "string (ISO-8601)"\n}`,
  },
  {
    method: "POST",
    path: "/api/v1/logs/batch",
    title: "Ingest logs batch",
    description: "Submit a batch of events in one API request.",
    request: `Body (JSON):\n{\n  "logs": [\n    { "event_type": "transaction", "data": { ... } }\n  ]\n}`,
    response: `{\n  "ingested": 1,\n  "log_ids": ["string (UUID)"]\n}`,
  },
  {
    method: "GET",
    path: "/api/v1/logs/{log_id}/verify",
    title: "Verify log chain",
    description: "Check chain validation hashes and signature validity for a specific log ID.",
    response: `{\n  "log_id": "string (UUID)",\n  "hash": "string (hex)",\n  "chain_valid": true,\n  "signature_valid": true,\n  "verified_at": "string (ISO-8601)"\n}`,
  },
  {
    method: "POST",
    path: "/api/v1/forensics/replays",
    title: "Create forensic replay",
    description: "Create a forensic replay session for a given trace to build a timeline, causal graph, or staleness assessment.",
    request: `Body (JSON):\n{\n  "trace_id": "string (UUID)",\n  "token_id": "string (optional)",\n  "metadata": {}\n}`,
    response: `{\n  "id": "string (UUID)",\n  "company_id": "string",\n  "trace_id": "string (UUID)",\n  "created_at": "string (ISO-8601)"\n}`,
  },
  {
    method: "GET",
    path: "/api/v1/forensics/replays/{replay_session_id}/root-cause",
    title: "Get replay root cause",
    description: "Run heuristics over the replay session timeline to identify anomalies such as stale context or policy denials.",
    response: `{\n  "detected": true,\n  "root_cause_type": "STALE_CONTEXT",\n  "description": "Execution relied on stale data source at path 'market.feed'.",\n  "confidence": 0.95,\n  "remediation": "Refresh the stale resource before executing."\n}`,
  },
  {
    method: "POST",
    path: "/api/v1/hitl/reject",
    title: "Submit human review rejection",
    description: "Audit human rejection overrides.",
    request: `Body (JSON):\n{\n  "reviewer": "reviewer@company.com",\n  "rejection_reason": "Limit exceeded",\n  "decision_id": "string (UUID, optional)"\n}`,
  },
];

export default function ApiReferenceDocsPage() {
  return (
    <main
      className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
      style={{ position: "relative", zIndex: 1 }}
    >
      <div className="space-y-8">
        <header className="max-w-3xl">
          <p className="eyebrow">API Reference</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            REST API Reference
          </h1>
          <p className="mt-4 text-base leading-8 text-muted">
            Ingest logs, verify data integrity, manage incidents, and review human authorization workflows through the HTTPS API.
          </p>
        </header>

        <section className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:grid-cols-3 sm:p-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Auth</p>
            <p className="mt-2 text-sm text-white">X-API-Key header</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Format</p>
            <p className="mt-2 text-sm text-white">JSON request/response</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Base pattern</p>
            <p className="mt-2 text-sm text-white">/api/v1/...</p>
          </div>
        </section>

        <div className="space-y-6">
          {endpoints.map((endpoint) => (
            <EndpointCard key={`${endpoint.method}-${endpoint.path}`} {...endpoint} />
          ))}
        </div>

        <nav className="flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row">
          <Link
            className="inline-flex items-center justify-center rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            href="/docs/incident-reconstruction"
          >
            End-to-End Example
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