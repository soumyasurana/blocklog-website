import type { ReactNode } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="dashboard">
      <DashboardSidebar />
      <main className="dashboard-main">{children}</main>
    </div>
  );
}
