"use client";

import { useEffect, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { blocklogRequest, normalizePayload } from "@/lib/blocklog";

type HealthPayload = { status?: string };
type IntegrityPayload = { integrity_status?: string };
type MetricsPayload = { requests_total?: number; ingestion_rate?: number };

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
        const [healthPayload, integrityPayload, metricsPayload] = await Promise.all([
          blocklogRequest<HealthPayload | { data?: HealthPayload }>("/health"),
          blocklogRequest<IntegrityPayload | { data?: IntegrityPayload }>(
            "/integrity/status",
          ),
          blocklogRequest<MetricsPayload | { data?: MetricsPayload }>("/metrics"),
        ]);

        const health = normalizePayload<HealthPayload>(healthPayload, {}, "data");
        const integrity = normalizePayload<IntegrityPayload>(integrityPayload, {}, "data");
        const metrics = normalizePayload<MetricsPayload>(metricsPayload, {}, "data");

        setServices([
          {
            service: "API status",
            status: health.status ?? "Operational",
            uptime: "Available",
          },
          {
            service: "Integrity status",
            status: integrity.integrity_status ?? "Healthy",
            uptime: "Continuous",
          },
          {
            service: "Ingestion rate",
            status: `${metrics.ingestion_rate ?? 0}/min`,
            uptime: `${metrics.requests_total ?? 0} requests`,
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
        <h1 style={{ marginTop: 0 }}>Status</h1>
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
                  <td>{entry.status}</td>
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
