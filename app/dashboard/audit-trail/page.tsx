"use client";

import { useEffect, useState } from "react";
import DashboardTopBar from "@/components/DashboardTopBar";
import { blocklogRequest } from "@/lib/blocklog";

type ChainNode = { log: string; hash: string; createdAt: string };

type ExportProofResponse = {
  logs?: { log_id: string; created_at: string; chain_hash: string }[];
};

export default function AuditTrailPage() {
  const [nodes, setNodes] = useState<ChainNode[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadChain() {
      try {
        const from = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const to = new Date().toISOString();
        const payload = await blocklogRequest<ExportProofResponse>(
          `/logs/export-proof?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
        );

        setNodes(
          (payload.logs ?? []).slice(0, 12).map((entry, index) => ({
            log: `Log ${index + 1} · ${entry.log_id}`,
            hash: entry.chain_hash,
            createdAt: entry.created_at,
          })),
        );
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load chain");
      }
    }

    loadChain();
  }, []);

  return (
    <>
      <DashboardTopBar title="Audit Trail Viewer" />
      {error && <p className="error-banner">Live API unavailable: {error}</p>}
      <section className="card glass-card">
        <p className="eyebrow">Chain view</p>
        <h2 style={{ marginTop: 8 }}>Hash chain visualization built from exported proof windows.</h2>
        {nodes.length === 0 ? (
          <div className="empty-state">No proof data available for the selected time range.</div>
        ) : (
          <div className="hash-chain">
            {nodes.map((node, index) => (
              <div className="chain-node" key={`${node.log}-${node.hash}`}>
                <strong>
                  {node.log} → {node.hash}
                </strong>
                <p className="muted" style={{ marginBottom: 0 }}>
                  Chain position {index + 1} · {new Date(node.createdAt).toISOString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
