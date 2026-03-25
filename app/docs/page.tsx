import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const pages = [
  ["Getting started", "/docs/getting-started"],
  ["Authentication", "/docs/authentication"],
  ["Log ingestion", "/docs/log-ingestion"],
  ["Batch logs", "/docs/batch-logs"],
  ["Verification", "/docs/verification"],
  ["Operations", "/docs/operations"],
  ["Admin portal", "/docs/admin-portal"],
  ["Auditor portal", "/docs/auditor-portal"],
  ["SDKs", "/docs/sdks"],
] as const;

export default function DocsIndexPage() {
  return (
    <>
      <SiteHeader />
      <main className="container section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Documentation</p>
            <h1 style={{ marginTop: 0, marginBottom: 10 }}>Product and API docs for Blocklog.</h1>
          </div>
          <p className="section-lead">
            These pages match the current product surface: bearer-auth console access, manual integration
            API keys, admin controls, auditor verification, and the operational endpoints exposed by the backend.
          </p>
        </div>
        <div className="grid grid-3" style={{ marginTop: 12 }}>
          {pages.map(([name, href]) => (
            <Link key={href} href={href} className="card glass-card">
              <strong>{name}</strong>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
