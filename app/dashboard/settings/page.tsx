import DashboardTopBar from "@/components/DashboardTopBar";

export default function SettingsPage() {
  return (
    <>
      <DashboardTopBar title="Company / Project Settings" />
      <section className="card">
        <div className="grid grid-2">
          <div>
            <label>Company name</label>
            <input defaultValue="Acme Financial" />
          </div>
          <div>
            <label>Company ID</label>
            <input defaultValue="cmp_84f02" readOnly />
          </div>
          <div>
            <label>API endpoint</label>
            <input defaultValue="https://api.blocklog.dev/v1" readOnly />
          </div>
          <div>
            <label>Region</label>
            <input defaultValue="us-east-1" />
          </div>
        </div>
      </section>
      <section className="grid grid-2" style={{ marginTop: 12 }}>
        <article className="card">
          <h2 style={{ marginTop: 0 }}>Rotate keys</h2>
          <p className="muted">Regenerate all active keys and invalidate old credentials.</p>
          <button className="btn">Rotate</button>
        </article>
        <article className="card">
          <h2 style={{ marginTop: 0 }}>Delete project</h2>
          <p className="muted">Permanent action for this project and all related logs.</p>
          <button className="btn">Delete project</button>
        </article>
      </section>
    </>
  );
}
