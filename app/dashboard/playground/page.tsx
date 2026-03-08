import DashboardTopBar from "@/components/DashboardTopBar";

export default function PlaygroundPage() {
  return (
    <>
      <DashboardTopBar title="Developer Playground" />
      <section className="card">
        <h2 style={{ marginTop: 0 }}>Interactive API tester</h2>
        <p className="muted">Try <code>POST /logs</code> with a sample payload.</p>
        <div className="grid grid-2">
          <div>
            <label>Method + endpoint</label>
            <input defaultValue="POST /api/v1/logs" />
          </div>
          <div>
            <label>API key</label>
            <input placeholder="blk_live_..." />
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <label>Payload</label>
          <textarea defaultValue={`{\n  "event": "payment.created",\n  "user_id": "123",\n  "metadata": {"amount": 2000}\n}`} />
        </div>
        <button className="btn btn-primary" style={{ marginTop: 12 }}>
          Send request
        </button>
      </section>
    </>
  );
}
