import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function VerifyPage() {
  return (
    <>
      <SiteHeader />
      <main className="container section">
        <h1 style={{ marginTop: 0 }}>Public Verifier</h1>
        <p className="muted">Paste a hash or payload to validate integrity.</p>
        <section className="card">
          <div className="form">
            <div>
              <label>Hash</label>
              <input placeholder="0x..." />
            </div>
            <div>
              <label>Log payload</label>
              <textarea placeholder='{"event":"user.login","user_id":"123"}' />
            </div>
            <button className="btn btn-primary" type="button">
              Verify
            </button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
