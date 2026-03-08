import Link from "next/link";

export default function VerificationDocsPage() {
  return (
    <main className="container section">
      <h1>Verification</h1>
      <pre className="code-pane">{`GET /api/v1/verify/{log_id}`}</pre>
      <p>Checks integrity, hash chain, and signature validity.</p>
      <Link className="btn" href="/docs">Back to docs</Link>
    </main>
  );
}
