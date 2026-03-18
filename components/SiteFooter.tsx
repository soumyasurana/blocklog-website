import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-intro">
          <div>
            <p className="eyebrow">Blocklog</p>
            <h2>Proof systems for every critical event.</h2>
          </div>
          <p className="muted" style={{ maxWidth: 520 }}>
            Built for teams that need verifiable audit history across financial systems,
            internal controls, AI actions, and regulated workloads.
          </p>
        </div>
        <div className="footer-links">
          <Link href="/docs">Docs</Link>
          <Link href="/docs/log-ingestion">API</Link>
          <Link href="/docs/sdks">SDK examples</Link>
          <Link href="/docs/getting-started">Quick start</Link>
          <Link href="/pilot">Start 20-Day Pilot</Link>
          <a href="https://github.com/Blockloghq" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
        </div>
      </div>
    </footer>
  );
}
