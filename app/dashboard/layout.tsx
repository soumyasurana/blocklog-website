"use client";

import type { ReactNode } from "react";
import { useEffect, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import BlocklogShell from "@/components/nav/BlocklogShell";
import DashboardSidebarNav from "@/components/nav/DashboardSidebarNav";
import { readSession, subscribeSession, type BlocklogSession } from "@/lib/blocklog";

const EMPTY_SESSION: BlocklogSession = {};

function getSessionSnapshot() {
  return readSession();
}

function getServerSessionSnapshot(): BlocklogSession {
  return EMPTY_SESSION;
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const session = useSyncExternalStore(
    subscribeSession,
    getSessionSnapshot,
    getServerSessionSnapshot,
  );
  const ready = Boolean(session.accessToken);

  useEffect(() => {
    if (!ready) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [pathname, ready, router]);

  if (!ready) {
    return (
      <main className="auth-page">
        <div className="card auth-card">
          <div className="spinner" />
          <p className="muted" style={{ marginBottom: 0 }}>
            Validating session…
          </p>
        </div>
      </main>
    );
  }

  return (
    <>
      {/* Fixed top shell — 56 px */}
      <BlocklogShell current="dashboard" />

      {/* Fixed left sidebar — 240 px, sits below the shell */}
      <DashboardSidebarNav />

      {/* Main content area
          - pt-14  : clears the 56 px shell on all screens
          - md:pl-60: 240 px sidebar offset on ≥768 px
          - pb-16  : clears the 64 px mobile tab bar on small screens
          - md:pb-0: reset on desktop
      */}
      <main
        id="dashboard-content"
        className="min-h-screen pt-14 pb-16 md:pb-0 md:pl-60"
        style={{
          background:
            "radial-gradient(circle at top right, rgba(123,247,212,0.06), transparent 22%), linear-gradient(180deg, rgba(255,255,255,0.012), transparent 30%)",
        }}
      >
        <div className="p-6 md:p-7">
          {children}
        </div>
      </main>
    </>
  );
}
