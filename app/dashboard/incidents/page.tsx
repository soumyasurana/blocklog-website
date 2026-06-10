"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import DashboardTopBar from "@/components/DashboardTopBar";
import { blocklogRequest } from "@/lib/blocklog";

type Incident = {
  id: string;
  company_id: string;
  severity: string;
  owner: string | null;
  status: string;
  linked_replay_id: string | null;
  title: string;
  created_at: string;
  updated_at: string;
};

export default function IncidentsDashboard() {
  const router = useRouter();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // New incident form state
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [severity, setSeverity] = useState("medium");
  const [description, setDescription] = useState("");

  async function load() {
    try {
      const res = await blocklogRequest<Incident[]>("/incidents");
      setIncidents(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load incidents");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title) return;
    try {
      await blocklogRequest("/incidents", "POST", { title, severity, description });
      setIsCreating(false);
      setTitle("");
      setDescription("");
      void load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create incident");
    }
  }

  const getSeverityColor = (sev: string) => {
    switch (sev.toLowerCase()) {
      case "critical": return "var(--error)";
      case "high": return "#ff9800";
      case "medium": return "#ffeb3b";
      case "low": return "var(--success)";
      default: return "var(--text)";
    }
  };

  return (
    <>
      <DashboardTopBar title="Security Incidents" />
      {error && <p className="error-banner">{error}</p>}

      <div className="section" style={{ display: "grid", gap: "24px" }}>
        
        {/* Create Panel */}
        <div className="card liquid-glass" style={{ padding: "24px", borderRadius: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ margin: 0, color: "var(--primary)" }}>Manage Incidents</h2>
            <button className="btn" onClick={() => setIsCreating(!isCreating)} style={{ background: "var(--accent)", color: "var(--bg)", fontWeight: "600" }}>
              {isCreating ? "Cancel" : "New Incident"}
            </button>
          </div>

          {isCreating && (
            <form onSubmit={handleCreate} style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "end", marginTop: "24px" }}>
              <div style={{ flex: 1, minWidth: "240px" }}>
                <label className="muted" style={{ display: "block", marginBottom: "6px", fontSize: "0.8rem", textTransform: "uppercase" }}>Title</label>
                <input
                  type="text"
                  placeholder="e.g. Data Exfiltration from Prompt Injection"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", background: "var(--surface-strong)", border: "1px solid var(--border)", color: "var(--text)" }}
                  required
                />
              </div>
              <div style={{ width: "150px" }}>
                <label className="muted" style={{ display: "block", marginBottom: "6px", fontSize: "0.8rem", textTransform: "uppercase" }}>Severity</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", background: "var(--surface-strong)", border: "1px solid var(--border)", color: "var(--text)" }}
                >
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div style={{ flex: 2, minWidth: "300px" }}>
                <label className="muted" style={{ display: "block", marginBottom: "6px", fontSize: "0.8rem", textTransform: "uppercase" }}>Description</label>
                <input
                  type="text"
                  placeholder="Brief description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", background: "var(--surface-strong)", border: "1px solid var(--border)", color: "var(--text)" }}
                />
              </div>
              <button className="btn" type="submit" style={{ height: "42px", padding: "0 24px", background: "var(--primary)", color: "var(--bg)" }}>
                Create
              </button>
            </form>
          )}
        </div>

        {/* List Panel */}
        <div className="card liquid-glass" style={{ padding: "24px", borderRadius: "16px" }}>
          {loading ? (
            <div className="spinner" style={{ margin: "20px auto" }} />
          ) : incidents.length === 0 ? (
            <div className="empty-state" style={{ padding: "40px 0" }}>No incidents reported.</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)", textAlign: "left" }}>
                    <th style={{ padding: "12px 8px" }} className="muted">Title</th>
                    <th style={{ padding: "12px 8px" }} className="muted">Severity</th>
                    <th style={{ padding: "12px 8px" }} className="muted">Status</th>
                    <th style={{ padding: "12px 8px" }} className="muted">Owner</th>
                    <th style={{ padding: "12px 8px" }} className="muted">Created At</th>
                    <th style={{ padding: "12px 8px", textAlign: "right" }} className="muted">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {incidents.map((incident) => (
                    <tr key={incident.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <td style={{ padding: "12px 8px", fontWeight: "bold" }}>{incident.title}</td>
                      <td style={{ padding: "12px 8px", color: getSeverityColor(incident.severity) }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: getSeverityColor(incident.severity) }} />
                          <span style={{ textTransform: "capitalize" }}>{incident.severity}</span>
                        </div>
                      </td>
                      <td style={{ padding: "12px 8px", textTransform: "capitalize" }}>{incident.status}</td>
                      <td style={{ padding: "12px 8px", color: incident.owner ? "inherit" : "var(--muted)" }}>{incident.owner || "Unassigned"}</td>
                      <td style={{ padding: "12px 8px" }}>{new Date(incident.created_at).toLocaleString()}</td>
                      <td style={{ padding: "12px 8px", textAlign: "right" }}>
                        <Link href={`/dashboard/incidents/${incident.id}`} style={{ textDecoration: "none" }}>
                          <button className="btn btn-sm" style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}>
                            Investigate
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
