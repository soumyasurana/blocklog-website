"use client";

import type { ReactNode } from "react";
import { useEffect, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import DashboardSidebar from "@/components/DashboardSidebar";
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
            Validating session...
          </p>
        </div>
      </main>
    );
  }

  return (
    <div className="dashboard">
      <DashboardSidebar />
      <main className="dashboard-main">{children}</main>
    </div>
  );
}
