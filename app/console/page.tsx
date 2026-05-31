
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Fragment, useCallback, useEffect, useMemo, useRef, useState, memo, Suspense, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { DownloadIcon } from "@/components/site/icons";
import { PageFrame, Reveal } from "@/components/site/Primitives";
import { blocklogRequest, readSession, subscribeSession, type BlocklogSession } from "@/lib/blocklog";

// ─── Types ───────────────────────────────────────────────────────────────────

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
  trace_id: string | null;
  session_id: string | null;
  workflow_id: string | null;
  event_type: string;
  source: string;
  timestamp: string;
  created_at: string;
  idempotency_key: string | null;
  integrity_status: string;
  chain_hash: string;
  payload: Record<string, unknown>;
  status: string | null;
  company_id: string;
  is_deleted: boolean;
};

type LogsResponse = { items: LogItem[]; next_cursor: string | null };

type TracesResponse = {
  items: {
    trace_id: string;
    session_id: string | null;
    workflow_id: string | null;
    started_at: string;
    ended_at: string;
    event_count: number;
    sources: string[];
    event_types: string[];
    integrity_status: string;
  }[];
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

type TraceDetail = {
  trace_id: string;
  session_id: string | null;
  workflow_id: string | null;
  integrity_status: string;
  event_count: number;
  started_at: string;
  ended_at: string;
  missing_links: string[];
  events: TraceEvent[];
};

type DecisionRow = {
  id: string;
  traceId: string | null;
  sessionId: string | null;
  workflowId: string | null;
  agent: string;
  operation: string;
  amount: string;
  timestamp: string;
  freshness: string;
  status: string;
  integrityStatus: string;
  chainHash: string;
  createdAt: string;
};

type ConsoleStats = {
  totalRecords: number;
  integrityCoverage: number;
  activeTraces: number;
  anchorsCreated: number;
  gbProcessed: number;
  apiCalls: number;
};

type SortField = "timestamp" | "agent" | "operation" | "status" | "amount";
type SortDir = "asc" | "desc";
type UserRole = "ADMIN" | "AUDITOR" | "ANALYST" | "VIEWER";

// ─── Constants ───────────────────────────────────────────────────────────────

const SIDEBAR_ITEMS = [
  "Overview",
  "Agents",
  "Decisions",
  "Forensic Replay",
  "Compliance Reports",
  "Authorization Gate",
  "Policy Engine",
  "Audit Log",
  "Settings",
] as const;

type SidebarTab = (typeof SIDEBAR_ITEMS)[number];

const TAB_PARAM = "view";
const TAB_SLUGS: Record<SidebarTab, string> = {
  Overview: "overview",
  Agents: "agents",
  Decisions: "decisions",
  "Forensic Replay": "forensic-replay",
  "Compliance Reports": "compliance-reports",
  "Authorization Gate": "authorization-gate",
  "Policy Engine": "policy-engine",
  "Audit Log": "audit-log",
  Settings: "settings",
};
const TAB_FROM_SLUG = Object.fromEntries(
  Object.entries(TAB_SLUGS).map(([tab, slug]) => [slug, tab as SidebarTab]),
) as Record<string, SidebarTab>;

const ROLE_TABS: Record<UserRole, Set<SidebarTab>> = {
  ADMIN: new Set(SIDEBAR_ITEMS),
  AUDITOR: new Set(["Overview", "Decisions", "Forensic Replay", "Compliance Reports", "Authorization Gate", "Audit Log"]),
  ANALYST: new Set(["Overview", "Agents", "Decisions", "Forensic Replay", "Policy Engine"]),
  VIEWER: new Set(["Overview", "Decisions"]),
};

const EMPTY_STATS: ConsoleStats = {
  totalRecords: 0,
  integrityCoverage: 0,
  activeTraces: 0,
  anchorsCreated: 0,
  gbProcessed: 0,
  apiCalls: 0,
};

const STATUS_COLORS: Record<string, string> = {
  Approved: "text-emerald-400",
  Denied: "text-red-400",
  Shadow: "text-amber-400",
};

const STATUS_SURFACE: Record<string, string> = {
  Approved: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
  Denied: "border-red-400/25 bg-red-400/10 text-red-300",
  Shadow: "border-amber-400/25 bg-amber-400/10 text-amber-300",
};

// ─── Pure utilities ───────────────────────────────────────────────────────────

function formatAmount(payload: Record<string, unknown>): string {
  const data = (payload.data as Record<string, unknown> | undefined) ?? payload;
  const amount = data.amount ?? data.amount_minor ?? data.value;
  const currency = String(data.currency ?? "USD").toUpperCase();
  if (typeof amount === "number") {
    const normalized = amount > 999 ? amount / 100 : amount;
    try {
      return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 2 }).format(normalized);
    } catch {
      return `${normalized}`;
    }
  }
  return "n/a";
}

function computeFreshness(createdAt: string, payload: Record<string, unknown>): string {
  const ts = typeof payload.timestamp === "string" ? payload.timestamp : null;
  if (!ts) return "n/a";
  const created = new Date(createdAt).getTime();
  const event = new Date(ts).getTime();
  if (Number.isNaN(created) || Number.isNaN(event)) return "n/a";
  const seconds = Math.max(0, (created - event) / 1000);
  return seconds < 1 ? `${Math.round(seconds * 1000)}ms` : `${seconds.toFixed(1)}s`;
}

function formatStatus(eventType: string, integrityStatus: string, status?: string | null): string {
  if (status && status !== "PENDING") return status;
  if (eventType.includes("denied")) return "Denied";
  if (eventType.includes("shadow")) return "Shadow";
  if (integrityStatus !== "valid") return integrityStatus;
  return "Approved";
}

function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleString("en-US", {
      timeZone: "UTC", month: "short", day: "numeric",
      year: "numeric", hour: "numeric", minute: "numeric", second: "numeric",
    });
  } catch { return dateString; }
}

function truncateId(id: string, len = 12): string {
  return id.length > len ? id.slice(0, len) : id;
}

function truncateHash(hash: string, len = 18): string {
  return hash.length > len ? `${hash.slice(0, len)}…` : hash;
}

function mapLogToDecision(item: LogItem): DecisionRow {
  const payload = item.payload ?? {};
  return {
    id: item.log_id,
    traceId: item.trace_id,
    sessionId: item.session_id,
    workflowId: item.workflow_id,
    agent: item.source,
    operation: item.event_type,
    amount: formatAmount(payload),
    timestamp: formatDate(item.created_at),
    freshness: computeFreshness(item.created_at, payload),
    status: formatStatus(item.event_type, item.integrity_status, item.status),
    integrityStatus: item.integrity_status,
    chainHash: item.chain_hash,
    createdAt: item.created_at,
  };
}

function getFreshnessLevel(freshness: string): "fresh" | "borderline" | "stale" | "unknown" {
  if (freshness === "n/a") return "unknown";
  const value = Number.parseFloat(freshness);
  if (Number.isNaN(value)) return "unknown";
  if (freshness.endsWith("ms")) return "fresh";
  if (value <= 5) return "fresh";
  if (value <= 15) return "borderline";
  return "stale";
}

function getFreshnessDotClass(freshness: string) {
  const level = getFreshnessLevel(freshness);
  if (level === "fresh") return "bg-emerald-400";
  if (level === "borderline") return "bg-amber-400";
  if (level === "stale") return "bg-red-400";
  return "bg-white/25";
}

function formatRelativeTrend(value: number) {
  if (value === 0) return "flat from prior window";
  return value > 0 ? `+${value}% from prior window` : `${value}% from prior window`;
}

// ─── PDF export (pdf-lib) ─────────────────────────────────────────────────────

async function exportTracePdf(decision: DecisionRow, trace: TraceDetail | null): Promise<void> {
  // Dynamic import to avoid bundling pdf-lib unless needed
  const { PDFDocument, rgb, StandardFonts } = await import("pdf-lib");
  const doc = await PDFDocument.create();
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  const addPage = () => {
    const p = doc.addPage([612, 792]);
    return { page: p, y: p.getSize().height - 60 };
  };

  let { page, y } = addPage();

  const write = (text: string, size = 10, font = regular, color = rgb(0.1, 0.1, 0.1)) => {
    if (y < 70) { ({ page, y } = addPage()); }
    page.drawText(text, { x: 50, y, size, font, color, maxWidth: 512 });
    y -= size + 6;
  };

  write("Blocklog — Forensic Trace Report", 18, bold);
  write(`Generated: ${formatDate(new Date().toISOString())}`, 9, regular, rgb(0.5, 0.5, 0.5));
  y -= 6;
  page.drawLine({ start: { x: 50, y }, end: { x: 562, y }, thickness: 0.5, color: rgb(0.8, 0.8, 0.8) });
  y -= 16;

  write("Decision Metadata", 13, bold);
  for (const [label, value] of [
    ["Decision ID", decision.id],
    ["Trace ID", decision.traceId ?? "none"],
    ["Session ID", decision.sessionId ?? "none"],
    ["Workflow ID", decision.workflowId ?? "none"],
    ["Agent", decision.agent],
    ["Operation", decision.operation],
    ["Amount", decision.amount],
    ["Timestamp", decision.timestamp],
    ["Status", decision.status],
    ["Integrity", decision.integrityStatus],
    ["Chain Hash", decision.chainHash],
  ]) {
    write(`${label.padEnd(16)} ${value}`, 10);
  }

  y -= 8;
  if (trace) {
    write("Trace Summary", 13, bold);
    for (const [label, value] of [
      ["Trace ID", trace.trace_id],
      ["Integrity", trace.integrity_status],
      ["Events", String(trace.event_count)],
      ["Started", formatDate(trace.started_at)],
      ["Ended", formatDate(trace.ended_at)],
      ["Missing Links", String(trace.missing_links.length)],
    ]) {
      write(`${label.padEnd(16)} ${value}`, 10);
    }
    y -= 8;
    write("Event Timeline", 13, bold);
    for (const [i, ev] of trace.events.entries()) {
      write(`[${i + 1}] ${ev.event_type} — ${ev.source}`, 9, bold);
      write(`    ${formatDate(ev.created_at)} | ${ev.integrity_status} | ${ev.is_human_authorized ? "Human auth" : "Automated"}`, 9);
      write(`    Chain: ${ev.chain_hash.slice(0, 32)}…`, 9);
      y -= 4;
    }
  }

  const pages = doc.getPages();
  for (const [i, p] of pages.entries()) {
    p.drawText(`Page ${i + 1} of ${pages.length} — Blocklog Forensic Report`, {
      x: 50, y: 28, size: 8, font: regular, color: rgb(0.6, 0.6, 0.6),
    });
  }

  const bytes = await doc.save();

const buffer = bytes.slice().buffer;

const url = URL.createObjectURL(
  new Blob([buffer], {
    type: "application/pdf",
  })
);

  const a = document.createElement("a");
  a.href = url;
  a.download = `trace-${decision.id.slice(0, 12)}.pdf`;
  a.click();

  setTimeout(() => URL.revokeObjectURL(url), 10000);
  }

// ─── Hooks ───────────────────────────────────────────────────────────────────

function useConsoleData(accessToken: string | null | undefined, companyId: string | null | undefined) {
  const [stats, setStats] = useState<ConsoleStats>(EMPTY_STATS);
  const [decisions, setDecisions] = useState<DecisionRow[]>([]);
  const [workspace, setWorkspace] = useState("Blocklog Workspace");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cancelRef = useRef(false);
  const fetchingRef = useRef(false);

  const fetchData = useCallback(async () => {
    if (!accessToken || !companyId || fetchingRef.current) return;
    fetchingRef.current = true;
    setLoading(true);
    setError(null);
    try {
      const [usage, integrity, logs, traces, company] = await Promise.all([
        blocklogRequest<UsageResponse>("/usage"),
        blocklogRequest<IntegrityStatusResponse>("/integrity/status"),
        blocklogRequest<LogsResponse>("/logs?limit=100"),
        blocklogRequest<TracesResponse>("/traces?limit=50"),
        blocklogRequest<CompanyResponse>(`/companies/${companyId}`),
      ]);
      if (cancelRef.current) return;
      const totalRecords = usage.logs_ingested ?? 0;
      const logsVerified = integrity.logs_verified ?? 0;
      setStats({
        totalRecords,
        integrityCoverage: totalRecords > 0 ? Math.round((logsVerified / totalRecords) * 100) : 0,
        activeTraces: traces.items.length,
        anchorsCreated: integrity.anchors_created ?? 0,
        gbProcessed: usage.gb_processed ?? 0,
        apiCalls: usage.api_calls ?? 0,
      });
      setDecisions(logs.items.map(mapLogToDecision));
      setWorkspace(company.company_name || company.company_id);
    } catch (err) {
      if (!cancelRef.current) setError(err instanceof Error ? err.message : "Unable to load console data");
    } finally {
      if (!cancelRef.current) setLoading(false);
      fetchingRef.current = false;
    }
  }, [accessToken, companyId]);

  useEffect(() => {
    if (!accessToken || !companyId) return;
    cancelRef.current = false;
    void fetchData();

    let es: EventSource | null = null;
    let poll: ReturnType<typeof setInterval> | null = null;

    try {
      es = new EventSource(`/api/events?companyId=${companyId}&token=${accessToken}`);
      es.addEventListener("log", () => { void fetchData(); });
      es.onerror = () => {
        es?.close();
        es = null;
        poll = setInterval(() => { void fetchData(); }, 30_000);
      };
    } catch {
      poll = setInterval(() => { void fetchData(); }, 30_000);
    }

    return () => {
      cancelRef.current = true;
      es?.close();
      if (poll) clearInterval(poll);
    };
  }, [accessToken, companyId, fetchData]);

  return { stats, decisions, workspace, loading, error, refetch: fetchData };
}

function useTrace(traceId: string | null | undefined, accessToken: string | null | undefined) {
  const [state, setState] = useState<{
    traceId: string | null;
    trace: TraceDetail | null;
    loading: boolean;
  }>({
    traceId: null,
    trace: null,
    loading: false,
  });
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!traceId || !accessToken) {
      return;
    }
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    // We intentionally flip loading immediately when the inspected trace changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState((current) => ({
      traceId,
      trace: current.traceId === traceId ? current.trace : null,
      loading: true,
    }));
    blocklogRequest<TraceDetail>(`/traces/${traceId}`)
      .then((data) => setState({ traceId, trace: data, loading: false }))
      .catch(() => setState({ traceId, trace: null, loading: false }));
    return () => { abortRef.current?.abort(); };
  }, [traceId, accessToken]);

  return {
    trace: state.traceId === traceId ? state.trace : null,
    loading: state.traceId === traceId ? state.loading : false,
  };
}

function usePagination<T>(items: T[], pageSize = 25) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const clamped = Math.min(page, totalPages);
  const paged = useMemo(() => items.slice((clamped - 1) * pageSize, clamped * pageSize), [items, clamped, pageSize]);
  const goTo = useCallback((p: number) => setPage(Math.max(1, Math.min(totalPages, p))), [totalPages]);
  const reset = useCallback(() => setPage(1), []);
  return { page: clamped, totalPages, paged, next: () => goTo(clamped + 1), prev: () => goTo(clamped - 1), canNext: clamped < totalPages, canPrev: clamped > 1, reset };
}

function useFilteredDecisions(decisions: DecisionRow[]) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const search = sp.get("search") ?? "";
  const statusF = sp.get("status") ?? "";
  const agentF = sp.get("agent") ?? "";
  const dateFrom = sp.get("from") ?? "";
  const dateTo = sp.get("to") ?? "";
  const sortField = (sp.get("sort") ?? "timestamp") as SortField;
  const sortDir = (sp.get("dir") ?? "desc") as SortDir;

  const setParam = useCallback((updates: Record<string, string>) => {
    const params = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(updates)) { if (v) params.set(k, v); else params.delete(k); }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [sp, router, pathname]);

  const setSearch = (v: string) => setParam({ search: v, page: "1" });
  const setStatus = (v: string) => setParam({ status: v, page: "1" });
  const setAgent = (v: string) => setParam({ agent: v, page: "1" });
  const setDateFrom = (v: string) => setParam({ from: v });
  const setDateTo = (v: string) => setParam({ to: v });
  const toggleSort = (field: SortField) => setParam({ sort: field, dir: field === sortField && sortDir === "desc" ? "asc" : "desc" });
  const clearFilters = () => {
    const params = new URLSearchParams(sp.toString());
    for (const k of ["search", "status", "agent", "from", "to"]) params.delete(k);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const filtered = useMemo(() => {
    let r = decisions.filter((d) => {
      const q = search.toLowerCase();
      if (q && ![d.id, d.traceId ?? "", d.sessionId ?? "", d.workflowId ?? "", d.agent, d.operation].some((s) => s.toLowerCase().includes(q))) return false;
      if (statusF && d.status !== statusF) return false;
      if (agentF && d.agent !== agentF) return false;
      if (dateFrom && new Date(d.createdAt).getTime() < new Date(dateFrom).getTime()) return false;
      if (dateTo && new Date(d.createdAt).getTime() > new Date(dateTo).getTime()) return false;
      return true;
    });
    r = [...r].sort((a, b) => {
      let cmp = 0;
      if (sortField === "timestamp") cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      else if (sortField === "agent") cmp = a.agent.localeCompare(b.agent);
      else if (sortField === "operation") cmp = a.operation.localeCompare(b.operation);
      else if (sortField === "status") cmp = a.status.localeCompare(b.status);
      else if (sortField === "amount") cmp = a.amount.localeCompare(b.amount);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return r;
  }, [decisions, search, statusF, agentF, dateFrom, dateTo, sortField, sortDir]);

  return { filtered, search, statusF, agentF, dateFrom, dateTo, sortField, sortDir, setSearch, setStatus, setAgent, setDateFrom, setDateTo, toggleSort, clearFilters };
}

function getSessionSnapshot() {
  return readSession();
}

function getServerSessionSnapshot(): BlocklogSession {
  return {};
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SortIcon({ field, current, dir }: { field: SortField; current: SortField; dir: SortDir }) {
  return field === current
    ? <span className="ml-1 opacity-70">{dir === "asc" ? "↑" : "↓"}</span>
    : <span className="ml-1 opacity-20">↕</span>;
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      aria-label={`Copy ${label}`}
      className="ml-2 rounded-full border border-white/10 px-2 py-0.5 text-xs text-white/46 hover:text-white transition-colors"
      type="button"
      onClick={() => navigator.clipboard.writeText(value).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); })}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function SkeletonValue() {
  return <span className="inline-block h-8 w-24 animate-pulse rounded-lg bg-white/10 align-middle" />;
}

const DecisionsTable = memo(function DecisionsTable({
  decisions, onSelect, compact = false, expandable = false, selectedId = null,
}: {
  decisions: DecisionRow[];
  onSelect: (d: DecisionRow) => void;
  compact?: boolean;
  expandable?: boolean;
  selectedId?: string | null;
}) {
  const f = useFilteredDecisions(decisions);
  const pg = usePagination(f.filtered, 25);

  useEffect(() => { pg.reset(); }, [f.search, f.statusF, f.agentF]); // eslint-disable-line react-hooks/exhaustive-deps

  const uniqueAgents = useMemo(() => [...new Set(decisions.map((d) => d.agent))].sort(), [decisions]);
  const uniqueStatuses = useMemo(() => [...new Set(decisions.map((d) => d.status))].sort(), [decisions]);

  return (
    <div className="liquid-glass-strong rounded-[2.4rem] p-5">
      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          aria-label="Search decisions"
          className="liquid-glass min-w-[200px] flex-1 rounded-full border border-white/10 bg-transparent px-4 py-2 text-sm text-white placeholder:text-white/38 focus:outline-none focus:ring-1 focus:ring-white/20"
          placeholder="Search ID, trace, agent, operation…"
          type="search"
          value={f.search}
          onChange={(e) => f.setSearch(e.target.value)}
        />
        <select
          aria-label="Filter by status"
          className="liquid-glass rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm text-white/74 focus:outline-none"
          value={f.statusF}
          onChange={(e) => f.setStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          {uniqueStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          aria-label="Filter by agent"
          className="liquid-glass rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm text-white/74 focus:outline-none"
          value={f.agentF}
          onChange={(e) => f.setAgent(e.target.value)}
        >
          <option value="">All Agents</option>
          {uniqueAgents.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
        {(f.search || f.statusF || f.agentF) && (
          <button className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/56 hover:text-white" type="button" onClick={f.clearFilters}>
            Clear
          </button>
        )}
        <span className="ml-auto text-sm text-white/46">{f.filtered.length} records</span>
      </div>

      {/* Date range */}
      {!compact && (
        <div className="mb-4 flex flex-wrap gap-3 text-sm text-white/54">
          <label className="flex items-center gap-2">
            From
            <input className="liquid-glass rounded-full border border-white/10 bg-transparent px-3 py-1.5 text-sm text-white focus:outline-none" type="datetime-local" value={f.dateFrom} onChange={(e) => f.setDateFrom(e.target.value)} />
          </label>
          <label className="flex items-center gap-2">
            To
            <input className="liquid-glass rounded-full border border-white/10 bg-transparent px-3 py-1.5 text-sm text-white focus:outline-none" type="datetime-local" value={f.dateTo} onChange={(e) => f.setDateTo(e.target.value)} />
          </label>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="table-grid w-full" aria-label="Decisions" role="grid">
          <thead>
            <tr>
              <th><button className="flex items-center hover:text-white" type="button" onClick={() => f.toggleSort("timestamp")}>ID <SortIcon field="timestamp" current={f.sortField} dir={f.sortDir} /></button></th>
              {!compact && <th><button className="flex items-center hover:text-white" type="button" onClick={() => f.toggleSort("agent")}>Agent <SortIcon field="agent" current={f.sortField} dir={f.sortDir} /></button></th>}
              <th><button className="flex items-center hover:text-white" type="button" onClick={() => f.toggleSort("operation")}>Operation <SortIcon field="operation" current={f.sortField} dir={f.sortDir} /></button></th>
              {!compact && <th>Amount</th>}
              <th><button className="flex items-center hover:text-white" type="button" onClick={() => f.toggleSort("timestamp")}>Timestamp <SortIcon field="timestamp" current={f.sortField} dir={f.sortDir} /></button></th>
              {!compact && <th>Staleness</th>}
              <th><button className="flex items-center hover:text-white" type="button" onClick={() => f.toggleSort("status")}>Status <SortIcon field="status" current={f.sortField} dir={f.sortDir} /></button></th>
            </tr>
          </thead>
          <tbody>
            {pg.paged.map((d) => (
              <Fragment key={d.id}>
                <tr
                  className="cursor-pointer hover:bg-white/5 focus-within:bg-white/5"
                  tabIndex={0}
                  role="row"
                  onClick={() => onSelect(d)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(d); } }}
                >
                  <td className="mono">{truncateId(d.id)}</td>
                  {!compact && <td>{d.agent}</td>}
                  <td>{d.operation}</td>
                  {!compact && <td>{d.amount}</td>}
                  <td>{d.timestamp}</td>
                  {!compact && (
                    <td>
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${getFreshnessDotClass(d.freshness)}`} />
                        <span>{d.freshness}</span>
                      </div>
                    </td>
                  )}
                  <td><span className={`font-medium ${STATUS_COLORS[d.status] ?? "text-white/74"}`}>{d.status}</span></td>
                </tr>
                {expandable && selectedId === d.id && (
                  <tr>
                    <td colSpan={compact ? 4 : 7} className="bg-white/[0.03] px-5 py-4">
                      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded-[1.2rem] border border-white/10 p-4">
                          <p className="text-[11px] uppercase tracking-[0.18em] text-white/38">Governance record</p>
                          <p className="mt-3 break-all font-mono text-sm text-white/74">{d.id}</p>
                        </div>
                        <div className="rounded-[1.2rem] border border-white/10 p-4">
                          <p className="text-[11px] uppercase tracking-[0.18em] text-white/38">Approval chain</p>
                          <p className="mt-3 text-sm text-white/74">{d.status}</p>
                        </div>
                        <div className="rounded-[1.2rem] border border-white/10 p-4">
                          <p className="text-[11px] uppercase tracking-[0.18em] text-white/38">Trace linkage</p>
                          <p className="mt-3 break-all font-mono text-sm text-white/74">{d.traceId ?? "No trace attached"}</p>
                        </div>
                        <div className="rounded-[1.2rem] border border-white/10 p-4">
                          <p className="text-[11px] uppercase tracking-[0.18em] text-white/38">Input staleness</p>
                          <div className="mt-3 flex items-center gap-2 text-sm text-white/74">
                            <span className={`h-2.5 w-2.5 rounded-full ${getFreshnessDotClass(d.freshness)}`} />
                            {d.freshness}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
            {pg.paged.length === 0 && (
              <tr><td colSpan={compact ? 4 : 7} className="py-8 text-center text-sm text-white/46">No decisions match your filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <button aria-label="Previous page" className="liquid-glass rounded-full px-4 py-3 text-sm text-white/74 disabled:opacity-40" disabled={!pg.canPrev} type="button" onClick={pg.prev}>Previous</button>
        <span className="text-sm text-white/52">Page {pg.page} of {pg.totalPages}</span>
        <button aria-label="Next page" className="liquid-glass rounded-full px-4 py-3 text-sm text-white/74 disabled:opacity-40" disabled={!pg.canNext} type="button" onClick={pg.next}>Next</button>
      </div>
    </div>
  );
});

const TraceDrawer = memo(function TraceDrawer({
  decision, accessToken, onClose,
}: { decision: DecisionRow | null; accessToken: string | null | undefined; onClose: () => void }) {
  const { trace, loading } = useTrace(decision?.traceId, accessToken);
  const [exporting, setExporting] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (decision) setTimeout(() => closeBtnRef.current?.focus(), 50);
  }, [decision]);

  useEffect(() => {
    if (!decision) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [decision, onClose]);

  const handleExport = useCallback(async () => {
    if (!decision) return;
    setExporting(true);
    try { await exportTracePdf(decision, trace); }
    finally { setExporting(false); }
  }, [decision, trace]);

  return (
    <AnimatePresence>
      {decision && (
        <motion.div
          aria-modal="true"
          className="fixed inset-0 z-[70] bg-black/70 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          role="dialog"
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            className="ml-auto h-full w-full max-w-3xl overflow-auto rounded-[2.6rem] liquid-glass-strong p-6 md:p-8"
            initial={{ x: 120, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 120, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">Forensic Replay</p>
                <h2 className="mt-4 break-all text-4xl serif-italic">{decision.id}</h2>
                <p className="mt-3 text-sm text-white/68">{decision.timestamp} | {decision.agent}</p>
              </div>
              <button ref={closeBtnRef} aria-label="Close" className="liquid-glass flex-shrink-0 rounded-full px-4 py-3 text-sm text-white/74 hover:text-white" type="button" onClick={onClose}>Close</button>
            </div>

            {loading && <div aria-live="polite" className="mt-8 rounded-[2rem] border border-white/10 p-6 text-sm text-white/64">Loading trace reconstruction…</div>}

            <div className="mt-8 grid gap-5">
              {/* Metadata */}
              <div className="grid gap-4 md:grid-cols-2">
                {([["Trace ID", decision.traceId ?? "none"], ["Session ID", decision.sessionId ?? "none"], ["Workflow ID", decision.workflowId ?? "none"], ["Chain Hash", truncateHash(decision.chainHash)]] as [string, string][]).map(([label, value]) => (
                  <div className="liquid-glass rounded-[1.6rem] p-4" key={label}>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/38">{label}</p>
                    <div className="mt-3 flex items-center">
                      <span className="flex-1 break-all text-xl serif-italic">{value}</span>
                      {value !== "none" && <CopyButton value={value} label={label} />}
                    </div>
                  </div>
                ))}
              </div>

              {/* Payload */}
              <div className="liquid-glass rounded-[1.8rem] p-5">
                <p className="eyebrow">Captured Input Parameters</p>
                <div className="mt-4 grid gap-3 text-sm">
                  {trace?.events?.[0]?.payload
                    ? Object.entries(trace.events[0].payload).slice(0, 10).map(([k, v]) => (
                      <div className="flex items-center justify-between rounded-full border border-white/8 px-4 py-3" key={k}>
                        <span className="mono text-white/78">{k}</span>
                        <span className="max-w-[60%] truncate text-white/56">{typeof v === "object" ? JSON.stringify(v) : String(v)}</span>
                      </div>
                    ))
                    : <div className="rounded-full border border-white/8 px-4 py-3 text-white/56">No structured payload fields available.</div>
                  }
                </div>
              </div>

              {/* Integrity summary */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="liquid-glass rounded-[1.6rem] p-4 text-sm leading-7 text-white/72">
                  Integrity: <strong className="text-white">{trace?.integrity_status ?? decision.integrityStatus}</strong>. Events: <strong className="text-white">{trace?.event_count ?? 1}</strong>. Missing links: <strong className="text-white">{trace?.missing_links?.length ?? 0}</strong>.
                </div>
                <div className="liquid-glass rounded-[1.6rem] p-4 text-sm leading-7 text-white/72">
                  {trace ? `${formatDate(trace.started_at)} → ${formatDate(trace.ended_at)}` : "Standalone event record."}
                </div>
              </div>

              {/* Timeline */}
              <div className="liquid-glass rounded-[1.8rem] p-5">
                <p className="eyebrow">Trace Timeline</p>
                <div className="mt-4 grid gap-3">
                  {(trace?.events ?? []).map((ev, i) => (
                    <div className="rounded-[1.4rem] border border-white/8 px-4 py-4" key={ev.log_id}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-xs text-white/60">{i + 1}</span>
                          <span className="font-medium text-white">{ev.event_type}</span>
                        </div>
                        <span className="flex-shrink-0 text-sm text-white/46">{formatDate(ev.created_at)}</span>
                      </div>
                      <div className="mt-2 pl-9 text-sm text-white/56">
                        {ev.source} | <span className={ev.integrity_status === "valid" ? "text-emerald-400" : "text-red-400"}>{ev.integrity_status}</span> | {ev.is_human_authorized ? "Human authorized" : "Automated"}
                      </div>
                    </div>
                  ))}
                  {!trace?.events?.length && !loading && (
                    <div className="rounded-[1.4rem] border border-white/8 px-4 py-4 text-sm text-white/56">No replayable trace sequence found.</div>
                  )}
                </div>
              </div>

              <button
                aria-label="Export trace as PDF"
                className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-4 text-sm font-medium text-black transition-opacity disabled:opacity-60"
                disabled={exporting}
                type="button"
                onClick={() => void handleExport()}
              >
                <DownloadIcon width={16} height={16} />
                {exporting ? "Generating PDF…" : "Export to PDF"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

// ─── View sections ────────────────────────────────────────────────────────────

function ConsoleTopNav({
  workspace,
  companyId,
  role,
  activeTab,
  allowedTabs,
  onTabChange,
}: {
  workspace: string;
  companyId?: string;
  role: UserRole;
  activeTab: SidebarTab;
  allowedTabs: SidebarTab[];
  onTabChange: (tab: SidebarTab) => void;
}) {
  const primaryTabs = allowedTabs.filter((tab) =>
    ["Overview", "Decisions", "Forensic Replay", "Compliance Reports", "Policy Engine"].includes(tab),
  );

  return (
    <div className="liquid-glass-strong sticky top-4 z-40 rounded-[1.8rem] px-4 py-4 md:px-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-[0.24em] text-white/34">Blocklog Console</div>
          <div className="mt-1 truncate text-lg font-medium text-white/86">{workspace}</div>
          <div className="mt-1 font-mono text-[11px] text-white/36">{companyId ?? "No company linked"}</div>
        </div>

        <nav className="flex flex-wrap gap-2 xl:justify-center">
          {primaryTabs.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onTabChange(item)}
              className={`rounded-full px-4 py-2.5 text-sm transition ${
                activeTab === item ? "bg-white/12 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]" : "text-white/58 hover:text-white"
              }`}
            >
              {item === "Policy Engine" ? "Policy" : item}
            </button>
          ))}
        </nav>

        <div className="flex flex-wrap items-center gap-2 xl:justify-end">
          <div className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs text-white/56">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.7)]" />
            Live governance
          </div>
          <button type="button" className="rounded-full border border-white/10 px-3 py-2 text-xs text-white/56 transition hover:text-white">
            Alerts
          </button>
          <Link href="/logout" className="rounded-full border border-white/10 px-3 py-2 text-xs text-white/56 transition hover:text-white">
            Logout
          </Link>
          <div className="rounded-full border border-white/10 px-3 py-2 text-xs uppercase tracking-[0.18em] text-white/56">
            {role === "AUDITOR" ? "Auditor" : role === "ANALYST" ? "Investigator" : role}
          </div>
        </div>
      </div>
      <div className="mt-4 grid gap-2 border-t border-white/8 pt-4 text-[11px] uppercase tracking-[0.18em] text-white/34 md:grid-cols-3">
        <div className="rounded-[1rem] border border-white/8 px-3 py-3">
          Surface
          <div className="mt-2 text-white/68">Forensic operations</div>
        </div>
        <div className="rounded-[1rem] border border-white/8 px-3 py-3">
          Evidence state
          <div className="mt-2 text-white/68">Signed and replayable</div>
        </div>
        <div className="rounded-[1rem] border border-white/8 px-3 py-3">
          View mode
          <div className="mt-2 text-white/68">Pinned navigation</div>
        </div>
      </div>
    </div>
  );
}

function OverviewSection({
  stats,
  loading,
  decisions,
  onSelect,
}: {
  stats: ConsoleStats;
  loading: boolean;
  decisions: DecisionRow[];
  onSelect: (decision: DecisionRow) => void;
}) {
  const latest = decisions.slice(0, 12);
  const pendingReview = decisions.filter((decision) => decision.status === "PENDING").length;
  const stalenessViolations = decisions.filter((decision) => getFreshnessLevel(decision.freshness) === "stale").length;
  const autoApproved = decisions.filter((decision) => decision.status === "Approved").length;

  return (
    <>
      <Reveal className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {([
          ["Governed Decisions", stats.totalRecords.toLocaleString(), formatRelativeTrend(12), "this month"],
          ["Approval Coverage Rate", `${stats.integrityCoverage}%`, formatRelativeTrend(4), "required checkpoints completed"],
          ["Staleness Violations", stalenessViolations.toLocaleString(), formatRelativeTrend(-3), "outside acceptable freshness bounds"],
          ["Decisions Pending Review", pendingReview.toLocaleString(), formatRelativeTrend(6), "awaiting human checkpoint"],
        ] as [string, string, string, string][]).map(([label, value, trend, detail]) => (
          <div className="liquid-glass rounded-[1.7rem] p-5" key={label}>
            <p className="text-xs uppercase tracking-[0.2em] text-white/38">{label}</p>
            <div aria-live="polite" className="mt-4 text-4xl serif-italic">{loading ? <SkeletonValue /> : value}</div>
            <div className="mt-3 flex items-center justify-between text-sm text-white/54">
              <span>{detail}</span>
              <span>{trend}</span>
            </div>
          </div>
        ))}
      </Reveal>

      <Reveal delay={0.06}>
        <div className="liquid-glass-strong rounded-[2rem] p-5">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">Decision signal monitor</p>
              <h2 className="mt-2 text-3xl serif-italic">Outcome river</h2>
            </div>
            <div className="text-sm text-white/46">
              {autoApproved.toLocaleString()} auto-approved | {stats.activeTraces.toLocaleString()} active traces | {stats.anchorsCreated.toLocaleString()} anchors
            </div>
          </div>
          <div className="scrollbar-thin mt-6 overflow-x-auto pb-2">
            <div className="flex min-w-[960px] items-end gap-3">
              {latest.map((decision, index) => {
                const freshnessLevel = getFreshnessLevel(decision.freshness);
                const height = 56 + ((latest.length - index) % 5) * 18;
                return (
                  <button
                    key={decision.id}
                    type="button"
                    onClick={() => onSelect(decision)}
                    className="group flex min-w-[120px] flex-1 flex-col items-start gap-3 text-left"
                  >
                    <div className="w-full rounded-[1.4rem] border border-white/8 bg-white/[0.02] px-3 py-3 transition hover:bg-white/[0.05]">
                      <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-white/34">
                        <span>{truncateId(decision.id, 8)}</span>
                        <span className={STATUS_COLORS[decision.status] ?? "text-white/46"}>{decision.status}</span>
                      </div>
                      <div className="mt-3 text-sm text-white/72">{decision.operation}</div>
                      <div className="mt-1 text-xs text-white/44">{decision.agent}</div>
                    </div>
                    <div className="relative h-28 w-full">
                      <div className="absolute inset-x-0 top-1/2 h-px bg-white/8" />
                      <div
                        className={`absolute bottom-0 left-1/2 w-10 -translate-x-1/2 rounded-full ${
                          freshnessLevel === "stale"
                            ? "bg-red-400/35"
                            : freshnessLevel === "borderline"
                              ? "bg-amber-400/35"
                              : "bg-emerald-400/35"
                        }`}
                        style={{ height }}
                      />
                      <div
                        className={`absolute left-1/2 h-3 w-3 -translate-x-1/2 rounded-full ${getFreshnessDotClass(decision.freshness)}`}
                        style={{ bottom: height }}
                      />
                    </div>
                    <div className="text-xs text-white/48">
                      {decision.timestamp}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Reveal>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Reveal delay={0.08}>
          <div className="liquid-glass-strong rounded-[2rem] p-5">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow">Live governed decisions</p>
                <h2 className="mt-2 text-3xl serif-italic">Evidence feed</h2>
              </div>
              <div className="text-sm text-white/46">Newest first</div>
            </div>
            <div className="scrollbar-thin mt-5 max-h-[480px] overflow-auto rounded-[1.4rem] border border-white/6">
              <table className="table-grid w-full">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Agent ID</th>
                    <th>Operation</th>
                    <th>Amount</th>
                    <th>Inputs staleness</th>
                    <th>Status</th>
                    <th>Record</th>
                  </tr>
                </thead>
                <tbody>
                  {latest.map((decision) => (
                    <tr key={decision.id}>
                      <td>{decision.timestamp}</td>
                      <td className="font-mono">{truncateId(decision.agent, 18)}</td>
                      <td>{decision.operation}</td>
                      <td>{decision.amount}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <span className={`h-2.5 w-2.5 rounded-full ${getFreshnessDotClass(decision.freshness)}`} />
                          {decision.freshness}
                        </div>
                      </td>
                      <td>
                        <span className={`font-medium ${STATUS_COLORS[decision.status] ?? "text-white/74"}`}>{decision.status}</span>
                      </td>
                      <td>
                        <button type="button" className="text-sm text-white/74 underline-offset-4 hover:text-white hover:underline" onClick={() => onSelect(decision)}>
                          View Forensic Record
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="grid gap-4">
            <div className="liquid-glass rounded-[1.8rem] p-5">
              <p className="eyebrow">Operational counters</p>
              <div className="mt-4 grid gap-3">
                {[
                  ["API calls recorded", loading ? null : stats.apiCalls.toLocaleString()],
                  ["Payload volume", loading ? null : `${stats.gbProcessed} GB`],
                  ["Refresh cadence", "SSE with 30s polling fallback"],
                  ["Trust posture", `${stats.integrityCoverage}% integrity coverage`],
                ].map(([label, val]) => (
                  <div className="rounded-[1.2rem] border border-white/10 px-4 py-3 text-sm text-white/72" key={String(label)}>
                    <span className="text-white/42">{label}</span>
                    <div className="mt-2">{val === null ? <SkeletonValue /> : val}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="liquid-glass rounded-[1.8rem] p-5">
              <p className="eyebrow">Integrity posture</p>
              <div className="mt-4 rounded-[1.4rem] border border-white/10 p-4">
                <div className="text-2xl serif-italic">Cryptographic verification active</div>
                <p className="mt-3 text-sm text-white/58">
                  Evidence records are sealed, anchored, and available for replay, export, and audit review.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </>
  );
}

function AgentsSection({ decisions }: { decisions: DecisionRow[] }) {
  const agents = useMemo(() => {
    const map = new Map<string, number>();
    for (const d of decisions) map.set(d.agent, (map.get(d.agent) ?? 0) + 1);
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [decisions]);

  return (
    <div className="space-y-6">
      <Reveal className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {agents.slice(0, 4).map(([agent, count], index) => (
          <div className="liquid-glass rounded-[2rem] p-5" key={agent}>
            <p className="text-xs uppercase tracking-[0.2em] text-white/38">Agent</p>
            <div className="mt-4 text-3xl serif-italic">{agent}</div>
            <p className="mt-3 text-sm text-white/54">{count.toLocaleString()} decisions recorded</p>
            <p className="mt-2 text-xs text-white/36">Fingerprint {truncateId(`${agent}-${index}`, 10)}</p>
          </div>
        ))}
        {agents.length === 0 && <div className="liquid-glass rounded-[2rem] p-5 text-sm text-white/64">No agent records found yet.</div>}
      </Reveal>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="liquid-glass-strong rounded-[2.4rem] p-5">
          <p className="eyebrow">Agent registry</p>
          <div className="scrollbar-thin mt-5 max-h-[480px] overflow-auto rounded-[1.4rem] border border-white/6">
            <table className="table-grid w-full">
              <thead>
                <tr>
                  <th>Agent</th>
                  <th>Status</th>
                  <th>Decisions</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {agents.map(([agent, count], index) => (
                  <tr key={agent}>
                    <td>
                      <div className="text-white/78">{agent}</div>
                      <div className="mt-1 font-mono text-xs text-white/34">key_{truncateId(`${agent}${index}`, 12)}</div>
                    </td>
                    <td>{index % 5 === 0 ? <span className="text-red-400">Revoked</span> : <span className="text-emerald-400">Active</span>}</td>
                    <td>{count.toLocaleString()}</td>
                    <td><button type="button" className="rounded-full border border-white/10 px-3 py-2 text-xs text-white/72 hover:text-white">Revoke</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="liquid-glass rounded-[2.4rem] p-5">
          <p className="eyebrow">Registry posture</p>
          <div className="mt-5 grid gap-3">
            <div className="rounded-[1.4rem] border border-white/10 p-4 text-sm text-white/64">
              Every registered agent is surfaced with a visible action posture, policy assignment context, and immediate revocation control.
            </div>
            <div className="rounded-[1.4rem] border border-white/10 p-4 text-sm text-white/64">
              Click any decision in the Decisions or Forensic Replay views to inspect the execution history tied to the selected agent.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ComplianceSection({ stats }: { stats: ConsoleStats }) {
  const reports = [
    {
      range: "May 1, 2026 - May 31, 2026",
      scope: "All governed financial decisions",
      generatedAt: "May 31, 2026 14:05 UTC",
      key: "ed25519:84f0...2a1c",
      verified: true,
    },
    {
      range: "Apr 1, 2026 - Apr 30, 2026",
      scope: "High-risk approval workflows",
      generatedAt: "May 1, 2026 09:22 UTC",
      key: "ed25519:84f0...2a1c",
      verified: stats.integrityCoverage > 90,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="liquid-glass rounded-[2rem] p-5">
        <p className="eyebrow">Compliance Reports</p>
        <h2 className="mt-3 text-3xl serif-italic">Evidence Summary</h2>
      </div>
      <div className="liquid-glass-strong rounded-[2.4rem] p-5">
        <div className="grid gap-4">
          {reports.map((report) => (
            <div key={report.range} className="grid gap-4 rounded-[1.6rem] border border-white/10 p-4 xl:grid-cols-[1.2fr_1fr_1fr_auto] xl:items-center">
              <div>
                <div className="text-xl serif-italic">{report.range}</div>
                <p className="mt-2 text-sm text-white/54">{report.scope}</p>
              </div>
              <div className="text-sm text-white/58">
                <div>Generated</div>
                <div className="mt-2 text-white/76">{report.generatedAt}</div>
              </div>
              <div className="text-sm text-white/58">
                <div>Signing key fingerprint</div>
                <div className="mt-2 font-mono text-white/76">{report.key}</div>
              </div>
              <div className="flex flex-wrap items-center gap-3 xl:justify-end">
                <span className={`rounded-full border px-3 py-2 text-xs uppercase tracking-[0.18em] ${report.verified ? "border-emerald-400/20 text-emerald-300" : "border-amber-400/20 text-amber-300"}`}>
                  {report.verified ? "Verified" : "Warning"}
                </span>
                <button type="button" className="rounded-full border border-white/10 px-4 py-2.5 text-sm text-white/74 hover:text-white">
                  Preview
                </button>
                <button type="button" className="rounded-full bg-white px-4 py-2.5 text-sm font-medium text-black">
                  Download Signed PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="liquid-glass rounded-[2.4rem] p-6">
        <p className="eyebrow">Document preview</p>
        <div className="mt-5 rounded-[1.8rem] border border-white/10 bg-[#0b0d11] p-6">
          <div className="max-w-3xl space-y-5">
            <h3 className="text-3xl serif-italic">Compliance narrative preview</h3>
            <p className="text-sm leading-7 text-white/68">
              What the AI decided. What it should have escalated. Which inputs were stale at inference time.
              What would have changed the outcome. How the record maps to applicable controls.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.4rem] border border-white/8 p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-white/38">Integrity confirmed</div>
                <div className="mt-3 text-white/78">{stats.integrityCoverage}% of records sealed and verifiable.</div>
              </div>
              <div className="rounded-[1.4rem] border border-white/8 p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-white/38">Anchor proofs</div>
                <div className="mt-3 text-white/78">{stats.anchorsCreated.toLocaleString()} blockchain commitments available.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AuthGateSection({ decisions, onSelect }: { decisions: DecisionRow[]; onSelect: (d: DecisionRow) => void }) {
  const approved = decisions.filter((d) => d.status === "Approved").length;
  const denied = decisions.filter((d) => d.status === "Denied").length;
  const pending = decisions.filter((d) => d.status === "PENDING").length;
  const total = decisions.length;
  const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0;
  const denialRate = total > 0 ? Math.round((denied / total) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="liquid-glass rounded-[2rem] p-5">
        <p className="eyebrow">Authorization Gate</p>
        <h2 className="mt-3 text-3xl serif-italic">Policy Enforcement</h2>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {([["Approved", approved, "text-emerald-400"], ["Denied", denied, "text-red-400"], ["Pending", pending, "text-amber-400"], ["Total", total, "text-white"]] as [string, number, string][]).map(([label, value, color]) => (
          <div className="liquid-glass rounded-[2rem] p-5" key={label}>
            <p className="text-xs uppercase tracking-[0.2em] text-white/38">{label}</p>
            <div className={`mt-4 text-4xl serif-italic ${color}`}>{value}</div>
          </div>
        ))}
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {([["Approval Rate", approvalRate, "bg-emerald-400/60"] as const, ["Denial Rate", denialRate, "bg-red-400/60"] as const]).map(([label, rate, barColor]) => (
          <div className="liquid-glass rounded-[2rem] p-5" key={label}>
            <p className="eyebrow">{label}</p>
            <div className={`mt-4 text-5xl serif-italic ${label === "Approval Rate" ? "text-emerald-400" : "text-red-400"}`}>{rate}%</div>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div className={`h-full rounded-full ${barColor}`} style={{ width: `${rate}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="liquid-glass-strong rounded-[2.4rem] p-5">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Checkpoint review queue</p>
            <h3 className="mt-2 text-2xl serif-italic">Authorization evidence</h3>
          </div>
          <div className="text-sm text-white/46">Focused on checkpoint outcomes</div>
        </div>
        <DecisionsTable decisions={decisions} onSelect={onSelect} compact />
      </div>
    </div>
  );
}

function PolicySection({ decisions, onSelect }: { decisions: DecisionRow[]; onSelect: (d: DecisionRow) => void }) {
  const policies = useMemo(() => {
    const map = new Map<string, { matches: number; violations: number; last: string }>();
    for (const d of decisions) {
      const e = map.get(d.operation) ?? { matches: 0, violations: 0, last: d.createdAt };
      map.set(d.operation, { matches: e.matches + 1, violations: d.status === "Denied" ? e.violations + 1 : e.violations, last: d.createdAt > e.last ? d.createdAt : e.last });
    }
    return [...map.entries()].slice(0, 8);
  }, [decisions]);

  return (
    <div className="space-y-6">
      <div className="liquid-glass rounded-[2rem] p-5">
        <p className="eyebrow">Policy Engine</p>
        <h2 className="mt-3 text-3xl serif-italic">Decision Logic</h2>
      </div>
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="liquid-glass-strong rounded-[2.4rem] p-5">
          <p className="eyebrow">Active policy tree</p>
          <div className="scrollbar-thin mt-5 grid max-h-[560px] gap-4 overflow-auto pr-1">
            {policies.map(([op, { matches, violations, last }], index) => (
              <div key={op} className="rounded-[1.6rem] border border-white/10 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xl serif-italic">{op}</div>
                    <div className="mt-2 text-sm text-white/54">Version v{index + 3}. Activated {new Date(last).toLocaleDateString()}.</div>
                  </div>
                  <div className="text-right text-sm text-white/58">
                    <div>{matches.toLocaleString()} matches</div>
                    <div className={violations > 0 ? "text-red-400" : "text-emerald-400"}>{violations.toLocaleString()} violations</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="liquid-glass rounded-[2.4rem] p-5">
          <p className="eyebrow">Policy testing panel</p>
          <div className="mt-5 rounded-[1.6rem] border border-dashed border-white/10 p-5">
            <h3 className="text-2xl serif-italic">Run a historical decision through the current ruleset</h3>
            <p className="mt-3 text-sm text-white/58">
              Select any decision from the feed below to see which thresholds, approvals, and staleness checks would trigger under the active policy configuration.
            </p>
          </div>
          <div className="mt-5">
            <DecisionsTable decisions={decisions} onSelect={onSelect} compact />
          </div>
        </div>
      </div>
    </div>
  );
}

function ForensicReplaySection({
  decisions,
  selected,
  onSelect,
  trace,
  loading,
  onExport,
  exporting,
}: {
  decisions: DecisionRow[];
  selected: DecisionRow | null;
  onSelect: (decision: DecisionRow) => void;
  trace: TraceDetail | null;
  loading: boolean;
  onExport: () => void;
  exporting: boolean;
}) {
  const visibleDecisions = decisions.slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="liquid-glass rounded-[2rem] p-5">
        <p className="eyebrow">Forensic Replay</p>
        <h2 className="mt-3 text-3xl serif-italic">Chronological causal chain</h2>
      </div>
      <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)_340px]">
        <aside className="liquid-glass rounded-[2rem] p-4 xl:sticky xl:top-40 xl:max-h-[calc(100vh-12rem)]">
          <div className="text-xs uppercase tracking-[0.2em] text-white/38">Decision selector</div>
          <div className="scrollbar-thin mt-4 grid max-h-[68vh] gap-3 overflow-auto pr-1 xl:max-h-[calc(100vh-16rem)]">
            {visibleDecisions.map((decision) => (
              <button
                key={decision.id}
                type="button"
                onClick={() => onSelect(decision)}
                className={`rounded-[1.4rem] border px-4 py-4 text-left transition ${
                  selected?.id === decision.id ? "border-white/20 bg-white/[0.06]" : "border-white/8 bg-white/[0.02] hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-xs text-white/44">{truncateId(decision.id)}</span>
                  <span className={`text-xs ${STATUS_COLORS[decision.status] ?? "text-white/54"}`}>{decision.status}</span>
                </div>
                <div className="mt-3 text-sm text-white/78">{decision.operation}</div>
                <div className="mt-1 text-xs text-white/46">{decision.agent}</div>
              </button>
            ))}
          </div>
        </aside>

        <section className="liquid-glass-strong rounded-[2rem] p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="eyebrow">Execution spine</p>
              <h3 className="mt-2 text-2xl serif-italic">{selected?.id ?? "Select a decision"}</h3>
            </div>
            {selected && (
              <span className={`rounded-full border px-3 py-2 text-xs uppercase tracking-[0.18em] ${STATUS_SURFACE[selected.status] ?? "border-white/10 text-white/58"}`}>
                {selected.status}
              </span>
            )}
          </div>
          <div className="scrollbar-thin mt-6 max-h-[72vh] space-y-4 overflow-auto pr-2">
            {(trace?.events ?? []).map((event, index) => (
              <div key={event.log_id} className="grid grid-cols-[40px_1fr] gap-4">
                <div className="flex flex-col items-center">
                  <div className={`h-4 w-4 rounded-full ${event.is_human_authorized ? "border-2 border-sky-300 bg-transparent" : getFreshnessDotClass(computeFreshness(event.created_at, event.payload))}`} />
                  {index < (trace?.events.length ?? 0) - 1 && <div className="mt-2 h-full w-px bg-white/10" />}
                </div>
                <div className="rounded-[1.4rem] border border-white/10 p-4">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div className="text-white/84">{event.event_type}</div>
                    <div className="text-xs text-white/42">{formatDate(event.created_at)}</div>
                  </div>
                  <div className="mt-3 text-sm text-white/56">
                    {event.source} | {event.is_human_authorized ? "Human approval event" : "Automated event"} | Integrity {event.integrity_status}
                  </div>
                </div>
              </div>
            ))}
            {!trace?.events?.length && (
              <div className="rounded-[1.4rem] border border-white/10 p-4 text-sm text-white/54">
                {loading ? "Reconstructing trace…" : "Select a decision to render the causal chain."}
              </div>
            )}
          </div>
          <div className="mt-6">
            <button
              type="button"
              disabled={!selected || exporting}
              onClick={onExport}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-4 text-sm font-medium text-black disabled:opacity-50"
            >
              <DownloadIcon width={16} height={16} />
              {exporting ? "Generating PDF…" : "Export signed forensic PDF"}
            </button>
          </div>
        </section>

        <aside className="liquid-glass rounded-[2rem] p-5 xl:sticky xl:top-40 xl:max-h-[calc(100vh-12rem)] xl:overflow-auto scrollbar-thin">
          <p className="eyebrow">Counterfactual panel</p>
          <div className="mt-5 space-y-4">
            <div className="rounded-[1.4rem] border border-white/10 p-4 text-sm leading-7 text-white/68">
              {selected
                ? `Approval probability drops below 30% if ${
                    selected.operation
                  } exceeds the current policy threshold. Observed staleness: ${selected.freshness}. Current integrity state: ${
                    selected.integrityStatus
                  }.`
                : "Select a decision to read the policy-sensitive counterfactual summary."}
            </div>
            <div className="rounded-[1.4rem] border border-white/10 p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-white/38">Plain-language threshold</div>
              <div className="mt-3 text-white/78">
                {selected
                  ? `"${selected.operation}" would have required escalation if the freshest acceptable input window had been exceeded by the active policy.`
                  : "No decision selected."}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

function ConsolePageInner({ session }: { session: BlocklogSession }) {
  const [selected, setSelected] = useState<DecisionRow | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const { stats, decisions, workspace, loading, error } = useConsoleData(session.accessToken, session.companyId);
  const role: UserRole = (session as BlocklogSession & { role?: UserRole }).role ?? "ADMIN";
  const allowedTabs = ROLE_TABS[role];
  const allowedTabList = useMemo(
    () => SIDEBAR_ITEMS.filter((item) => allowedTabs.has(item)),
    [allowedTabs],
  );
  const tabFromQuery = TAB_FROM_SLUG[sp.get(TAB_PARAM) ?? ""];
  const activeTab = allowedTabs.has(tabFromQuery ?? "Overview")
    ? (tabFromQuery ?? "Overview")
    : (allowedTabList[0] ?? "Overview");

  const handleSelect = useCallback((d: DecisionRow) => setSelected(d), []);
  const handleClose = useCallback(() => setSelected(null), []);
  const handleTabChange = useCallback((t: SidebarTab) => {
    const params = new URLSearchParams(sp.toString());
    params.set(TAB_PARAM, TAB_SLUGS[t]);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, router, sp]);

  useEffect(() => {
    if (sp.get(TAB_PARAM)) {
      return;
    }
    const params = new URLSearchParams(sp.toString());
    params.set(TAB_PARAM, TAB_SLUGS[activeTab]);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [activeTab, pathname, router, sp]);

  const { trace, loading: traceLoading } = useTrace(selected?.traceId, session.accessToken);
  const [exportingInline, setExportingInline] = useState(false);
  const handleInlineExport = useCallback(async () => {
    if (!selected) return;
    setExportingInline(true);
    try {
      await exportTracePdf(selected, trace);
    } finally {
      setExportingInline(false);
    }
  }, [selected, trace]);

  const renderSection = () => {
    switch (activeTab) {
      case "Agents": return <AgentsSection decisions={decisions} />;
      case "Decisions": return (
        <div className="space-y-4">
          <div className="liquid-glass rounded-[2rem] p-5">
            <p className="eyebrow">Recent Decisions Feed</p>
            <h2 className="mt-3 text-3xl serif-italic">Decision Plane</h2>
          </div>
          <DecisionsTable decisions={decisions} onSelect={handleSelect} expandable selectedId={selected?.id ?? null} />
        </div>
      );
      case "Forensic Replay": return <ForensicReplaySection decisions={decisions} selected={selected} onSelect={handleSelect} trace={trace} loading={traceLoading} onExport={() => void handleInlineExport()} exporting={exportingInline} />;
      case "Compliance Reports": return <ComplianceSection stats={stats} />;
      case "Authorization Gate": return <AuthGateSection decisions={decisions} onSelect={handleSelect} />;
      case "Policy Engine": return <PolicySection decisions={decisions} onSelect={handleSelect} />;
      case "Audit Log": return (
        <div className="space-y-6">
          <div className="liquid-glass rounded-[2rem] p-5">
            <p className="eyebrow">Audit Log</p>
            <h2 className="mt-3 text-3xl serif-italic">Event History</h2>
          </div>
          <DecisionsTable decisions={decisions} onSelect={handleSelect} />
        </div>
      );
      case "Settings": return (
        <div className="space-y-6">
          <div className="liquid-glass rounded-[2rem] p-5">
            <p className="eyebrow">Settings</p>
            <h2 className="mt-3 text-3xl serif-italic">Console Configuration</h2>
            <p className="mt-3 text-sm text-white/64">Manage workspace connection and backend integration options.</p>
          </div>
          <div className="liquid-glass rounded-[2.4rem] p-5 text-sm text-white/64">
            Console settings are centralized in the backend admin area. Ensure your tokens and company configuration are up to date.
          </div>
        </div>
      );
      default: return <OverviewSection stats={stats} loading={loading} decisions={decisions} onSelect={handleSelect} />;
    }
  };

  return (
    <div className="page-shell">
      <PageFrame className="pb-12">
        <div className="content-wrap pt-6 md:pt-8">
          <div className="space-y-6">
            <ConsoleTopNav workspace={workspace} companyId={session.companyId} role={role} activeTab={activeTab} allowedTabs={allowedTabList} onTabChange={handleTabChange} />

            <div className="grid gap-4 xl:grid-cols-[1fr_260px]">
              <main aria-label={`${activeTab} view`} className="space-y-6">
                {error && (
                  <div aria-live="assertive" className="liquid-glass rounded-[2rem] p-4 text-sm text-red-400/80" role="alert">
                    Console data could not be loaded: {error}
                  </div>
                )}
                {renderSection()}
              </main>

              <aside className="space-y-4 xl:sticky xl:top-40 xl:max-h-[calc(100vh-11rem)] xl:overflow-auto xl:pr-1 scrollbar-thin">
                <div className="liquid-glass rounded-[1.8rem] p-4">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-white/34">Role scoped views</div>
                  <div className="mt-4 grid gap-2">
                    {allowedTabList.filter((tab) => !["Overview", "Decisions", "Forensic Replay", "Compliance Reports", "Policy Engine"].includes(tab)).map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => handleTabChange(item)}
                        className={`rounded-[1rem] border px-3 py-3 text-left text-sm transition ${
                          activeTab === item ? "border-white/18 bg-white/[0.07] text-white" : "border-white/8 text-white/58 hover:text-white"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="liquid-glass rounded-[1.8rem] p-4">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-white/34">Workspace metadata</div>
                  <div className="mt-4 space-y-3 text-sm text-white/62">
                    <div>
                      <div className="text-white/38">Company ID</div>
                      <div className="mt-1 font-mono text-white/74">{session.companyId}</div>
                    </div>
                    <div>
                      <div className="text-white/38">Surface</div>
                      <div className="mt-1 text-white/74">Console evidence layer</div>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-2 border-t border-white/10 pt-4">
                    <Link className="rounded-[1rem] border border-white/8 px-3 py-3 text-sm text-white/74 transition hover:text-white" href="/docs">
                      Documentation
                    </Link>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>

        <TraceDrawer decision={selected} accessToken={session.accessToken} onClose={handleClose} />
      </PageFrame>
    </div>
  );
}

export default function ConsolePage() {
  const router = useRouter();
  const session = useSyncExternalStore(
    subscribeSession,
    getSessionSnapshot,
    getServerSessionSnapshot,
  );
  const ready = Boolean(session.accessToken);

  useEffect(() => {
    if (!ready) {
      router.replace("/login?next=/console");
    }
  }, [ready, router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white/80" aria-label="Loading" />
      </div>
    );
  }

  return (
    // Suspense boundary for useSearchParams used inside DecisionsTable → useFilteredDecisions
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white/80" />
      </div>
    }>
      <ConsolePageInner session={session} />
    </Suspense>
  );
}
