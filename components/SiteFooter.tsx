import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-links">
          <Link href="/docs">Docs</Link>
          <Link href="/docs/log-ingestion">API</Link>
          <Link href="/docs/sdks">SDK examples</Link>
          <Link href="/docs/getting-started">Quick start</Link>
          <a href="https://github.com" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
        </div>
      </div>
    </footer>
  );
}
