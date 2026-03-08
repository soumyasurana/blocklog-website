"use client";

import { useEffect, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { blocklogRequest, normalizePayload } from "@/lib/blocklog";

type Service = { service: string; status: string; uptime: string };
type StatusPayload = { services?: Service[] };

const fallback: Service[] = [
  { service: "API status", status: "Operational", uptime: "99.99%" },
  { service: "Log ingestion", status: "Operational", uptime: "99.95%" },
  { service: "Verification service", status: "Operational", uptime: "99.97%" },
];

export default function StatusPage() {
  const [services, setServices] = useState<Service[]>(fallback);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStatus() {
      try {
        const payload = await blocklogRequest<StatusPayload | { data?: StatusPayload }>(
          "/status",
        );
        const parsed = normalizePayload<StatusPayload>(payload, {}, "data");
        if (parsed.services?.length) {
          setServices(parsed.services);
        }
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
        {error && <p className="muted">Live API unavailable: {error}</p>}
        <div className="table-shell">
          <table>
            <thead>
              <tr>
                <th>Service</th>
                <th>Status</th>
                <th>30-day uptime</th>
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
