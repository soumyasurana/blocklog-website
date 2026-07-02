"use client";

import Link from "next/link";

function ConceptCard({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">{eyebrow}</p>
      <h2 className="text-lg font-semibold tracking-tight text-white">{title}</h2>
      <div className="mt-3 text-sm leading-7 text-muted sm:text-[15px]">{children}</div>
    </article>
  );
}

function MiniCard({ title, description }: { title: string; description: string }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <h3 className="text-sm font-semibold text-white sm:text-[15px]">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-muted">{description}</p>
    </article>
  );
}

const integrityLayers = [
  { title: "Append-only storage", description: "API endpoints expose no edit or delete operations. The log stream is synchronized to WORM storage." },
  { title: "Cryptographic hash chaining", description: "Logs are chained sequentially, so downstream tampering invalidates the integrity chain." },
  { title: "Merkle batching", description: "Periodic batches build Merkle trees so a single Merkle root can represent and prove inclusion for the batch." },
  { title: "Ed25519 signing", description: "Merkle roots are signed and anchored for long-term verification outside the operational database." },
];

export default function CoreConceptsDocsPage() {
  return (
    <main
      className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
      style={{ position: "relative", zIndex: 1 }}
    >
      <div className="space-y-8">
        <header className="max-w-3xl">
          <p className="eyebrow">Core Concepts</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Decisions, Cryptography, and Accountability
          </h1>
          <p className="mt-4 text-base leading-8 text-muted">
            Understand why Blocklog exists and the cryptographic foundations of tamper-evident audit logging.
          </p>
        </header>

        <section className="grid gap-5 lg:grid-cols-2">
          <ConceptCard eyebrow="Model" title="Observability vs. accountability">
            <p>
              Traditional observability tools such as Datadog and Splunk are optimized for speed, indexing, and operational debugging. That makes them excellent for searchability, but not ideal for non-repudiable evidence when administrators or compromised credentials can still alter log history.
            </p>
            <p className="mt-4">
              Blocklog is designed for <strong>accountability</strong>. The goal is to preserve cryptographic proof of system state, decisions, and actions in a way that remains independently verifiable.
            </p>
          </ConceptCard>

          <ConceptCard eyebrow="Architecture" title="The four layers of integrity">
            <div className="space-y-4">
              {integrityLayers.map((layer) => (
                <div key={layer.title} className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
                  <h3 className="text-sm font-semibold text-white">{layer.title}</h3>
                  <p className="mt-1 text-sm leading-7 text-muted">{layer.description}</p>
                </div>
              ))}
            </div>
          </ConceptCard>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Why this matters</p>
          <p className="max-w-3xl text-sm leading-7 text-muted sm:text-[15px]">
            In AI and automated systems, it is rarely enough to know that something happened. You also need to know what context produced the action, what model or tool influenced it, whether a human approved it, and whether the record can still be verified later without trusting the operational database.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <MiniCard title="Decision logging" description="Decision logs preserve why an action was taken, including inputs, prompts, model versions, outputs, and authorizing actors." />
          <MiniCard title="Cryptographic signing" description="Logs can be signed at the source or during server-side sealing, so verification does not depend on the mutable application database." />
          <MiniCard title="Forensic reconstruction" description="Replay sessions use lineage across events, tool calls, and decisions to help isolate the exact source of an anomaly." />
        </section>

        <nav className="flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row">
          <Link
            className="inline-flex items-center justify-center rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            href="/docs/python-sdk"
          >
            Python SDK Reference
          </Link>
          <Link
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/[0.06]"
            href="/docs/quickstart"
          >
            Quickstart Guide
          </Link>
        </nav>
      </div>
    </main>
  );
}