"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import DashboardTopBar from "@/components/DashboardTopBar";
import { blocklogRequest, normalizePayload } from "@/lib/blocklog";

type VerifyResult = {
  exists?: boolean;
  hash_valid?: boolean;
  timestamp_anchored?: boolean;
  integrity?: string;
  verified_at?: string;
  anchor_tx?: string;
  merkle_proof_valid?: boolean;
  batch_id?: string;
};

type VerifyLookupType = "proof_id" | "log_id" | "batch_id";
type VerificationTab = "verify" | "auditor";
type ExportProofResponse = {
  logs?: { log_id: string; created_at: string; payload_hash: string; chain_hash: string }[];
};
type CurrentUserResponse = {
  email?: string;
};
type LogDetails = {
  log_id: string;
  company_id: string;
  event_type: string;
  source: string;
  payload: Record<string, unknown>;
  payload_hash?: string;
  previous_hash?: string;
  chain_hash: string;
  batch_id?: string;
  created_at: string;
};

const defaultResult: VerifyResult = {
  exists: true,
  hash_valid: true,
  timestamp_anchored: true,
  integrity: "VALID",
};

const verifyScript = `import { createHash } from "node:crypto";
import fs from "node:fs";

const file = process.argv[2];
const logs = JSON.parse(fs.readFileSync(file, "utf8"));

for (const log of logs) {
  if (log.payload) {
    const digest = createHash("sha256")
      .update(JSON.stringify(log.payload))
      .digest("hex");
    console.log(
      \`\\n[\${log.log_id}]\`,
      digest === log.payload_hash ? "payload-ok" : "payload-mismatch",
    );
  } else {
    console.log(\`\\n[\${log.log_id}]\`, "metadata-only bundle");
  }
}`;

const lookupOptions: Array<{
  value: VerifyLookupType;
  label: string;
  helper: string;
  example: string;
}> = [
  {
    value: "proof_id",
    label: "Proof ID",
    helper: "Best for public proof checks after anchoring.",
    example: "proof_demo_1",
  },
  {
    value: "log_id",
    label: "Log ID",
    helper: "Use a single event identifier from the audit trail.",
    example: "log_10021",
  },
  {
    value: "batch_id",
    label: "Batch ID",
    helper: "Validate an anchored sealing batch end to end.",
    example: "batch_demo_1",
  },
];

export default function VerificationToolsPage() {
  const [activeTab, setActiveTab] = useState<VerificationTab>("verify");
  const [lookupType, setLookupType] = useState<VerifyLookupType>("proof_id");
  const [lookupValue, setLookupValue] = useState("");
  const [result, setResult] = useState<VerifyResult>(defaultResult);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloadRange, setDownloadRange] = useState({
    from: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    to: new Date().toISOString().slice(0, 16),
  });
  const [reauthPassword, setReauthPassword] = useState("");
  const [bundleLoading, setBundleLoading] = useState(false);

  const endpointLabel =
    lookupType === "proof_id"
      ? "proof ID returned after anchoring"
      : lookupType === "log_id"
        ? "log ID"
        : "batch ID";

  const exampleValue =
    lookupType === "proof_id"
      ? "proof_demo_1"
      : lookupType === "log_id"
        ? "log_10021"
        : "batch_demo_1";

  function getLookupPath() {
    const value = encodeURIComponent(lookupValue.trim());
    if (lookupType === "log_id") return `/verify/log/${value}`;
    if (lookupType === "batch_id") return `/verify/batch/${value}`;
    return `/public/verify/${value}`;
  }

  function normalizeVerifyResult(payload: VerifyResult | null | undefined): VerifyResult {
    if (!payload) {
      return defaultResult;
    }

    const extendedPayload = payload as VerifyResult & {
      chain_valid?: boolean;
      time_attestation?: { anchored?: boolean; anchored_at?: string };
      anchor_proof?: { anchor_tx?: string; batch_id?: string };
      anchored?: boolean;
    };
    const exists = payload.exists ?? (payload.integrity ? payload.integrity !== "NOT_FOUND" : true);
    const hashValid =
      payload.hash_valid ??
      payload.merkle_proof_valid ??
      extendedPayload.chain_valid ??
      payload.integrity !== "INVALID";
    const timestampAnchored =
      payload.timestamp_anchored ??
      extendedPayload.time_attestation?.anchored ??
      extendedPayload.anchored ??
      (typeof payload.anchor_tx === "string" ? true : undefined);

    return {
      ...payload,
      exists,
      hash_valid: hashValid,
      merkle_proof_valid: payload.merkle_proof_valid ?? hashValid,
      timestamp_anchored: timestampAnchored,
      verified_at: payload.verified_at ?? extendedPayload.time_attestation?.anchored_at,
      anchor_tx: payload.anchor_tx ?? extendedPayload.anchor_proof?.anchor_tx,
      batch_id: payload.batch_id ?? extendedPayload.anchor_proof?.batch_id,
      integrity:
        payload.integrity ??
        (exists === false ? "NOT_FOUND" : hashValid === false ? "INVALID" : "VALID"),
    };
  }

  async function verifyLookup() {
    if (lookupType === "log_id") {
      try {
        return await blocklogRequest<VerifyResult | { data?: VerifyResult }>(getLookupPath());
      } catch {
        return blocklogRequest<VerifyResult | { data?: VerifyResult }>(
          `/logs/${encodeURIComponent(lookupValue.trim())}/verify`,
        );
      }
    }

    return blocklogRequest<VerifyResult | { data?: VerifyResult }>(getLookupPath());
  }

  function downloadJson(filename: string, data: unknown) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function downloadText(filename: string, text: string) {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function downloadAuditBundle(includePayloads: boolean) {
    setBundleLoading(true);
    setError(null);
    setNotice(null);

    try {
      if (!reauthPassword.trim()) {
        throw new Error("Re-enter your password to unlock the auditor bundle.");
      }

      const currentUser = normalizePayload<CurrentUserResponse>(
        await blocklogRequest<CurrentUserResponse | { data?: CurrentUserResponse }>("/auth/me"),
        {},
        "data",
      );

      if (!currentUser.email) {
        throw new Error("Unable to confirm the current user email for re-authentication.");
      }

      await blocklogRequest("/auth/login", "POST", {
        email: currentUser.email,
        password: reauthPassword,
      });

      const fromIso = new Date(downloadRange.from).toISOString();
      const toIso = new Date(downloadRange.to).toISOString();
      const proof = await blocklogRequest<ExportProofResponse>(
        `/logs/export-proof?from=${encodeURIComponent(fromIso)}&to=${encodeURIComponent(toIso)}`,
      );

      const logs = proof.logs ?? [];
      const details = await Promise.all(
        logs.map((entry) => blocklogRequest<LogDetails>(`/logs/${entry.log_id}`)),
      );

      const bundle = details.map((detail) => ({
        log_id: detail.log_id,
        company_id: detail.company_id,
        event_type: detail.event_type,
        source: detail.source,
        payload_hash: detail.payload_hash,
        previous_hash: detail.previous_hash,
        chain_hash: detail.chain_hash,
        batch_id: detail.batch_id,
        created_at: detail.created_at,
        ...(includePayloads ? { payload: detail.payload } : {}),
      }));

      downloadJson(
        includePayloads ? "blocklog-audit-bundle-with-payloads.json" : "blocklog-audit-bundle-without-payloads.json",
        bundle,
      );
      downloadText("blocklog-verify-script.mjs", verifyScript);
      setNotice(
        includePayloads
          ? "Downloaded auditor bundle with payloads and verification script."
          : "Downloaded auditor bundle without payloads and verification script.",
      );
      setReauthPassword("");
    } catch (downloadError) {
      setError(downloadError instanceof Error ? downloadError.message : "Failed to download auditor bundle");
    } finally {
      setBundleLoading(false);
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);

    try {
      if (!lookupValue.trim()) {
        throw new Error(`Enter the ${endpointLabel}.`);
      }
      const response = await verifyLookup();
      setResult(normalizeVerifyResult(normalizePayload<VerifyResult>(response, defaultResult, "data")));
      setNotice("Verification complete.");
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Verification request failed",
      );
    } finally {
      setLoading(false);
    }
  }

  const checks = [
    ["Log exists", result.exists],
    ["Hash valid", result.hash_valid],
    ["Timestamp anchored", result.timestamp_anchored],
  ] as const;

  const integrityTone =
    result.integrity === "VALID"
      ? "Verified"
      : result.integrity === "NOT_FOUND"
        ? "Not found"
        : "Needs review";

  return (
    <>
      <DashboardTopBar title="Verification Tool" />
      <section className="verification-console">
        <div className="verification-tabs">
          <button
            className={`verification-tab ${activeTab === "verify" ? "active" : ""}`}
            type="button"
            onClick={() => setActiveTab("verify")}
          >
            Verify Integrity
          </button>
          <button
            className={`verification-tab ${activeTab === "auditor" ? "active" : ""}`}
            type="button"
            onClick={() => setActiveTab("auditor")}
          >
            Auditor Bundle
          </button>
        </div>

        {activeTab === "verify" ? (
          <section className="verification-stage">
            <form className="card glass-card verification-entry-card" onSubmit={onSubmit}>
              <div className="verification-intro">
                <div>
                  <p className="eyebrow">Verification workflow</p>
                  <h2 style={{ marginTop: 8 }}>Run a cryptographic integrity check in seconds.</h2>
                  <p className="muted" style={{ marginTop: 0 }}>
                    Resolve a proof, log, or batch directly from the console and get an auditor-ready
                    verdict with anchor context, Merkle validity, and verification timing.
                  </p>
                </div>
                <div className="verification-scoreboard">
                  <div className="verification-score">
                    <span className="verification-score-label">Current verdict</span>
                    <strong>{integrityTone}</strong>
                  </div>
                  <div className="verification-score">
                    <span className="verification-score-label">Identifier mode</span>
                    <strong>{lookupType.replace("_", " ").toUpperCase()}</strong>
                  </div>
                </div>
              </div>

              <div className="verification-mode-grid">
                {lookupOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`verification-mode-card ${lookupType === option.value ? "active" : ""}`}
                    type="button"
                    onClick={() => setLookupType(option.value)}
                  >
                    <strong>{option.label}</strong>
                    <span>{option.helper}</span>
                    <code>{option.example}</code>
                  </button>
                ))}
              </div>

              <div className="verify-console-banner">
                <span className="verify-console-label">Expected input</span>
                <code>{exampleValue}</code>
                <span className="muted">
                  {lookupType === "proof_id"
                    ? "Paste your real `proof_id` exactly as returned after anchoring."
                    : lookupType === "log_id"
                      ? "Paste a real `log_id` from the audit trail."
                      : "Paste a real `batch_id` from the batch pipeline."}
                </span>
              </div>
              <div className="form">
                <div>
                  <label>Lookup type</label>
                  <select
                    value={lookupType}
                    onChange={(event) => setLookupType(event.target.value as VerifyLookupType)}
                  >
                    <option value="proof_id">Proof ID</option>
                    <option value="log_id">Log ID</option>
                    <option value="batch_id">Batch ID</option>
                  </select>
                </div>
                <div>
                  <label>{`Paste your ${endpointLabel}`}</label>
                  <input
                    placeholder={exampleValue}
                    value={lookupValue}
                    onChange={(event) => setLookupValue(event.target.value)}
                  />
                  <p className="input-caption">
                    Use the identifier exactly as returned by the ingestion, seal, or anchoring workflow.
                  </p>
                </div>
                <div className="button-row">
                  <button className="btn btn-primary" type="submit" disabled={loading}>
                    {loading ? "Verifying..." : "Verify Integrity"}
                  </button>
                  <Link className="btn" href="/docs/verification">
                    API docs
                  </Link>
                  <Link className="btn" href="/docs/getting-started">
                    Quick start
                  </Link>
                </div>
              </div>
            </form>

            <section className="verification-main-grid">
              <section className="card glass-card">
                <div className="verification-result-header">
                  <div>
                    <p className="eyebrow">Result</p>
                    <h2 style={{ marginTop: 8 }}>Integrity decision</h2>
                  </div>
                  <div className={`status-pill ${result.integrity === "VALID" ? "status-valid" : "status-invalid"}`}>
                    Integrity: {result.integrity ?? "UNKNOWN"}
                  </div>
                </div>
                <div className="verification-hero-card">
                  <div>
                    <span className="verification-hero-label">Verification status</span>
                    <h3>{integrityTone}</h3>
                    <p className="muted">
                      {result.integrity === "VALID"
                        ? "The selected record resolved successfully and the chain of proof is intact."
                        : result.integrity === "NOT_FOUND"
                          ? "No verifiable record was found for this identifier in the configured environment."
                          : "At least one integrity signal needs review before this record can be trusted."}
                    </p>
                  </div>
                  <div className="verification-signal-grid">
                    <div className="verification-signal">
                      <span>Merkle</span>
                      <strong>{result.hash_valid ? "Valid" : "Check required"}</strong>
                    </div>
                    <div className="verification-signal">
                      <span>Anchor</span>
                      <strong>{result.timestamp_anchored ? "Anchored" : "Pending"}</strong>
                    </div>
                    <div className="verification-signal">
                      <span>Object</span>
                      <strong>{result.exists ? "Located" : "Missing"}</strong>
                    </div>
                  </div>
                </div>
                <div className="verification-check-grid" style={{ marginTop: 18 }}>
                  {checks.map(([label, value]) => (
                    <article className="orbital-card" key={label}>
                      <strong>{label === "Hash valid" ? "Merkle proof valid" : label}</strong>
                      <p
                        style={{
                          marginBottom: 0,
                          color: value ? "var(--success)" : "var(--danger)",
                          fontWeight: 700,
                        }}
                      >
                        {value ? "Verified" : "Not verified"}
                      </p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="card glass-card">
                <p className="eyebrow">Trace</p>
                <h2 style={{ marginTop: 8 }}>Resolution trace</h2>
                <div className="terminal-pane" style={{ marginTop: 18 }}>
                  <div className="terminal-pane-header">Verification flow</div>
                  <pre className="terminal-output">{`1. Resolve the selected identifier type
2. Load proof, log, or batch verification data
3. Recompute inclusion state and Merkle validity
4. Check anchor timestamp and transaction proof
5. Return the final integrity verdict`}</pre>
                </div>
                <div className="verification-metadata-grid verification-metadata-tall" style={{ marginTop: 18 }}>
                  <article className="orbital-card">
                    <strong>Verified at</strong>
                    <p>{result.verified_at ? new Date(result.verified_at).toISOString() : "Pending"}</p>
                  </article>
                  <article className="orbital-card">
                    <strong>Anchor transaction</strong>
                    <p>{result.anchor_tx ?? "Available after anchoring"}</p>
                  </article>
                  <article className="orbital-card">
                    <strong>Batch reference</strong>
                    <p>{result.batch_id ?? "Resolved from proof graph"}</p>
                  </article>
                </div>
              </section>
            </section>
          </section>
        ) : (
          <section className="auditor-shell">
            <section className="card glass-card auditor-panel">
              <p className="eyebrow">Auditor bundle</p>
              <h2 style={{ marginTop: 8 }}>Download a sealed review package.</h2>
              <p className="muted" style={{ marginTop: 0 }}>
                Export logs with or without payloads, and require a password check before release.
                This keeps the auditor workflow separate from day-to-day verification.
              </p>
              <div className="auditor-security-banner">
                <strong>Security checkpoint</strong>
                <span className="muted">
                  Re-enter your password before the bundle, proof data, and local verification script can be downloaded.
                </span>
              </div>
              <div className="form">
                <div>
                  <label>From</label>
                  <input
                    type="datetime-local"
                    value={downloadRange.from}
                    onChange={(event) =>
                      setDownloadRange((current) => ({ ...current, from: event.target.value }))
                    }
                  />
                </div>
                <div>
                  <label>To</label>
                  <input
                    type="datetime-local"
                    value={downloadRange.to}
                    onChange={(event) =>
                      setDownloadRange((current) => ({ ...current, to: event.target.value }))
                    }
                  />
                </div>
                <div>
                  <label>Re-enter password</label>
                  <input
                    type="password"
                    placeholder="Confirm your password"
                    value={reauthPassword}
                    onChange={(event) => setReauthPassword(event.target.value)}
                  />
                </div>
                <div className="button-row">
                  <button
                    className="btn btn-primary"
                    type="button"
                    disabled={bundleLoading}
                    onClick={() => downloadAuditBundle(true)}
                  >
                    {bundleLoading ? "Preparing..." : "Download Logs With Payloads"}
                  </button>
                  <button
                    className="btn"
                    type="button"
                    disabled={bundleLoading}
                    onClick={() => downloadAuditBundle(false)}
                  >
                    Download Logs Without Payloads
                  </button>
                </div>
              </div>
            </section>

            <section className="card glass-card auditor-panel">
              <p className="eyebrow">Verification script</p>
              <h2 style={{ marginTop: 8 }}>Run local validation in one step.</h2>
              <p className="muted" style={{ marginTop: 0 }}>
                Auditors can use the exported JSON and this script to independently validate payload hashes outside the Blocklog console.
              </p>
              <div className="terminal-pane" style={{ marginTop: 18 }}>
                <div className="terminal-pane-header">Auditor verification script</div>
                <pre className="terminal-output">{verifyScript}</pre>
              </div>
            </section>
          </section>
        )}
      </section>

      {error && <p className="error-banner" style={{ marginTop: 16 }}>Live API unavailable: {error}</p>}
      {notice && <p className="notice" style={{ marginTop: 16 }}>{notice}</p>}
    </>
  );
}
