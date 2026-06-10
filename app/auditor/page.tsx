import Link from "next/link";


const auditorCapabilities = [
  "Read-only verification surface",
  "Proof, log, and batch integrity checks",
  "Verification report and bundle workflow",
  "Timeline reconstruction for audit review",
  "No mutation permissions",
];

const auditorTimeline = [
  "Resolve the selected proof, log, or batch identifier",
  "Recompute chain and Merkle inclusion validity",
  "Check the anchor receipt and verification timestamp",
  "Review the event timeline and supporting evidence bundle",
  "Export the verification output for the audit file",
];

export const metadata = {
  title: "Auditor Portal",
  description:
    "Read-only verification portal for auditors, compliance teams, and enterprise buyers reviewing Blocklog evidence.",
};

export default function AuditorPortalPage() {
  return (
    <>
      <main className="container section">
        <section className="section-header">
          <div>
            <p className="eyebrow">Auditor portal</p>
            <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4.2rem)", margin: 0 }}>
              Read-only verification for auditors, compliance teams, and buyer reviews.
            </h1>
          </div>
          <p className="section-lead">
            This portal is intentionally narrow: verify integrity, reconstruct the timeline, and export
            review artifacts without giving mutation access to the underlying system.
          </p>
        </section>

        <section className="trust-band" style={{ marginTop: 20 }}>
          <div>
            <p className="eyebrow">Portal guarantees</p>
            <h2>External reviewers see evidence, not admin controls.</h2>
          </div>
          <div className="grid" style={{ gap: 10 }}>
            {auditorCapabilities.map((item) => (
              <div className="status-pill" key={item}>
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="section">
        </section>

        <section className="grid grid-2">
          <article className="card glass-card">
            <p className="eyebrow">Timeline reconstruction</p>
            <h2 style={{ marginTop: 8 }}>How an auditor should review a record.</h2>
            <div className="terminal-pane" style={{ marginTop: 18 }}>
              <div className="terminal-pane-header">Read-only review flow</div>
              <pre className="terminal-output">{auditorTimeline.map((step, index) => `${index + 1}. ${step}`).join("\n")}</pre>
            </div>
          </article>

          <article className="card glass-card">
            <p className="eyebrow">Evidence export</p>
            <h2 style={{ marginTop: 8 }}>Download the materials an audit team will actually ask for.</h2>
            <div className="grid" style={{ gap: 10 }}>
              <div className="orbital-card">
                <strong>Verification reports</strong>
                <p className="muted" style={{ margin: "8px 0 0" }}>
                  Use the verification workflow and evidence export surfaces to create review-ready outputs.
                </p>
              </div>
              <div className="orbital-card">
                <strong>Evidence bundles</strong>
                <p className="muted" style={{ margin: "8px 0 0" }}>
                  Bundle proof artifacts, timestamps, and supporting payload evidence for external review.
                </p>
              </div>
            </div>
            <div className="button-row" style={{ marginTop: 16 }}>
              <Link className="btn btn-primary" href="/verify">
                Open Verifier
              </Link>
              <Link className="btn" href="/docs/verification">
                Verification Docs
              </Link>
              <Link className="btn" href="/dashboard/verification-tools">
                Console Workflow
              </Link>
            </div>
          </article>
        </section>
      </main>
    </>
  );
}
