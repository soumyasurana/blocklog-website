import Link from "next/link";

export default function LogIngestionDocsPage() {
  return (
    <main className="container section">
      <h1>Log Ingestion</h1>
      <pre className="code-pane">{`POST /api/v1/logs\n{\n  "event": "payment.created",\n  "user_id": "123",\n  "metadata": {"amount": 2000}\n}`}</pre>
      <Link className="btn" href="/docs">Back to docs</Link>
    </main>
  );
}
