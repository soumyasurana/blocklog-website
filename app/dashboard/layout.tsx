"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import DashboardSidebar from "@/components/DashboardSidebar";
import { readSession } from "@/lib/blocklog";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const session = readSession();
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
