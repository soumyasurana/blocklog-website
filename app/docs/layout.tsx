"use client";

import { SiteHeader, Footer, PageFrame } from "@/components/site/Primitives";
import Link from "next/link";

const sidebar = [
  { label: "Quickstart", href: "/docs/quickstart" },
  { label: "Core Concepts", href: "/docs/concepts" },
  { label: "Python SDK", href: "/docs/python-sdk" },
  { label: "REST API", href: "/docs/api-reference" },
  { label: "Examples", href: "/docs/incident-reconstruction" },
];

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="page-shell">
      <SiteHeader />

      <PageFrame>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "240px minmax(0, 1fr)",
            gap: 0,
            alignItems: "start",
            position: "relative",
            zIndex: 1,
          }}
        >
          <aside
            style={{
              position: "sticky",
              top: 72,
              alignSelf: "start",
              height: "calc(100vh - 72px)",
              overflowY: "auto",
              padding: "32px 20px 40px 8px",
              borderRight: "1px solid rgba(255,255,255,0.08)",
              zIndex: 1,
            }}
          >
            <div style={{ marginBottom: 28 }}>
              <p
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  marginBottom: 12,
                }}
              >
                Documentation
              </p>

              <nav
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                {sidebar.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{
                      display: "block",
                      padding: "8px 10px",
                      borderRadius: 8,
                      fontSize: "0.92rem",
                      color: "var(--muted)",
                      textDecoration: "none",
                      transition: "background 0.15s ease, color 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.04)";
                      e.currentTarget.style.color =
                        "rgba(255,255,255,0.9)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "var(--muted)";
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div
              style={{
                paddingTop: 20,
                borderTop: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <p
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  marginBottom: 12,
                }}
              >
                Resources
              </p>

              <nav
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                {[
                  {
                    label: "PyPI ↗",
                    href: "https://pypi.org/project/blocklog-python",
                    external: true,
                  },
                  {
                    label: "GitHub ↗",
                    href: "https://github.com/blockloghq",
                    external: true,
                  },
                  {
                    label: "Support ↗",
                    href: "mailto:founder@blocklogsecurity.com",
                    external: false,
                  },
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    style={{
                      display: "block",
                      padding: "8px 10px",
                      borderRadius: 8,
                      fontSize: "0.92rem",
                      color: "var(--muted)",
                      textDecoration: "none",
                      transition: "background 0.15s ease, color 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.04)";
                      e.currentTarget.style.color =
                        "rgba(255,255,255,0.9)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "var(--muted)";
                    }}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <div
            style={{
              position: "relative",
              zIndex: 1,
            }}
          >
            {children}
          </div>
        </div>

        <Footer />
      </PageFrame>
    </div>
  );
}