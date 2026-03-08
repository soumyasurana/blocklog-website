import DashboardTopBar from "@/components/DashboardTopBar";

const nodes = [
  ["Log 1", "hash A"],
  ["Log 2", "hash B"],
  ["Log 3", "hash C"],
  ["Log 4", "hash D"],
];

export default function AuditTrailPage() {
  return (
    <>
      <DashboardTopBar title="Audit Trail Viewer" />
      <section className="card">
        <h2 style={{ marginTop: 0 }}>Hash chain visualization</h2>
        <div className="hash-chain">
          {nodes.map(([log, hash], index) => (
            <div className="chain-node" key={log}>
              <strong>
                {log} → {hash}
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
