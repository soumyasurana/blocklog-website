import Link from "next/link";

const quickLinks = [
  { href: "/dashboard/logs", label: "Logs Explorer" },
  { href: "/dashboard/traces", label: "Traces" },
  { href: "/dashboard/forensics", label: "Forensics" },
  { href: "/dashboard/audit-trail", label: "Audit Trail" },
  { href: "/dashboard/monitoring/integrity", label: "Integrity Monitor" },
];

export default function QuickLinksPanel() {
  return (
    <section className="card dashboard-panel">
      <div className="section-header">
        <div>
          <p className="eyebrow">Quick Access</p>
          <h2>Fast navigation</h2>
        </div>
      </div>
      <div className="quick-links-grid">
        {quickLinks.map((link) => (
          <Link key={link.href} className="quick-link-card" href={link.href}>
            {link.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
