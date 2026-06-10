"use client";

import { useState } from "react";
import Link from "next/link";
import { blocklogRequest } from "@/lib/blocklog";

type DiffEntry = {
  type: string;
  field: string;
  baseline_value: unknown;
  candidate_value: unknown;
  description: string;
};

type ComparisonResult = {
  id: string;
  company_id: string;
  baseline_session_id: string;
  candidate_session_id: string;
  differences: DiffEntry[];
  created_at: string;
};

const DIFF_TYPE_COLORS: Record<string, string> = {
  summary_counter: "#f59e0b",
  decision_outcome: "var(--error)",
  tool_selection: "var(--primary)",
  context_divergence: "#8b5cf6",
};

export default function ForensicsComparePage() {
  const [baselineId, setBaselineId] = useState("");
  const [candidateId, setCandidateId] = useState("");
  const [savedId, setSavedId] = useState("");
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"run" | "load">("run");

  async function handleCompare(e: React.FormEvent) {
    e.preventDefault();
    if (!baselineId || !candidateId) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await blocklogRequest<ComparisonResult>("/forensics/compare", "POST", {
        baseline_session_id: baselineId,
        candidate_session_id: candidateId,
      });
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Comparison failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleLoad(e: React.FormEvent) {
    e.preventDefault();
    if (!savedId) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await blocklogRequest<ComparisonResult>(`/forensics/compare/${savedId}`);
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load comparison");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {error && <p className="error-banner">{error}</p>}

      <div className="section" style={{ display: "grid", gap: "24px" }}>

        {/* Mode Tabs */}
        <div className="card liquid-glass" style={{ padding: "24px", borderRadius: "16px" }}>
          <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
            <button
              onClick={() => setActiveTab("run")}
              className="btn btn-sm"
              style={{
                background: activeTab === "run" ? "var(--primary)" : "var(--surface-strong)",
                color: activeTab === "run" ? "var(--bg)" : "var(--text)",
                fontWeight: "600",
              }}
            >
              Run New Comparison
            </button>
            <button
              onClick={() => setActiveTab("load")}
              className="btn btn-sm"
              style={{
                background: activeTab === "load" ? "var(--primary)" : "var(--surface-strong)",
                color: activeTab === "load" ? "var(--bg)" : "var(--text)",
                fontWeight: "600",
              }}
            >
              Load Saved Comparison
            </button>
          </div>

          {activeTab === "run" ? (
            <form onSubmit={handleCompare} style={{ display: "grid", gap: "16px" }}>
              <p className="muted" style={{ margin: 0, fontSize: "0.9rem" }}>
                Enter the IDs of two replay sessions to compare side-by-side. The comparison will be saved and shareable via its ID.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label className="muted" style={{ display: "block", fontSize: "0.85rem", marginBottom: "6px", textTransform: "uppercase" }}>
                    Baseline Session ID (Success)
                  </label>
                  <input
                    type="text"
                    value={baselineId}
                    onChange={(e) => setBaselineId(e.target.value)}
                    placeholder="UUID of the successful replay session"
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", background: "var(--surface-strong)", border: "1px solid var(--border)", color: "var(--text)", fontFamily: "monospace" }}
                  />
                </div>
                <div>
                  <label className="muted" style={{ display: "block", fontSize: "0.85rem", marginBottom: "6px", textTransform: "uppercase" }}>
                    Candidate Session ID (Failure)
                  </label>
                  <input
                    type="text"
                    value={candidateId}
                    onChange={(e) => setCandidateId(e.target.value)}
                    placeholder="UUID of the failed replay session"
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", background: "var(--surface-strong)", border: "1px solid var(--border)", color: "var(--text)", fontFamily: "monospace" }}
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn"
                  style={{ background: "var(--primary)", color: "var(--bg)", fontWeight: "bold", padding: "0 32px", height: "44px" }}
                >
                  {loading ? "Running Comparison..." : "Compare Sessions"}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleLoad} style={{ display: "grid", gap: "16px" }}>
              <p className="muted" style={{ margin: 0, fontSize: "0.9rem" }}>
                Load a previously saved comparison by its ID. Share this ID with teammates to collaborate on the same investigation.
              </p>
              <div style={{ display: "flex", gap: "16px", alignItems: "flex-end" }}>
                <div style={{ flex: 1 }}>
                  <label className="muted" style={{ display: "block", fontSize: "0.85rem", marginBottom: "6px", textTransform: "uppercase" }}>
                    Comparison ID
                  </label>
                  <input
                    type="text"
                    value={savedId}
                    onChange={(e) => setSavedId(e.target.value)}
                    placeholder="UUID of the saved comparison"
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", background: "var(--surface-strong)", border: "1px solid var(--border)", color: "var(--text)", fontFamily: "monospace" }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn"
                  style={{ background: "var(--accent)", color: "var(--bg)", fontWeight: "bold", padding: "0 32px", height: "42px" }}
                >
                  {loading ? "Loading..." : "Load"}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Results */}
        {result && (
          <>
            {/* Summary Bar */}
            <div className="card liquid-glass" style={{ padding: "24px", borderRadius: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
                <div>
                  <h3 style={{ margin: "0 0 8px 0", color: "var(--primary)" }}>Comparison Result</h3>
                  <div className="muted" style={{ fontSize: "0.85rem", fontFamily: "monospace" }}>ID: {result.id}</div>
                  <div className="muted" style={{ fontSize: "0.85rem" }}>Generated: {new Date(result.created_at).toLocaleString()}</div>
                </div>
                <div style={{ display: "flex", gap: "24px", textAlign: "center" }}>
                  <div>
                    <div style={{ fontSize: "2rem", fontWeight: "bold", color: result.differences.length > 0 ? "var(--error)" : "var(--success)" }}>
                      {result.differences.length}
                    </div>
                    <div className="muted" style={{ fontSize: "0.85rem" }}>Divergences Found</div>
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "20px" }}>
                <div style={{ padding: "16px", background: "rgba(0,255,100,0.05)", borderRadius: "8px", border: "1px solid var(--success)" }}>
                  <div className="muted" style={{ fontSize: "0.8rem", marginBottom: "8px", textTransform: "uppercase" }}>Baseline (Success)</div>
                  <div style={{ fontFamily: "monospace", wordBreak: "break-all", fontSize: "0.9rem" }}>{result.baseline_session_id}</div>
                </div>
                <div style={{ padding: "16px", background: "rgba(255,0,0,0.05)", borderRadius: "8px", border: "1px solid var(--error)" }}>
                  <div className="muted" style={{ fontSize: "0.8rem", marginBottom: "8px", textTransform: "uppercase" }}>Candidate (Failure)</div>
                  <div style={{ fontFamily: "monospace", wordBreak: "break-all", fontSize: "0.9rem" }}>{result.candidate_session_id}</div>
                </div>
              </div>
            </div>

            {/* Differences List */}
            <div className="card liquid-glass" style={{ padding: "24px", borderRadius: "16px" }}>
              <h3 style={{ marginTop: 0, marginBottom: "20px" }}>
                {result.differences.length === 0 ? "✓ No Divergences Detected" : `Divergence Analysis (${result.differences.length} found)`}
              </h3>

              {result.differences.length === 0 ? (
                <div style={{ padding: "40px", textAlign: "center", color: "var(--success)" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "12px" }}>✓</div>
                  <p style={{ margin: 0 }}>The two sessions are functionally identical. No divergences detected.</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {result.differences.map((diff, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: "20px",
                        background: "var(--surface)",
                        borderRadius: "12px",
                        borderLeft: `4px solid ${DIFF_TYPE_COLORS[diff.type] || "var(--primary)"}`,
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                        <div>
                          <span style={{
                            fontSize: "0.75rem",
                            textTransform: "uppercase",
                            padding: "2px 8px",
                            borderRadius: "4px",
                            background: `${DIFF_TYPE_COLORS[diff.type] || "var(--primary)"}22`,
                            color: DIFF_TYPE_COLORS[diff.type] || "var(--primary)",
                            marginRight: "10px",
                          }}>
                            {diff.type}
                          </span>
                          <strong>Field: <code style={{ fontFamily: "monospace" }}>{diff.field}</code></strong>
                        </div>
                      </div>
                      <p style={{ margin: "0 0 16px 0", color: "var(--text)", fontSize: "0.9rem" }}>{diff.description}</p>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <div style={{ padding: "12px", background: "rgba(0,255,100,0.05)", borderRadius: "8px", border: "1px solid rgba(0,255,100,0.2)" }}>
                          <div className="muted" style={{ fontSize: "0.8rem", marginBottom: "6px" }}>BASELINE VALUE</div>
                          <code style={{ fontFamily: "monospace", color: "var(--success)" }}>
                            {JSON.stringify(diff.baseline_value)}
                          </code>
                        </div>
                        <div style={{ padding: "12px", background: "rgba(255,0,0,0.05)", borderRadius: "8px", border: "1px solid rgba(255,0,0,0.2)" }}>
                          <div className="muted" style={{ fontSize: "0.8rem", marginBottom: "6px" }}>CANDIDATE VALUE</div>
                          <code style={{ fontFamily: "monospace", color: "var(--error)" }}>
                            {JSON.stringify(diff.candidate_value)}
                          </code>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Share/Save info */}
            <div className="card liquid-glass" style={{ padding: "20px", borderRadius: "16px", display: "flex", gap: "16px", alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <strong>Share this investigation</strong>
                <div className="muted" style={{ fontSize: "0.85rem" }}>Load this comparison at any time using ID:</div>
                <code style={{ fontFamily: "monospace", fontSize: "0.9rem", color: "var(--primary)" }}>{result.id}</code>
              </div>
              <button
                className="btn btn-sm"
                onClick={() => navigator.clipboard.writeText(result.id)}
                style={{ background: "var(--surface-strong)", border: "1px solid var(--border)" }}
              >
                Copy ID
              </button>
              <Link href="/dashboard/forensics">
                <button className="btn btn-sm" style={{ background: "var(--surface-strong)", border: "1px solid var(--border)" }}>
                  ← Back to Forensics
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
