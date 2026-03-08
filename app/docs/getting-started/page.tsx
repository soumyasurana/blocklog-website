import Link from "next/link";

export default function GettingStartedPage() {
  return (
    <main className="container section">
      <h1>Getting Started</h1>
      <p className="muted">Create a project, generate an API key, and send your first log.</p>
      <pre className="code-pane">{`curl -X POST https://api.blocklog.dev/api/v1/logs`}</pre>
      <Link className="btn" href="/docs">Back to docs</Link>
    </main>
  );
}
