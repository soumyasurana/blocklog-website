import Link from "next/link";


export default function AdminPortalDocsPage() {
  return (
    <>
      <main className="container section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Admin portal</p>
            <h1 style={{ marginTop: 0, marginBottom: 10 }}>Founder-only controls for tenants, pilots, and abuse response.</h1>
          </div>
          <p className="section-lead">
            The internal admin portal is hidden behind `/admin` and uses founder/admin auth. It exposes tenant
            listing, limit overrides, pilot and refund state, API key inspection, and kill-switch execution.
          </p>
        </div>

        <pre className="code-pane">{`GET    /api/v1/admin/overview
GET    /api/v1/admin/companies
GET    /api/v1/admin/companies/{company_id}/api-keys
PATCH  /api/v1/admin/companies/{company_id}/controls
POST   /api/v1/admin/companies/{company_id}/kill-switch`}</pre>

        <div className="button-row" style={{ marginTop: 18 }}>
          <Link className="btn btn-primary" href="/admin">
            Open Admin Portal
          </Link>
          <Link className="btn" href="/docs/authentication">
            Authentication
          </Link>
        </div>
      </main>
    </>
  );
}
