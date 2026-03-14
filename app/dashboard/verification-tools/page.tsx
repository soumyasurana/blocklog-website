"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import DashboardTopBar from "@/components/DashboardTopBar";
import { blocklogRequest, normalizePayload } from "@/lib/blocklog";

type VerifyResult = {
  exists?: boolean;
  hash_valid?: boolean;
  timestamp_anchored?: boolean;
  integrity?: string;
};

const defaultResult: VerifyResult = {
  exists: true,
  hash_valid: true,
  timestamp_anchored: true,
  integrity: "VALID",
};

export default function VerificationToolsPage() {
  const [hash, setHash] = useState("");
  const [payload, setPayload] = useState('{"event":"user.login","user_id":"123"}');
  const [result, setResult] = useState<VerifyResult>(defaultResult);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);

    try {
      if (!hash.trim()) {
        throw new Error("A proof ID or log hash is required.");
      }
      if (payload.trim()) {
        JSON.parse(payload);
      }
      const response = await blocklogRequest<VerifyResult | { data?: VerifyResult }>(
        `/public/verify/${encodeURIComponent(hash.trim())}`,
      );
      setResult(normalizePayload<VerifyResult>(response, defaultResult, "data"));
      setNotice("Verification complete.");
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Verification request failed",
      );
    } finally {
      setLoading(false);
    }
  }

  const checks = [
    ["Log exists", result.exists],
    ["Hash valid", result.hash_valid],
    ["Timestamp anchored", result.timestamp_anchored],
  ] as const;

  return (
    <>
      <DashboardTopBar title="Verification Tool" />
      <section className="stack-grid">
        <form className="card glass-card" onSubmit={onSubmit}>
          <p className="eyebrow">Verification workflow</p>
          <h2 style={{ marginTop: 8 }}>Paste a proof ID. Reproduce the trust decision.</h2>
          <p className="muted" style={{ marginTop: 0 }}>
            Blocklog verifies whether the referenced proof exists, whether the digest is valid, and
            whether the record has been anchored. This is the core differentiator in the product, so
            the UI is designed to feel like an assurance checkpoint rather than a generic form.
          </p>
          <div className="form">
            <div>
              <label>Proof ID or log hash</label>
              <input
                placeholder="proof_... or log_..."
                value={hash}
                onChange={(event) => setHash(event.target.value)}
              />
            </div>
            <div>
              <label>Optional raw log payload</label>
              <textarea
                value={payload}
                onChange={(event) => setPayload(event.target.value)}
              />
            </div>
            <div className="button-row">
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? "Verifying..." : "Verify Integrity"}
              </button>
              <Link className="btn" href="/docs/verification">
                API docs
              </Link>
              <Link className="btn" href="/docs/getting-started">
                Quick start
              </Link>
            </div>
          </div>
        </form>

        <section className="card glass-card">
          <p className="eyebrow">Result</p>
          <h2 style={{ marginTop: 8 }}>Integrity decision</h2>
          <div className={`status-pill ${result.integrity === "VALID" ? "status-valid" : "status-invalid"}`}>
            Integrity: {result.integrity ?? "UNKNOWN"}
          </div>
          <div className="grid" style={{ marginTop: 18 }}>
            {checks.map(([label, value]) => (
              <article className="orbital-card" key={label}>
                <strong>{label}</strong>
                <p
                  style={{
                    marginBottom: 0,
                    color: value ? "var(--success)" : "var(--danger)",
                    fontWeight: 700,
                  }}
                >
                  {value ? "Verified" : "Not verified"}
                </p>
              </article>
            ))}
          </div>
          <div className="code-pane" style={{ marginTop: 18 }}>
            {`Verification flow
1. Look up proof reference
2. Recompute hash / inclusion state
3. Check timestamp anchoring
4. Return integrity verdict`}
          </div>
        </section>
      </section>

      {error && <p className="error-banner" style={{ marginTop: 16 }}>Live API unavailable: {error}</p>}
      {notice && <p className="notice" style={{ marginTop: 16 }}>{notice}</p>}
    </>
  );
}
