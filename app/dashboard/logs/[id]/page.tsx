"use client";

import { use, useEffect, useState } from "react";
import DashboardTopBar from "@/components/DashboardTopBar";
import { blocklogRequest } from "@/lib/blocklog";

type LogDetails = {
  log_id?: string;
  company_id?: string;
  event_type?: string;
  source?: string;
  payload?: Record<string, unknown>;
  payload_hash?: string;
  log_signature?: string | null;
  public_key_id?: string | null;
  previous_hash?: string | null;
  chain_hash?: string;
  batch_id?: string | null;
  created_at?: string;
  is_deleted?: boolean;
};

type VerificationResult = {
  log_id?: string;
  hash?: string;
  previous_hash?: string | null;
  chain_valid?: boolean;
  signature_valid?: boolean | null;
  anchor_proof?: Record<string, unknown> | null;
  time_attestation?: Record<string, unknown> | null;
  verified_at?: string;
};

export default function LogDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [details, setDetails] = useState<LogDetails | null>(null);
  const [verification, setVerification] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    async function loadDetails() {
      try {
        const payload = await blocklogRequest<LogDetails>(`/logs/${id}`);
        setDetails(payload);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load log");
      }
    }

    loadDetails();
  }, [id]);

  async function verifyIntegrity() {
    setVerifying(true);
    try {
      const payload = await blocklogRequest<VerificationResult>(`/logs/${id}/verify`);
      setVerification(payload);
    } catch (verifyError) {
      setError(verifyError instanceof Error ? verifyError.message : "Verification failed");
    } finally {
      setVerifying(false);
    }
  }

  const eventData = JSON.stringify(
    {
      event_type: details?.event_type ?? "user.login",
      source: details?.source ?? "api",
      payload: details?.payload ?? {},
    },
    null,
    2,
  );

  return (
    <>
      <DashboardTopBar title={`Log Details: ${id}`} />
      {error && <p className="error-banner">Live API unavailable: {error}</p>}
      <section className="card glass-card" style={{ marginBottom: 16 }}>
        <p className="eyebrow">Canonical record</p>
        <h2 style={{ marginTop: 8 }}>Inspect payload, signatures, and chain state for this log.</h2>
      </section>
      <section className="grid grid-2">
        <article className="card glass-card">
          <h2 style={{ marginTop: 0 }}>Event data</h2>
          <pre className="code-pane" style={{ margin: 0 }}>
            {eventData}
          </pre>
        </article>
        <article className="card glass-card">
          <h2 style={{ marginTop: 0 }}>Integrity metadata</h2>
          <pre className="code-pane" style={{ margin: 0 }}>
            {JSON.stringify(
              {
                payload_hash: details?.payload_hash,
                previous_hash: details?.previous_hash,
                chain_hash: details?.chain_hash,
                batch_id: details?.batch_id,
                public_key_id: details?.public_key_id,
              },
              null,
              2,
            )}
          </pre>
        </article>
      </section>
      <section className="grid grid-3" style={{ marginTop: 12 }}>
        <article className="card glass-card">
          <strong>Log ID</strong>
          <p className="muted">{details?.log_id ?? id}</p>
        </article>
        <article className="card glass-card">
          <strong>Chain hash</strong>
          <p className="muted">{details?.chain_hash ?? "pending"}</p>
        </article>
        <article className="card glass-card">
          <strong>Status</strong>
          <span className={`status-pill ${details?.is_deleted ? "status-deleted" : "status-active"}`}>
            {details?.is_deleted ? "Deleted" : "Active"}
          </span>
        </article>
        <article className="card glass-card">
          <strong>Company ID</strong>
          <p className="muted">{details?.company_id ?? "unknown"}</p>
        </article>
        <article className="card glass-card">
          <strong>Created at</strong>
          <p className="muted">
            {details?.created_at ? new Date(details.created_at).toISOString() : "unknown"}
          </p>
        </article>
        <article className="card glass-card">
          <strong>Signature</strong>
          <p className="muted">{details?.log_signature ?? "none"}</p>
        </article>
      </section>
      <button
        className="btn btn-primary"
        style={{ marginTop: 14 }}
        onClick={verifyIntegrity}
        type="button"
        disabled={verifying}
      >
        {verifying ? "Verifying..." : "Verify Integrity"}
      </button>
      {verification && (
        <section className="grid grid-3" style={{ marginTop: 12 }}>
          <article className="card glass-card">
            <strong>Chain valid</strong>
            <span className={`status-pill ${verification.chain_valid ? "status-valid" : "status-invalid"}`}>
              {verification.chain_valid ? "Yes" : "No"}
            </span>
          </article>
          <article className="card glass-card">
            <strong>Signature valid</strong>
            <p className="muted">
              {verification.signature_valid === null
                ? "Not checked"
                : verification.signature_valid
                  ? "Yes"
                  : "No"}
            </p>
          </article>
          <article className="card glass-card">
            <strong>Verified at</strong>
            <p className="muted">
              {verification.verified_at
                ? new Date(verification.verified_at).toISOString()
                : "unknown"}
            </p>
          </article>
        </section>
      )}
    </>
  );
}
