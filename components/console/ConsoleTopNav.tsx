"use client";

import Link from "next/link";
import type { UserRole } from "@/types/console";

export default function ConsoleTopNav({
  workspace,
  companyId,
  role,
}: {
  workspace: string;
  companyId?: string;
  role: UserRole;
}) {
  return (
    <div className="liquid-glass-strong sticky top-4 z-40 mb-6 rounded-[1.8rem] px-4 py-4 md:px-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-[0.24em] text-white/34">Blocklog Console</div>
          <div className="mt-1 truncate text-lg font-medium text-white/86">{workspace}</div>
          <div className="mt-1 font-mono text-[11px] text-white/36">{companyId ?? "No company linked"}</div>
        </div>

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
