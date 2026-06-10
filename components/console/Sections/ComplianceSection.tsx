"use client";

import { Reveal } from "@/components/site/Primitives";

// ── Score ring ────────────────────────────────────────────────────────────────
function ScoreRing({ score }: { score: number }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 80 ? "#4ade80" : score >= 60 ? "#facc15" : "#f87171";

  return (
    <div className="relative flex h-24 w-24 items-center justify-center">
      <svg className="-rotate-90" height={96} viewBox="0 0 96 96" width={96}>
        <circle cx={48} cy={48} fill="none" r={r} stroke="rgba(255,255,255,0.08)" strokeWidth={8} />
        <circle
          cx={48}
          cy={48}
          fill="none"
          r={r}
          stroke={color}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          strokeWidth={8}
          style={{ transition: "stroke-dasharray 0.8s ease" }}
        />
      </svg>
      <span className="absolute text-xl font-semibold text-white">{score}%</span>
    </div>
  );
}

// ── Report row ────────────────────────────────────────────────────────────────
type ReportStatus = "passing" | "review" | "failing";

interface Report {
  id: string;
  name: string;
  framework: string;
  lastRun: string;
  coverage: number;
  status: ReportStatus;
}

const STATUS_META: Record<ReportStatus, { label: string; dot: string; text: string }> = {
  passing: { label: "Passing",  dot: "bg-green-400",  text: "text-green-400"  },
  review:  { label: "Review",   dot: "bg-yellow-400", text: "text-yellow-400" },
  failing: { label: "Failing",  dot: "bg-red-400",    text: "text-red-400"    },
};

function ReportRow({ report }: { report: Report }) {
  const meta = STATUS_META[report.status];
  return (
    <div className="flex items-center gap-4 rounded-[1.4rem] border border-white/8 bg-white/3 px-5 py-4 transition hover:bg-white/6">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
          <p className="truncate text-sm font-medium text-white">{report.name}</p>
        </div>
        <p className="mt-0.5 text-xs text-white/40">{report.framework} · Last run {report.lastRun}</p>
      </div>

      {/* Coverage bar */}
      <div className="hidden sm:flex flex-col items-end gap-1 w-28">
        <span className="text-xs text-white/40">{report.coverage}% coverage</span>
        <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-white/40"
            style={{ width: `${report.coverage}%` }}
          />
        </div>
      </div>

      <span className={`text-xs font-medium ${meta.text} shrink-0`}>{meta.label}</span>

      <button
        aria-label={`Download ${report.name}`}
        className="shrink-0 rounded-full border border-white/10 p-2 text-white/40 transition hover:text-white"
      >
        <svg fill="none" height={14} stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" width={14}>
          <path d="M12 3v12m0 0-4-4m4 4 4-4M3 17v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

// ── Timeline strip ────────────────────────────────────────────────────────────
const TIMELINE: { label: string; event: string; when: string }[] = [
  { label: "SOC 2 Type II",      event: "Audit window opened",   when: "2 days ago"  },
  { label: "GDPR Article 30",    event: "Record updated",        when: "5 days ago"  },
  { label: "ISO 27001 Annex A",  event: "Control gap resolved",  when: "11 days ago" },
];

function TimelineStrip() {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/3 p-6">
      <p className="eyebrow mb-4">Recent activity</p>
      <ol className="space-y-4">
        {TIMELINE.map((t, i) => (
          <li key={i} className="flex items-start gap-3 text-sm">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white/30" />
            <div className="flex-1">
              <span className="text-white/80">{t.label}</span>
              <span className="text-white/40"> — {t.event}</span>
            </div>
            <span className="shrink-0 text-xs text-white/30">{t.when}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

// ── Main section ──────────────────────────────────────────────────────────────
const MOCK_REPORTS: Report[] = [
  { id: "r1", name: "SOC 2 Type II",     framework: "AICPA",    lastRun: "Jun 8",  coverage: 94, status: "passing" },
  { id: "r2", name: "GDPR Article 30",   framework: "EU GDPR",  lastRun: "Jun 5",  coverage: 78, status: "review"  },
  { id: "r3", name: "ISO 27001 Annex A", framework: "ISO",      lastRun: "May 30", coverage: 61, status: "failing" },
  { id: "r4", name: "HIPAA Security",    framework: "HHS",      lastRun: "May 28", coverage: 88, status: "passing" },
];

export default function ComplianceSection({
  complianceScore,
  activeReports,
}: {
  complianceScore: number;
  activeReports: number;
}) {
  const passing = MOCK_REPORTS.filter((r) => r.status === "passing").length;
  const failing = MOCK_REPORTS.filter((r) => r.status === "failing").length;

  return (
    <Reveal>
      <section className="grid gap-6">

        {/* Header card */}
        <div className="rounded-[2rem] border border-white/10 bg-white/3 p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="eyebrow">Compliance reports</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Regulatory posture</h2>
              <p className="mt-1 text-sm text-white/50">
                {activeReports} active report{activeReports !== 1 ? "s" : ""} across {MOCK_REPORTS.length} frameworks.
              </p>
            </div>
            <ScoreRing score={complianceScore} />
          </div>

          {/* Quick stats */}
          <div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/8 pt-6">
            {[
              { label: "Frameworks",    value: String(MOCK_REPORTS.length) },
              { label: "Passing",       value: String(passing)             },
              { label: "Need attention",value: String(failing)             },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-[1.2rem] border border-white/8 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-white/34">{label}</p>
                <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Report rows */}
        <div className="space-y-2">
          {MOCK_REPORTS.map((r) => (
            <ReportRow key={r.id} report={r} />
          ))}
        </div>

        {/* Timeline */}
        <TimelineStrip />

      </section>
    </Reveal>
  );
}