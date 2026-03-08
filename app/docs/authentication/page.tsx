import Link from "next/link";

export default function AuthenticationDocsPage() {
  return (
    <main className="container section">
      <h1>Authentication</h1>
      <pre className="code-pane">{`X-Company-ID: cmp_84f02\nX-API-Key: blk_live_xxx`}</pre>
      <Link className="btn" href="/docs">Back to docs</Link>
    </main>
  );
}
