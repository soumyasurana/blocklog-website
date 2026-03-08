import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" href="/">
          Blocklog
        </Link>
        <nav className="nav-links">
          <Link href="/pricing">Pricing</Link>
          <Link href="/docs">Docs</Link>
          <Link href="/status">Status</Link>
          <Link href="/auth/login">Login</Link>
          <Link href="/dashboard">Dashboard</Link>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
