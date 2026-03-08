"use client";

import { useEffect, useState } from "react";
import DashboardTopBar from "@/components/DashboardTopBar";
import { blocklogRequest, normalizePayload } from "@/lib/blocklog";

type ChainNode = { log: string; hash: string };

type ChainPayload = {
  nodes?: ChainNode[];
};

const fallback: ChainNode[] = [
  { log: "Log 1", hash: "hash A" },
  { log: "Log 2", hash: "hash B" },
  { log: "Log 3", hash: "hash C" },
  { log: "Log 4", hash: "hash D" },
];

export default function AuditTrailPage() {
  const [nodes, setNodes] = useState<ChainNode[]>(fallback);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadChain() {
      try {
        const payload = await blocklogRequest<ChainPayload | { data?: ChainPayload }>(
          "/logs/chain",
        );
        const parsed = normalizePayload<ChainPayload>(payload, {}, "data");
        if (parsed.nodes?.length) {
          setNodes(parsed.nodes);
        }
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load chain");
      }
    }

    loadChain();
  }, []);

  return (
    <>
      <DashboardTopBar title="Audit Trail Viewer" />
      {error && <p className="muted">Live API unavailable: {error}</p>}
      <section className="card">
        <h2 style={{ marginTop: 0 }}>Hash chain visualization</h2>
        <div className="hash-chain">
          {nodes.map((node, index) => (
            <div className="chain-node" key={`${node.log}-${node.hash}`}>
              <strong>
                {node.log} → {node.hash}
              </strong>
              <p className="muted" style={{ marginBottom: 0 }}>
                Chain position {index + 1}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
