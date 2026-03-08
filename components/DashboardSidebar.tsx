"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/logs", label: "Log Explorer" },
  { href: "/dashboard/ingestion-monitor", label: "Ingestion Monitor" },
  { href: "/dashboard/verification-tools", label: "Verification Tools" },
  { href: "/dashboard/audit-trail", label: "Audit Trail" },
  { href: "/dashboard/api-keys", label: "API Keys" },
  { href: "/dashboard/playground", label: "Developer Playground" },
  { href: "/dashboard/errors", label: "Error Monitoring" },
  { href: "/dashboard/notifications", label: "Notifications" },
  { href: "/dashboard/settings", label: "Settings" },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <Link className="brand" href="/dashboard">
        Blocklog Console
      </Link>
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
