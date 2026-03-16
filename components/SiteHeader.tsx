import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" href="/">
          <span className="brand-mark" />
          <span>
            Blocklog
            <span className="brand-subtitle">Audit Integrity Cloud</span>
          </span>
        </Link>
        <nav className="nav-links">
          <Link href="/">Platform</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/docs">Docs</Link>
          <Link href="/status">Status</Link>
          <Link href="/login">Login</Link>
          <Link className="header-cta subtle" href="/dashboard">Console</Link>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
