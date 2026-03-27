import Link from "next/link";
import LandingHeroActions from "@/components/LandingHeroActions";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import VerifyProofWidget from "@/components/VerifyProofWidget";

const heroSignals = [
  { value: "30 seconds", label: "for an auditor to verify a proof bundle" },
  { value: "20-day pilot", label: "to prove the workflow before rollout" },
  { value: "No schema changes", label: "for existing JSON log sources" },
];

const heroQuotes = [
  {
    quote: "Blocklog turns log integrity from a promise into proof.",
    label: "For compliance teams",
  },
  {
    quote: "Your auditor gets evidence they can verify without trusting your app.",
    label: "For audit review",
  },
  {
    quote: "Your team keeps shipping while Blocklog handles the proof trail.",
    label: "For engineering teams",
  },
];

const heroConfidencePoints = [
  "Portable proof bundles you can keep",
  "Independent verification for auditors",
  "Fast pilot with founder-led onboarding",
];

const proofSteps = [
  {
    step: "Step 1",
    title: "Send your logs",
    benefit: "One API call. Works with CloudTrail, Cloud Logging, GitHub, or any JSON logs.",
    detail: "No schema changes. No complex setup.",
  },
  {
    step: "Step 2",
    title: "We create cryptographic proof",
    benefit: "Automatically sealed and anchored so tampering becomes visible and independently verifiable.",
    detail: "Runs in the background. No manual review step required.",
  },
  {
    step: "Step 3",
    title: "Give proof to your auditor",
    benefit: "Download a proof bundle your auditor can verify without trusting your app or ours.",
    detail: "Includes verification data and an auditor-friendly report.",
  },
];

const auditOutcomes = [
  {
    title: "Pass SOC 2 without log-verification delays",
    before: "Before: 2 weeks of manual exports, screenshots, and integrity questions.",
    after: "After: 5 minutes to hand over a proof bundle backed by cryptographic evidence.",
    result: "Result: Faster audit completion and less back-and-forth.",
  },
  {
    title: "Give auditors what they actually want",
    before: "Before: \"We use locked storage\" and a request to trust your process.",
    after: "After: \"Here is proof you can verify independently.\"",
    result: "Result: Stronger answers, fewer follow-up questions.",
  },
  {
    title: "Stay audit-ready year-round",
    before: "Before: Point-in-time evidence collection once the audit starts.",
    after: "After: Ongoing verification with current, portable proof bundles.",
    result: "Result: Less scramble during audit season.",
  },
  {
    title: "Use independence as a trust advantage",
    before: "Before: The auditor has to trust your cloud provider and your narrative.",
    after: "After: The auditor can verify the evidence without trusting anyone.",
    result: "Result: A cleaner story for enterprise buyers and security reviewers.",
  },
];

const engineerPoints = [
  "One ingestion endpoint for new and existing JSON logs",
  "Python and Node SDKs for faster rollout",
  "No schema changes required for common log sources",
  "Detailed docs, proof export, and verification endpoints",
];

const auditorPoints = [
  "Independent verification without trusting Blocklog",
  "Professional proof bundles and portable audit evidence",
  "Clear integrity story for SOC 2, ISO 27001, and HIPAA workflows",
  "Step-by-step verification path for reviewers and external auditors",
];

const securityQuestions = [
  {
    question: "Where is our data stored?",
    answer:
      "Blocklog is designed around proof and audit evidence, not opaque storage claims. Teams can keep raw logs in their own systems while using Blocklog for verification workflows, proof bundles, and integrity checks.",
  },
  {
    question: "What if Blocklog gets breached?",
    answer:
      "The core value is that proofs stay independently verifiable. If Blocklog is unavailable or compromised, exported proof bundles and public anchor data still let reviewers validate integrity without trusting the application.",
  },
  {
    question: "How do you prevent tampering or retroactive changes to logs?",
    answer:
      "Blocklog is built around immutability and verifiable integrity. Once events are processed, they are cryptographically linked and anchored, making any modification detectable. Instead of relying on internal assurances, reviewers can independently verify that logs have not been altered by checking proof bundles against their original anchors.",
  },
  {
    question: "What if Blocklog goes away?",
    answer:
      "That is exactly why independent verification matters. Proof bundles are portable, and the verification story does not depend on a private database or a promise that Blocklog will always be online.",
  },
  {
    question: "How do you handle security reviews and compliance?",
    answer:
      "Security buyers usually want architecture clarity, evidence handling, and scope boundaries. Blocklog keeps the conversation focused on verifiable proof, operational controls, and clear documentation rather than vague trust language.",
  },
  {
    question: "What about GDPR and data sensitivity?",
    answer:
      "Compliance teams still need to review their own obligations, but Blocklog is built to support defensible evidence handling, immutable proof exports, and clearer separation between raw event capture and verification artifacts.",
  },
];

const currentUseCases = [
  {
    title: "Incident response verification",
    detail:
      "After an incident, show what happened and when, with evidence that the underlying record was not silently changed after the fact.",
  },
  {
    title: "SOC 2 and internal audit prep",
    detail:
      "Reduce the manual work of assembling integrity evidence for audit review and recurring compliance checks.",
  },
  {
    title: "Customer and vendor trust reviews",
    detail:
      "Share portable proof instead of screenshots and process descriptions when customers or partners ask how log integrity is maintained.",
  },
];

const withoutBlocklog = [
  "CloudTrail exports and app logs assembled by hand",
  "Manual formatting for auditor review",
  "Integrity questions answered with process descriptions",
  "Repeated evidence requests during audit review",
];

const withBlocklog = [
  "Send logs once through the ingestion pipeline",
  "Proof bundle generated automatically",
  "Auditor verifies independently in seconds",
  "Fewer follow-up requests and faster approval",
];

const docsLinks = [
  {
    href: "/docs/log-ingestion",
    title: "Log ingestion docs",
    detail: "Authentication, ingestion, proof export, and verification endpoints.",
  },
  {
    href: "/docs/sdks",
    title: "SDK references",
    detail: "Node and Python clients with retries, batching, timestamps, and idempotency support.",
  },
  {
    href: "/pilot",
    title: "Start a pilot",
    detail: "Run a scoped 20-day pilot focused on auditor-ready proof and integration speed.",
  },
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="container">
        <section className="hero">
          <div className="hero-copy">
            <div className="hero-copy-inner">
              <div className="hero-badge">
                <span className="hero-badge-dot" />
                Built for security teams, compliance leads, and auditors
              </div>
              <p className="eyebrow">Tamper-evident audit proof</p>
              <h1>
                <span className="landing-headline-question">Auditors ask for proof.</span>
                <span>Blocklog gives you proof.</span>
              </h1>
              <p className="hero-value-prop">
                Cryptographic proof your audit logs are intact, verifiable by anyone even if
                Blocklog disappears tomorrow.
              </p>
              <div className="landing-hero-quotes">
                {heroQuotes.map((item) => (
                  <div className="landing-hero-quote" key={item.quote}>
                    <p>{item.quote}</p>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
              <LandingHeroActions />
              <p className="landing-hero-note">
                Pilot includes ingestion setup, proof generation, and an auditor-ready verification
                flow.
              </p>
              <div className="landing-hero-confidence">
                <p className="eyebrow">Why teams start now</p>
                <div className="landing-hero-confidence-list">
                  {heroConfidencePoints.map((item) => (
                    <div className="landing-hero-confidence-item" key={item}>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="hero-metrics">
                {heroSignals.map((signal) => (
                  <div className="hero-metric" key={signal.label}>
                    <span className="metric-value">{signal.value}</span>
                    <span className="muted">{signal.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="hero-panel landing-proof-panel">
            <div className="hero-panel-glow" />
            <div className="landing-proof-exchange">
              <div className="landing-proof-prompt">
                <span className="comparison-label">Auditor challenge</span>
                <strong>“Prove your logs weren’t modified.”</strong>
                <p className="muted">
                  This is where most teams lose days pulling exports, screenshots, and manual
                  explanations together.
                </p>
              </div>
              <div className="landing-proof-response">
                <span className="comparison-label">Blocklog response</span>
                <strong>Proof bundle ready.</strong>
                <div className="landing-proof-checks">
                  <div className="status-pill">Integrity verified</div>
                  <div className="status-pill">Timestamp anchored</div>
                  <div className="status-pill">Auditor can verify independently</div>
                </div>
              </div>
            </div>
            <div className="code-pane">{`POST /api/v1/logs/batch
{
  "logs": [
    {
      "event_type": "payment.created",
      "source": "payments-api",
      "idempotency_key": "evt_payment_123_created",
      "data": {
        "user_id": "123",
        "amount": 2000,
        "currency": "USD"
      }
    }
  ]
}

$ ./verify.sh proof_bundle.zip
[OK] log chain intact
[OK] timestamp anchored
[OK] proof independently verifiable`}</div>
            <div className="hero-orbit">
              <div className="orbital-card">
                <p className="eyebrow">Why buyers care</p>
                <strong>Move from &quot;trust our process&quot; to proof your auditor can check.</strong>
              </div>
              <div className="orbital-card">
                <p className="eyebrow">Pilot structure</p>
                <strong>Start a 20-day pilot.</strong>
                <p className="muted">No credit card required. Keep your data if you continue.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="proof-flow">
          <div className="section-header">
            <div>
              <p className="eyebrow">Proof flow</p>
              <h2>From logs to proof in 3 steps. No complex setup.</h2>
            </div>
          </div>
          <div className="stack-grid landing-proof-grid">
            <div className="grid">
              {proofSteps.map((item) => (
                <article className="card glass-card landing-step-card" key={item.title}>
                  <div className="capability-icon" />
                  <p className="eyebrow">{item.step}</p>
                  <h3 style={{ marginTop: 8, marginBottom: 10 }}>{item.title}</h3>
                  <p style={{ marginTop: 0, marginBottom: 10 }}>{item.benefit}</p>
                  <p className="muted" style={{ marginBottom: 0 }}>{item.detail}</p>
                </article>
              ))}
            </div>
            <article className="card glass-card landing-verification-card">
              <p className="eyebrow">What the auditor sees</p>
              <h3 style={{ marginTop: 8, marginBottom: 12 }}>
                Your auditor can verify this independently in 30 seconds.
              </h3>
              <div className="code-pane">{`./verify.sh proof_bundle.zip

[OK] bundle signature valid
[OK] log hashes match
[OK] anchor timestamp found
[OK] evidence ready for review`}</div>
              <p className="muted" style={{ marginBottom: 0 }}>
                No screenshots. No custom explanation. No trust leap.
              </p>
            </article>
          </div>
          <article className="card glass-card landing-no-work-card" style={{ marginTop: 16 }}>
            <p className="eyebrow">What you don&apos;t have to do</p>
            <h3 style={{ marginTop: 8, marginBottom: 10 }}>No extra work required.</h3>
            <div className="grid grid-2">
              <div className="status-pill">No custom audit scripts</div>
              <div className="status-pill">No manual log stitching</div>
              <div className="status-pill">No screenshot-based evidence</div>
              <div className="status-pill">No reliance on internal tooling</div>
            </div>
          </article>
        </section>

        <section className="section">
          <VerifyProofWidget />
        </section>

        <section className="section">
          <div className="section-header">
            <div>
              <p className="eyebrow">Audit outcomes</p>
              <h2>What this means for your audit.</h2>
            </div>
          </div>
          <div className="grid grid-2">
            {auditOutcomes.map((item) => (
              <article className="card glass-card landing-outcome-card" key={item.title}>
                <h3 style={{ marginTop: 0 }}>{item.title}</h3>
                <p>{item.before}</p>
                <p>{item.after}</p>
                <p className="muted" style={{ marginBottom: 0 }}>{item.result}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <div>
              <p className="eyebrow">Two audiences</p>
              <h2>Built for auditors, not just engineers.</h2>
            </div>
          </div>
          <div className="grid grid-2">
            <article className="card glass-card landing-audience-card">
              <p className="eyebrow">For engineers</p>
              <h3 style={{ marginTop: 8 }}>Simple integration</h3>
              <ul className="landing-list">
                {engineerPoints.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
            <article className="card glass-card landing-audience-card">
              <p className="eyebrow">For auditors</p>
              <h3 style={{ marginTop: 8 }}>Independent verification</h3>
              <ul className="landing-list">
                {auditorPoints.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <div>
              <p className="eyebrow">Buyer objections</p>
              <h2>Security and compliance questions, answered.</h2>
            </div>
          </div>
          <div className="grid grid-2">
            {securityQuestions.map((item) => (
              <article className="card glass-card landing-question-card" key={item.question}>
                <span className="comparison-label">Question</span>
                <h3 style={{ marginTop: 0, marginBottom: 10 }}>{item.question}</h3>
                <p className="muted" style={{ marginBottom: 0 }}>{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <div>
              <p className="eyebrow">Use cases</p>
              <h2>Beyond SOC 2: other ways teams use Blocklog.</h2>
            </div>
          </div>
          <div className="grid grid-3">
            {currentUseCases.map((item) => (
              <article className="card glass-card landing-use-case-card" key={item.title}>
                <p className="eyebrow">Current workflow</p>
                <h3 style={{ marginTop: 8, marginBottom: 10 }}>{item.title}</h3>
                <p className="muted" style={{ marginBottom: 0 }}>{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <div>
              <p className="eyebrow">SOC 2 speed</p>
              <h2>Save 2 weeks on your SOC 2 audit.</h2>
            </div>
          </div>
          <div className="comparison-row">
            <article className="comparison-card comparison-card-muted">
              <span className="comparison-label">Without Blocklog</span>
              <ul className="landing-list">
                {withoutBlocklog.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="landing-summary">Typical result: long evidence cycles and repeated integrity questions.</p>
            </article>
            <article className="comparison-card comparison-card-strong">
              <span className="comparison-label">With Blocklog</span>
              <ul className="landing-list">
                {withBlocklog.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="landing-summary">Typical result: faster approval, clearer evidence, less audit friction.</p>
            </article>
          </div>
        </section>

        <section className="section">
          <div className="landing-final-cta">
            <div className="landing-final-cta-copy">
              <p className="eyebrow">Final call</p>
              <h2>Your audit is coming. Be ready.</h2>
              <p className="section-lead" style={{ marginBottom: 0 }}>
                Don&apos;t wait until the last minute to explain log integrity. Start a 20-day pilot
                now and have cryptographic proof ready before the audit clock becomes painful.
              </p>
            </div>
            <div className="landing-final-cta-grid">
              <article className="card glass-card landing-final-primary">
                <p className="eyebrow">Primary path</p>
                <h3 style={{ marginTop: 8, marginBottom: 12 }}>Start 20-Day Pilot</h3>
                <ul className="landing-list landing-list-compact">
                  <li>No credit card required</li>
                  <li>Full product access</li>
                  <li>Founder-led onboarding</li>
                </ul>
                <div className="button-row" style={{ marginTop: 20 }}>
                  <Link className="btn btn-primary" href="/pilot">
                    Start Pilot
                  </Link>
                </div>
              </article>
              <article className="card glass-card landing-final-secondary">
                <p className="eyebrow">Not ready yet?</p>
                <h3 style={{ marginTop: 8, marginBottom: 12 }}>Take the lower-friction path.</h3>
                <div className="landing-cta-links">
                  <Link href="/docs/getting-started">Read documentation</Link>
                  <Link href="/docs/sdks">Explore SDKs</Link>
                  <Link href="/pricing">See pricing details</Link>
                  <Link href="/contact">Talk to sales</Link>
                </div>
              </article>
            </div>
            <div className="landing-trust-strip">
              <div className="status-pill">No credit card required</div>
              <div className="status-pill">Cancel anytime</div>
              <div className="status-pill">$149 refunded if you convert</div>
              <div className="status-pill">White-glove onboarding included</div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="trust-band">
            <div>
              <p className="eyebrow">Pilot clarity</p>
              <h2>Run the workflow before committing.</h2>
            </div>
            <div>
              <p className="section-lead" style={{ marginBottom: 16 }}>
                Start with a 20-day pilot, prove the evidence flow with your real logs, then expand
                only if it makes audit review meaningfully easier.
              </p>
              <div className="button-row">
                <Link className="btn btn-primary" href="/pilot">
                  Start 20-Day Pilot
                </Link>
                <Link className="btn btn-link" href="/docs/getting-started">
                  View integration path
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <div>
              <p className="eyebrow">Documentation</p>
              <h2>Everything needed to integrate quickly.</h2>
            </div>
          </div>
          <div className="grid grid-3">
            {docsLinks.map((item) => (
              <Link className="card glass-card" href={item.href} key={item.href}>
                <h3>{item.title}</h3>
                <p className="muted" style={{ marginBottom: 0 }}>{item.detail}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
