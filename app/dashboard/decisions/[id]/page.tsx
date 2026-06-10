"use client";

import { useEffect, useState, use } from "react";
import DashboardTopBar from "@/components/DashboardTopBar";
import { blocklogRequest } from "@/lib/blocklog";

export default function DecisionDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [decision, setDecision] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [evidence, setEvidence] = useState<any>(null);
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [decRes, timelineRes, evidenceRes] = await Promise.all([
          blocklogRequest<any>(`/decisions/${id}`),
          blocklogRequest<any[]>(`/decisions/${id}/timeline`),
          blocklogRequest<any>(`/decisions/${id}/evidence`),
        ]);
        setDecision(decRes);
        setTimeline(timelineRes);
        setEvidence(evidenceRes);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load decision details");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [id]);

  if (loading) return <div className="spinner" style={{ margin: "100px auto" }} />;
  if (error) return <p className="error-banner">{error}</p>;
  if (!decision) return <p className="error-banner">Decision not found</p>;

  return (
    <>
      <DashboardTopBar title="AI Decision Inspection" />
      
      <div className="section" style={{ display: "grid", gap: "24px" }}>
        
        {/* Header Summary */}
        <div className="card liquid-glass" style={{ padding: "24px", borderRadius: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ margin: "0 0 8px 0", color: "var(--primary)", fontFamily: "monospace" }}>Decision: {decision.id}</h2>
            <div className="muted" style={{ display: "flex", gap: "16px", fontSize: "0.9rem" }}>
              <span><strong>Actor:</strong> {decision.actor || "System Agent"}</span>
              <span><strong>Model:</strong> {decision.model || "Unknown"}</span>
              <span><strong>Status:</strong> {decision.status || "Pending"}</span>
              <span><strong>Time:</strong> {new Date(decision.created_at).toLocaleString()}</span>
            </div>
          </div>
          <div>
            <button 
              className="btn" 
              onClick={() => setShowEvidenceModal(true)}
              style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
            >
              Verify Signature Proof
            </button>
          </div>
        </div>

        {/* Two Column Layout for Details */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          
          <div className="card liquid-glass" style={{ padding: "24px", borderRadius: "16px" }}>
            <h3 style={{ marginTop: 0, marginBottom: "16px", borderBottom: "1px solid var(--border)", paddingBottom: "12px" }}>Input Prompt & Context</h3>
            <div style={{ background: "var(--surface)", padding: "16px", borderRadius: "8px", border: "1px solid var(--border)", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem" }}>
              <pre style={{ margin: 0, whiteSpace: "pre-wrap", color: "var(--text)" }}>
                {decision.prompt || "No prompt recorded."}
              </pre>
            </div>
            
            <h4 style={{ marginTop: "24px", marginBottom: "12px" }}>Parsed Inputs</h4>
            <div style={{ background: "var(--surface)", padding: "16px", borderRadius: "8px", border: "1px solid var(--border)", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem" }}>
              <pre style={{ margin: 0, color: "var(--primary)" }}>
                {JSON.stringify(decision.inputs || {}, null, 2)}
              </pre>
            </div>
          </div>

          <div className="card liquid-glass" style={{ padding: "24px", borderRadius: "16px" }}>
            <h3 style={{ marginTop: 0, marginBottom: "16px", borderBottom: "1px solid var(--border)", paddingBottom: "12px" }}>Output & Policies</h3>
            
            <h4 style={{ marginTop: 0, marginBottom: "12px" }}>Model Output</h4>
            <div style={{ background: "var(--surface)", padding: "16px", borderRadius: "8px", border: "1px solid var(--border)", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem" }}>
              <pre style={{ margin: 0, color: "var(--success)" }}>
                {JSON.stringify(decision.outputs || {}, null, 2)}
              </pre>
            </div>

            <h4 style={{ marginTop: "24px", marginBottom: "12px" }}>Applied Policies</h4>
            <div style={{ background: "var(--surface)", padding: "16px", borderRadius: "8px", border: "1px dashed var(--border)", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem" }}>
              <pre style={{ margin: 0, color: "var(--text)" }}>
                {JSON.stringify(decision.policies || [], null, 2)}
              </pre>
            </div>

            <h4 style={{ marginTop: "24px", marginBottom: "12px" }}>Tools Called</h4>
            <div style={{ background: "var(--surface)", padding: "16px", borderRadius: "8px", border: "1px solid var(--border)", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem" }}>
              <pre style={{ margin: 0, color: "var(--text)" }}>
                {JSON.stringify(decision.tools || [], null, 2)}
              </pre>
            </div>
          </div>
          <div className="card liquid-glass" style={{ padding: "24px", borderRadius: "16px", gridColumn: "1 / -1" }}>
            <h3 style={{ marginTop: 0, marginBottom: "16px", borderBottom: "1px solid var(--border)", paddingBottom: "12px" }}>Execution Timeline</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {timeline.length === 0 ? (
                <div className="muted" style={{ fontStyle: "italic" }}>No timeline events found.</div>
              ) : (
                timeline.map((event, idx) => (
                  <div key={idx} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                    <div style={{ width: "120px", fontSize: "0.85rem", color: "var(--primary)", marginTop: "4px" }}>
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </div>
                    <div style={{ flex: 1, padding: "16px", background: "var(--surface)", borderRadius: "8px", borderLeft: "4px solid var(--accent)" }}>
                      <strong style={{ display: "block", marginBottom: "8px" }}>{event.action}</strong>
                      <pre style={{ margin: 0, fontSize: "0.85rem", color: "var(--text)", overflowX: "auto" }}>
                        {JSON.stringify(event.details, null, 2)}
                      </pre>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {showEvidenceModal && evidence && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div className="card liquid-glass" style={{ padding: "32px", borderRadius: "16px", width: "100%", maxWidth: "600px", maxHeight: "80vh", overflowY: "auto" }}>
            <h3 style={{ marginTop: 0, color: "var(--primary)" }}>Cryptographic Evidence</h3>
            
            <div style={{ display: "grid", gap: "16px", marginTop: "24px" }}>
              <div>
                <div className="muted" style={{ fontSize: "0.85rem", textTransform: "uppercase" }}>Input Hash (SHA256)</div>
                <div style={{ fontFamily: "monospace", wordBreak: "break-all" }}>{evidence.input_hash}</div>
              </div>
              <div>
                <div className="muted" style={{ fontSize: "0.85rem", textTransform: "uppercase" }}>Output Hash (SHA256)</div>
                <div style={{ fontFamily: "monospace", wordBreak: "break-all" }}>{evidence.output_hash}</div>
              </div>
              <div>
                <div className="muted" style={{ fontSize: "0.85rem", textTransform: "uppercase" }}>Verification Status</div>
                <div style={{ 
                  color: evidence.verification?.status === "VERIFIED" ? "var(--success)" : "var(--error)",
                  fontWeight: "bold"
                }}>
                  {evidence.verification?.status || "UNKNOWN"}
                </div>
              </div>
              
              {evidence.verification?.items && evidence.verification.items.length > 0 && (
                <div>
                  <div className="muted" style={{ fontSize: "0.85rem", textTransform: "uppercase", marginBottom: "8px" }}>Log Verifications</div>
                  {evidence.verification.items.map((item: any, idx: number) => (
                    <div key={idx} style={{ padding: "8px", background: "var(--surface)", borderRadius: "4px", marginBottom: "8px", fontSize: "0.85rem" }}>
                      Log: <span style={{ fontFamily: "monospace" }}>{item.item_id}</span> - {item.status}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button 
              className="btn" 
              onClick={() => setShowEvidenceModal(false)}
              style={{ width: "100%", marginTop: "24px", background: "var(--surface-strong)", color: "var(--text)" }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
