"use client";

import { Suspense, useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageFrame } from "@/components/site/Primitives";
import { readSession, subscribeSession, type BlocklogSession } from "@/lib/blocklog";
import { useConsoleData } from "@/hooks/console/useConsoleData";
import ConsoleTopNav from "@/components/console/ConsoleTopNav";
import TraceDrawer from "@/components/console/Trace/TraceDrawer";
import type { DecisionRow, SidebarTab, UserRole } from "@/types/console";

const ROLE_TABS: Record<UserRole, Set<SidebarTab>> = {
  ADMIN: new Set(["Overview", "Agents", "Decisions", "Forensic Replay", "Compliance Reports", "Authorization Gate", "Policy Engine", "Audit Log", "Settings"]),
  AUDITOR: new Set(["Overview", "Decisions", "Forensic Replay", "Compliance Reports", "Authorization Gate", "Audit Log"]),
  ANALYST: new Set(["Overview", "Agents", "Decisions", "Forensic Replay", "Policy Engine"]),
  VIEWER: new Set(["Overview", "Decisions"]),
};

function getSessionSnapshot() {
  return readSession();
}

const EMPTY_SESSION: BlocklogSession = {
  accessToken: "",
  companyId: "",
} as BlocklogSession;

function getServerSessionSnapshot() {
  return EMPTY_SESSION;
}
export function ConsolePageWrapperInner({
  children,
  requiredTab,
}: {
  children: (props: {
    stats: any;
    decisions: DecisionRow[];
    loading: boolean;
    selected: DecisionRow | null;
    handleSelect: (d: DecisionRow) => void;
  }) => React.ReactNode;
  requiredTab: SidebarTab;
}) {
  const router = useRouter();
  const session = useSyncExternalStore(subscribeSession, getSessionSnapshot, getServerSessionSnapshot);
  
  const ready = Boolean(session.accessToken);
  const { stats, decisions, workspace, loading, error } = useConsoleData(session.accessToken, session.companyId);
  
  const role: UserRole = (session as BlocklogSession & { role?: UserRole }).role ?? "ADMIN";
  const allowedTabs = ROLE_TABS[role];

  const [selected, setSelected] = useState<DecisionRow | null>(null);
  const handleSelect = useCallback((d: DecisionRow) => setSelected(d), []);
  const handleClose = useCallback(() => setSelected(null), []);

  useEffect(() => {
    if (!ready) {
      router.replace("/login?next=/console");
    } else if (!allowedTabs.has(requiredTab)) {
      router.replace("/console"); // Redirect unauthorized roles to Overview
    }
  }, [ready, router, allowedTabs, requiredTab]);

  if (!ready || !allowedTabs.has(requiredTab)) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white/80" />
      </div>
    );
  }

  return (
    <div className="page-shell">
      <PageFrame className="pb-12">
        <div className="content-wrap pt-6 md:pt-8">
          <div className="space-y-6">
            <ConsoleTopNav workspace={workspace} companyId={session.companyId} role={role} />

            <div className="grid gap-4 xl:grid-cols-[1fr_260px]">
              <main aria-label={`${requiredTab} view`} className="space-y-6">
                {error && (
                  <div aria-live="assertive" className="liquid-glass rounded-[2rem] p-4 text-sm text-red-400/80" role="alert">
                    Console data could not be loaded: {error}
                  </div>
                )}
                {children({ stats, decisions, loading, selected, handleSelect })}
              </main>

              <aside className="space-y-4 xl:sticky xl:top-40 xl:max-h-[calc(100vh-11rem)] xl:overflow-auto xl:pr-1 scrollbar-thin">
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

export default function ConsolePageWrapper({
  children,
  requiredTab,
}: {
  children: (props: {
    stats: any;
    decisions: DecisionRow[];
    loading: boolean;
    selected: DecisionRow | null;
    handleSelect: (d: DecisionRow) => void;
  }) => React.ReactNode;
  requiredTab: SidebarTab;
}) {
  return (
    <Suspense fallback={
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white/80" />
      </div>
    }>
      <ConsolePageWrapperInner requiredTab={requiredTab}>
        {children}
      </ConsolePageWrapperInner>
    </Suspense>
  );
}
