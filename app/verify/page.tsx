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
};

export default function VerifyPage() {
  const [hash, setHash] = useState("");
  const [payload, setPayload] = useState('{"event":"user.login","user_id":"123"}');
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
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
      setResult(normalizePayload<VerifyResult>(response, {}, "data"));
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
        <p className="muted">Paste a hash or payload to validate integrity.</p>
        <section className="card">
          <form className="form" onSubmit={onSubmit}>
            <div>
              <label>Hash</label>
              <input
                placeholder="0x..."
                value={hash}
                onChange={(event) => setHash(event.target.value)}
              />
            </div>
            <div>
              <label>Log payload</label>
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
              <strong>Hash valid</strong>
              <p>{result.hash_valid ? "Yes" : "No"}</p>
            </article>
            <article className="card">
              <strong>Timestamp anchored</strong>
              <p>{result.timestamp_anchored ? "Yes" : "No"}</p>
            </article>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
