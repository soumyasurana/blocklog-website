"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLink = {
  href: string;
  label: string;
  aliases?: string[];
};

type NavGroup = {
  title: string;
  links: NavLink[];
};

const overviewLink: NavLink = {
  href: "/dashboard",
  label: "Overview",
};

const groups: NavGroup[] = [
  {
    title: "Data Plane",
    links: [
      { href: "/dashboard/logs", label: "Logs" },
      { href: "/dashboard/verify", label: "Verify", aliases: ["/dashboard/verification-tools"] },
      { href: "/dashboard/audit-trail", label: "Audit Trail" },
    ],
  },
  {
    title: "Observability",
    links: [
      {
        href: "/dashboard/monitoring/ingestion",
        label: "Monitoring / Ingestion",
        aliases: ["/dashboard/ingestion-monitor"],
      },
      {
        href: "/dashboard/monitoring/errors",
        label: "Monitoring / Errors",
        aliases: ["/dashboard/errors"],
      },
      {
        href: "/dashboard/monitoring/integrity",
        label: "Monitoring / Integrity",
      },
    ],
  },
  {
    title: "Control Plane",
    links: [
      { href: "/dashboard/system/pipeline", label: "System / Pipeline" },
      { href: "/dashboard/system/anchoring", label: "System / Anchoring" },
      { href: "/dashboard/settings", label: "Settings" },
      { href: "/dashboard/api-keys", label: "API Keys" },
      { href: "/dashboard/notifications", label: "Notifications" },
    ],
  },
  {
    title: "Developer Surface",
    links: [
      { href: "/dashboard/playground", label: "Playground" },
    ],
  },
];

function matchesPath(pathname: string, href: string, aliases: string[] = []) {
  if (href === "/dashboard") {
    return pathname === href;
  }

  if (pathname === href || pathname.startsWith(`${href}/`)) {
    return true;
  }

  return aliases.some((alias) => pathname === alias || pathname.startsWith(`${alias}/`));
}

export default function DashboardSidebar() {
  const pathname = usePathname();

  function renderLink(item: NavLink) {
    const active = matchesPath(pathname, item.href, item.aliases);

    return (
      <Link
        key={item.href}
        className={`nav-item${active ? " active" : ""}`}
        href={item.href}
      >
        <span>{item.label}</span>
        {active && <span className="nav-item-pulse" />}
      </Link>
    );
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <Link className="brand" href="/">
          <span className="brand-mark" />
          <span>
            Blocklog Console
            <span className="brand-subtitle">Next-gen Operations Layer</span>
          </span>
        </Link>
        <div className="sidebar-chip">
          <strong>Operational trust</strong>
          <span>Next-gen console for trust operations, system flow, and API execution.</span>
        </div>
      </div>

      <div className="sidebar-nav-shell">
        <div className="sidebar-overview-link">{renderLink(overviewLink)}</div>
        <nav className="sidebar-nav-groups">
          {groups.map((group) => (
            <div className="sidebar-group" key={group.title}>
              <p className="sidebar-group-title">{group.title}</p>
              <div className="sidebar-group-links">
                {group.links.map(renderLink)}
              </div>
            </div>
          ))}
        </nav>
      </div>

    </aside>
  );
}
