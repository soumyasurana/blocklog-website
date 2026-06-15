"use client";

import Link from "next/link";

const docGroups = [
  {
    title: "Getting Started",
    items: [
      { eyebrow: "Quickstart", title: "5 Minutes to First Log", description: "Install the SDK, configure credentials, and send your first cryptographically anchored audit log.", href: "/docs/quickstart" },
      { eyebrow: "Core Concepts", title: "Decisions, Cryptography & Accountability", description: "Understand the cryptographic foundations of tamper-evident logging and why Blocklog exists.", href: "/docs/concepts" },
    ],
  },
  {
    title: "References",
    items: [
      { eyebrow: "Python SDK", title: "Python SDK Reference", description: "Method signatures, parameter schemas, return types, and runnable examples for the Python client.", href: "/docs/python-sdk" },
      { eyebrow: "REST API", title: "REST API Reference", description: "Ingest logs, verify integrity, manage incidents, and trigger human review via HTTPS.", href: "/docs/api-reference" },
    ],
  },
  {
    title: "Examples",
    items: [
      { eyebrow: "End-to-End Example", title: "AI Agent Incident Reconstruction", description: "Walkthrough of a multi-agent workflow where a risk limit violation triggers forensic replay.", href: "/docs/incident-reconstruction" },
    ],
  },
];

export default function DocsIndexPage() {
  return (
    <main style={{ padding: "48px 48px 80px", maxWidth: 920, width: "100%", position: "relative", zIndex: 1 }}>
      <div className="space-y-8">
        <section style={{ marginBottom: 32 }}>
          <p className="eyebrow">Documentation</p>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.025em", margin: "10px 0 14px" }}>
            Blocklog Docs
          </h1>
          <p style={{ fontSize: "1rem", color: "var(--muted)", lineHeight: 1.75, maxWidth: 680, margin: 0 }}>
            Tamper-evident audit logging and AI forensic infrastructure. Start with the quickstart, then move into concepts, SDK usage, and API workflows.
          </p>
        </section>

        <Link href="/docs/quickstart" style={{ textDecoration: "none", display: "block" }}>
          <section style={{ border: "1px solid rgba(var(--accent-rgb), 0.22)", background: "rgba(var(--accent-rgb), 0.06)", borderRadius: 14, padding: "22px 24px", marginBottom: 36 }}>
            <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 8 }}>
              Start Here
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
              <div>
                <h2 style={{ fontSize: "1.05rem", fontWeight: 600, margin: "0 0 6px", color: "var(--foreground)" }}>
                  Quickstart — 5 Minutes to First Log
                </h2>
                <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.93rem", lineHeight: 1.7 }}>
                  Set up credentials, install the SDK, and anchor your first audit event.
                </p>
              </div>
              <span style={{ color: "var(--accent)", fontSize: "1.15rem" }}>→</span>
            </div>
          </section>
        </Link>

        <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
          {docGroups.map((group) => (
            <section key={group.title}>
              <h2 style={{ fontSize: "1.05rem", fontWeight: 600, margin: "0 0 14px", letterSpacing: "-0.01em" }}>
                {group.title}
              </h2>
              <div style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, overflow: "hidden", background: "rgba(255,255,255,0.02)" }}>
                {group.items.map((doc, index) => (
                  <Link
                    key={doc.href}
                    href={doc.href}
                    style={{ display: "block", textDecoration: "none", color: "inherit", padding: "18px 20px", borderTop: index === 0 ? "none" : "1px solid rgba(255,255,255,0.06)", transition: "background 0.15s ease" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 6 }}>
                      {doc.eyebrow}
                    </p>
                    <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between", gap: 16 }}>
                      <div>
                        <h3 style={{ margin: "0 0 6px", fontSize: "0.98rem", fontWeight: 600, color: "var(--foreground)" }}>
                          {doc.title}
                        </h3>
                        <p style={{ margin: 0, fontSize: "0.92rem", lineHeight: 1.7, color: "var(--muted)", maxWidth: 620 }}>
                          {doc.description}
                        </p>
                      </div>
                      <span style={{ color: "var(--muted)", fontSize: "1rem", flexShrink: 0, marginTop: 2 }}>→</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}