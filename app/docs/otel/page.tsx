"use client";

import Link from "next/link";

// Code samples

const envConfig = `OTEL_ENABLED=true
OTEL_EXPORTER_OTLP_ENDPOINT=http://your-collector:4317`;

const envFull = `# Endpoint — where your collector is listening
OTEL_EXPORTER_OTLP_ENDPOINT=http://your-collector:4317

# Protocol — "grpc" (default) or "http"
OTEL_EXPORTER_PROTOCOL=grpc

# Auth header, if your collector requires it
OTEL_EXPORTER_OTLP_HEADERS=Authorization=Bearer <token>

# Sampling — fraction of traces to record (0.0–1.0, default 1.0)
OTEL_TRACES_SAMPLE_RATE=0.2

# How often metrics are pushed, in milliseconds (default 60000)
OTEL_METRICS_EXPORT_INTERVAL_MS=60000`;

const dockerCompose = `services:
  blocklog:
    image: blocklog/blocklog:latest
    environment:
      OTEL_ENABLED: "true"
      OTEL_EXPORTER_OTLP_ENDPOINT: "http://otel-collector:4317"
      OTEL_SERVICE_NAME: "blocklog"`;

const grafanaAgentConfig = `# grafana-agent.yaml (River syntax)
otelcol.receiver.otlp "default" {
  grpc { endpoint = "0.0.0.0:4317" }
  http { endpoint = "0.0.0.0:4318" }

  output {
    traces  = [otelcol.exporter.otlp.tempo.input]
    metrics = [otelcol.exporter.prometheus.default.input]
    logs    = [otelcol.exporter.loki.default.input]
  }
}`;

const collectorYaml = `# otel-collector-config.yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318

exporters:
  # Replace with your backend — Jaeger, Datadog, Honeycomb, etc.
  otlp/jaeger:
    endpoint: jaeger:4317
    tls:
      insecure: true

service:
  pipelines:
    traces:
      receivers: [otlp]
      exporters: [otlp/jaeger]
    metrics:
      receivers: [otlp]
      exporters: [otlp/jaeger]
    logs:
      receivers: [otlp]
      exporters: [otlp/jaeger]`;

// Sub-components

function CodeBlock({ code, filename }: { code: string; filename?: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10">
      {filename && (
        <div className="border-b border-white/10 bg-white/[0.04] px-4 py-2">
          <span className="font-mono text-[11px] text-zinc-500">{filename}</span>
        </div>
      )}
      <pre className="overflow-x-auto bg-black/30 p-4 text-sm leading-6 text-zinc-200 sm:p-5">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function StepCard({
  step,
  title,
  description,
  children,
}: {
  step: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
        {step}
      </p>
      <h2 className="text-base font-semibold tracking-tight text-white sm:text-lg">{title}</h2>
      <p className="mt-2 text-sm leading-7 text-muted sm:text-[15px]">{description}</p>
      <div className="mt-4">{children}</div>
    </article>
  );
}

function SignalBadge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]"
      style={{ borderColor: `${color}40`, color, backgroundColor: `${color}12` }}
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[13px] text-zinc-200">
      {children}
    </code>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
      {children}
    </p>
  );
}

function Callout({
  type = "info",
  children,
}: {
  type?: "info" | "warning";
  children: React.ReactNode;
}) {
  const styles =
    type === "warning"
      ? { border: "#f59e0b40", bg: "#f59e0b08", icon: "⚠" }
      : { border: "#818cf840", bg: "#818cf808", icon: "ℹ" };

  return (
    <div
      className="mt-4 flex gap-3 rounded-xl border p-4 text-sm leading-7 text-muted"
      style={{ borderColor: styles.border, backgroundColor: styles.bg }}
    >
      <span className="mt-0.5 shrink-0 text-base leading-6">{styles.icon}</span>
      <div>{children}</div>
    </div>
  );
}

// Telemetry that ships

const signals = [
  {
    label: "Traces",
    color: "#818cf8",
    description: "Every API request, database query, cache operation, and background job — linked across services into full end-to-end traces.",
  },
  {
    label: "Metrics",
    color: "#34d399",
    description: "Request rates, error rates, latency histograms, and log ingestion counts — exported on a 60-second interval by default.",
  },
  {
    label: "Logs",
    color: "#fb923c",
    description: "Structured application logs with trace_id and span_id injected automatically, so every log line links back to a trace.",
  },
];

const signalTable = [
  { signal: "Traces", exporter: "OTLPSpanExporter", processor: "BatchSpanProcessor", interval: "On flush / 5 s max", color: "#818cf8" },
  { signal: "Metrics", exporter: "OTLPMetricExporter", processor: "PeriodicExportingMetricReader", interval: "60 s (configurable)", color: "#34d399" },
  { signal: "Logs", exporter: "OTLPLogExporter", processor: "BatchLogRecordProcessor", interval: "On flush / 5 s max", color: "#fb923c" },
];

// Page 

export default function OtelDocsPage() {
  return (
    <main
      className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
      style={{ position: "relative", zIndex: 1 }}
    >
      <div className="space-y-10">

        {/* Header */}
        <header className="max-w-3xl">
          <p className="eyebrow">Observability</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Export Telemetry via OpenTelemetry
          </h1>
          <p className="mt-4 text-base leading-8 text-muted">
            Blocklog can push traces, metrics, and logs to any OpenTelemetry-compatible
            backend — Grafana, Jaeger, Datadog, Honeycomb, or your own collector.
            Two environment variables are all it takes to enable it.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <SignalBadge label="Traces" color="#818cf8" />
            <SignalBadge label="Metrics" color="#34d399" />
            <SignalBadge label="Logs" color="#fb923c" />
          </div>
        </header>

        {/* What ships */}
        <section className="space-y-3">
          <SectionLabel>What Blocklog exports</SectionLabel>
          <div className="grid gap-4 sm:grid-cols-3">
            {signals.map(({ label, color, description }) => (
              <div
                key={label}
                className="rounded-2xl border bg-white/[0.02] p-5"
                style={{ borderColor: `${color}30` }}
              >
                <SignalBadge label={label} color={color} />
                <p className="mt-3 text-sm leading-7 text-muted">{description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Step 1 – Enable */}
        <StepCard
          step="Step 1"
          title="Enable OTel with two variables"
          description="Set these in your environment, .env file, or deployment config. Everything else has a working default."
        >
          <CodeBlock code={envConfig} filename=".env" />
          <Callout>
            Your collector must be reachable from the Blocklog process. Use a hostname
            or IP that resolves inside your network — <InlineCode>localhost</InlineCode>{" "}
            won't work inside Docker unless you set <InlineCode>network_mode: host</InlineCode>.
          </Callout>
        </StepCard>

        {/* Step 2 – Docker Compose */}
        <StepCard
          step="Step 2"
          title="Pass variables to your deployment"
          description="If you run Blocklog via Docker Compose, add the variables to your service definition."
        >
          <CodeBlock code={dockerCompose} filename="docker-compose.yml" />
        </StepCard>

        {/* Step 3 – Collector config */}
        <StepCard
          step="Step 3"
          title="Configure your collector"
          description="Blocklog sends data over OTLP. Your collector needs an OTLP receiver on port 4317 (gRPC) or 4318 (HTTP). Below is a minimal OpenTelemetry Collector config that forwards everything to Jaeger."
        >
          <CodeBlock code={collectorYaml} filename="otel-collector-config.yaml" />
          <p className="mt-3 text-xs leading-6 text-muted">
            Replace the <InlineCode>exporters</InlineCode> block with your backend.
            The OTel Collector supports Datadog, Honeycomb, Prometheus, Loki, and
            dozens more out of the box.
          </p>
        </StepCard>

        {/* Grafana alternative */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
          <SectionLabel>Using Grafana Agent?</SectionLabel>
          <p className="mb-4 text-sm leading-7 text-muted sm:text-[15px]">
            If your stack is Grafana Cloud or a self-hosted Grafana + Tempo + Loki setup,
            point Blocklog at your Grafana Agent instead. The agent accepts OTLP natively
            and routes signals to the right backend automatically.
          </p>
          <CodeBlock code={grafanaAgentConfig} filename="grafana-agent.yaml" />
        </section>

        {/* Full variable reference */}
        <section className="space-y-4">
          <SectionLabel>All configuration variables</SectionLabel>
          <CodeBlock code={envFull} filename=".env" />
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full text-sm text-muted">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.03] text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                  <th className="px-4 py-3">Variable</th>
                  <th className="px-4 py-3">Default</th>
                  <th className="px-4 py-3">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {[
                  { key: "OTEL_ENABLED", default: "false", desc: "Set to true to enable all three signal pipelines." },
                  { key: "OTEL_EXPORTER_OTLP_ENDPOINT", default: "http://localhost:4317", desc: "OTLP collector endpoint. Use port 4317 for gRPC, 4318 for HTTP." },
                  { key: "OTEL_SERVICE_NAME", default: "blocklog", desc: "Service name that appears in your tracing backend." },
                  { key: "OTEL_EXPORTER_PROTOCOL", default: "grpc", desc: "Transport protocol — grpc or http." },
                  { key: "OTEL_EXPORTER_OTLP_HEADERS", default: "—", desc: 'Comma-separated auth headers. e.g. "Authorization=Bearer token".' },
                  { key: "OTEL_TRACES_SAMPLE_RATE", default: "1.0", desc: "Fraction of traces to record. 0.2 = 20 %, 1.0 = all." },
                  { key: "OTEL_METRICS_EXPORT_INTERVAL_MS", default: "60000", desc: "How often metrics are pushed to the collector, in milliseconds." },
                ].map(({ key, default: def, desc }) => (
                  <tr key={key} className="bg-transparent transition-colors hover:bg-white/[0.02]">
                    <td className="px-4 py-3 align-top">
                      <InlineCode>{key}</InlineCode>
                    </td>
                    <td className="px-4 py-3 align-top font-mono text-xs text-zinc-500">{def}</td>
                    <td className="px-4 py-3 align-top text-xs leading-6">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Signal pipeline reference */}
        <section className="space-y-4">
          <SectionLabel>Signal pipeline reference</SectionLabel>
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full text-sm text-muted">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.03] text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                  <th className="px-4 py-3">Signal</th>
                  <th className="px-4 py-3">Exporter</th>
                  <th className="px-4 py-3">Batching</th>
                  <th className="px-4 py-3">Default cadence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {signalTable.map(({ signal, exporter, processor, interval, color }) => (
                  <tr key={signal} className="bg-transparent transition-colors hover:bg-white/[0.02]">
                    <td className="px-4 py-3 font-medium" style={{ color }}>{signal}</td>
                    <td className="px-4 py-3"><InlineCode>{exporter}</InlineCode></td>
                    <td className="px-4 py-3"><InlineCode>{processor}</InlineCode></td>
                    <td className="px-4 py-3 text-xs">{interval}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Troubleshooting */}
        <section className="space-y-3">
          <SectionLabel>Troubleshooting</SectionLabel>
          <div className="space-y-3">
            {[
              {
                q: "No data appearing in my backend",
                a: (
                  <>
                    Confirm <InlineCode>OTEL_ENABLED=true</InlineCode> is set and
                    that Blocklog's logs show no connection errors on startup. Check
                    that your collector is reachable at the configured endpoint and
                    that the protocol (gRPC vs HTTP) matches the collector's listener.
                  </>
                ),
              },
              {
                q: "Traces arrive but metrics or logs are missing",
                a: (
                  <>
                    Make sure your collector config has separate pipeline entries for{" "}
                    <InlineCode>metrics</InlineCode> and <InlineCode>logs</InlineCode>.
                    The OpenTelemetry Collector does not route signals automatically —
                    each must be declared explicitly in the <InlineCode>service.pipelines</InlineCode> block.
                  </>
                ),
              },
              {
                q: "Too much data / high cardinality",
                a: (
                  <>
                    Lower <InlineCode>OTEL_TRACES_SAMPLE_RATE</InlineCode> to reduce
                    trace volume (e.g. <InlineCode>0.1</InlineCode> for 10%). Health
                    and metrics endpoints are excluded from tracing by default.
                  </>
                ),
              },
            ].map(({ q, a }) => (
              <div key={q} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <p className="text-sm font-medium text-zinc-200">{q}</p>
                <p className="mt-2 text-sm leading-7 text-muted">{a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Nav */}
        <nav className="flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row">
          <Link
            className="inline-flex items-center justify-center rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            href="/docs/quickstart"
          >
            Quickstart
          </Link>
          <Link
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/[0.06]"
            href="/docs/python-sdk"
          >
            Python SDK Reference
          </Link>
          <Link
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/[0.06]"
            href="/docs/concepts"
          >
            Core Concepts
          </Link>
        </nav>
      </div>
    </main>
  );
}