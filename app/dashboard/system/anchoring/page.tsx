"use client";

import { useEffect, useState } from "react";
import DashboardTopBar from "@/components/DashboardTopBar";
import { blocklogRequest } from "@/lib/blocklog";

type IntegrityStatusResponse = {
  status?: string;
  integrity_status?: string;
  anchors_created?: number;
};

type ExportProofResponse = {
  merkle_root?: string;
  verification_steps?: string[];
};

export default function AnchoringPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState({
    integrity: "unknown",
    anchors: 0,
    merkleRoot: "not available",
  });
  const [steps, setSteps] = useState<string[]>([]);

  useEffect(() => {
    async function loadAnchoring() {
      setLoading(true);
      setError(null);

      try {
        const [integrity, proof] = await Promise.all([
          blocklogRequest<IntegrityStatusResponse>("/integrity/status"),
          blocklogRequest<ExportProofResponse>(
            `/logs/export-proof?from=${encodeURIComponent(
              new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            )}&to=${encodeURIComponent(new Date().toISOString())}`,
          ),
        ]);

        setStatus({
          integrity: integrity.integrity_status ?? integrity.status ?? "unknown",
          anchors: integrity.anchors_created ?? 0,
          merkleRoot: proof.merkle_root ?? "not available",
        });
        setSteps(proof.verification_steps ?? []);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load anchoring view");
      } finally {
        setLoading(false);
      }
    }

    loadAnchoring();
  }, []);

  return (
    <>
      <DashboardTopBar title="System / Anchoring" />
      {loading && (
        <div className="notice" style={{ marginBottom: 12 }}>
          <div className="spinner" />
          <span>Loading anchoring telemetry...</span>
        </div>
      )}
      {error && <p className="error-banner">Live API unavailable: {error}</p>}

      <section className="grid grid-3">
        <article className="card glass-card">
          <p className="eyebrow">Anchor status</p>
          <h2 style={{ marginTop: 8, marginBottom: 0 }}>{status.integrity}</h2>
        </article>
        <article className="card glass-card">
          <p className="eyebrow">Anchors created</p>
          <h2 style={{ marginTop: 8, marginBottom: 0 }}>{status.anchors}</h2>
        </article>
        <article className="card glass-card">
          <p className="eyebrow">Merkle root</p>
          <code>{status.merkleRoot}</code>
        </article>
      </section>

      <section className="card glass-card" style={{ marginTop: 16 }}>
        <p className="eyebrow">Anchoring flow</p>
        <h2 style={{ marginTop: 8 }}>How proof windows are sealed and attested.</h2>
        {steps.length === 0 ? (
          <div className="empty-state">No anchoring steps were returned for the selected proof window.</div>
        ) : (
          <div className="hash-chain">
            {steps.map((step, index) => (
              <div className="chain-node" key={`${index}-${step}`}>
                <strong>Step {index + 1}</strong>
                <p className="muted" style={{ marginBottom: 0 }}>{step}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
