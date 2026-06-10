"use client";

import Link from "next/link";

export type BlocklogInterface = "dashboard" | "governance";

export default function BlocklogShell({ current }: { current: BlocklogInterface }) {
  return (
    <header
      id="blocklog-shell"
      className="liquid-glass-strong fixed top-0 left-0 right-0 z-50 flex h-14 items-center gap-3 px-4"
      style={{
        borderRadius: 0,
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* ── Logo ── */}
      <Link
        href="/"
        className="flex items-center gap-2.5 flex-shrink-0 group"
        aria-label="Blocklog home"
      >
        <span className="text-[15px] font-bold tracking-tight text-white/90 transition-colors group-hover:text-white">
          Blocklog
        </span>
      </Link>

      {/* ── Divider ── */}
      <span
        aria-hidden="true"
        className="h-5 w-px flex-shrink-0"
        style={{ background: "rgba(255,255,255,0.1)" }}
      />

      {/* ── Active interface label ── */}
      <span className="text-[13px] font-medium tracking-wide text-white/44">
        {current === "dashboard" ? "Dashboard" : "Governance"}
      </span>

      {/* ── Spacer ── */}
      <div className="flex-1" />

      {/* ── Interface switcher ── */}
      <nav
        id="interface-switcher"
        aria-label="Switch interface"
        className="flex items-center gap-1 rounded-full p-1"
        style={{
          border: "1px solid rgba(255,255,255,0.09)",
          background: "rgba(255,255,255,0.03)",
        }}
      >
        <Link
          href="/dashboard"
          id="switch-to-dashboard"
          aria-current={current === "dashboard" ? "page" : undefined}
          className={`flex flex-col items-center gap-[3px] rounded-full px-4 py-[6px] transition-all duration-200 ${
            current === "dashboard"
              ? "text-white"
              : "text-white/48 hover:text-white/72"
          }`}
          style={
            current === "dashboard"
              ? {
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.09), rgba(255,255,255,0.04))",
                  boxShadow:
                    "0 1px 3px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.11)",
                }
              : undefined
          }
        >
          <span className="text-[13px] font-semibold leading-none">
            Dashboard
          </span>
          <span
            className={`text-[9.5px] uppercase leading-none tracking-[0.14em] transition-colors ${
              current === "dashboard" ? "text-white/50" : "text-white/26"
            }`}
          >
            Engineers
          </span>
        </Link>

        <Link
          href="/console"
          id="switch-to-governance"
          aria-current={current === "governance" ? "page" : undefined}
          className={`flex flex-col items-center gap-[3px] rounded-full px-4 py-[6px] transition-all duration-200 ${
            current === "governance"
              ? "text-white"
              : "text-white/48 hover:text-white/72"
          }`}
          style={
            current === "governance"
              ? {
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.09), rgba(255,255,255,0.04))",
                  boxShadow:
                    "0 1px 3px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.11)",
                }
              : undefined
          }
        >
          <span className="text-[13px] font-semibold leading-none">
            Governance
          </span>
          <span
            className={`text-[9.5px] uppercase leading-none tracking-[0.14em] transition-colors ${
              current === "governance" ? "text-white/50" : "text-white/26"
            }`}
          >
            Compliance
          </span>
        </Link>
      </nav>
    </header>
  );
}
