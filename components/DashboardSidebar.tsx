
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { clearSession, readSession } from "@/lib/blocklog";

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
    title: "Evidence",
    links: [
      { href: "/dashboard/logs", label: "Logs Explorer" },
      { href: "/dashboard/traces", label: "Traces" },
      { href: "/dashboard/verify", label: "Verify", aliases: ["/dashboard/verification-tools"] },
    ],
  },
  {
    title: "Investigations",
    links: [
      { href: "/dashboard/decisions", label: "Decisions" },
      { href: "/dashboard/forensics", label: "Forensics" },
      { href: "/dashboard/incidents", label: "Incidents" },
      { href: "/dashboard/hitl", label: "HITL" },
    ],
  },
  {
    title: "Governance",
    links: [
      { href: "/dashboard/audit-trail", label: "Audit Trail" },
      { href: "/dashboard/monitoring/integrity", label: "Integrity Monitor" },
    ],
  },
  {
    title: "Operations",
    links: [
      { href: "/dashboard/onboarding", label: "Onboarding" },
      {
        href: "/dashboard/monitoring/ingestion",
        label: "Ingestion Monitor",
        aliases: ["/dashboard/ingestion-monitor"],
      },
      {
        href: "/dashboard/monitoring/errors",
        label: "Error Monitor",
        aliases: ["/dashboard/errors"],
      },
      { href: "/dashboard/notifications", label: "Notifications" },
    ],
  },
  {
    title: "Platform",
    links: [
      { href: "/dashboard/system/pipeline", label: "Pipeline" },
      { href: "/dashboard/system/anchoring", label: "Anchoring" },
      { href: "/dashboard/settings", label: "Settings" },
      { href: "/dashboard/api-keys", label: "API Keys" },
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
  const router = useRouter();
  const companyId = readSession().companyId ?? "No company linked";

  function logout() {
    clearSession();
    router.replace("/login");
  }

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
            Blocklog Dashboard
          </span>
        </Link>
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

      <div className="sidebar-group-links" style={{ marginTop: "auto", padding: "0 1.5rem 1.5rem" }}>
        <Link className="nav-item nav-item-cta" href="/console">
          <span>Open Governance Console</span>
        </Link>
        <button className="nav-item" onClick={logout} type="button">
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
