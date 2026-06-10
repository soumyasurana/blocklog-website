"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import DashboardTopBar from "@/components/DashboardTopBar";
import { blocklogRequest } from "@/lib/blocklog";

export default function DecisionsDashboard() {
  const [decisions, setDecisions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await blocklogRequest<any[]>("/decisions");
        setDecisions(res);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load decisions");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  return (
    <>
      <DashboardTopBar title="AI Decisions Log" />
      {error && <p className="error-banner">{error}</p>}

      <div className="section">
        <div className="card liquid-glass" style={{ padding: "24px", borderRadius: "16px" }}>
          <h2 style={{ marginTop: 0, marginBottom: "16px", color: "var(--primary)" }}>Decisions Registry</h2>
          {loading ? (
            <div className="spinner" style={{ margin: "20px auto" }} />
          ) : decisions.length === 0 ? (
            <div className="empty-state" style={{ padding: "40px 0" }}>No AI decisions logged.</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)", textAlign: "left" }}>
                    <th style={{ padding: "12px 8px" }} className="muted">Decision ID</th>
                    <th style={{ padding: "12px 8px" }} className="muted">Actor</th>
                    <th style={{ padding: "12px 8px" }} className="muted">Model</th>
                    <th style={{ padding: "12px 8px" }} className="muted">Status</th>
                    <th style={{ padding: "12px 8px" }} className="muted">Created At</th>
                    <th style={{ padding: "12px 8px", textAlign: "right" }} className="muted">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {decisions.map((decision) => (
                    <tr key={decision.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <td style={{ padding: "12px 8px", fontWeight: "bold", fontFamily: "monospace", fontSize: "0.9rem" }}>
                        {decision.id.split("-")[0]}...
                      </td>
                      <td style={{ padding: "12px 8px" }}>{decision.actor || "System Agent"}</td>
                      <td style={{ padding: "12px 8px" }}>
                        <span style={{ padding: "4px 8px", background: "var(--surface)", borderRadius: "4px", fontSize: "0.85rem", border: "1px solid var(--border)" }}>
                          {decision.model || "unknown-model"}
                        </span>
                      </td>
                      <td style={{ padding: "12px 8px" }}>
                        <span style={{ 
                          padding: "4px 8px", 
                          borderRadius: "4px", 
                          fontSize: "0.85rem", 
                          background: decision.status === "approved" ? "rgba(76, 175, 80, 0.1)" : "rgba(255, 255, 255, 0.05)",
                          color: decision.status === "approved" ? "var(--success)" : "var(--text)"
                        }}>
                          {decision.status || "Pending"}
                        </span>
                      </td>
                      <td style={{ padding: "12px 8px" }}>{new Date(decision.created_at).toLocaleString()}</td>
                      <td style={{ padding: "12px 8px", textAlign: "right" }}>
                        <Link href={`/dashboard/decisions/${decision.id}`} style={{ textDecoration: "none" }}>
                          <button className="btn btn-sm" style={{ background: "transparent", border: "1px solid var(--primary)", color: "var(--primary)" }}>
                            Inspect
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
