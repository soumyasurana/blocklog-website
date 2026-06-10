"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import DashboardTopBar from "@/components/DashboardTopBar";
import { blocklogRequest } from "@/lib/blocklog";

export default function IncidentWorkspace({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [incident, setIncident] = useState<any>(null);
  const [annotations, setAnnotations] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [noteContent, setNoteContent] = useState("");
  const [reportData, setReportData] = useState<any>(null);

  async function loadData() {
    try {
      const [incRes, annRes, itemRes] = await Promise.all([
        blocklogRequest<any>(`/incidents/${id}`),
        blocklogRequest<any[]>(`/incidents/${id}/annotations`),
        blocklogRequest<any[]>(`/incidents/${id}/workspace`),
      ]);
      setIncident(incRes);
      setAnnotations(annRes);
      setItems(itemRes);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load incident");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, [id]);

  async function handleAddNote(e: React.FormEvent) {
    e.preventDefault();
    if (!noteContent) return;
    try {
      await blocklogRequest(`/incidents/${id}/annotations`, "POST", {
        content: noteContent,
        annotation_type: "note",
        author: "Current User",
      });
      setNoteContent("");
      void loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to add note");
    }
  }

  async function handleAssign() {
    const assignee = window.prompt("Enter assignee name:");
    if (!assignee) return;
    const notes = window.prompt("Enter assignment notes (optional):") || undefined;
    try {
      await blocklogRequest(`/incidents/${id}/assign`, "POST", { assignee, notes });
      void loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to assign");
    }
  }

  async function handleResolve() {
    const resolution_summary = window.prompt("Enter resolution summary:");
    if (!resolution_summary) return;
    try {
      await blocklogRequest(`/incidents/${id}/resolve`, "POST", { resolution_summary });
      void loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to resolve");
    }
  }

  async function handleClose() {
    const closure_notes = window.prompt("Enter closure notes:");
    if (!closure_notes) return;
    try {
      await blocklogRequest(`/incidents/${id}/close`, "POST", { closure_notes });
      void loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to close");
    }
  }

  async function handleGenerateReport() {
    try {
      const res = await blocklogRequest<any>(`/incidents/${id}/report`, "POST", {});
      setReportData(res);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to generate report");
    }
  }

  if (loading) return <div className="spinner" style={{ margin: "100px auto" }} />;
  if (error) return <p className="error-banner">{error}</p>;
  if (!incident) return <p className="error-banner">Incident not found</p>;

  return (
    <>
      <DashboardTopBar title={`Incident Workspace: ${incident.title}`} />
      
      <div className="section" style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: "24px" }}>
        
        {/* Left Column - Details and Annotations */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div className="card liquid-glass" style={{ padding: "24px", borderRadius: "16px" }}>
            <h2 style={{ marginTop: 0, color: "var(--primary)" }}>Description</h2>
            <p>{incident.description || "No description provided."}</p>
            {incident.linked_replay_id && (
              <div style={{ marginTop: "16px", padding: "16px", background: "rgba(0,0,0,0.2)", borderRadius: "8px", border: "1px dashed var(--border)" }}>
                <strong style={{ display: "block", marginBottom: "8px" }}>Linked Forensics Replay</strong>
                <Link href={`/dashboard/forensics/replay/${incident.linked_replay_id}`}>
                  <button className="btn btn-sm" style={{ background: "var(--accent)", color: "var(--bg)", fontWeight: "600" }}>
                    View Replay Analysis
                  </button>
                </Link>
              </div>
            )}
          </div>

          <div className="card liquid-glass" style={{ padding: "24px", borderRadius: "16px", flex: 1 }}>
            <h2 style={{ marginTop: 0, color: "var(--primary)" }}>Investigation Timeline & Notes</h2>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
              {annotations.length === 0 ? (
                <div className="muted" style={{ fontStyle: "italic" }}>No notes or annotations yet.</div>
              ) : (
                annotations.map((ann) => (
                  <div key={ann.id} style={{ padding: "16px", background: "var(--surface)", borderRadius: "8px", borderLeft: "4px solid var(--accent)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <strong style={{ color: "var(--primary)" }}>{ann.author || "System"}</strong>
                      <span className="muted" style={{ fontSize: "0.85rem" }}>{new Date(ann.created_at).toLocaleString()}</span>
                    </div>
                    <p style={{ margin: 0 }}>{ann.content}</p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleAddNote} style={{ display: "flex", gap: "12px" }}>
              <input
                type="text"
                placeholder="Add a finding, note, or compliance remark..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                style={{ flex: 1, padding: "12px 16px", borderRadius: "8px", background: "var(--surface-strong)", border: "1px solid var(--border)", color: "var(--text)" }}
              />
              <button className="btn" type="submit" style={{ padding: "0 24px", background: "var(--primary)", color: "var(--bg)" }}>
                Add Note
              </button>
            </form>
          </div>
        </div>

        {/* Right Column - Metadata and Workspace Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div className="card liquid-glass" style={{ padding: "24px", borderRadius: "16px" }}>
            <h3 style={{ marginTop: 0, marginBottom: "16px" }}>Metadata</h3>
            <div style={{ display: "grid", gap: "12px" }}>
              <div>
                <div className="muted" style={{ fontSize: "0.85rem", textTransform: "uppercase" }}>Status</div>
                <div style={{ textTransform: "capitalize", fontWeight: "600" }}>{incident.status}</div>
              </div>
              <div>
                <div className="muted" style={{ fontSize: "0.85rem", textTransform: "uppercase" }}>Severity</div>
                <div style={{ textTransform: "capitalize", fontWeight: "600" }}>{incident.severity}</div>
              </div>
              <div>
                <div className="muted" style={{ fontSize: "0.85rem", textTransform: "uppercase" }}>Owner</div>
                <div style={{ fontWeight: "600" }}>{incident.owner || "Unassigned"}</div>
              </div>
              <div>
                <div className="muted" style={{ fontSize: "0.85rem", textTransform: "uppercase" }}>Created</div>
                <div style={{ fontSize: "0.9rem" }}>{new Date(incident.created_at).toLocaleString()}</div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px", marginTop: "24px", flexWrap: "wrap" }}>
              <button onClick={handleAssign} className="btn btn-sm" style={{ flex: 1, background: "var(--surface-strong)", border: "1px solid var(--border)", color: "var(--text)" }}>Assign</button>
              <button onClick={handleResolve} className="btn btn-sm" style={{ flex: 1, background: "var(--accent)", border: "1px solid var(--border)", color: "var(--bg)", fontWeight: "600" }}>Resolve</button>
              <button onClick={handleClose} className="btn btn-sm" style={{ flex: 1, background: "var(--error)", border: "1px solid var(--error)", color: "#fff", fontWeight: "600" }}>Close</button>
            </div>
          </div>

          <div className="card liquid-glass" style={{ padding: "24px", borderRadius: "16px" }}>
            <h3 style={{ marginTop: 0, marginBottom: "16px" }}>Evidence & Attachments</h3>
            {items.length === 0 ? (
              <p className="muted" style={{ fontSize: "0.9rem" }}>No files or evidence attached yet.</p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "12px" }}>
                {items.map((item) => (
                  <li key={item.id} style={{ padding: "12px", background: "var(--surface)", borderRadius: "8px", border: "1px solid var(--border)", fontSize: "0.9rem" }}>
                    <div style={{ fontWeight: "600", marginBottom: "4px" }}>{item.item_type}</div>
                    <div className="muted" style={{ wordBreak: "break-all" }}>{item.content || "No content"}</div>
                  </li>
                ))}
              </ul>
            )}
            <button className="btn btn-sm" style={{ width: "100%", marginTop: "16px", background: "var(--surface)", border: "1px dashed var(--border)" }}>
              + Attach Evidence
            </button>

            <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
              <button onClick={handleGenerateReport} className="btn btn-sm" style={{ width: "100%", background: "var(--primary)", color: "var(--bg)", fontWeight: "bold" }}>
                Generate Investigation Report
              </button>
              {reportData && (
                <div style={{ marginTop: "16px", padding: "16px", background: "rgba(0,255,0,0.05)", borderRadius: "8px", border: "1px solid var(--success)" }}>
                  <strong style={{ display: "block", color: "var(--success)", marginBottom: "8px" }}>Report Ready</strong>
                  <div style={{ fontSize: "0.85rem", wordBreak: "break-all", marginBottom: "8px" }}>
                    <span className="muted">Checksum: </span> {reportData.checksum}
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <a href={reportData.export_links?.pdf} target="_blank" rel="noreferrer" style={{ color: "var(--primary)", textDecoration: "underline", fontSize: "0.9rem" }}>Download PDF</a>
                    <a href={reportData.export_links?.json} target="_blank" rel="noreferrer" style={{ color: "var(--primary)", textDecoration: "underline", fontSize: "0.9rem" }}>Download JSON</a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
