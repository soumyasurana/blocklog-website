import Link from "next/link";

export default function BatchLogsDocsPage() {
  return (
    <main className="container section">
      <h1>Batch Logs</h1>
      <pre className="code-pane">{`POST /api/v1/logs/batch\n{\n  "logs": [ ... ]\n}`}</pre>
      <Link className="btn" href="/docs">Back to docs</Link>
    </main>
  );
}
