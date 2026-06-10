import Link from "next/link";

export default function SdksDocsPage() {
  return (
    <>
      <main className="container section">
        <div className="section-header">
          <div>
            <p className="eyebrow">SDKs and integration notes</p>
            <h1 style={{ marginTop: 0, marginBottom: 10 }}>
              First-class SDKs for AI Observability & Forensics
            </h1>
          </div>
          <p className="section-lead">
            Blocklog ships first-party Node.js and Python SDKs covering the full platform surface:
            log ingestion, incident management, decision forensics, HITL audit workflows, and replay comparisons.
          </p>
        </div>

        {/* Core SDK cards */}
        <div className="grid grid-3">
          <article className="card glass-card">
            <strong>Node.js / TypeScript</strong>
            <p className="muted" style={{ marginBottom: 0 }}>
              Fully typed. Covers ingestion, incidents, decisions, forensics, and HITL. Works in any Node.js 18+ environment.
            </p>
          </article>
          <article className="card glass-card">
            <strong>Python</strong>
            <p className="muted" style={{ marginBottom: 0 }}>
              Sync transport with retries. Namespaced API groups mounted directly on the client. Supports LangChain, LangGraph, and OpenAI Agents integrations.
            </p>
          </article>
          <article className="card glass-card">
            <strong>Operational guardrails</strong>
            <p className="muted" style={{ marginBottom: 0 }}>
              Auto timestamps, idempotency keys, safe batching, and bounded backoff retries — encoded by default in every SDK call.
            </p>
          </article>
        </div>

        {/* Python SDK reference */}
        <section className="card glass-card" style={{ marginTop: 24 }}>
          <p className="eyebrow">Python SDK</p>
          <h2 style={{ marginTop: 8, marginBottom: 16 }}>Quick start</h2>
          <pre style={{ background: "rgba(0,0,0,0.3)", padding: "16px", borderRadius: "8px", overflowX: "auto", fontSize: "0.9rem" }}>{`from blocklog.client import BlocklogClient
from blocklog.config import BlocklogConfig

# Initialize from environment variables BLOCKLOG_API_KEY, BLOCKLOG_BASE_URL
client = BlocklogClient.from_env()

# --- Ingest Events ---
client.event("agent.decision", {"action": "approve_loan", "confidence": 0.97})

# --- Incident Lifecycle ---
client.incidents.assign(incident_id, assignee="alice@acme.com", notes="Taking ownership")
client.incidents.resolve(incident_id, resolution_summary="Root cause: stale model cache")
client.incidents.close(incident_id, closure_notes="Post-mortem complete")
report = client.incidents.generate_report(incident_id)
print(report["export_links"]["pdf"])

# --- AI Decision Forensics ---
timeline = client.decisions.get_timeline(decision_id)
evidence = client.decisions.get_evidence(decision_id)

# --- Replay Comparisons ---
comparison = client.forensics.compare(baseline_session_id, failed_session_id)
print(f"Found {len(comparison['differences'])} divergences")

# --- HITL Audit ---
client.hitl.reject(reviewer="bob@acme.com", rejection_reason="Policy violation")
client.hitl.escalate("bob@acme.com", "ciso@acme.com", "Requires senior review")
trail = client.hitl.get_audit_trail()`}</pre>
        </section>

        {/* Node SDK reference */}
        <section className="card glass-card" style={{ marginTop: 18 }}>
          <p className="eyebrow">Node.js SDK</p>
          <h2 style={{ marginTop: 8, marginBottom: 16 }}>Quick start</h2>
          <pre style={{ background: "rgba(0,0,0,0.3)", padding: "16px", borderRadius: "8px", overflowX: "auto", fontSize: "0.9rem" }}>{`import { BlocklogClient } from "@blocklog/node";

const client = new BlocklogClient({
  baseUrl: process.env.BLOCKLOG_BASE_URL!,
  apiKey: process.env.BLOCKLOG_API_KEY!,
});

// --- Ingest Events ---
await client.ingestLog({ event_type: "agent.decision", data: { action: "approve_loan" } });

// --- Incident Lifecycle ---
await client.incidents.assign(id, "alice@acme.com");
await client.incidents.resolve(id, "Root cause: stale model cache");
await client.incidents.close(id, "Post-mortem complete");
const report = await client.incidents.generateReport(id);

// --- AI Decision Forensics ---
const timeline = await client.decisions.getTimeline(id);
const evidence = await client.decisions.getEvidence(id);

// --- Replay Comparisons ---
const comparison = await client.forensics.compare(baselineId, candidateId);
const saved = await client.forensics.getComparison(comparison.id); // shareable

// --- HITL Audit ---
await client.hitl.reject("reviewer@acme.com", "Policy violation detected");
await client.hitl.escalate("reviewer@acme.com", "ciso@acme.com", "Escalating");
const trail = await client.hitl.getAuditTrail();`}</pre>
        </section>

        {/* Included guardrails */}
        <section className="card glass-card" style={{ marginTop: 18 }}>
          <p className="eyebrow">Built-in guardrails</p>
          <h2 style={{ marginTop: 8, marginBottom: 10 }}>The platform contracts, enforced in every call.</h2>
          <ul className="muted" style={{ margin: 0, paddingLeft: 18, lineHeight: 2 }}>
            <li>UTC timestamps added automatically when the caller omits one.</li>
            <li>Transient failures retried with bounded exponential backoff.</li>
            <li>Batch ingestion chunked safely to stay within API payload limits.</li>
            <li>Input schema validated before hitting the wire — errors surface locally.</li>
            <li>Idempotency keys are first-class — duplicate submissions resolve to the same log entry.</li>
            <li>All API namespaces share the same transport, retry policy, and auth headers.</li>
          </ul>
        </section>

        {/* API namespace overview */}
        <section className="card glass-card" style={{ marginTop: 18 }}>
          <p className="eyebrow">API Surface</p>
          <h2 style={{ marginTop: 8, marginBottom: 16 }}>Full namespace reference</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left" }}>
                  <th style={{ padding: "10px 12px" }}>Namespace</th>
                  <th style={{ padding: "10px 12px" }}>Method</th>
                  <th style={{ padding: "10px 12px" }}>REST Endpoint</th>
                  <th style={{ padding: "10px 12px" }}>Description</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["incidents", "assign(id, assignee, notes?)", "POST /incidents/{id}/assign", "Assign an incident to an investigator"],
                  ["incidents", "resolve(id, summary, ...)", "POST /incidents/{id}/resolve", "Mark resolved with root cause"],
                  ["incidents", "close(id, notes)", "POST /incidents/{id}/close", "Lock the investigation"],
                  ["incidents", "generateReport(id)", "POST /incidents/{id}/report", "Generate PDF/JSON report"],
                  ["decisions", "getTimeline(id)", "GET /decisions/{id}/timeline", "Chronological execution trace"],
                  ["decisions", "getEvidence(id)", "GET /decisions/{id}/evidence", "Cryptographic hashes and proofs"],
                  ["forensics", "compare(baselineId, candidateId)", "POST /forensics/compare", "Run and persist a comparison"],
                  ["forensics", "getComparison(id)", "GET /forensics/compare/{id}", "Retrieve a saved comparison"],
                  ["hitl", "reject(reviewer, reason)", "POST /hitl/reject", "Log a human rejection"],
                  ["hitl", "escalate(from, to, reason)", "POST /hitl/escalate", "Log an escalation"],
                  ["hitl", "getAuditTrail()", "GET /hitl/audit-trail", "Full chronological HITL log"],
                ].map(([ns, method, endpoint, desc], i) => (
                  <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <td style={{ padding: "10px 12px" }}><code style={{ color: "var(--primary)" }}>client.{ns}</code></td>
                    <td style={{ padding: "10px 12px", fontFamily: "monospace", fontSize: "0.85rem" }}>.{method}</td>
                    <td style={{ padding: "10px 12px", fontFamily: "monospace", fontSize: "0.85rem", color: "var(--accent)" }}>{endpoint}</td>
                    <td style={{ padding: "10px 12px", color: "var(--text-muted, #888)" }}>{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="button-row" style={{ marginTop: 24 }}>
          <Link className="btn btn-primary" href="/docs/getting-started">
            Getting Started
          </Link>
          <Link className="btn" href="/docs/log-ingestion">
            Log Ingestion
          </Link>
          <Link className="btn" href="/dashboard">
            Open Dashboard →
          </Link>
        </div>
      </main>
    </>
  );
}
