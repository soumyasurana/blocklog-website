export const metadata = {
  title: "Blocklog Pilot Program – Cryptographic Audit Readiness",
  description:
    "Join the Blocklog pilot program to make your security logs cryptographically verifiable before your next audit.",
};

const ACCENT = "#1F3A5F";

export default function PilotPage() {
  return (
    <main
      style={{
        maxWidth: 980,
        margin: "0 auto",
        padding: "80px 24px 120px",
        lineHeight: 1.7,
      }}
    >
      {/* HERO */}
      <section style={{ marginBottom: 96 }}>
        <h1
          style={{
            fontSize: 44,
            letterSpacing: "-0.025em",
            marginBottom: 24,
            maxWidth: 820,
          }}
        >
          Blocklog Pilot Program
          <br />
          <span style={{ color: ACCENT }}>Audit-ready. Court-verifiable.</span>
        </h1>

        <p style={{ fontSize: 18, maxWidth: 760, color: "#333" }}>
          A 40-day guided deployment to cryptographically harden your security logs
          before SOC-2, ISO-27001, DPDP, or enterprise audits.
        </p>

        <a
          href="https://calendly.com/founder-blocklogsecurity/audit-readiness-call-20-min"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            marginTop: 36,
            padding: "14px 26px",
            backgroundColor: ACCENT,
            color: "#fff",
            textDecoration: "none",
            fontWeight: 600,
            borderRadius: 6,
          }}
        >
          Request pilot access
        </a>
      </section>

      <Divider />

      {/* WHO IT'S FOR */}
      <Section title="Who This Is For">
        <ul>
          <li>FinTech / SaaS companies preparing for audits</li>
          <li>Startups selling to regulated enterprises</li>
          <li>Security teams tired of unverifiable logs</li>
          <li>Founders who need defensible audit evidence</li>
        </ul>
      </Section>

      <Divider />

      {/* WHAT YOU GET */}
      <Section title="What You Get During the Pilot">
        <ul>
          <li>Cryptographically signed & batched logs</li>
          <li>Public blockchain timestamp anchoring</li>
          <li>Independent verification portal</li>
          <li>Policy & compliance engine</li>
          <li>Integrity drift detection</li>
          <li>Evidence export (PDF + JSON)</li>
          <li>CLI verifier tool</li>
          <li>Architecture review session</li>
        </ul>
      </Section>

      <Divider />

      {/* TIMELINE */}
      <Section title="40-Day Pilot Timeline">
        <ol>
          <li><strong>Day 0–3:</strong> Architecture review + integration planning</li>
          <li><strong>Day 4–7:</strong> SDK / API integration</li>
          <li><strong>Week 2:</strong> First cryptographic batch anchored</li>
          <li><strong>Week 3:</strong> Policy engine enabled</li>
          <li><strong>Week 4:</strong> Evidence generation & verification demo</li>
          <li><strong>Day 40:</strong> Final compliance report + production offer</li>
        </ol>
      </Section>

      <Divider />

      {/* INTEGRATION */}
      <Section title="How Integration Works">
        <ol>
          <li>Add Blocklog API endpoint (or local proxy)</li>
          <li>Forward structured logs (JSON)</li>
          <li>Optional origin signing</li>
          <li>Automatic batching + anchoring</li>
          <li>Verifier available publicly</li>
        </ol>

        <p>
          No replacement of your logging system. No data migration. No vendor lock-in.
        </p>
      </Section>

      <Divider />

      {/* EVIDENCE */}
      <Section title="Evidence You Receive">
        <ul>
          <li>Merkle roots</li>
          <li>Blockchain transactions</li>
          <li>Proof-of-absence reports</li>
          <li>Policy violation summaries</li>
          <li>Cryptographic verification bundle</li>
          <li>Chain-of-custody graph</li>
        </ul>
      </Section>

      <Divider />

      {/* REQUIREMENTS */}
      <Section title="Pilot Requirements">
        <ul>
          <li>Structured logs (JSON)</li>
          <li>5k+ logs/day preferred</li>
          <li>Security contact available</li>
          <li>Willing to provide feedback</li>
        </ul>
      </Section>

      <Divider />

      {/* CTA */}
      <section style={{ marginTop: 100 }}>
        <h2
          style={{
            fontSize: 32,
            marginBottom: 18,
            letterSpacing: "-0.015em",
            color: ACCENT,
          }}
        >
          Request Pilot Access
        </h2>

        <p style={{ maxWidth: 640 }}>
          Limited to 10 companies per quarter to ensure deep technical support.
        </p>

        <a
          href="https://calendly.com/founder-blocklogsecurity/audit-readiness-call-20-min"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            marginTop: 24,
            padding: "14px 26px",
            backgroundColor: ACCENT,
            color: "#fff",
            textDecoration: "none",
            fontWeight: 600,
            borderRadius: 6,
          }}
        >
          Book pilot call
        </a>
      </section>
    </main>
  );
}

/* ------------------ Helpers ------------------ */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginBottom: 72 }}>
      <h2
        style={{
          fontSize: 28,
          marginBottom: 18,
          letterSpacing: "-0.015em",
          color: ACCENT,
        }}
      >
        {title}
      </h2>
      <div style={{ maxWidth: 800, color: "#222" }}>{children}</div>
    </section>
  );
}

function Divider() {
  return (
    <div
      style={{
        height: 1,
        backgroundColor: "#eee",
        margin: "72px 0",
      }}
    />
  );
}
