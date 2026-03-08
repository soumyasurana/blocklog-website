export const metadata = {
  title: "Blocklog Security Architecture",
  description:
    "Cryptographic threat model, integrity guarantees, and verification design for tamper-proof audit logs.",
};

const ACCENT = "#1F3A5F";

export default function SecurityPage() {
  return (
    <main
      style={{
        maxWidth: 1100,
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
            maxWidth: 900,
          }}
        >
          Security architecture &
          <br />
          <span style={{ color: ACCENT }}>
            cryptographic guarantees
          </span>
        </h1>

        <p style={{ fontSize: 18, maxWidth: 760, color: "#333" }}>
          Blocklog is designed as audit-grade cryptographic infrastructure.
          This document describes the threat model, integrity guarantees, and
          independent verification design.
        </p>
      </section>

      <Divider />

      <Section title="Threat model">
        <ul>
          <li>Malicious or compromised administrators</li>
          <li>Insider tampering of logs</li>
          <li>Post-incident log rewriting</li>
          <li>Backdated or fabricated audit evidence</li>
          <li>Vendor compromise or disappearance</li>
          <li>Database-level manipulation</li>
        </ul>
      </Section>

      <Divider />

      <Section title="Security goals">
        <ul>
          <li>Detect any modification, deletion, or reordering of logs</li>
          <li>Prove when data existed (public timestamp)</li>
          <li>Allow verification without trusting Blocklog</li>
          <li>Preserve evidence indefinitely</li>
          <li>Enable deterministic replay</li>
        </ul>
      </Section>

      <Divider />

      <Section title="Cryptographic design">
        <ul>
          <li>Deterministic canonical log serialization</li>
          <li>SHA-256 hashing</li>
          <li>Merkle tree batching</li>
          <li>Batch hash chaining</li>
          <li>Public blockchain anchoring</li>
          <li>Independent verification CLI</li>
        </ul>
      </Section>

      <Divider />

      <Section title="Batch integrity pipeline">
        <ol>
          <li>Logs are canonicalized into deterministic JSON</li>
          <li>Each log is hashed using SHA-256</li>
          <li>Hashes are combined into a Merkle tree</li>
          <li>The Merkle root becomes the batch hash</li>
          <li>The batch hash commits to the previous batch</li>
          <li>The final hash is anchored on a public blockchain</li>
        </ol>
      </Section>

      <Divider />

      <Section title="Tamper detection guarantees">
        <ul>
          <li>Single-bit modification changes Merkle root</li>
          <li>Deleted logs invalidate the tree</li>
          <li>Inserted logs change batch hash</li>
          <li>Reordering logs changes canonical serialization</li>
          <li>Missing batches break the hash chain</li>
          <li>Backdating is cryptographically impossible</li>
        </ul>
      </Section>

      <Divider />

      <Section title="Independence from Blocklog">
        <p>
          Verification does not require:
        </p>
        <ul>
          <li>Blocklog servers</li>
          <li>Blocklog APIs</li>
          <li>Blocklog databases</li>
          <li>Blocklog keys</li>
        </ul>

        <p>
          Any third party can independently verify batches using:
        </p>
        <ul>
          <li>The public blockchain</li>
          <li>The open verification algorithm</li>
          <li>The exported batch data</li>
        </ul>
      </Section>

      <Divider />

      <Section title="Key management">
        <ul>
          <li>No customer private keys required</li>
          <li>Optional HSM / KMS signing for enterprise</li>
          <li>Anchoring transactions use segregated wallets</li>
          <li>Key rotation supported</li>
        </ul>
      </Section>

      <Divider />

      <Section title="Data handling & privacy">
        <ul>
          <li>Blocklog never modifies original logs</li>
          <li>Only hashes are anchored on-chain</li>
          <li>No PII is written to the blockchain</li>
          <li>Optional local hashing proxy for air-gapped environments</li>
        </ul>
      </Section>

      <Divider />

      <Section title="Compliance alignment">
        <ul>
          <li>SOC 2 evidence immutability requirements</li>
          <li>ISO 27001 audit trails</li>
          <li>DPDP Act (India) forensic readiness</li>
          <li>GDPR accountability principle</li>
          <li>HIPAA audit integrity</li>
        </ul>
      </Section>

      <Divider />

      <Section title="Limitations">
        <ul>
          <li>Blocklog does not prevent logs from being falsified at source</li>
          <li>Blocklog does not validate business correctness</li>
          <li>Blocklog does not replace SIEM or log storage</li>
        </ul>

        <p>
          Blocklog proves whether stored logs were altered after ingestion.
        </p>
      </Section>

      <Divider />

      <Section title="Security contact">
        <p>
          For security issues or vulnerability disclosure:
        </p>
        <p>
          <a href="mailto:founder@blocklogsecurity.com" style={{ color: ACCENT }}>
            security@blocklogsecurity.com
          </a>
        </p>
      </Section>
    </main>
  );
}

/* ---------- Helpers ---------- */

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
      <div style={{ maxWidth: 820, color: "#222" }}>{children}</div>
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
