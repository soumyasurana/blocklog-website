"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { readSession, subscribeSession } from "@/lib/blocklog";

function getSnapshot() {
  return Boolean(readSession().accessToken);
}

export default function SiteHeader() {
  const loggedIn = useSyncExternalStore(subscribeSession, getSnapshot, () => false);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" href="/">
          <span className="brand-mark" />
          <span>
            Blocklog
          </span>
        </Link>
        <nav className="nav-links">
          <Link href="/">Platform</Link>
          <Link href="/pilot">Pilot</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/docs">Docs</Link>
          <Link href="/status">Status</Link>
          {!loggedIn && <Link href="/login">Login</Link>}
          <Link className="header-cta subtle" href="/dashboard">Console</Link>
        </nav>
      </div>
    </header>
  );
}
