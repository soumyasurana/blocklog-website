"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/logs", label: "Log Explorer" },
  { href: "/dashboard/ingestion-monitor", label: "Ingestion Monitor" },
  { href: "/dashboard/verify", label: "Verification Tool" },
  { href: "/dashboard/audit-trail", label: "Audit Trail" },
  { href: "/dashboard/api-keys", label: "API Keys" },
  { href: "/dashboard/playground", label: "Developer Playground" },
  { href: "/dashboard/errors", label: "Error Monitoring" },
  { href: "/dashboard/notifications", label: "Notifications" },
  { href: "/dashboard/settings", label: "Settings" },
  { href: "/docs", label: "Documentation" },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <Link className="brand" href="/dashboard">
        <span className="brand-mark" />
        <span>
          Blocklog Console
          <small className="brand-subtitle">Assurance Layer</small>
        </span>
      </Link>
      <div className="sidebar-chip">
        <strong>Operational trust</strong>
        <span>Cryptographic logging, verification, evidence export.</span>
      </div>
      <nav>
        {links.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              className={`nav-item${active ? " active" : ""}`}
              href={item.href}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
