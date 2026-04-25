import Link from "next/link";
import LandingHeroActions from "@/components/LandingHeroActions";
import LandingThemeLock from "@/components/LandingThemeLock";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import VerifyProofWidget from "@/components/VerifyProofWidget";

const heroSignals = [
  { value: "30 seconds", label: "for an auditor or agent to verify a proof bundle" },
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
  "Independent verification for auditors and autonomous systems",
  "Fast pilot with founder-led onboarding",
];

const proofSteps = [
  {
    step: "Step 1",
    title: "Send your logs",
    benefit: "One API call. Works with CloudTrail, Cloud Logging, GitHub, or any JSON logs.",
    detail: "No schema changes. No new infrastructure. Blocklog sits beside your existing stack.",
  },
  {
    step: "Step 2",
    title: "We create cryptographic proof",
    benefit:
      "Every event gets a deterministic hash chained to its predecessor - making silent log tampering cryptographically detectable, not just policy-detectable.",
    detail: "Runs in the background. No manual review step required.",
  },
  {
    step: "Step 3",
    title: "Give proof to your auditor",
    benefit:
      "Proof endpoints any system can query - including AI agents that need to verify state before acting.",
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
    title: "Give auditors and autonomous systems what they actually need",
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
  "Step-by-step verification path for reviewers, external auditors, and autonomous systems",
];

const securityQuestions = [
  {
    question: "Where is our data stored?",
    answer:
      "Blocklog is designed around proof and audit evidence, not opaque storage claims. Teams can keep raw logs in their own systems while using Blocklog as verification infrastructure for proof bundles and integrity checks.",
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

const founderLinks = [
  { href: "https://github.com/soumyasurana", label: "GitHub" },
  { href: "https://blocklogsecurity.com", label: "blocklogsecurity.com" },
  { href: "mailto:founder@blocklogsecurity.com", label: "founder@blocklogsecurity.com" },
];

const pressurePoints = [
  "The average incident takes 7 hours to diagnose from logs.",
  "Most logs can be edited without detection.",
  "Regulators are starting to ask how you know your logs are real.",
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <LandingThemeLock />
      <main className="container landing-page">
        <section className="hero">
          <div className="hero-copy">
            <div className="hero-copy-inner">
              <div className="hero-badge">
                <span className="hero-badge-dot" />
                Built for security teams, compliance leads, auditors, and autonomous systems
              </div>
              <p className="eyebrow">Cryptographically verifiable audit proof</p>
              <h1>
                <span className="landing-headline-question">Logs are claims.</span>
                <span>Blocklog makes them proof.</span>
              </h1>
              <p className="hero-value-prop">
                Every system that touches money, compliance, or autonomous decisions will need to
                prove its own integrity. That moment is arriving faster than the tooling is.
                Blocklog is the layer being built for it.
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
                <em>
                  Built by a 20-year-old who got tired of watching engineers reconstruct incidents
                  from corrupt logs.
                </em>
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

        <section className="landing-proof-strip" aria-label="Blocklog proof signals">
          🔒 Live MVP · Hash-chained event store · Public API · GitHub open source
        </section>

        <section className="section">
          <article className="card glass-card landing-pressure-card">
            <div className="landing-pressure-layout">
              <div className="landing-pressure-copy">
                <div>
                  <p className="eyebrow">Real-world pressure</p>
                  <h2>
                    The systems running your business are making decisions you{" "}
                    <span>can&apos;t verify.</span>
                  </h2>
                </div>
                <p className="landing-pressure-body">
                  Your CI pipeline deploys at 3am. Your payment processor retries silently. Your AI
                  agent updates a record and moves on. When something breaks - and it will -
                  you&apos;ll open a log file and hope nothing touched it. That hope is not a system.
                  Blocklog is.
                </p>
              </div>
              <div className="landing-pressure-panel">
                <div className="landing-pressure-panel-header">
                  <div>
                    <span className="comparison-label">Audit session</span>
                    <strong>Proof Bundle Verified</strong>
                  </div>
                  <div className="landing-pressure-status">Live verification</div>
                </div>
                <div className="landing-pressure-checks">
                  <div className="landing-pressure-check landing-pressure-check-ok">[OK] log chain intact</div>
                  <div className="landing-pressure-check landing-pressure-check-ok">[OK] timestamp anchored</div>
                  <div className="landing-pressure-check landing-pressure-check-warn">[WARN] source state was previously untrusted</div>
                </div>
                <div className="landing-pressure-console">
                  <div className="landing-pressure-console-row">
                    <span>event_id</span>
                    <strong>evt_29afc11d</strong>
                  </div>
                  <div className="landing-pressure-console-row">
                    <span>batch_id</span>
                    <strong>b_2026_04_25_0314</strong>
                  </div>
                  <div className="landing-pressure-console-row">
                    <span>anchored_at</span>
                    <strong>2026-04-25T03:14:22Z</strong>
                  </div>
                  <div className="landing-pressure-console-row">
                    <span>root_hash</span>
                    <strong>0x8c43...91aa</strong>
                  </div>
                  <div className="landing-pressure-console-row">
                    <span>proof_id</span>
                    <strong>pf_live_00318</strong>
                  </div>
                </div>
              </div>
            </div>
            <div className="landing-pressure-points">
              {pressurePoints.map((item, index) => (
                <div className="landing-pressure-point" key={item}>
                  <span>{`0${index + 1}`}</span>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="section" id="proof-flow">
          <div className="section-header">
            <div>
              <p className="eyebrow">Proof flow</p>
              <h2>A new primitive for verifiable systems. Three lines of code to start.</h2>
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
              <p className="eyebrow">What the auditor and autonomous systems see</p>
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
              <div className="status-pill">No reliance on internal infrastructure</div>
            </div>
          </article>
        </section>

        <section className="section">
          <div className="landing-live-demo-label">[ Live — this is the actual running system ]</div>
          <VerifyProofWidget />
          <p className="landing-live-demo-note">
            Backend live since March 2026. Uptime and hash chain continuity are publicly verifiable.
          </p>
        </section>

        <section className="section">
          <div className="section-header">
            <div>
              <p className="eyebrow">Audit outcomes</p>
              <h2>Why logs needed a trust layer before AI agents made it urgent.</h2>
              <p className="section-lead">
                Compliance teams have lived with unverifiable logs for decades because humans could
                catch obvious tampering. AI agents operating autonomously cannot - they execute on
                whatever state they&apos;re handed. Blocklog is the missing trust primitive.
              </p>
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
              <h2>Built for every layer of the stack - human and automated.</h2>
            </div>
          </div>
          <div className="grid grid-2">
            <article className="card glass-card landing-audience-card">
              <p className="eyebrow">For the systems and agents reading these logs</p>
              <h3 style={{ marginTop: 8 }}>Simple integration</h3>
              <ul className="landing-list">
                {engineerPoints.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
            <article className="card glass-card landing-audience-card">
              <p className="eyebrow">For compliance &amp; security teams</p>
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
              <h2>The same primitive that secures audits secures agentic systems.</h2>
              <p className="section-lead">
                We started with SOC 2 because the pain was obvious and the buyer existed. The same
                hash-chain architecture is the foundation AI agent frameworks will need when they
                have to prove what they did and why.
              </p>
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
              <h2>What teams are cutting with Blocklog.</h2>
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
          <article className="card glass-card landing-builder-card">
            <p className="eyebrow">Founder</p>
            <h2>Why I built this.</h2>
            <div className="landing-builder-copy">
              <p>
                At 2am during a production incident, I watched a senior engineer spend four hours
                reconstructing what happened - not because the logs were missing, but because no
                one could prove they hadn&apos;t been touched. The system had integrity. The logs
                didn&apos;t. We shipped a fix based on a best guess. That&apos;s when I understood the
                actual problem wasn&apos;t debugging. It was trust.
              </p>
              <p>
                Blocklog is a live system. Hash-chained Postgres event store, public REST API,
                running backend, 2 shipped GitHub repos. The architecture is the same one
                append-only databases and certificate transparency logs use - I just put it where
                logs actually live.
              </p>
              <p>
                I&apos;m 20. I don&apos;t have a decade of enterprise sales experience. What I have is a
                system that&apos;s running, a problem that&apos;s getting more urgent as AI agents multiply,
                and the conviction that infrastructure built for autonomous systems needs to be
                designed before those systems are everywhere - not after the first major incident
                proves why.
              </p>
            </div>
            <p className="landing-builder-close">
              Logs were never supposed to be trusted blindly. I&apos;m building the layer that makes
              them trustworthy by default.
            </p>
            <div className="landing-builder-links">
              {founderLinks.map((item) => (
                <a href={item.href} key={item.href}>
                  {item.label}
                </a>
              ))}
            </div>
          </article>
        </section>

        <section className="section">
          <div className="landing-final-cta">
            <div className="landing-final-cta-copy">
              <p className="eyebrow">Final call</p>
              <h2>Your audit is coming. Your agents are already running. Be ready for both.</h2>
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
