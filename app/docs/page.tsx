"use client";

import Link from "next/link";
import { docsIndexGroups } from "./content";

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
            Production documentation for the Blocklog backend, SDKs, API surface, ownership model, incident workflows, and troubleshooting paths.
          </p>
        </section>

        <Link href="/docs/getting-started/introduction" style={{ textDecoration: "none", display: "block" }}>
          <section style={{ border: "1px solid rgba(var(--accent-rgb), 0.22)", background: "rgba(var(--accent-rgb), 0.06)", borderRadius: 14, padding: "22px 24px", marginBottom: 36 }}>
            <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 8 }}>
              Start Here
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
              <div>
                <h2 style={{ fontSize: "1.05rem", fontWeight: 600, margin: "0 0 6px", color: "var(--foreground)" }}>
                  Introduction — Platform Orientation
                </h2>
                <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.93rem", lineHeight: 1.7 }}>
                  Learn how the backend, SDKs, teams, incidents, notifications, and governance pieces fit together.
                </p>
              </div>
              <span style={{ color: "var(--accent)", fontSize: "1.15rem" }}>→</span>
            </div>
          </section>
        </Link>

        <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
          {docsIndexGroups.map((group) => (
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
