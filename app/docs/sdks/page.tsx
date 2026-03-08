import Link from "next/link";

export default function SdksDocsPage() {
  return (
    <main className="container section">
      <h1>SDKs</h1>
      <ul>
        <li>Node.js SDK</li>
        <li>Python SDK</li>
        <li>Go SDK</li>
      </ul>
      <Link className="btn" href="/docs">Back to docs</Link>
    </main>
  );
}
