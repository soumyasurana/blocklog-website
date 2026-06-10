"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  GitBranch,
  Rewind,
  ScrollText,
  AlertTriangle,
  Bug,
  Workflow,
  Bell,
  KeyRound,
  Settings2,
  MoreHorizontal,
  X,
  type LucideIcon,
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  aliases?: string[];
};

type NavGroup = {
  label: string;
  showLabel: boolean;
  items: NavItem[];
};

// ── Nav structure ─────────────────────────────────────────────────────────────

const GROUPS: NavGroup[] = [
  {
    label: "Primary",
    showLabel: false,
    items: [
      {
        href: "/dashboard",
        label: "Overview",
        icon: LayoutDashboard,
      },
      {
        href: "/dashboard/traces",
        label: "Traces",
        icon: GitBranch,
      },
      {
        href: "/dashboard/forensics",
        label: "Forensic Replay",
        icon: Rewind,
      },
      {
        href: "/dashboard/decisions",
        label: "Decisions",
        icon: ScrollText,
      },
    ],
  },
  {
    label: "Monitoring",
    showLabel: true,
    items: [
      {
        href: "/dashboard/incidents",
        label: "Incidents",
        icon: AlertTriangle,
      },
      {
        href: "/dashboard/monitoring/errors",
        label: "Error Monitor",
        icon: Bug,
        aliases: ["/dashboard/errors"],
      },
      {
        href: "/dashboard/system/pipeline",
        label: "Pipeline",
        icon: Workflow,
      },
    ],
  },
  {
    label: "Configuration",
    showLabel: true,
    items: [
      {
        href: "/dashboard/notifications",
        label: "Notifications",
        icon: Bell,
      },
      {
        href: "/dashboard/api-keys",
        label: "API Keys",
        icon: KeyRound,
      },
      {
        href: "/dashboard/settings",
        label: "Settings",
        icon: Settings2,
      },
    ],
  },
];

const ALL_ITEMS: NavItem[] = GROUPS.flatMap((g) => g.items);
const TAB_BAR_ITEMS = ALL_ITEMS.slice(0, 5);
const MORE_ITEMS = ALL_ITEMS.slice(5);

// ── Helpers ──────────────────────────────────────────────────────────────────

function matchesPath(pathname: string, item: NavItem): boolean {
  if (item.href === "/dashboard") return pathname === "/dashboard";
  if (pathname === item.href || pathname.startsWith(`${item.href}/`)) return true;
  return (item.aliases ?? []).some(
    (a) => pathname === a || pathname.startsWith(`${a}/`),
  );
}

// ── Nav Item ──────────────────────────────────────────────────────────────────

function SidebarNavItem({
  item,
  active,
}: {
  item: NavItem;
  active: boolean;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      id={`dashboard-nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
      aria-current={active ? "page" : undefined}
      className={`flex items-center gap-2.5 rounded-full px-3 py-[9px] text-[13.5px] font-medium transition-all duration-200 ${
        active
          ? "liquid-glass text-white"
          : "text-white/58 hover:bg-white/[0.04] hover:text-white/82"
      }`}
    >
      <span
        className="flex-shrink-0"
        style={{ opacity: active ? 1 : 0.62 }}
      >
        <Icon size={14} strokeWidth={active ? 2.2 : 1.8} />
      </span>
      <span>{item.label}</span>
    </Link>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function DashboardSidebarNav() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      {/* ════ Desktop Sidebar ════ */}
      <aside
        id="dashboard-sidebar"
        aria-label="Dashboard navigation"
        className="fixed top-14 left-0 z-40 hidden w-[240px] flex-col overflow-x-hidden overflow-y-auto md:flex"
        style={{
          height: "calc(100vh - 56px)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          background:
            "radial-gradient(circle at 20% 8%, rgba(108,154,255,0.058), transparent 52%), linear-gradient(180deg, rgba(255,255,255,0.022), rgba(255,255,255,0.008))",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(255,255,255,0.07) transparent",
        }}
      >
        <div className="flex flex-1 flex-col gap-5 px-3 py-5">
          {GROUPS.map((group) => (
            <div key={group.label} className="flex flex-col gap-0.5">
              {group.showLabel && (
                <p
                  className="eyebrow mb-1 px-2.5"
                  style={{ fontSize: "0.67rem" }}
                >
                  {group.label}
                </p>
              )}
              {group.items.map((item) => (
                <SidebarNavItem
                  key={item.href}
                  item={item}
                  active={matchesPath(pathname, item)}
                />
              ))}
            </div>
          ))}
        </div>
      </aside>

      {/* ════ Mobile Bottom Tab Bar ════ */}
      <nav
        id="dashboard-mobile-tabs"
        aria-label="Dashboard mobile navigation"
        className="liquid-glass-strong fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center px-1 md:hidden"
        style={{
          borderRadius: 0,
          borderTop: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {TAB_BAR_ITEMS.map((item) => {
          const active = matchesPath(pathname, item);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex flex-1 flex-col items-center gap-1 rounded-xl py-2 transition-all duration-200 ${
                active ? "text-white" : "text-white/42 hover:text-white/70"
              }`}
            >
              <span
                className={`flex h-5 w-7 items-center justify-center rounded-md transition-colors ${
                  active ? "bg-white/10" : ""
                }`}
              >
                <Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
              </span>
              <span className="text-[9px] font-semibold leading-none tracking-wide">
                {item.label.split(" ")[0]}
              </span>
            </Link>
          );
        })}

        {/* More button */}
        <button
          type="button"
          id="dashboard-mobile-more"
          aria-label="More sections"
          aria-expanded={drawerOpen}
          onClick={() => setDrawerOpen(true)}
          className="flex flex-1 flex-col items-center gap-1 rounded-xl py-2 text-white/42 transition-all duration-200 hover:text-white/70"
        >
          <span className="flex h-5 w-7 items-center justify-center">
            <MoreHorizontal size={16} strokeWidth={1.8} />
          </span>
          <span className="text-[9px] font-semibold leading-none tracking-wide">
            More
          </span>
        </button>
      </nav>

      {/* ════ Mobile More Drawer ════ */}
      {drawerOpen && (
        <div className="md:hidden">
          {/* Overlay */}
          <div
            aria-hidden="true"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            style={{ zIndex: 60 }}
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer panel */}
          <div
            id="dashboard-more-drawer"
            role="dialog"
            aria-label="More dashboard sections"
            className="liquid-glass-strong fixed left-3 right-3 rounded-[1.5rem] p-3"
            style={{ bottom: "4.5rem", zIndex: 70 }}
          >
            {/* Drawer header */}
            <div className="mb-2 flex items-center justify-between px-2 py-1">
              <span
                className="eyebrow"
                style={{ fontSize: "0.65rem" }}
              >
                More sections
              </span>
              <button
                type="button"
                aria-label="Close drawer"
                onClick={() => setDrawerOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-full text-white/52 transition-colors hover:bg-white/8 hover:text-white"
              >
                <X size={13} />
              </button>
            </div>

            {/* Drawer items */}
            <div className="grid gap-0.5">
              {MORE_ITEMS.map((item) => {
                const active = matchesPath(pathname, item);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setDrawerOpen(false)}
                    className={`flex items-center gap-3 rounded-[0.875rem] px-3 py-3 text-[14px] font-medium transition-all duration-200 ${
                      active
                        ? "border border-white/10 bg-white/8 text-white"
                        : "text-white/64 hover:bg-white/5 hover:text-white/88"
                    }`}
                  >
                    <span className="flex-shrink-0" style={{ opacity: 0.8 }}>
                      <Icon size={15} strokeWidth={active ? 2.2 : 1.8} />
                    </span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
