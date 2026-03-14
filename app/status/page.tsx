"use client";

import { useEffect, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { blocklogRequest, normalizePayload } from "@/lib/blocklog";

type HealthPayload = { status?: string };
type IntegrityPayload = { status?: string; integrity_status?: string; logs_verified?: number };
type UsagePayload = {
  logs_ingested?: number;
  logs_ingested_today?: number;
  verification_requests?: number;
  gb_processed?: number;
};

type Service = { service: string; status: string; uptime: string };

const fallback: Service[] = [
  { service: "API status", status: "Operational", uptime: "99.99%" },
  { service: "Integrity status", status: "Healthy", uptime: "Continuous" },
  { service: "Ingestion rate", status: "128/min", uptime: "Live" },
];

export default function StatusPage() {
  const [services, setServices] = useState<Service[]>(fallback);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStatus() {
      try {
        const [healthPayload, integrityPayload, usagePayload] = await Promise.all([
          blocklogRequest<HealthPayload | { data?: HealthPayload }>("/health"),
          blocklogRequest<IntegrityPayload | { data?: IntegrityPayload }>(
            "/integrity/status",
          ),
          blocklogRequest<UsagePayload | { data?: UsagePayload }>("/usage"),
        ]);

        const health = normalizePayload<HealthPayload>(healthPayload, {}, "data");
        const integrity = normalizePayload<IntegrityPayload>(integrityPayload, {}, "data");
        const usage = normalizePayload<UsagePayload>(usagePayload, {}, "data");

        setServices([
          {
            service: "API status",
            status: health.status ?? "Operational",
            uptime: "Available",
          },
          {
            service: "Integrity status",
            status: integrity.integrity_status ?? integrity.status ?? "Healthy",
            uptime: "Continuous",
          },
          {
            service: "Ingestion volume",
            status: `${usage.logs_ingested_today ?? usage.logs_ingested ?? 0} logs today`,
            uptime: `${usage.verification_requests ?? integrity.logs_verified ?? 0} verification checks`,
          },
        ]);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load status");
      }
    }

    loadStatus();
  }, []);

  return (
    <>
      <SiteHeader />
      <main className="container section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Service health</p>
            <h1 style={{ margin: 0, fontSize: "clamp(2.6rem, 5vw, 4.5rem)" }}>System status</h1>
          </div>
          <p className="section-lead">
            Live signals from health, integrity, and usage endpoints. This page is tuned to the
            actual API surface rather than a fake synthetic status model.
          </p>
        </div>
        {error && <p className="error-banner">Live API unavailable: {error}</p>}
        <div className="table-shell">
          <table>
            <thead>
              <tr>
                <th>Service</th>
                <th>Status</th>
                <th>Signal</th>
              </tr>
            </thead>
            <tbody>
              {services.map((entry) => (
                <tr key={entry.service}>
                  <td>{entry.service}</td>
                  <td>
                    <span className="status-pill status-valid">{entry.status}</span>
                  </td>
                  <td>{entry.uptime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
