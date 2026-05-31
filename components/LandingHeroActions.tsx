// OLD WEBSITE
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
    <div className="landing-hero-actions">
      <div className="button-row" style={{ marginTop: 18 }}>
        <Link className="btn btn-primary" href={loggedIn ? "/dashboard" : "/pilot"}>
          {loggedIn ? "Open Console" : "Join 30-Day Pilot"}
        </Link>
        <Link className="btn btn-link" href="#proof-flow">
          See 3-Step Proof Flow
        </Link>
        {!loggedIn && (
          <Link className="btn" href="/docs">
            View Docs
          </Link>
        )}
      </div>
      {!loggedIn && <p className="landing-hero-action-note">No credit card required for the pilot.</p>}
    </div>
  );
}
