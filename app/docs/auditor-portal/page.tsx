import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export default function AuditorPortalDocsPage() {
  return (
    <>
      <SiteHeader />
      <main className="container section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Auditor portal</p>
            <h1 style={{ marginTop: 0, marginBottom: 10 }}>Read-only verification for auditors, compliance teams, and buyer reviews.</h1>
          </div>
          <p className="section-lead">
            The auditor portal is intentionally narrow: verify integrity, inspect the timeline, and move into
            evidence export workflows without any mutation permissions.
          </p>
        </div>

        <pre className="code-pane">{`Portal surface: /auditor
Verifier surface: /verify

Primary verification APIs:
GET /api/v1/public/verify/{proof_id}
GET /api/v1/verify/log/{log_id}
GET /api/v1/verify/batch/{batch_id}
GET /api/v1/logs/export-proof?from=...&to=...`}</pre>

        <div className="button-row" style={{ marginTop: 18 }}>
          <Link className="btn btn-primary" href="/auditor">
            Open Auditor Portal
          </Link>
          <Link className="btn" href="/docs/verification">
            Verification
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
