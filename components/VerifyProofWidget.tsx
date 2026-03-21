"use client";

import { FormEvent, useState } from "react";
import { blocklogRequest, normalizePayload } from "@/lib/blocklog";

type VerifyWidgetResult = {
  exists?: boolean;
  hash_valid?: boolean;
  timestamp_anchored?: boolean;
  integrity?: string;
  verified_at?: string;
  anchor_tx?: string;
  merkle_proof_valid?: boolean;
};

type VerifyLookupType = "proof_id" | "log_id" | "batch_id";

const defaultResult: VerifyWidgetResult = {
  exists: true,
  hash_valid: true,
  timestamp_anchored: true,
  integrity: "VALID",
  verified_at: undefined,
  anchor_tx: "0xanchor",
  merkle_proof_valid: true,
};

export default function VerifyProofWidget() {
  const [lookupType, setLookupType] = useState<VerifyLookupType>("proof_id");
  const [lookupValue, setLookupValue] = useState("proof_demo_1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VerifyWidgetResult | null>(defaultResult);

  const exampleValue =
    lookupType === "proof_id"
      ? "proof_demo_1"
      : lookupType === "log_id"
        ? "log_10021"
        : "batch_demo_1";

  const fieldLabel =
    lookupType === "proof_id"
      ? "Paste your proof ID returned after anchoring"
      : lookupType === "log_id"
        ? "Paste your log ID from the audit trail"
        : "Paste your batch ID from the sealing pipeline";

  function getLookupPath() {
    const value = encodeURIComponent(lookupValue.trim());
    if (lookupType === "log_id") return `/verify/log/${value}`;
    if (lookupType === "batch_id") return `/verify/batch/${value}`;
    return `/public/verify/${value}`;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!lookupValue.trim()) {
        throw new Error(
          lookupType === "proof_id"
            ? "Enter the proof ID returned after anchoring."
            : lookupType === "log_id"
              ? "Enter a real log ID from the audit trail."
              : "Enter a real batch ID from the batch pipeline.",
        );
      }

      let response: VerifyWidgetResult | { data?: VerifyWidgetResult };

      if (lookupType === "log_id") {
        try {
          response = await blocklogRequest<VerifyWidgetResult | { data?: VerifyWidgetResult }>(getLookupPath());
        } catch {
          response = await blocklogRequest<VerifyWidgetResult | { data?: VerifyWidgetResult }>(
            `/logs/${encodeURIComponent(lookupValue.trim())}/verify`,
          );
        }
      } else {
        response = await blocklogRequest<VerifyWidgetResult | { data?: VerifyWidgetResult }>(getLookupPath());
      }

      setResult(normalizePayload<VerifyWidgetResult>(response, defaultResult, "data"));
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Verification failed");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card glass-card verify-widget">
      <div className="verify-widget-header">
        <div>
          <p className="eyebrow">Verify a real proof</p>
          <h2 style={{ marginTop: 8, marginBottom: 10 }}>See Blocklog prove integrity in real time.</h2>
          <p className="muted" style={{ margin: 0 }}>
            Verify by proof ID, log ID, or batch ID to check integrity without screenshots or
            trust leaps.
          </p>
        </div>
        <div className="status-pill status-valid">Live verification</div>
      </div>

      <div className="verify-console-banner">
        <span className="verify-console-label">Expected input</span>
        <code>{exampleValue}</code>
        <span className="muted">
          {lookupType === "proof_id"
            ? "Use the real `proof_id` returned by your backend after sealing and anchoring."
            : lookupType === "log_id"
              ? "Use a real `log_id` from your audit trail."
              : "Use a real `batch_id` from the sealing and anchoring workflow."}
        </span>
      </div>

      <form className="verify-widget-form" onSubmit={onSubmit}>
        <div>
          <label>Lookup type</label>
          <select value={lookupType} onChange={(event) => setLookupType(event.target.value as VerifyLookupType)}>
            <option value="proof_id">Proof ID</option>
            <option value="log_id">Log ID</option>
            <option value="batch_id">Batch ID</option>
          </select>
        </div>
        <div>
          <label>{fieldLabel}</label>
          <input
            placeholder={exampleValue}
            value={lookupValue}
            onChange={(event) => setLookupValue(event.target.value)}
          />
        </div>
        <button className="btn btn-primary" disabled={loading} type="submit">
          {loading ? "Verifying..." : "Verify Now"}
        </button>
      </form>

      {error && <p className="error-banner" style={{ marginTop: 16 }}>{error}</p>}

      {result && (
        <div className="verify-widget-results">
          <article className="orbital-card verify-widget-card">
            <strong>{result.integrity === "VALID" ? "Verified" : result.integrity === "NOT_FOUND" ? "Proof not found" : "Needs review"}</strong>
            <p className="muted" style={{ marginBottom: 0 }}>
              {result.exists ? "Proof found and checked." : "No proof matched that identifier."}
            </p>
          </article>
          <article className="orbital-card verify-widget-card">
            <strong>Timestamp</strong>
            <p className="muted" style={{ marginBottom: 0 }}>
              {result.verified_at ? new Date(result.verified_at).toISOString() : "Unavailable"}
            </p>
          </article>
          <article className="orbital-card verify-widget-card">
            <strong>Anchor (tx hash)</strong>
            <p className="muted" style={{ marginBottom: 0 }}>{result.anchor_tx ?? "Unavailable"}</p>
          </article>
          <article className="orbital-card verify-widget-card">
            <strong>Merkle proof valid</strong>
            <p className="muted" style={{ marginBottom: 0 }}>
              {result.merkle_proof_valid ?? result.hash_valid ? "Yes" : "No"}
            </p>
          </article>
        </div>
      )}
    </section>
  );
}
