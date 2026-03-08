import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const pages = [
  ["Getting started", "/docs/getting-started"],
  ["Authentication", "/docs/authentication"],
  ["Log ingestion", "/docs/log-ingestion"],
  ["Batch logs", "/docs/batch-logs"],
  ["Verification", "/docs/verification"],
  ["SDKs", "/docs/sdks"],
] as const;

export default function DocsIndexPage() {
  return (
    <>
      <SiteHeader />
      <main className="container section">
        <h1 style={{ marginTop: 0 }}>Documentation</h1>
        <p className="muted">Choose a section to integrate and verify quickly.</p>
        <div className="grid grid-3" style={{ marginTop: 12 }}>
          {pages.map(([name, href]) => (
            <Link key={href} href={href} className="card">
              <strong>{name}</strong>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
