"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import DashboardTopBar from "@/components/DashboardTopBar";
import { blocklogRequest } from "@/lib/blocklog";

type OnboardingStatus = {
  company_id: string;
  has_api_keys: boolean;
  first_log_id: string | null;
  first_trace_id: string | null;
  checklist: Record<string, boolean>;
};

export default function OnboardingPage() {
  const [status, setStatus] = useState<OnboardingStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const response = await blocklogRequest<OnboardingStatus>("/onboarding/status");
        setStatus(response);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load onboarding status");
      }
    }

    void load();
  }, []);

  return (
    <>
      <DashboardTopBar title="Onboarding" />
      {error && <p className="error-banner">{error}</p>}
      {status && (
        <section className="card glass-card" style={{ display: "grid", gap: 16 }}>
          <div>
            <p className="eyebrow">Five-minute activation</p>
            <h2 style={{ marginBottom: 8 }}>Get to your first verifiable trace.</h2>
            <p className="muted" style={{ margin: 0 }}>
              Create an API key, send one SDK event, then open the reconstructed timeline.
            </p>
          </div>
          <div className="grid grid-2">
            {Object.entries(status.checklist).map(([key, value]) => (
              <div key={key} className="card">
                <strong>{key.replaceAll("_", " ")}</strong>
                <p className="muted" style={{ margin: "8px 0 0 0" }}>
                  {value ? "Complete" : "Pending"}
                </p>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link className="btn btn-primary" href="/dashboard/api-keys">
              API keys
            </Link>
            <Link className="btn" href="/docs/sdks">
              SDK quickstart
            </Link>
            {status.first_trace_id && (
              <Link className="btn" href={`/dashboard/traces/${status.first_trace_id}`}>
                Open first trace
              </Link>
            )}
          </div>
        </section>
      )}
    </>
  );
}
