"use client";

import { useMemo } from "react";
import { clearSession, readSession } from "@/lib/blocklog";
import ThemeToggle from "./ThemeToggle";

export default function DashboardTopBar({ title }: { title: string }) {
  const session = useMemo(() => readSession(), []);

  return (
    <div className="dashboard-top">
      <div>
        <h1 style={{ margin: 0 }}>{title}</h1>
        <p className="muted" style={{ margin: "4px 0 0" }}>
          Company: {session.companyId ?? "not-set"}
        </p>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button className="btn" onClick={clearSession} type="button">
          Clear Session
        </button>
        <ThemeToggle />
      </div>
    </div>
  );
}
