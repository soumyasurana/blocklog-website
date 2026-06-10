"use client";

import { useEffect, useState } from "react";
import DashboardTopBar from "@/components/DashboardTopBar";
import { blocklogRequest } from "@/lib/blocklog";

type HITLAuditEntry = {
  id: string;
  company_id: string;
  action: string;
  reviewer: string;
  target_reviewer: string | null;
  reason: string | null;
  timestamp: string;
};

const ACTION_COLORS: Record<string, string> = {
  approve: "var(--success)",
  reject: "var(--error)",
  escalate: "#f59e0b",
  request: "var(--primary)",
};

const ACTION_ICONS: Record<string, string> = {
  approve: "✓",
  reject: "✗",
  escalate: "↑",
  request: "?",
};

export default function HITLAuditTrailPage() {
  const [entries, setEntries] = useState<HITLAuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New reject/escalate form state
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [showEscalateForm, setShowEscalateForm] = useState(false);
  const [rejectReviewer, setRejectReviewer] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [escalateCurrentReviewer, setEscalateCurrentReviewer] = useState("");
  const [escalateTarget, setEscalateTarget] = useState("");
  const [escalateReason, setEscalateReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function loadTrail() {
    try {
      setLoading(true);
      const res = await blocklogRequest<HITLAuditEntry[]>("/hitl/audit-trail");
      setEntries(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load audit trail");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadTrail();
  }, []);

  async function handleReject(e: React.FormEvent) {
    e.preventDefault();
    if (!rejectReviewer || !rejectReason) return;
    setSubmitting(true);
    try {
      await blocklogRequest("/hitl/reject", "POST", {
        reviewer: rejectReviewer,
        rejection_reason: rejectReason,
      });
      setRejectReviewer("");
      setRejectReason("");
      setShowRejectForm(false);
      void loadTrail();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to submit rejection");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleEscalate(e: React.FormEvent) {
    e.preventDefault();
    if (!escalateCurrentReviewer || !escalateTarget || !escalateReason) return;
    setSubmitting(true);
    try {
      await blocklogRequest("/hitl/escalate", "POST", {
        current_reviewer: escalateCurrentReviewer,
        escalation_target: escalateTarget,
        escalation_reason: escalateReason,
      });
      setEscalateCurrentReviewer("");
      setEscalateTarget("");
      setEscalateReason("");
      setShowEscalateForm(false);
      void loadTrail();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to submit escalation");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <DashboardTopBar title="HITL Audit Trail" />

      {error && <p className="error-banner">{error}</p>}

      <div className="section" style={{ display: "grid", gap: "24px" }}>

        {/* Header Controls */}
        <div className="card liquid-glass" style={{ padding: "24px", borderRadius: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h2 style={{ margin: 0, color: "var(--primary)" }}>Human Review Decisions</h2>
            <p className="muted" style={{ margin: "8px 0 0 0", fontSize: "0.9rem" }}>
              Immutable chronological record of all approvals, rejections, and escalations.
            </p>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              className="btn btn-sm"
              onClick={() => { setShowEscalateForm(false); setShowRejectForm(!showRejectForm); }}
              style={{ background: "rgba(239,68,68,0.15)", border: "1px solid var(--error)", color: "var(--error)", fontWeight: "600" }}
            >
              + Log Rejection
            </button>
            <button
              className="btn btn-sm"
              onClick={() => { setShowRejectForm(false); setShowEscalateForm(!showEscalateForm); }}
              style={{ background: "rgba(245,158,11,0.15)", border: "1px solid #f59e0b", color: "#f59e0b", fontWeight: "600" }}
            >
              + Log Escalation
            </button>
          </div>
        </div>

        {/* Rejection Form */}
        {showRejectForm && (
          <div className="card liquid-glass" style={{ padding: "24px", borderRadius: "16px", border: "1px solid var(--error)" }}>
            <h3 style={{ marginTop: 0, color: "var(--error)" }}>Log a Rejection</h3>
            <form onSubmit={handleReject} style={{ display: "grid", gap: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label className="muted" style={{ display: "block", fontSize: "0.85rem", marginBottom: "6px" }}>Reviewer</label>
                  <input
                    type="text"
                    value={rejectReviewer}
                    onChange={(e) => setRejectReviewer(e.target.value)}
                    placeholder="reviewer@company.com"
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", background: "var(--surface-strong)", border: "1px solid var(--border)", color: "var(--text)" }}
                  />
                </div>
                <div>
                  <label className="muted" style={{ display: "block", fontSize: "0.85rem", marginBottom: "6px" }}>Rejection Reason</label>
                  <input
                    type="text"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Policy violation: exceeds authority level"
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", background: "var(--surface-strong)", border: "1px solid var(--border)", color: "var(--text)" }}
                  />
                </div>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <button className="btn" type="submit" disabled={submitting} style={{ background: "var(--error)", color: "#fff", fontWeight: "bold" }}>
                  {submitting ? "Submitting..." : "Submit Rejection"}
                </button>
                <button type="button" className="btn" onClick={() => setShowRejectForm(false)} style={{ background: "var(--surface)" }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Escalation Form */}
        {showEscalateForm && (
          <div className="card liquid-glass" style={{ padding: "24px", borderRadius: "16px", border: "1px solid #f59e0b" }}>
            <h3 style={{ marginTop: 0, color: "#f59e0b" }}>Log an Escalation</h3>
            <form onSubmit={handleEscalate} style={{ display: "grid", gap: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                <div>
                  <label className="muted" style={{ display: "block", fontSize: "0.85rem", marginBottom: "6px" }}>Current Reviewer</label>
                  <input type="text" value={escalateCurrentReviewer} onChange={(e) => setEscalateCurrentReviewer(e.target.value)} placeholder="reviewer@company.com"
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", background: "var(--surface-strong)", border: "1px solid var(--border)", color: "var(--text)" }} />
                </div>
                <div>
                  <label className="muted" style={{ display: "block", fontSize: "0.85rem", marginBottom: "6px" }}>Escalation Target</label>
                  <input type="text" value={escalateTarget} onChange={(e) => setEscalateTarget(e.target.value)} placeholder="ciso@company.com"
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", background: "var(--surface-strong)", border: "1px solid var(--border)", color: "var(--text)" }} />
                </div>
                <div>
                  <label className="muted" style={{ display: "block", fontSize: "0.85rem", marginBottom: "6px" }}>Escalation Reason</label>
                  <input type="text" value={escalateReason} onChange={(e) => setEscalateReason(e.target.value)} placeholder="Requires CISO review"
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", background: "var(--surface-strong)", border: "1px solid var(--border)", color: "var(--text)" }} />
                </div>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <button className="btn" type="submit" disabled={submitting} style={{ background: "#f59e0b", color: "#000", fontWeight: "bold" }}>
                  {submitting ? "Submitting..." : "Submit Escalation"}
                </button>
                <button type="button" className="btn" onClick={() => setShowEscalateForm(false)} style={{ background: "var(--surface)" }}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Audit Trail Table */}
        <div className="card liquid-glass" style={{ padding: "24px", borderRadius: "16px" }}>
          <h3 style={{ marginTop: 0, marginBottom: "20px" }}>Chronological Audit Trail</h3>
          {loading ? (
            <div className="spinner" style={{ margin: "40px auto" }} />
          ) : entries.length === 0 ? (
            <div className="empty-state" style={{ padding: "40px 0" }}>No HITL audit events recorded yet.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {entries.map((entry, idx) => (
                <div key={entry.id} style={{ display: "flex", gap: "16px", padding: "16px 0", borderBottom: idx < entries.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                  {/* Icon */}
                  <div style={{
                    width: "36px", height: "36px", borderRadius: "50%", flexShrink: 0,
                    background: `${ACTION_COLORS[entry.action] || "var(--primary)"}22`,
                    border: `1px solid ${ACTION_COLORS[entry.action] || "var(--primary)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: "bold", fontSize: "1.1rem",
                    color: ACTION_COLORS[entry.action] || "var(--primary)"
                  }}>
                    {ACTION_ICONS[entry.action] || "•"}
                  </div>
                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <div>
                        <span style={{ fontWeight: "600", textTransform: "capitalize", color: ACTION_COLORS[entry.action] || "var(--text)" }}>{entry.action}</span>
                        <span className="muted" style={{ marginLeft: "8px", fontSize: "0.9rem" }}>by {entry.reviewer}</span>
                        {entry.target_reviewer && (
                          <span className="muted" style={{ fontSize: "0.9rem" }}> → {entry.target_reviewer}</span>
                        )}
                      </div>
                      <span className="muted" style={{ fontSize: "0.85rem" }}>{new Date(entry.timestamp).toLocaleString()}</span>
                    </div>
                    {entry.reason && (
                      <div style={{ fontSize: "0.9rem", color: "var(--text)", background: "var(--surface)", padding: "8px 12px", borderRadius: "6px", marginTop: "4px" }}>
                        {entry.reason}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
