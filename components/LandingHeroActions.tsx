"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { readSession, subscribeSession } from "@/lib/blocklog";

function getSnapshot() {
  return Boolean(readSession().accessToken);
}

export default function LandingHeroActions() {
  const loggedIn = useSyncExternalStore(subscribeSession, getSnapshot, () => false);

  return (
    <div className="button-row" style={{ marginTop: 18 }}>
      {!loggedIn && (
        <Link className="btn btn-primary" href="/pilot">
          Start 20-Day Pilot
        </Link>
      )}
      <Link className="btn btn-link" href="/docs">
        View Docs
      </Link>
      <Link className={`btn${loggedIn ? " btn-primary" : ""}`} href="/dashboard">
        Open Console
      </Link>
    </div>
  );
}
