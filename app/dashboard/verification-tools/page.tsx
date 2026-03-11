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

  return (
    <>
      <DashboardTopBar title="Verification Tool" />
      {error && <p className="error-banner">Live API unavailable: {error}</p>}
      {notice && <p className="notice">{notice}</p>}
      <form className="card" onSubmit={onSubmit}>
        <h2 style={{ marginTop: 0 }}>Paste hash, verify integrity</h2>
        <p className="muted" style={{ marginTop: 0 }}>
          UI flow: paste log hash, click Verify, confirm log exists, hash is valid, and timestamp is anchored.
        </p>
        <div className="form">
          <div>
            <label>Hash</label>
            <input
              placeholder="0x..."
              value={hash}
              onChange={(event) => setHash(event.target.value)}
            />
          </div>
          <div>
            <label>Raw log payload</label>
            <textarea
              value={payload}
              onChange={(event) => setPayload(event.target.value)}
            />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Verify"}
          </button>
          <div className="button-row">
            <Link className="btn" href="/docs/verification">
              API docs
            </Link>
            <Link className="btn" href="/docs/getting-started">
              Quick start guide
            </Link>
            <Link className="btn" href="/docs/sdks">
              SDK examples
            </Link>
          </div>
        </div>
      </form>
      <section className="grid grid-3" style={{ marginTop: 12 }}>
        <article className="card">
          <strong>Log exists</strong>
          <p style={{ color: "var(--success)" }}>{result.exists ? "Yes" : "No"}</p>
        </article>
        <article className="card">
          <strong>Hash valid</strong>
          <p style={{ color: "var(--success)" }}>{result.hash_valid ? "Yes" : "No"}</p>
        </article>
        <article className="card">
          <strong>Timestamp anchored</strong>
          <p style={{ color: "var(--success)" }}>
            {result.timestamp_anchored ? "Yes" : "No"}
          </p>
        </article>
      </section>
    </>
  );
}
