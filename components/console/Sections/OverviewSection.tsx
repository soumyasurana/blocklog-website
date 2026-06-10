"use client";

import { Reveal } from "@/components/site/Primitives";
import type { DecisionRow } from "@/types/console";
import { getFreshnessLevel } from "@/lib/console/decisionUtils";
import { truncateId } from "@/lib/console/formatters";

// ── Stat card ────────────────────────────────────────────────────────────────

type StatCardProps = {
  label: string;
  value: string;
  sub?: string;
  intent?: "default" | "success" | "danger";
  icon: React.ReactNode;
};

function StatCard({ label, value, sub, intent = "default", icon }: StatCardProps) {
  const valueColor =
    intent === "success"
      ? "text-emerald-400"
      : intent === "danger"
      ? "text-red-400"
      : "text-white";

  return (
    <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
      <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-white/38">
        <span className="text-white/30">{icon}</span>
        {label}
      </p>
      <p className={`mt-3 text-3xl font-semibold ${valueColor}`}>{value}</p>
      {sub && <p className="mt-1 text-[11px] text-white/30">{sub}</p>}
    </div>
  );
}

// ── Compliance check strip ───────────────────────────────────────────────────

type CheckStatus = "ok" | "warn" | "alert" | "info";

type ComplianceCheck = {
  label: string;
  status: string;
  intent: CheckStatus;
  icon: React.ReactNode;
};

function ComplianceChip({ label, status, intent, icon }: ComplianceCheck) {
  const colors: Record<CheckStatus, string> = {
    ok:    "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    warn:  "border-amber-500/30  bg-amber-500/10  text-amber-300",
    alert: "border-red-500/30    bg-red-500/10    text-red-300",
    info:  "border-sky-500/30    bg-sky-500/10    text-sky-300",
  };

  return (
    <div
      className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium ${colors[intent]}`}
    >
      <span className="shrink-0">{icon}</span>
      <span className="text-white/50">{label}:</span>
      <span>{status}</span>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function freshnessIntent(level: string): CheckStatus {
  if (level === "fresh")    return "ok";
  if (level === "moderate") return "warn";
  if (level === "stale")    return "alert";
  return "info";
}

function getTimeSince(decisions: DecisionRow[]): string {
  if (!decisions.length) return "—";
  const ts = (decisions[0] as DecisionRow & { timestamp?: string }).timestamp;
  if (!ts) return "—";
  const diffMin = Math.floor((Date.now() - new Date(ts).getTime()) / 60_000);
  if (diffMin < 1)   return "just now";
  if (diffMin < 60)  return `${diffMin}m ago`;
  return `${Math.floor(diffMin / 60)}h ago`;
}

// ── Icons (inline SVG, no extra deps) ───────────────────────────────────────

const Icons = {
  db:        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/></svg>,
  check:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 6 9 17l-5-5"/></svg>,
  x:         <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 6 6 18M6 6l12 12"/></svg>,
  fp:        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2"/><path d="M12 8v4l3 3"/></svg>,
  auditLog:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>,
  lock:      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  refresh:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  user:      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  alert:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  chart:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6"  y1="20" x2="6"  y2="14"/></svg>,
};

// ── Main component ───────────────────────────────────────────────────────────

export default function OverviewSection({
  decisions,
  loading,
}: {
  decisions: DecisionRow[];
  loading: boolean;
}) {
  const total    = decisions.length;
  const approved = decisions.filter((d) => d.status === "Approved").length;
  const denied   = decisions.filter((d) => d.status === "Denied").length;
  const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0;

  const freshnessLevel = decisions.length > 0
    ? getFreshnessLevel(decisions[0].freshness)
    : "unknown";

  const latestId   = decisions.length > 0 ? truncateId(decisions[0].id) : "None";
  const timeSince  = getTimeSince(decisions);

  const complianceChecks: ComplianceCheck[] = [
    { label: "Audit logging",    status: "Active",      intent: "ok",    icon: Icons.auditLog },
    { label: "Access control",   status: "Enforced",    intent: "ok",    icon: Icons.lock     },
    { label: "Policy freshness", status: freshnessLevel === "unknown" ? "Unknown" : freshnessLevel === "fresh" ? "Up to date" : freshnessLevel === "borderline" ? "Review due" : "Stale", intent: freshnessIntent(freshnessLevel), icon: Icons.refresh },
    { label: "Human oversight",  status: "Required",    intent: "ok",    icon: Icons.user     },
    { label: "Explainability",   status: "Tracked",     intent: "info",  icon: Icons.chart    },
    { label: "Anomaly alerts",   status: denied > 5 ? `${denied} open` : "None", intent: denied > 5 ? "alert" : "ok", icon: Icons.alert },
  ];

  return (
    <Reveal>
      <section className="grid gap-6">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">

          {/* ── Header ── */}
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="eyebrow">AI Governance · Blocklog Console</p>

              <h2 className="mt-3 text-3xl font-semibold text-white">
                Overview
              </h2>

              <p className="mt-2 max-w-2xl text-sm text-white/58">
                Real-time view of agent decision flow, audit surface health,
                and governance compliance posture across active workloads.
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap gap-2 lg:justify-end">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
                {Icons.check}
                Policy enforced
              </span>
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${
                freshnessLevel === "fresh"
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                  : freshnessLevel === "borderline"
                  ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
                  : "border-red-500/30 bg-red-500/10 text-red-300"
              }`}>
                {Icons.refresh}
                Freshness: {freshnessLevel}
              </span>
            </div>
          </div>

          {/* ── Stat cards ── */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total decisions"
              icon={Icons.db}
              value={loading ? "—" : String(total)}
              sub="Across all agents"
            />
            <StatCard
              label="Approved"
              icon={Icons.check}
              intent="success"
              value={loading ? "—" : String(approved)}
              sub={loading ? undefined : `${approvalRate}% approval rate`}
            />
            <StatCard
              label="Denied"
              icon={Icons.x}
              intent="danger"
              value={loading ? "—" : String(denied)}
              sub="Policy-blocked actions"
            />
            <StatCard
              label="Latest decision"
              icon={Icons.fp}
              value={loading ? "—" : latestId}
              sub={loading ? undefined : timeSince}
            />
          </div>

          {/* ── Compliance checks ── */}
          <div className="mt-6 border-t border-white/10 pt-5">
            <p className="mb-3 text-[11px] uppercase tracking-[0.2em] text-white/38">
              Governance compliance checks
            </p>
            <div className="flex flex-wrap gap-2">
              {complianceChecks.map((c) => (
                <ComplianceChip key={c.label} {...c} />
              ))}
            </div>
          </div>

        </div>
      </section>
    </Reveal>
  );
}