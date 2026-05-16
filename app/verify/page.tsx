"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { blocklogRequest, normalizePayload } from "@/lib/blocklog";

type VerifyResult = {
  exists?: boolean;
  hash_valid?: boolean;
  timestamp_anchored?: boolean;
  integrity?: string;
  verified_at?: string;
  anchor_tx?: string;
  merkle_proof_valid?: boolean;
  batch_id?: string;
};

type VerifyLookupType = "proof_id" | "log_id" | "batch_id";

export default function VerifyPage() {
  const [lookupType, setLookupType] = useState<VerifyLookupType>("proof_id");
  const [lookupValue, setLookupValue] = useState("");
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const endpointLabel =
    lookupType === "proof_id"
      ? "proof ID returned after anchoring"
      : lookupType === "log_id"
        ? "log ID"
        : "batch ID";

  const endpointPlaceholder =
    lookupType === "proof_id"
      ? "proof_demo_1"
      : lookupType === "log_id"
        ? "log_10021"
        : "batch_demo_1";

  function getLookupPath() {
    const value = encodeURIComponent(lookupValue.trim());
    if (lookupType === "log_id") return `/verify/log/${value}`;
    if (lookupType === "batch_id") return `/verify/batch/${value}`;
    return `/public/verify/${value}`;
  }

  function normalizeVerifyResult(payload: VerifyResult | null | undefined): VerifyResult {
    if (!payload) {
      return {};
    }

    const extendedPayload = payload as VerifyResult & {
      chain_valid?: boolean;
      time_attestation?: { anchored?: boolean; anchored_at?: string };
      anchor_proof?: { anchor_tx?: string; batch_id?: string };
    };
    const exists = payload.exists ?? (payload.integrity ? payload.integrity !== "NOT_FOUND" : undefined);
    const hashValid =
      payload.hash_valid ?? payload.merkle_proof_valid ?? extendedPayload.chain_valid;
    const timestampAnchored =
      payload.timestamp_anchored ??
      extendedPayload.time_attestation?.anchored ??
      (typeof payload.anchor_tx === "string" ? true : undefined);

    return {
      ...payload,
      exists,
      hash_valid: hashValid,
      merkle_proof_valid: payload.merkle_proof_valid ?? hashValid,
      timestamp_anchored: timestampAnchored,
      verified_at: payload.verified_at ?? extendedPayload.time_attestation?.anchored_at,
      anchor_tx: payload.anchor_tx ?? extendedPayload.anchor_proof?.anchor_tx,
      batch_id: payload.batch_id ?? extendedPayload.anchor_proof?.batch_id,
      integrity:
        payload.integrity ??
        (exists === false ? "NOT_FOUND" : hashValid === false ? "INVALID" : "VALID"),
    };
  }

  async function verifyLookup() {
    if (lookupType === "log_id") {
      try {
        return await blocklogRequest<VerifyResult | { data?: VerifyResult }>(getLookupPath());
      } catch {
        return blocklogRequest<VerifyResult | { data?: VerifyResult }>(
          `/logs/${encodeURIComponent(lookupValue.trim())}/verify`,
        );
      }
    }

    return blocklogRequest<VerifyResult | { data?: VerifyResult }>(getLookupPath());
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!lookupValue.trim()) {
        throw new Error(`Enter the ${endpointLabel}.`);
      }
      const response = await verifyLookup();
      setResult(normalizeVerifyResult(normalizePayload<VerifyResult>(response, {}, "data")));
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Verification failed",
      );
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="container section">
        <h1 style={{ marginTop: 0 }}>Public Verifier</h1>
        <p className="muted">Verify by proof ID, log ID, or batch ID using the public verification surface.</p>
        <section className="card glass-card verify-widget">
          <div className="verify-console-banner">
            <span className="verify-console-label">Expected input</span>
            <code>{lookupType === "proof_id" ? "proof_demo_1" : lookupType === "log_id" ? "log_10021" : "batch_demo_1"}</code>
            <span className="muted">
              Use a real {lookupType === "proof_id" ? "`proof_id` returned after anchoring" : lookupType === "log_id" ? "`log_id` from the audit trail" : "`batch_id` from your batch pipeline"}.
            </span>
          </div>
          <form className="form" onSubmit={onSubmit}>
            <div>
              <label>Lookup type</label>
              <select
                value={lookupType}
                onChange={(event) => setLookupType(event.target.value as VerifyLookupType)}
              >
                <option value="proof_id">Proof ID</option>
                <option value="log_id">Log ID</option>
                <option value="batch_id">Batch ID</option>
              </select>
            </div>
            <div>
              <label>{`Paste your ${endpointLabel}`}</label>
              <input
                placeholder={endpointPlaceholder}
                value={lookupValue}
                onChange={(event) => setLookupValue(event.target.value)}
              />
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Verifying..." : "Verify"}
            </button>
            <div className="button-row">
              <Link className="btn" href="/docs/verification">
                API docs
              </Link>
              <Link className="btn" href="/docs/sdks">
                SDK examples
              </Link>
              <Link className="btn" href="/docs/getting-started">
                Quick start guide
              </Link>
            </div>
          </form>
          {error && <p className="error-banner">{error}</p>}
        </section>

        {result && (
          <section className="grid grid-3" style={{ marginTop: 12 }}>
            <article className="card">
              <strong>Log exists</strong>
              <p>{result.exists ? "Yes" : "No"}</p>
            </article>
            <article className="card">
              <strong>Merkle proof valid</strong>
              <p>{result.hash_valid ? "Yes" : "No"}</p>
            </article>
            <article className="card">
              <strong>Timestamp anchored</strong>
              <p>{result.timestamp_anchored ? "Yes" : "No"}</p>
            </article>
            <article className="card">
              <strong>Anchor transaction</strong>
              <p>{result.anchor_tx ?? "Available after anchoring"}</p>
            </article>
            <article className="card">
              <strong>Verified at</strong>
              <p>{result.verified_at ? new Date(result.verified_at).toISOString() : "Pending"}</p>
            </article>
            <article className="card">
              <strong>Integrity verdict</strong>
              <p>{result.integrity ?? "UNKNOWN"}</p>
            </article>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
