"use client";

import { FormEvent, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { blocklogRequest, normalizePayload } from "@/lib/blocklog";

type VerifyResult = {
  integrity?: string;
  chain?: string;
  signature?: string;
};

export default function VerifyPage() {
  const [hash, setHash] = useState("");
  const [payload, setPayload] = useState('{"event":"user.login","user_id":"123"}');
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    try {
      const parsedPayload = payload ? JSON.parse(payload) : null;
      const response = await blocklogRequest<VerifyResult | { data?: VerifyResult }>(
        "/verify",
        "POST",
        {
          hash,
          log: parsedPayload,
        },
      );
      setResult(normalizePayload<VerifyResult>(response, {}, "data"));
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Verification failed",
      );
      setResult(null);
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
            <button className="btn btn-primary" type="submit">
              Verify
            </button>
          </form>
          {error && <p style={{ color: "var(--danger)" }}>{error}</p>}
        </section>

        {result && (
          <section className="grid grid-3" style={{ marginTop: 12 }}>
            <article className="card">
              <strong>Integrity</strong>
              <p>{result.integrity ?? "VALID"}</p>
            </article>
            <article className="card">
              <strong>Chain</strong>
              <p>{result.chain ?? "VERIFIED"}</p>
            </article>
            <article className="card">
              <strong>Signature</strong>
              <p>{result.signature ?? "MATCH"}</p>
            </article>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
