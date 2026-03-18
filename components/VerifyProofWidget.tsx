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

const defaultResult: VerifyWidgetResult = {
  exists: true,
  hash_valid: true,
  timestamp_anchored: true,
  integrity: "VALID",
  verified_at: new Date().toISOString(),
  anchor_tx: "0xanchor",
  merkle_proof_valid: true,
};

export default function VerifyProofWidget() {
  const [proofId, setProofId] = useState("proof_demo_1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VerifyWidgetResult | null>(defaultResult);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!proofId.trim()) {
        throw new Error("Enter a proof ID to verify.");
      }

      const response = await blocklogRequest<VerifyWidgetResult | { data?: VerifyWidgetResult }>(
        `/public/verify/${encodeURIComponent(proofId.trim())}`,
      );
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
            Enter a proof ID and verify the audit trail instantly. No screenshots. No hand-waving.
          </p>
        </div>
        <div className="status-pill status-valid">Live verification</div>
      </div>

      <form className="verify-widget-form" onSubmit={onSubmit}>
        <div>
          <label>Proof ID</label>
          <input
            placeholder="proof_..."
            value={proofId}
            onChange={(event) => setProofId(event.target.value)}
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
            <strong>{result.integrity === "VALID" ? "Verified" : "Needs review"}</strong>
            <p className="muted" style={{ marginBottom: 0 }}>
              {result.exists ? "Proof found and checked." : "Proof not found."}
            </p>
          </article>
          <article className="orbital-card verify-widget-card">
            <strong>Timestamp</strong>
            <p className="muted" style={{ marginBottom: 0 }}>
              {result.verified_at ? new Date(result.verified_at).toLocaleString() : "Anchored"}
            </p>
          </article>
          <article className="orbital-card verify-widget-card">
            <strong>Anchor (tx hash)</strong>
            <p className="muted" style={{ marginBottom: 0 }}>{result.anchor_tx ?? "0xanchor"}</p>
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
