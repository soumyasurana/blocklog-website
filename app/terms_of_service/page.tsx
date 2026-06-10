export default function TermsOfServicePage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-12">
        <p className="text-sm uppercase tracking-widest text-zinc-500">
          Legal
        </p>
        <h1 className="mt-3 text-5xl font-bold tracking-tight">
          Terms of Service
        </h1>
        <p className="mt-4 text-zinc-400">
          Effective Date: June 10, 2026
        </p>
      </div>

      <div className="prose prose-invert max-w-none">
        <p>
          These Terms of Service ("Terms") govern your access to and use of
          Blocklog's website and services ("Service"). By signing up for the
          free trial or pilot program, or by using the Service in any way, you
          agree to these Terms.
        </p>

        <h2>1. The Service</h2>

        <p>
          Blocklog is an early-stage AI forensic debugging and audit
          infrastructure product operated independently by its founder, based
          in Delhi, India, pending formal incorporation. The Service allows
          engineering and compliance teams to capture decision-time input
          snapshots from AI agents, detect input staleness at inference time,
          replay counterfactual scenarios, trace multi-step causal chains, and
          generate forensic audit reports from production data.
        </p>

        <p>
          Blocklog operates in shadow mode — running parallel to your AI
          agent without modifying production behaviour. The Service is
          currently in an early trial phase. A free 14-day trial is available,
          after which continued access may require a paid plan.
        </p>

        <h2>2. Eligibility</h2>

        <p>
          You must be at least 18 years old and have the authority to accept
          these Terms on behalf of yourself or your organisation. By using the
          Service, you represent that you meet these requirements.
        </p>

        <h2>3. Trial and Pilot Program</h2>

        <p>
          Access to Blocklog during the free trial and pilot phase is:
        </p>

        <ul>
          <li>Free of charge for 14 days from the date of sign-up</li>
          <li>Subject to approval at our discretion</li>
          <li>
            Limited in scope — we may cap usage, restrict features, or modify
            access with reasonable notice
          </li>
          <li>
            Not guaranteed to continue — the trial may transition to a paid
            product at any time, with reasonable notice provided to active
            participants
          </li>
        </ul>

        <p>
          We will provide reasonable notice before terminating or significantly
          changing trial or pilot access.
        </p>

        <h2>4. Acceptable Use</h2>

        <p>You agree not to:</p>

        <ul>
          <li>
            Submit raw personally identifiable information, authentication
            credentials, payment card data, government identification numbers,
            or protected health information
          </li>
          <li>
            Attempt to reverse-engineer, exploit, or stress-test the Service
            without written permission
          </li>
          <li>Use the Service for any unlawful purpose</li>
          <li>Resell or sublicense access to the Service</li>
          <li>Misrepresent your affiliation with Blocklog</li>
        </ul>

        <p>
          You must not submit any of the following data types to the Service:
        </p>

        <ul>
          <li>Passwords or authentication credentials</li>
          <li>API keys or authentication tokens</li>
          <li>Payment card numbers or CVVs</li>
          <li>Government identification numbers</li>
          <li>Protected health information</li>
          <li>
            Any data regulated under GDPR special categories, HIPAA, PCI-DSS,
            or equivalent frameworks, unless appropriately anonymised or
            tokenised prior to submission
          </li>
        </ul>

        <p>
          Log metadata, agent decision records, input freshness timestamps,
          policy version identifiers, and counterfactual outputs that do not
          contain the above categories are permitted and are the intended use
          of the Service.
        </p>

        <p>
          We reserve the right to suspend access for violations of these Terms
          without prior notice.
        </p>

        <h2>5. Data You Submit</h2>

        <p>
          You retain ownership of any log data you submit to the Service. By
          submitting data, you grant Blocklog a limited licence to store,
          process, and use that data solely for the purpose of operating and
          improving the Service.
        </p>

        <p>
          You are responsible for ensuring you have the right to submit any
          data you send to the Service, and that doing so does not violate any
          applicable laws or third-party rights.
        </p>

        <h2>6. Regulatory Use and Compliance</h2>

        <p>
          Blocklog generates forensic audit reports intended to support
          compliance workflows under frameworks including the EU AI Act
          (Article 12), SR 11-7, DORA, and the Colorado AI Act.
        </p>

        <p>
          However, Blocklog does not guarantee that any report, log record,
          cryptographic proof, hash, chain, Merkle root, or verification
          artifact will satisfy the specific requirements of any regulator,
          auditor, or legal authority in your jurisdiction. You are responsible
          for confirming that Blocklog's outputs meet your applicable
          compliance obligations before relying on them for regulatory
          submissions.
        </p>

        <p>
          The existence of a Blocklog forensic report does not constitute legal
          proof, compliance certification, or regulatory approval by any
          authority.
        </p>

        <h2>7. Feedback</h2>

        <p>
          As a trial or pilot participant, you may provide feedback, bug
          reports, or suggestions. You agree that we may use this feedback to
          improve the Service without compensation or attribution obligations
          to you.
        </p>

        <h2>8. Intellectual Property</h2>

        <p>
          All intellectual property in the Blocklog Service — including
          software, architecture, documentation, and brand — belongs to
          Blocklog. These Terms do not grant you any rights to our IP beyond
          what is necessary to use the Service.
        </p>

        <h2>9. Beta Software Acknowledgement</h2>

        <p>
          You acknowledge that Blocklog is an early-stage product and may
          contain bugs, errors, security vulnerabilities, or other defects that
          have not yet been identified.
        </p>

        <p>
          Features, APIs, documentation, data models, retention policies, and
          system behaviour may change without notice as the product evolves.
        </p>

        <p>
          You agree to evaluate the Service at your own discretion and not rely
          on it as your sole audit, logging, forensic, or compliance system for
          production-critical or safety-critical workloads.
        </p>

        <h2>10. Service Availability</h2>

        <p>
          The Service may experience interruptions, maintenance windows, data
          loss incidents, or operational instability during the trial and pilot
          phase. We do not guarantee any specific level of uptime, availability,
          throughput, retention, or recovery capability.
        </p>

        <p>
          You remain responsible for maintaining independent backups and
          operational controls appropriate to your environment.
        </p>

        <h2>11. Disclaimer of Warranties</h2>

        <p className="font-medium uppercase">
          THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES
          OF ANY KIND, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE.
        </p>

        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, BLOCKLOG DISCLAIMS ALL
          IMPLIED WARRANTIES INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR
          PURPOSE, NON-INFRINGEMENT, ACCURACY, RELIABILITY, AND AVAILABILITY.
        </p>

        <p>
          While we implement security measures appropriate for an early-stage
          service, no internet-based system can be guaranteed completely secure.
        </p>

        <h2>12. Limitation of Liability</h2>

        <p className="font-medium uppercase">
          TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, BLOCKLOG SHALL NOT
          BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL,
          EXEMPLARY, OR PUNITIVE DAMAGES.
        </p>

        <p>
          THIS LIMITATION INCLUDES LOSS OF PROFITS, REVENUE, GOODWILL, DATA,
          BUSINESS INTERRUPTION, SECURITY INCIDENTS, REGULATORY PENALTIES, OR
          PROCUREMENT OF SUBSTITUTE SERVICES.
        </p>

        <p>
          Our total aggregate liability arising from or related to the Service
          shall not exceed the total amount paid by you to Blocklog during the
          twelve (12) months immediately preceding the event giving rise to the
          claim. During the free trial phase, that amount will typically be
          zero.
        </p>

        <h2>13. Security Incidents and Force Majeure</h2>

        <p>
          We will use commercially reasonable efforts to respond to material
          security incidents affecting the Service.
        </p>

        <p>
          Blocklog shall not be liable for failures or delays caused by events
          beyond our reasonable control, including internet outages, cloud
          provider failures, denial-of-service attacks, natural disasters,
          labour disputes, government actions, wars, pandemics, or other force
          majeure events.
        </p>

        <h2>14. Export Controls and Sanctions</h2>

        <p>
          You represent that neither you nor your organisation is subject to
          applicable sanctions, export restrictions, or trade prohibitions
          imposed by any relevant governmental authority.
        </p>

        <p>
          You agree not to use the Service in violation of applicable export
          control or sanctions laws.
        </p>

        <h2>15. Termination</h2>

        <p>
          Either party may terminate access to the Service at any time.
        </p>

        <p>
          You may stop using the Service and request deletion of your data. We
          will make commercially reasonable efforts to process deletion requests
          within thirty (30) days.
        </p>

        <p>
          We may suspend or terminate access for violation of these Terms,
          security concerns, abuse of the Service, legal requirements, or
          operational reasons.
        </p>

        <h2>16. Governing Law</h2>

        <p>
          These Terms are governed by the laws of India without regard to
          conflict of law principles. Any disputes arising under or relating to
          these Terms shall be subject to the exclusive jurisdiction of the
          courts located in Delhi, India.
        </p>

        <h2>17. Changes to These Terms</h2>

        <p>
          We may update these Terms as the product, infrastructure, business,
          and legal requirements evolve. Active trial and pilot participants
          will receive notice of material changes via email at least fourteen
          (14) days before such changes become effective.
        </p>

        <h2>18. Contact</h2>

        <p>
          Questions regarding these Terms may be directed to:
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