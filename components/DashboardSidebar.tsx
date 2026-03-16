"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const groups = [
  {
    title: "Command",
    links: [
      { href: "/dashboard", label: "Overview" },
      { href: "/dashboard/api-endpoints", label: "API Command Center" },
      { href: "/dashboard/playground", label: "Developer Playground" },
    ],
  },
  {
    title: "Operations",
    links: [
      { href: "/dashboard/logs", label: "Log Explorer" },
      { href: "/dashboard/ingestion-monitor", label: "Ingestion Monitor" },
      { href: "/dashboard/verify", label: "Verification Tool" },
      { href: "/dashboard/audit-trail", label: "Audit Trail" },
      { href: "/dashboard/errors", label: "Error Monitoring" },
      { href: "/dashboard/notifications", label: "Notifications" },
    ],
  },
  {
    title: "Configuration",
    links: [
      { href: "/dashboard/api-keys", label: "API Keys" },
      { href: "/dashboard/settings", label: "Settings" },
      { href: "/docs", label: "Documentation" },
    ],
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <Link className="brand" href="/">
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
      <nav className="sidebar-nav-groups">
        {groups.map((group) => (
          <div className="sidebar-group" key={group.title}>
            <p className="sidebar-group-title">{group.title}</p>
            <div className="sidebar-group-links">
              {group.links.map((item) => {
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
            </div>
          </div>
        ))}
      </nav>
      <div className="sidebar-footer">
        <span className="status-pill status-valid">Landing linked</span>
        <span className="muted">Brand mark now returns to the public site.</span>
      </div>
    </aside>
  );
}
