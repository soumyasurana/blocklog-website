"use client";

import { useEffect, useState } from "react";
import DashboardTopBar from "@/components/DashboardTopBar";
import { blocklogRequest, normalizePayload } from "@/lib/blocklog";

type LogDetails = {
  id?: string;
  event_data?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  hash?: string;
  signature?: string;
  integrity_status?: string;
  chain_position?: string;
  verification_result?: string;
};

export default function LogDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const [details, setDetails] = useState<LogDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verifyMessage, setVerifyMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadDetails() {
      try {
        const payload = await blocklogRequest<LogDetails | { data?: LogDetails }>(
          `/logs/${params.id}`,
        );
        setDetails(normalizePayload<LogDetails>(payload, {}, "data"));
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load log");
      }
    }

    loadDetails();
  }, [params.id]);

  async function verifyIntegrity() {
    setVerifyMessage(null);
    setVerifying(true);
    try {
      const payload = await blocklogRequest<{ result?: string; data?: { result?: string } }>(
        `/logs/${params.id}/verify`,
        "POST",
      );
      const result = normalizePayload<{ result?: string }>(payload, {}, "data");
      setVerifyMessage(result.result ?? "Integrity check completed.");
    } catch (verifyError) {
      setVerifyMessage(
        verifyError instanceof Error ? verifyError.message : "Verification failed",
      );
    } finally {
      setVerifying(false);
    }
  }

  const eventData = JSON.stringify(details?.event_data ?? { event: "user.login" }, null, 2);
  const metadata = JSON.stringify(
    details?.metadata ?? { ip: "172.2.4.9", trace: "tr_784f9" },
    null,
    2,
  );

  return (
    <>
      <DashboardTopBar title={`Log Details: ${params.id}`} />
      {error && <p className="muted">Live API unavailable: {error}</p>}
      <section className="grid grid-2">
        <article className="card">
          <h2 style={{ marginTop: 0 }}>Event data</h2>
          <pre className="code-pane" style={{ margin: 0 }}>
            {eventData}
          </pre>
        </article>
        <article className="card">
          <h2 style={{ marginTop: 0 }}>Metadata</h2>
          <pre className="code-pane" style={{ margin: 0 }}>
            {metadata}
          </pre>
        </article>
      </section>
      <section className="grid grid-3" style={{ marginTop: 12 }}>
        <article className="card">
          <strong>Hash</strong>
          <p className="muted">{details?.hash ?? "0x2eaf1b1a..."}</p>
        </article>
        <article className="card">
          <strong>Signature</strong>
          <p className="muted">{details?.signature ?? "sig_9f01...ef8"}</p>
        </article>
        <article className="card">
          <strong>Integrity status</strong>
          <p style={{ color: "var(--success)" }}>{details?.integrity_status ?? "VALID"}</p>
        </article>
        <article className="card">
          <strong>Chain position</strong>
          <p className="muted">{details?.chain_position ?? "Block #6,818"}</p>
        </article>
        <article className="card">
          <strong>Verification result</strong>
          <p className="muted">
            {details?.verification_result ?? "Signature MATCH, Chain VERIFIED"}
          </p>
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
      {verifyMessage && <p className="muted">{verifyMessage}</p>}
    </>
  );
}
