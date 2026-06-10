"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import DashboardTopBar from "@/components/DashboardTopBar";
import { blocklogRequest } from "@/lib/blocklog";

type TimelineItem = {
  at: string;
  item_type: string;
  reference_id: string;
  summary: string;
  payload: any;
  stale: boolean;
  severity: string;
  tags: string[];
};

type Node = {
  id: string;
  type: string;
  label: string;
  timestamp: string;
  severity: string;
  tags: string[];
  payload: any;
};

type Edge = {
  from_id: string;
  to_id: string;
  edge_type: string;
};

type CausalGraph = {
  nodes: Node[];
  edges: Edge[];
};

type RootCause = {
  detected: boolean;
  root_cause_type: string;
  description: string;
  confidence: number;
  remediation: string;
};

type StalenessFinding = {
  source: string;
  path: string;
  observed_at: string;
  age_seconds: number;
  threshold_seconds: number | null;
  stale: boolean;
  reason: string | null;
  risk_score: number;
};

type StalenessData = {
  overall_staleness_rating: string;
  findings: StalenessFinding[];
};

export default function ReplayDetailPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };

  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [causalGraph, setCausalGraph] = useState<CausalGraph | null>(null);
  const [rootCause, setRootCause] = useState<RootCause | null>(null);
  const [staleness, setStaleness] = useState<StalenessData | null>(null);
  
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Counterfactual sandbox state
  const [tokenInput, setTokenInput] = useState<string>("");
  const [policyInput, setPolicyInput] = useState<string>("");
  const [simulationResult, setSimulationResult] = useState<any | null>(null);
  const [simulating, setSimulating] = useState(false);
  const [tokenId, setTokenId] = useState<string>("");

  useEffect(() => {
    if (!id) return;

    async function loadAll() {
      setLoading(true);
      setError(null);
      try {
        // Fetch timeline, causal graph, root cause, staleness
        const timelineRes = await blocklogRequest<TimelineItem[]>(`/forensics/replays/${id}/timeline`);
        const graphRes = await blocklogRequest<CausalGraph>(`/forensics/replays/${id}/causal-graph`);
        const rootCauseRes = await blocklogRequest<RootCause>(`/forensics/replays/${id}/root-cause`);
        const stalenessRes = await blocklogRequest<StalenessData>(`/forensics/replays/${id}/staleness`);

        setTimeline(timelineRes);
        setCausalGraph(graphRes);
        setRootCause(rootCauseRes);
        setStaleness(stalenessRes);

        // Prepopulate selected item with first item
        if (timelineRes.length > 0) {
          setSelectedItem(timelineRes[0]);
        }

        // Try to prepopulate counterfactual inputs from replay session tokens
        const replaySession = await blocklogRequest<any>(`/forensics/replays/${id}`);
        if (replaySession.token_id) {
          setTokenId(replaySession.token_id);
          // Find token item in timeline
          const tokenItem = timelineRes.find(item => item.reference_id === replaySession.token_id);
          if (tokenItem) {
            setTokenInput(JSON.stringify(tokenItem.payload.request_payload || {}, null, 2));
          } else {
            setTokenInput(JSON.stringify(replaySession.request_payload || {}, null, 2));
          }
          setPolicyInput(JSON.stringify(replaySession.analysis.divergences?.[0]?.policy_snapshot || { rule_set: { max_context_age_seconds: 60 } }, null, 2));
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load replay details");
      } finally {
        setLoading(false);
      }
    }

    void loadAll();
  }, [id]);

  async function handleSimulate() {
    if (!tokenId) {
      alert("No token ID linked to this replay session to execute counterfactual simulation.");
      return;
    }
    setSimulating(true);
    setSimulationResult(null);
    try {
      let parsedPayload = {};
      try {
        parsedPayload = JSON.parse(tokenInput);
      } catch {
        alert("Malformed JSON in Token Request Payload.");
        setSimulating(false);
        return;
      }

      const res = await blocklogRequest<any>(`/forensics/replays/${id}/counterfactuals`, "POST", {
        token_id: tokenId,
        request_payload: parsedPayload,
        policy_override: policyInput ? JSON.parse(policyInput) : undefined
      });
      setSimulationResult(res);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Simulation failed");
    } finally {
      setSimulating(false);
    }
  }

  if (loading) {
    return (
      <>
        <DashboardTopBar title="AI Forensic Investigation" />
        <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
          <div className="spinner" />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <DashboardTopBar title="AI Forensic Investigation" />
        <div className="section">
          <div className="card liquid-glass" style={{ padding: "24px", border: "1px solid var(--danger)" }}>
            <h3 style={{ color: "var(--danger)", margin: 0 }}>Load Error</h3>
            <p>{error}</p>
            <button className="btn" onClick={() => router.push("/dashboard/forensics")}>Back to Dashboard</button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardTopBar title={`Run Replay: ${id.slice(0, 8)}...`} />

      <div className="section" style={{ display: "grid", gap: "24px" }}>
        
        {/* Navigation & Root Cause Header */}
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
          <button 
            className="btn btn-sm" 
            onClick={() => router.push("/dashboard/forensics")}
            style={{ border: "1px solid var(--border)", background: "transparent" }}
          >
            &larr; Back to Forensics
          </button>

          {/* Quick link to create incident from this replay */}
          <button
            className="btn btn-sm"
            onClick={() => {
              async function createInc() {
                try {
                  const res = await blocklogRequest<any>("/incidents", "POST", {
                    title: `Incident: AI anomaly on replay ${id.slice(0,8)}`,
                    severity: rootCause?.detected ? "high" : "medium",
                    status: "open",
                    linked_replay_id: id,
                    description: rootCause?.description || "Investigating AI decision anomaly detected in telemetry logs.",
                    root_cause: rootCause,
                  });
                  router.push(`/dashboard/incidents/${res.id}`);
                } catch (err) {
                  alert(err instanceof Error ? err.message : "Failed to create incident");
                }
              }
              void createInc();
            }}
            style={{ background: "var(--primary)", color: "var(--bg)", fontWeight: "600" }}
          >
            File Incident Report
          </button>
        </div>

        {/* RCA Card */}
        {rootCause && (
          <div className="card liquid-glass-strong" style={{ padding: "24px", borderRadius: "16px", borderLeft: rootCause.detected ? "6px solid var(--danger)" : "6px solid var(--success)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "16px" }}>
              <div>
                <span className="eyebrow" style={{ color: rootCause.detected ? "var(--danger)" : "var(--success)" }}>
                  Root Cause Diagnostics {rootCause.detected ? "[ANOMALY DETECTED]" : "[NORMAL]"}
                </span>
                <h2 style={{ margin: "8px 0 12px" }}>{rootCause.detected ? rootCause.root_cause_type : "No Anomaly Detected"}</h2>
                <p style={{ margin: "0 0 12px", fontSize: "1.05rem", lineHeight: "1.5" }}>{rootCause.description}</p>
                <div style={{ display: "flex", gap: "24px", marginTop: "16px" }}>
                  <div>
                    <span className="muted" style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase" }}>Confidence Rating</span>
                    <strong style={{ fontSize: "1.1rem" }}>{Math.round(rootCause.confidence * 100)}%</strong>
                  </div>
                  <div>
                    <span className="muted" style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase" }}>Remediation Strategy</span>
                    <span style={{ color: "var(--primary-strong)" }}>{rootCause.remediation}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Timeline & Detail Scrubber */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
          
          {/* Chronological Event Scrubber */}
          <div className="card liquid-glass" style={{ padding: "24px", borderRadius: "16px" }}>
            <h3 style={{ marginTop: 0, marginBottom: "16px", color: "var(--primary)" }}>Chronological Trace Scrubber</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {timeline.map((item, index) => {
                const isSelected = selectedItem?.reference_id === item.reference_id;
                let borderCol = "var(--border)";
                if (item.severity === "high") borderCol = "var(--danger)";
                else if (item.severity === "medium") borderCol = "var(--warning)";

                return (
                  <div 
                    key={index}
                    onClick={() => setSelectedItem(item)}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 16px",
                      background: isSelected ? "var(--surface-strong)" : "rgba(255,255,255,0.02)",
                      border: isSelected ? "1px solid var(--primary)" : `1px solid ${borderCol}`,
                      borderRadius: "10px",
                      cursor: "pointer",
                      transition: "all var(--motion-fast)"
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <span style={{ fontSize: "0.85rem", fontWeight: "600", textTransform: "uppercase", color: "var(--muted)" }}>{item.item_type}</span>
                        {item.stale && <span className="status-pill status-invalid" style={{ padding: "2px 6px", fontSize: "0.7rem" }}>STALE</span>}
                      </div>
                      <div style={{ margin: "4px 0 0", fontWeight: "bold" }}>{item.summary}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div className="muted" style={{ fontSize: "0.75rem" }}>{new Date(item.at).toLocaleTimeString()}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Event Context Inspector */}
          <div className="card liquid-glass" style={{ padding: "24px", borderRadius: "16px" }}>
            <h3 style={{ marginTop: 0, marginBottom: "16px", color: "var(--primary)" }}>Event Context Inspector</h3>
            {selectedItem ? (
              <div style={{ display: "grid", gap: "16px" }}>
                <div>
                  <span className="muted" style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase" }}>Event ID</span>
                  <code style={{ fontSize: "0.9rem" }}>{selectedItem.reference_id}</code>
                </div>
                <div>
                  <span className="muted" style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase" }}>Timestamp</span>
                  <span>{new Date(selectedItem.at).toLocaleString()}</span>
                </div>
                <div>
                  <span className="muted" style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase" }}>Severity / Tags</span>
                  <div style={{ display: "flex", gap: "6px", marginTop: "4px" }}>
                    <span className={`status-pill status-${selectedItem.severity}`} style={{ fontSize: "0.75rem" }}>{selectedItem.severity}</span>
                    {selectedItem.tags.map((tag: string) => (
                      <span key={tag} className="status-pill" style={{ background: "rgba(255,255,255,0.08)", fontSize: "0.75rem" }}>{tag}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="muted" style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", marginBottom: "4px" }}>Payload Content</span>
                  <pre style={{ margin: 0, padding: "12px", background: "rgba(0,0,0,0.3)", borderRadius: "8px", fontSize: "0.8rem", overflowX: "auto", maxHeight: "300px" }}>
                    {JSON.stringify(selectedItem.payload, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <p className="muted">Select an event in the timeline to inspect its context payload.</p>
            )}
          </div>
        </div>

        {/* Causal Graph Visualizer */}
        <div className="card liquid-glass" style={{ padding: "24px", borderRadius: "16px" }}>
          <h3 style={{ marginTop: 0, marginBottom: "16px", color: "var(--primary)" }}>Causal DAG dependency Visualizer</h3>
          <p className="muted" style={{ marginBottom: "20px", fontSize: "0.85rem" }}>
            Visual model of upstream parameters influencing downstream decisions. Nodes highlight execution status, trace inputs, and cryptographic evidence seals.
          </p>
          
          <div style={{ background: "rgba(0,0,0,0.25)", border: "1px solid var(--border)", borderRadius: "12px", padding: "24px", display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center", alignItems: "center", minHeight: "200px" }}>
            {causalGraph && causalGraph.nodes.map((node, index) => {
              let color = "var(--border)";
              if (node.severity === "high") color = "var(--danger)";
              else if (node.severity === "medium") color = "var(--warning)";

              return (
                <div key={node.id} style={{ display: "flex", alignItems: "center" }}>
                  <div 
                    onClick={() => {
                      const timelineItem = timeline.find(item => item.reference_id === node.id);
                      if (timelineItem) setSelectedItem(timelineItem);
                    }}
                    style={{
                      background: "var(--bg-elevated)",
                      border: `2px solid ${color}`,
                      borderRadius: "12px",
                      padding: "14px",
                      minWidth: "180px",
                      cursor: "pointer",
                      boxShadow: "var(--shadow-sm)",
                      textAlign: "center"
                    }}
                  >
                    <div style={{ fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase" }}>{node.type}</div>
                    <div style={{ fontWeight: "bold", fontSize: "0.9rem", margin: "4px 0" }}>{node.label}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-dim)" }}>{node.id.slice(0, 8)}</div>
                  </div>
                  {index < causalGraph.nodes.length - 1 && (
                    <div style={{ display: "flex", alignItems: "center", color: "var(--muted)", padding: "0 10px" }}>
                      <span style={{ fontSize: "1.5rem" }}>&rarr;</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Freshness Heatmap */}
        {staleness && staleness.findings.length > 0 && (
          <div className="card liquid-glass" style={{ padding: "24px", borderRadius: "16px" }}>
            <h3 style={{ marginTop: 0, marginBottom: "16px", color: "var(--primary)" }}>Data source Staleness Heatmap</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
              {staleness.findings.map((finding, idx) => {
                let heatColor = "rgba(62, 213, 152, 0.08)"; // green
                let textCol = "var(--success)";
                if (finding.stale) {
                  heatColor = "rgba(255, 108, 127, 0.12)"; // red
                  textCol = "var(--danger)";
                } else if (finding.risk_score > 30) {
                  heatColor = "rgba(255, 191, 71, 0.1)"; // orange/yellow
                  textCol = "var(--warning)";
                }

                return (
                  <div 
                    key={idx}
                    style={{
                      background: heatColor,
                      border: `1px solid ${textCol}`,
                      borderRadius: "12px",
                      padding: "16px"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <strong>{finding.path}</strong>
                      <span className="status-pill" style={{ background: textCol, color: "var(--bg)", fontSize: "0.75rem", fontWeight: "bold" }}>
                        Risk: {finding.risk_score}%
                      </span>
                    </div>
                    <div style={{ marginTop: "12px", fontSize: "0.85rem" }}>
                      <div><span className="muted">Source:</span> {finding.source}</div>
                      <div><span className="muted">Data Age:</span> {finding.age_seconds}s</div>
                      <div><span className="muted">Max Threshold:</span> {finding.threshold_seconds ? `${finding.threshold_seconds}s` : "N/A"}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Counterfactual sandbox */}
        {tokenId && (
          <div className="card liquid-glass-strong" style={{ padding: "24px", borderRadius: "16px" }}>
            <h3 style={{ marginTop: 0, marginBottom: "8px", color: "var(--primary)" }}>Counterfactual Simulation sandbox</h3>
            <p className="muted" style={{ marginBottom: "20px", fontSize: "0.85rem" }}>
              What would have happened if inputs were different? Tweak the token request context parameters below and execute a sandbox validation run.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
              <div>
                <label className="muted" style={{ display: "block", marginBottom: "6px", fontSize: "0.8rem", textTransform: "uppercase" }}>Token Request payload (Inputs)</label>
                <textarea
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  style={{
                    width: "100%",
                    height: "180px",
                    padding: "10px",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.8rem",
                    background: "rgba(0,0,0,0.3)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "var(--text)"
                  }}
                />
              </div>
              <div>
                <label className="muted" style={{ display: "block", marginBottom: "6px", fontSize: "0.8rem", textTransform: "uppercase" }}>Policy Snapshot / Overrides</label>
                <textarea
                  value={policyInput}
                  onChange={(e) => setPolicyInput(e.target.value)}
                  style={{
                    width: "100%",
                    height: "180px",
                    padding: "10px",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.8rem",
                    background: "rgba(0,0,0,0.3)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "var(--text)"
                  }}
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button 
                className="btn"
                onClick={handleSimulate}
                disabled={simulating}
                style={{ background: "var(--primary)", color: "var(--bg)", fontWeight: "600" }}
              >
                {simulating ? "Executing Sandbox simulation..." : "Run Simulation"}
              </button>
            </div>

            {simulationResult && (
              <div className="card" style={{ marginTop: "20px", padding: "20px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", borderRadius: "12px" }}>
                <h4 style={{ margin: "0 0 12px" }}>Simulation Result</h4>
                <div style={{ display: "flex", gap: "20px", marginBottom: "16px" }}>
                  <div>
                    <span className="muted" style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase" }}>Outcome Status</span>
                    <strong style={{ fontSize: "1.1rem", color: simulationResult.decision === "APPROVED" ? "var(--success)" : "var(--danger)" }}>
                      {simulationResult.decision}
                    </strong>
                  </div>
                  {simulationResult.denial_reasons?.length > 0 && (
                    <div>
                      <span className="muted" style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase" }}>Denial Reasons</span>
                      <span style={{ color: "var(--danger)" }}>{simulationResult.denial_reasons.join(", ")}</span>
                    </div>
                  )}
                </div>
                <div>
                  <span className="muted" style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", marginBottom: "6px" }}>Response Payload</span>
                  <pre style={{ margin: 0, padding: "10px", background: "rgba(0,0,0,0.2)", borderRadius: "6px", fontSize: "0.8rem", overflowX: "auto" }}>
                    {JSON.stringify(simulationResult, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
