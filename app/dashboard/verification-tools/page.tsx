"use client";

import { FormEvent, useState } from "react";
import DashboardTopBar from "@/components/DashboardTopBar";
import { blocklogRequest, normalizePayload } from "@/lib/blocklog";

type VerifyResult = {
  integrity?: string;
  chain?: string;
  signature?: string;
};

export default function VerificationToolsPage() {
  const [hash, setHash] = useState("");
  const [payload, setPayload] = useState('{"event":"user.login","user_id":"123"}');
  const [result, setResult] = useState<VerifyResult>({
    integrity: "VALID",
    chain: "VERIFIED",
    signature: "MATCH",
  });
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    try {
      const parsedPayload = payload ? JSON.parse(payload) : null;
      const response = await blocklogRequest<VerifyResult | { data?: VerifyResult }>(
        "/verify",
        "POST",
        { hash, log: parsedPayload },
      );
      setResult(normalizePayload<VerifyResult>(response, result, "data"));
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Verification request failed",
      );
    }
  }

  return (
    <>
      <DashboardTopBar title="Verification Tools" />
      {error && <p className="muted">Live API unavailable: {error}</p>}
      <form className="card" onSubmit={onSubmit}>
        <h2 style={{ marginTop: 0 }}>Verify hash or log payload</h2>
        <div className="form">
          <div>
            <label>Hash</label>
            <input placeholder="0x..." value={hash} onChange={(event) => setHash(event.target.value)} />
          </div>
          <div>
            <label>Raw log payload</label>
            <textarea value={payload} onChange={(event) => setPayload(event.target.value)} />
          </div>
          <button className="btn btn-primary" type="submit">
            Run verification
          </button>
        </div>
      </form>
      <section className="grid grid-3" style={{ marginTop: 12 }}>
        <article className="card">
          <strong>Integrity</strong>
          <p style={{ color: "var(--success)" }}>{result.integrity ?? "VALID"}</p>
        </article>
        <article className="card">
          <strong>Chain</strong>
          <p style={{ color: "var(--success)" }}>{result.chain ?? "VERIFIED"}</p>
        </article>
        <article className="card">
          <strong>Signature</strong>
          <p style={{ color: "var(--success)" }}>{result.signature ?? "MATCH"}</p>
        </article>
      </section>
    </>
  );
}
