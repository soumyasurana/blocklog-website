"use client";

import { useRouter } from "next/navigation";
import { clearSession, readSession } from "@/lib/blocklog";

export default function DashboardTopBar({ title }: { title: string }) {
  const router = useRouter();
  const companyId = readSession().companyId ?? "not-set";

  function logout() {
    clearSession();
    router.replace("/login");
  }

  return (
    <div className="dashboard-top">
      <div className="dashboard-top-copy">
        <p className="eyebrow" style={{ marginBottom: 8 }}>Control plane</p>
        <h1 style={{ margin: 0 }}>{title}</h1>
        <p className="muted" style={{ margin: "6px 0 0" }}>
          Trust domain: {companyId}
        </p>
      </div>
      <div className="dashboard-top-actions">
        <span className="status-pill status-valid">Console live</span>
        <button className="btn" onClick={logout} type="button">
          Logout
        </button>
      </div>
    </div>
  );
}
