import Link from "next/link";

export default function BatchLogsDocsPage() {
  return (
    <>
      <main className="container section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Batch workflow</p>
            <h1 style={{ marginTop: 0, marginBottom: 10 }}>Seal, verify, sign, and export batches.</h1>
          </div>
          <p className="section-lead">
            Batches move through sealing, proof bundling, signing, verification, and export. These are the core
            lifecycle endpoints used by the console and by operational runbooks.
          </p>
        </div>

        <pre className="code-pane">{`POST /api/v1/logs/batch
POST /api/v1/batches/seal
GET  /api/v1/batches
GET  /api/v1/batches/{batch_id}
GET  /api/v1/batches/{batch_id}/status
POST /api/v1/batches/{batch_id}/finalize
GET  /api/v1/batches/{batch_id}/proof-bundle
POST /api/v1/exports/{batch_id}
GET  /api/v1/exports/{export_id}
GET  /api/v1/exports/{export_id}/download`}</pre>

        <div className="button-row" style={{ marginTop: 18 }}>
          <Link className="btn btn-primary" href="/docs/verification">
            Verification
          </Link>
          <Link className="btn" href="/docs/operations">
            Operations
          </Link>
        </div>
      </main>
    </>
  );
}
