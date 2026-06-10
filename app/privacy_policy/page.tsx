export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-12">
        <p className="text-sm uppercase tracking-widest text-zinc-500">
          Legal
        </p>
        <h1 className="mt-3 text-5xl font-bold tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-4 text-zinc-400">
          Effective Date: June 10, 2026
        </p>
      </div>

      <div className="prose prose-invert max-w-none">
        <p>
          This Privacy Policy describes how Blocklog ("we", "us") collects,
          uses, and protects information provided by users and trial
          participants ("you") when using our service at blocklogsecurity.com.
        </p>

        <h2>1. Who We Are</h2>

        <p>
          Blocklog is an early-stage AI forensic debugging and audit
          infrastructure product operated independently by its founder, based
          in Delhi, India, pending formal incorporation. We provide engineering
          and compliance teams with decision-time input snapshots, input
          staleness detection, counterfactual replay, causal chain tracing, and
          forensic audit report generation for AI agents — running in shadow
          mode with no impact on production behaviour.
        </p>

        <p>
          Contact:{" "}
          <a
            href="mailto:founder@blocklogsecurity.com"
            className="text-blue-400 hover:text-blue-300"
          >
            founder@blocklogsecurity.com
          </a>
        </p>

        <h2>2. What Data We Collect</h2>

        <h3>2.1 Information You Provide</h3>

        <ul>
          <li>Email address (when you sign up for a trial or contact us)</li>
          <li>
            Any information you voluntarily share during onboarding or support
            communications
          </li>
        </ul>

        <h3>2.2 Agent Decision and Log Data</h3>

        <p>
          When you integrate Blocklog into your AI systems, we collect the
          forensic and audit data your systems generate and send to our
          service. This may include:
        </p>

        <ul>
          <li>Agent decision records and inference-time input snapshots</li>
          <li>Input freshness timestamps and staleness deltas</li>
          <li>Policy version identifiers active at decision time</li>
          <li>Counterfactual replay outputs and causal chain records</li>
          <li>Approval lineage and checkpoint completion status</li>
          <li>
            Cryptographic hashes, Merkle proofs, and chaining data derived
            from submitted records
          </li>
          <li>
            Timestamps, event identifiers, and metadata associated with log
            entries
          </li>
        </ul>

        <p>
          You are responsible for ensuring that any data submitted to Blocklog
          is appropriate to share with a third-party service. Do not submit
          data containing raw personally identifiable information,
          authentication credentials, payment card data, government
          identification numbers, protected health information, or other
          regulated data. Log metadata, decision records, and agent operational
          data that does not contain the above categories is the intended use
          of the Service.
        </p>

        <h3>2.3 Usage Analytics</h3>

        <p>
          We collect basic operational and usage data to understand how the
          product is being used, including:
        </p>

        <ul>
          <li>API request frequency and volume</li>
          <li>Feature usage patterns</li>
          <li>Error rates and performance metrics</li>
          <li>Service health and reliability metrics</li>
        </ul>

        <h2>3. How We Use Your Data</h2>

        <p>We use the data we collect to:</p>

        <ul>
          <li>Operate and improve the Blocklog service</li>
          <li>Generate forensic audit reports from your submitted data</li>
          <li>Communicate with you about the trial and pilot program</li>
          <li>Diagnose technical issues and monitor system health</li>
          <li>Investigate abuse, fraud, or security incidents</li>
          <li>
            Understand usage patterns to inform product development
          </li>
        </ul>

        <p>We do not sell your data.</p>
        <p>We do not use your data for advertising.</p>

        <h2>4. Legal Basis for Processing</h2>

        <p>
          Where applicable, including for users located in jurisdictions that
          require a legal basis for processing personal data, we process
          information on the following grounds:
        </p>

        <ul>
          <li>
            Performance of a contract or provision of requested services
          </li>
          <li>
            Legitimate interests in operating, securing, and improving the
            Service
          </li>
          <li>Your consent where required by law</li>
          <li>Compliance with legal obligations</li>
        </ul>

        <h2>5. Data Storage and Security</h2>

        <p>
          Data is stored and processed using Amazon Web Services (AWS) cloud
          infrastructure. We implement technical and organisational safeguards
          appropriate for an early-stage software service, including encryption
          in transit, access controls, monitoring, and security best practices.
        </p>

        <p>
          No internet-connected system can be guaranteed to be completely
          secure. We encourage trial and pilot participants not to submit
          sensitive or regulated data during this phase.
        </p>

        <h2>6. International Data Transfers</h2>

        <p>
          Blocklog is operated from India and uses infrastructure that may be
          located in the United States or other jurisdictions. By using the
          Service, you acknowledge that information may be transferred to,
          stored in, and processed in countries outside your country of
          residence, where data protection laws may differ. We take
          commercially reasonable measures to protect data during such
          transfers.
        </p>

        <h2>7. Data Retention</h2>

        <p>
          We retain email and communication data for as long as you are an
          active user and for a reasonable period thereafter.
        </p>

        <p>
          Agent decision records, log data, and forensic report data submitted
          through the API are retained for the duration of your active use of
          the Service unless deletion is requested or operational needs require
          earlier removal.
        </p>

        <p>
          We may retain limited information where necessary to comply with
          legal obligations, resolve disputes, or enforce agreements.
        </p>

        <h2>8. Your Rights</h2>

        <p>You may request:</p>

        <ul>
          <li>Access to the data we hold about you</li>
          <li>Correction of inaccurate data</li>
          <li>Deletion of your data</li>
          <li>Restriction of processing where applicable</li>
          <li>Withdrawal of consent where processing is consent-based</li>
        </ul>

        <p>
          Requests can be sent to:{" "}
          <a
            href="mailto:founder@blocklogsecurity.com"
            className="text-blue-400 hover:text-blue-300"
          >
            founder@blocklogsecurity.com
          </a>
        </p>

        <p>
          We will make commercially reasonable efforts to process requests
          within 30 days.
        </p>

        <h2>9. Third Parties and Service Providers</h2>

        <p>
          We use trusted third-party service providers to operate and improve
          the Service. These providers may process information only as necessary
          to provide their services to Blocklog:
        </p>

        <ul>
          <li>Amazon Web Services (AWS) — cloud infrastructure</li>
          <li>PostHog — product analytics and feature insights</li>
          <li>Sentry — error monitoring and diagnostics</li>
          <li>Resend — transactional email delivery</li>
        </ul>

        <p>
          We do not sell or rent personal information to third parties.
        </p>

        <h2>10. Security Incident Notification</h2>

        <p>
          If we become aware of a material security incident affecting data
          under our control, we will make commercially reasonable efforts to
          notify affected users without undue delay via email, dashboard
          notices, or other appropriate channels. Notifications will include
          information regarding the nature of the incident, affected systems,
          and recommended actions where available.
        </p>

        <h2>11. Children</h2>

        <p>
          Blocklog is not intended for individuals under 18 years of age. We
          do not knowingly collect personal information from minors.
        </p>

        <h2>12. Changes to This Policy</h2>

        <p>
          We may update this Privacy Policy as the Service evolves. Active
          users will be notified of material changes via email at least
          fourteen (14) days before such changes become effective. The
          effective date shown at the top of this document reflects the latest
          version.
        </p>

        <h2>13. Contact</h2>

        <p>
          Questions, requests, or privacy-related concerns may be directed to:
        </p>

        <p>
          <a
            href="mailto:founder@blocklogsecurity.com"
            className="text-blue-400 hover:text-blue-300"
          >
            founder@blocklogsecurity.com
          </a>
        </p>
      </div>
    </div>
  );
}