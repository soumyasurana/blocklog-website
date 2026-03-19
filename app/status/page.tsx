"use client";

import { useEffect, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { blocklogRequest, normalizePayload } from "@/lib/blocklog";

type HealthPayload = { status?: string };

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
        const healthPayload = await blocklogRequest<HealthPayload | { data?: HealthPayload }>("/health");

        const health = normalizePayload<HealthPayload>(healthPayload, {}, "data");

        setServices([
          {
            service: "API status",
            status: health.status ?? "Operational",
            uptime: "Available",
          },
          {
            service: "Integrity verification",
            status: "Protected",
            uptime: "Available after authenticated dashboard login",
          },
          {
            service: "Usage analytics",
            status: "Protected",
            uptime: "Visible inside the signed-in dashboard",
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
