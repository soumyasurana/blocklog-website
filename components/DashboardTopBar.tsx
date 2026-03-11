"use client";

import { useRouter } from "next/navigation";
import { clearSession, readSession } from "@/lib/blocklog";
import ThemeToggle from "./ThemeToggle";

export default function DashboardTopBar({ title }: { title: string }) {
  const router = useRouter();
  const companyId = readSession().companyId ?? "not-set";

  function logout() {
    clearSession();
    router.replace("/login");
  }

  return (
    <div className="dashboard-top">
      <div>
        <h1 style={{ margin: 0 }}>{title}</h1>
        <p className="muted" style={{ margin: "4px 0 0" }}>
          Company: {companyId}
        </p>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button className="btn" onClick={logout} type="button">
          Logout
        </button>
        <ThemeToggle />
      </div>
    </div>
  );
}
