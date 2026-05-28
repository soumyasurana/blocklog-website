"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DownloadIcon } from "@/components/site/icons";
import { PageFrame, Reveal, SiteHeader } from "@/components/site/Primitives";
import { blocklogRequest, readSession, type BlocklogSession } from "@/lib/blocklog";

type UsageResponse = {
  logs_ingested?: number;
  logs_ingested_today?: number;
  api_calls?: number;
  gb_processed?: number;
};

type IntegrityStatusResponse = {
  status?: string;
  logs_verified?: number;
  anchors_created?: number;
};

type CompanyResponse = {
  company_id: string;
  company_name: string;
  status: string;
};

type LogItem = {
  log_id: string;
  trace_id?: string | null;
  session_id?: string | null;
  workflow_id?: string | null;
  event_type: string;
  source: string;
  timestamp: string;
  created_at: string;
  idempotency_key?: string | null;
  integrity_status: string;
  chain_hash: string;
  payload: Record<string, unknown>;
  status?: string | null;
  company_id: string;
  is_deleted: boolean;
};

type LogsResponse = {
  items: LogItem[];
  next_cursor?: string | null;
};

type TraceItem = {
  trace_id: string;
  session_id?: string | null;
  workflow_id?: string | null;
  started_at: string;
  ended_at: string;
  event_count: number;
  sources: string[];
  event_types: string[];
  integrity_status: string;
};

type TracesResponse = {
  items: TraceItem[];
};

type TraceEvent = {
  log_id: string;
  event_type: string;
  source: string;
  timestamp: string;
  created_at: string;
  payload: Record<string, unknown>;
  chain_hash: string;
  previous_hash: string;
  integrity_status: string;
  is_human_authorized: boolean;
};

type TraceDetailResponse = {
  trace_id: string;
  session_id?: string | null;
  workflow_id?: string | null;
  integrity_status: string;
  event_count: number;
  started_at: string;
  ended_at: string;
  missing_links: string[];
  events: TraceEvent[];
};

type DecisionRow = {
  id: string;
  traceId?: string | null;
  sessionId?: string | null;
  workflowId?: string | null;
  agent: string;
  operation: string;
  amount: string;
  timestamp: string;
  freshness: string;
  status: string;
  chainHash: string;
};

const sidebarItems = ["Overview", "Agents", "Decisions", "Forensic Replay", "Compliance Reports", "Authorization Gate", "Policy Engine", "Audit Log", "Settings"];

function formatAmount(payload: Record<string, unknown>) {
  const data = (payload.data as Record<string, unknown> | undefined) ?? payload;
  const amount = data.amount ?? data.amount_minor ?? data.value;
  const currency = String(data.currency ?? "USD").toUpperCase();
  if (typeof amount === "number") {
    const normalized = amount > 999 ? amount / 100 : amount;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(normalized);
  }
  return "n/a";
}

function computeFreshness(createdAt: string, payload: Record<string, unknown>) {
  const timestamp = typeof payload.timestamp === "string" ? payload.timestamp : null;
  if (!timestamp) return "n/a";
  const created = new Date(createdAt).getTime();
  const event = new Date(timestamp).getTime();
  if (Number.isNaN(created) || Number.isNaN(event)) return "n/a";
  const seconds = Math.max(0, (created - event) / 1000);
  return seconds < 1 ? `${Math.round(seconds * 1000)}ms` : `${seconds.toFixed(1)}s`;
}

function formatStatus(eventType: string, integrityStatus: string, status?: string | null) {
  if (status && status !== "PENDING") return status;
  if (eventType.includes("denied")) return "Denied";
  if (eventType.includes("shadow")) return "Shadow";
  if (integrityStatus !== "valid") return integrityStatus;
  return "Approved";
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
}

export default function ConsolePage() {
  const router = useRouter();
  const [session, setSession] = useState<BlocklogSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [workspace, setWorkspace] = useState("Blocklog Workspace");
  const [stats, setStats] = useState({
    totalRecords: 0,
    integrityCoverage: 0,
    activeTraces: 0,
    anchorsCreated: 0,
    gbProcessed: 0,
    apiCalls: 0,
  });
  const [decisions, setDecisions] = useState<DecisionRow[]>([]);
  const [selected, setSelected] = useState<DecisionRow | null>(null);
  const [selectedTrace, setSelectedTrace] = useState<TraceDetailResponse | null>(null);
  const [selectedLoading, setSelectedLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState<string>(sidebarItems[0]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setSession(readSession());
  }, []);

  useEffect(() => {
    if (session === null) return;
    if (!session.accessToken) {
      router.replace("/login?next=/console");
    }
  }, [router, session]);

  useEffect(() => {
    const currentSession = session;
    if (!currentSession || !currentSession.accessToken || !currentSession.companyId) return;
    const companyId = currentSession.companyId;

    let cancelled = false;

    async function loadConsoleData() {
      setLoading(true);
      setError(null);
      try {
        const [usage, integrityStatus, logs, traces, company] = await Promise.all([
          blocklogRequest<UsageResponse>("/usage"),
          blocklogRequest<IntegrityStatusResponse>("/integrity/status"),
          blocklogRequest<LogsResponse>("/logs?limit=100"),
          blocklogRequest<TracesResponse>("/traces?limit=50"),
          blocklogRequest<CompanyResponse>(`/companies/${companyId}`),
        ]);

        if (cancelled) return;

        const mappedDecisions = logs.items.map((item) => {
          const payload = item.payload ?? {};
          return {
            id: item.log_id,
            traceId: item.trace_id ?? null,
            sessionId: item.session_id ?? null,
            workflowId: item.workflow_id ?? null,
            agent: item.source,
            operation: item.event_type,
            amount: formatAmount(payload),
            timestamp: formatDate(item.created_at),
            freshness: computeFreshness(item.created_at, payload),
            status: formatStatus(item.event_type, item.integrity_status, item.status),
            chainHash: item.chain_hash,
          };
        });

        const logsVerified = integrityStatus.logs_verified ?? 0;
        const totalRecords = usage.logs_ingested ?? 0;
        setWorkspace(company.company_name || company.company_id);
        setStats({
          totalRecords,
          integrityCoverage: totalRecords > 0 ? Math.round((logsVerified / totalRecords) * 100) : 0,
          activeTraces: traces.items.length,
          anchorsCreated: integrityStatus.anchors_created ?? 0,
          gbProcessed: usage.gb_processed ?? 0,
          apiCalls: usage.api_calls ?? 0,
        });
        setDecisions(mappedDecisions);
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load console data");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadConsoleData();
    const timer = setInterval(loadConsoleData, 30000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [session?.accessToken, session?.companyId]);

  useEffect(() => {
    if (!session || !session.accessToken) {
      setSelectedTrace(null);
      return;
    }
    const traceId = selected?.traceId;
    if (!traceId) {
      setSelectedTrace(null);
      return;
    }
    let cancelled = false;
    async function loadTrace() {
      setSelectedLoading(true);
      try {
        const trace = await blocklogRequest<TraceDetailResponse>(`/traces/${traceId}`);
        if (!cancelled) setSelectedTrace(trace);
      } catch {
        if (!cancelled) setSelectedTrace(null);
      } finally {
        if (!cancelled) setSelectedLoading(false);
      }
    }
    loadTrace();
    return () => {
      cancelled = true;
    };
  }, [selected?.traceId, session?.accessToken]);

  const agents = useMemo(() => {
    const map = new Map<string, number>();
    decisions.forEach((decision) => {
      map.set(decision.agent, (map.get(decision.agent) ?? 0) + 1);
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [decisions]);

  const totalPages = Math.max(1, Math.ceil(decisions.length / 25));
  const paged = useMemo(() => decisions.slice((page - 1) * 25, page * 25), [decisions, page]);

  const renderConsoleSection = () => {
    switch (selectedTab) {
      case "Agents":
        return (
          <div className="space-y-6">
            <Reveal className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {agents.map(([agent, count]) => (
                <div className="liquid-glass rounded-[2rem] p-5" key={agent}>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/38">Agent</p>
                  <div className="mt-4 text-3xl serif-italic">{agent}</div>
                  <p className="mt-3 text-sm text-white/54">{count.toLocaleString()} decisions recorded</p>
                </div>
              ))}
              {!agents.length ? (
                <div className="liquid-glass rounded-[2rem] p-5 text-sm text-white/64">
                  No agent records found yet.
                </div>
              ) : null}
            </Reveal>
            <div className="liquid-glass rounded-[2.4rem] p-5">
              <p className="eyebrow">Agent activity</p>
              <p className="mt-3 text-sm text-white/64">Click any decision in the Decisions tab to inspect its trace and run forensic replay.</p>
            </div>
          </div>
        );
      case "Decisions":
        return (
          <Reveal delay={0.16}>
            <div className="liquid-glass-strong rounded-[2.4rem] p-5">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="eyebrow">Recent Decisions Feed</p>
                  <h2 className="mt-3 text-3xl serif-italic">Decision Plane</h2>
                </div>
                <div className="rounded-full border border-white/10 px-4 py-3 text-sm text-white/56">
                  {decisions.length} records loaded
                </div>
              </div>
              <table className="table-grid">
                <thead>
                  <tr>
                    <th>Decision ID</th>
                    <th>Agent</th>
                    <th>Operation Type</th>
                    <th>Amount</th>
                    <th>Timestamp</th>
                    <th>Freshness</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((decision) => (
                    <tr className="cursor-pointer" key={decision.id} onClick={() => setSelected(decision)}>
                      <td className="mono">{decision.id.slice(0, 12)}</td>
                      <td>{decision.agent}</td>
                      <td>{decision.operation}</td>
                      <td>{decision.amount}</td>
                      <td>{decision.timestamp}</td>
                      <td>{decision.freshness}</td>
                      <td>{decision.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-5 flex items-center justify-between">
                <button className="liquid-glass rounded-full px-4 py-3 text-sm text-white/74" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} type="button">
                  Previous
                </button>
                <div className="text-sm text-white/52">Page {page} of {totalPages}</div>
                <button className="liquid-glass rounded-full px-4 py-3 text-sm text-white/74" disabled={page === totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))} type="button">
                  Next
                </button>
              </div>
            </div>
          </Reveal>
        );
      case "Forensic Replay":
        return (
          <div className="space-y-6">
            <div className="liquid-glass rounded-[2rem] p-5">
              <p className="eyebrow">Forensic Replay</p>
              <h2 className="mt-3 text-3xl serif-italic">Reconstruct Decisions</h2>
              <p className="mt-3 text-sm text-white/64">Select a decision from the table below to open the forensic trace panel. The replay panel will fetch event details from the backend trace API.</p>
            </div>
            <Reveal delay={0.16}>
              <div className="liquid-glass-strong rounded-[2.4rem] p-5">
                <table className="table-grid">
                  <thead>
                    <tr>
                      <th>Decision ID</th>
                      <th>Agent</th>
                      <th>Operation</th>
                      <th>Timestamp</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paged.map((decision) => (
                      <tr className="cursor-pointer" key={decision.id} onClick={() => setSelected(decision)}>
                        <td className="mono">{decision.id.slice(0, 12)}</td>
                        <td>{decision.agent}</td>
                        <td>{decision.operation}</td>
                        <td>{decision.timestamp}</td>
                        <td>{decision.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-5 text-sm text-white/56">Tap a row to view its trace timeline and payload in the forensic replay drawer.</div>
              </div>
            </Reveal>
          </div>
        );
      case "Compliance Reports":
        return (
          <div className="space-y-6">
            <div className="liquid-glass rounded-[2rem] p-5">
              <p className="eyebrow">Compliance Reports</p>
              <h2 className="mt-3 text-3xl serif-italic">Evidence Summary</h2>
              <p className="mt-3 text-sm text-white/64">Review compliance coverage across recorded decisions, integrity proofs, and traceable events.</p>
            </div>
            <Reveal className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              <div className="liquid-glass rounded-[2rem] p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-white/38">Verified Decisions</p>
                <div className="mt-4 text-4xl serif-italic">{stats.integrityCoverage}%</div>
                <p className="mt-3 text-sm text-white/54">of records sealed into verified batches</p>
              </div>
              <div className="liquid-glass rounded-[2rem] p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-white/38">Anchor Proofs</p>
                <div className="mt-4 text-4xl serif-italic">{stats.anchorsCreated.toLocaleString()}</div>
                <p className="mt-3 text-sm text-white/54">blockchain proofs available for audit</p>
              </div>
              <div className="liquid-glass rounded-[2rem] p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-white/38">Trace Sessions</p>
                <div className="mt-4 text-4xl serif-italic">{stats.activeTraces.toLocaleString()}</div>
                <p className="mt-3 text-sm text-white/54">replayable event traces</p>
              </div>
            </Reveal>
            <div className="liquid-glass rounded-[2.4rem] p-5 text-sm text-white/64">
              Compliance reports are generated from the same backend events and trace records used by the console. Select a decision in the Decisions tab to examine chain proof and trace data.
            </div>
          </div>
        );
      case "Authorization Gate":
        return (
          <div className="space-y-6">
            <div className="liquid-glass rounded-[2rem] p-5">
              <p className="eyebrow">Authorization Gate</p>
              <h2 className="mt-3 text-3xl serif-italic">Policy Enforcement</h2>
              <p className="mt-3 text-sm text-white/64">Monitor request authorization status, approval decisions, and gate enforcement across your backend.</p>
            </div>
            <div className="liquid-glass rounded-[2.4rem] p-5 text-sm text-white/64">
              This section links to policy evaluation and access decisions, powered by the same trace and log data that feeds the AI governance console.
            </div>
          </div>
        );
      case "Policy Engine":
        return (
          <div className="space-y-6">
            <div className="liquid-glass rounded-[2rem] p-5">
              <p className="eyebrow">Policy Engine</p>
              <h2 className="mt-3 text-3xl serif-italic">Decision Logic</h2>
              <p className="mt-3 text-sm text-white/64">View policy matching, rule metadata, and how decisions were derived from your backend event payloads.</p>
            </div>
            <div className="liquid-glass rounded-[2.4rem] p-5 text-sm text-white/64">
              Policy engine insights are built from the same governance records stored in the backend. Select a decision to see matching rules and policy evaluation.
            </div>
          </div>
        );
      case "Audit Log":
        return (
          <div className="space-y-6">
            <div className="liquid-glass rounded-[2rem] p-5">
              <p className="eyebrow">Audit Log</p>
              <h2 className="mt-3 text-3xl serif-italic">Event History</h2>
              <p className="mt-3 text-sm text-white/64">Browse the audit records that are being written to the backend, including integrity proofs, trace events, and decision history.</p>
            </div>
            <div className="liquid-glass rounded-[2.4rem] p-5 text-sm text-white/64">
              Audit logs are the raw source of truth for forensic replay and compliance reporting. Use the Decisions tab to inspect actual record payloads.
            </div>
          </div>
        );
      case "Settings":
        return (
          <div className="space-y-6">
            <div className="liquid-glass rounded-[2rem] p-5">
              <p className="eyebrow">Settings</p>
              <h2 className="mt-3 text-3xl serif-italic">Console Configuration</h2>
              <p className="mt-3 text-sm text-white/64">Manage your console settings, workspace connection, and backend integration options.</p>
            </div>
            <div className="liquid-glass rounded-[2.4rem] p-5 text-sm text-white/64">
              Console and workspace settings are currently centralized in the backend admin area. Ensure your backend tokens and company configuration are up to date.
            </div>
          </div>
        );
      default:
        return (
          <>
            <Reveal className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {[
                ["Total Governance Records", stats.totalRecords.toLocaleString(), "all logs for this tenant"],
                ["Integrity Coverage", `${stats.integrityCoverage}%`, "records sealed into verified batches"],
                ["Active Traces", stats.activeTraces.toLocaleString(), "trace sessions discovered"],
                ["Anchors Created", stats.anchorsCreated.toLocaleString(), "blockchain proofs committed"],
              ].map(([label, value, detail]) => (
                <div className="liquid-glass rounded-[2rem] p-5" key={String(label)}>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/38">{label}</p>
                  <div className="mt-4 text-4xl serif-italic">{loading ? "..." : value}</div>
                  <p className="mt-3 text-sm text-white/54">{detail}</p>
                </div>
              ))}
            </Reveal>

            <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
              <Reveal delay={0.08}>
                <div className="liquid-glass rounded-[2rem] p-5">
                  <p className="eyebrow">Operational Counters</p>
                  <div className="mt-5 grid gap-3">
                    <div className="rounded-full border border-white/10 px-4 py-3 text-sm text-white/72">
                      API calls recorded: {loading ? "..." : stats.apiCalls.toLocaleString()}
                    </div>
                    <div className="rounded-full border border-white/10 px-4 py-3 text-sm text-white/72">
                      Payload volume processed: {loading ? "..." : `${stats.gbProcessed} GB`}
                    </div>
                    <div className="rounded-full border border-white/10 px-4 py-3 text-sm text-white/72">
                      Refresh cadence: every 30 seconds
                    </div>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.12}>
                <div className="liquid-glass rounded-[2rem] p-5">
                  <p className="eyebrow">Authorization Gate</p>
                  <div className="mt-5 flex items-center justify-between rounded-[1.6rem] border border-white/10 p-4">
                    <div>
                      <div className="text-2xl serif-italic">Backend Connected</div>
                      <p className="mt-2 text-sm text-white/62">
                        This console is reading live usage, integrity, logs, and trace data from the FastAPI backend.
                      </p>
                    </div>
                    <Link className="rounded-full bg-white px-4 py-3 text-sm font-medium text-black" href="/docs">
                      View APIs
                    </Link>
                  </div>
                </div>
              </Reveal>
            </div>
          </>
        );
    }
  };

  if (session === null || !session.accessToken) return null;

  return (
    <div className="page-shell">
      <SiteHeader consoleMode workspaceName={workspace} />
      <PageFrame className="pb-12">
        <div className="content-wrap pt-28">
          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            <aside className="liquid-glass h-fit rounded-[2rem] p-4 lg:sticky lg:top-28">
              <div className="mb-4 rounded-[1.6rem] border border-white/10 p-4">
                <div className="text-sm uppercase tracking-[0.22em] text-white/38">Workspace</div>
                <div className="mt-2 text-2xl serif-italic">{workspace}</div>
                <div className="mt-3 text-sm text-white/48">{session.companyId}</div>
              </div>
              <div className="grid gap-2">
                {sidebarItems.map((item) => (
                  <button
                    className={`liquid-glass rounded-full px-4 py-3 text-left text-sm transition ${selectedTab === item ? "bg-white/15 text-white" : "text-white/74"}`}
                    key={item}
                    type="button"
                    onClick={() => {
                      setSelectedTab(item);
                      setPage(1);
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </aside>

            <div className="space-y-6">
              {error ? (
                <div className="liquid-glass rounded-[2rem] p-4 text-sm text-white/64">
                  Console data could not be loaded from the backend: {error}
                </div>
              ) : null}
              {renderConsoleSection()}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {selected ? (
            <motion.div
              className="fixed inset-0 z-[70] bg-black/70 p-4 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="ml-auto h-full w-full max-w-3xl overflow-auto rounded-[2.6rem] liquid-glass-strong p-6 md:p-8"
                initial={{ x: 120, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 120, opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="eyebrow">Forensic Replay</p>
                    <h2 className="mt-4 text-4xl serif-italic">{selected.id}</h2>
                    <p className="mt-3 text-sm text-white/68">{selected.timestamp} | {selected.agent}</p>
                  </div>
                  <button className="liquid-glass rounded-full px-4 py-3 text-sm text-white/74" onClick={() => setSelected(null)} type="button">
                    Close
                  </button>
                </div>

                {selectedLoading ? (
                  <div className="mt-8 rounded-[2rem] border border-white/10 p-6 text-sm text-white/64">
                    Loading trace reconstruction...
                  </div>
                ) : null}

                <div className="mt-8 grid gap-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    {[
                      ["Trace ID", selected.traceId ?? "none"],
                      ["Session ID", selected.sessionId ?? "none"],
                      ["Workflow ID", selected.workflowId ?? "none"],
                      ["Chain hash", selected.chainHash.slice(0, 18)],
                    ].map(([label, value]) => (
                      <div className="liquid-glass rounded-[1.6rem] p-4" key={label}>
                        <p className="text-xs uppercase tracking-[0.2em] text-white/38">{label}</p>
                        <div className="mt-3 break-all text-xl serif-italic">{value}</div>
                      </div>
                    ))}
                  </div>

                  <div className="liquid-glass rounded-[1.8rem] p-5">
                    <p className="eyebrow">Captured Input Parameters</p>
                    <div className="mt-4 grid gap-3 text-sm">
                      {(selectedTrace?.events?.[0]?.payload ? Object.entries(selectedTrace.events[0].payload) : []).slice(0, 8).map(([key, value]) => (
                        <div className="flex items-center justify-between rounded-full border border-white/8 px-4 py-3" key={key}>
                          <span className="mono text-white/78">{key}</span>
                          <span className="max-w-[60%] truncate text-white/56">
                            {typeof value === "object" ? JSON.stringify(value) : String(value)}
                          </span>
                        </div>
                      ))}
                      {!selectedTrace?.events?.[0]?.payload ? (
                        <div className="rounded-full border border-white/8 px-4 py-3 text-white/56">
                          No structured payload fields available for this record.
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="liquid-glass rounded-[1.6rem] p-4 text-sm leading-7 text-white/72">
                      Integrity status: {selectedTrace?.integrity_status ?? selected.status}. Event count in trace: {selectedTrace?.event_count ?? 1}. Missing causal links: {selectedTrace?.missing_links?.length ?? 0}.
                    </div>
                    <div className="liquid-glass rounded-[1.6rem] p-4 text-sm leading-7 text-white/72">
                      Timeline window: {selectedTrace ? `${formatDate(selectedTrace.started_at)} to ${formatDate(selectedTrace.ended_at)}` : "Standalone event record"}.
                    </div>
                  </div>

                  <div className="liquid-glass rounded-[1.8rem] p-5">
                    <p className="eyebrow">Trace Timeline</p>
                    <div className="mt-4 grid gap-3">
                      {(selectedTrace?.events ?? []).slice(0, 6).map((event) => (
                        <div className="rounded-[1.4rem] border border-white/8 px-4 py-4" key={event.log_id}>
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-white">{event.event_type}</span>
                            <span className="text-sm text-white/46">{formatDate(event.created_at)}</span>
                          </div>
                          <div className="mt-2 text-sm text-white/56">{event.source} | {event.integrity_status}</div>
                        </div>
                      ))}
                      {!selectedTrace?.events?.length ? (
                        <div className="rounded-[1.4rem] border border-white/8 px-4 py-4 text-sm text-white/56">
                          No replayable trace sequence was found for this decision.
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <button className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-4 text-sm font-medium text-black" type="button">
                    <DownloadIcon width={16} height={16} />
                    Export to PDF
                  </button>
                </div>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </PageFrame>
    </div>
  );
}
