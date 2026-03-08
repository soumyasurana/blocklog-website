"use client";

import { useEffect, useState } from "react";
import DashboardTopBar from "@/components/DashboardTopBar";
import { blocklogRequest, normalizePayload } from "@/lib/blocklog";

type ErrorsPayload = { errors?: string[] };

const fallback = ["Error: Invalid API key", "Error: Schema mismatch"];

export default function ErrorsPage() {
  const [errors, setErrors] = useState<string[]>(fallback);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadErrors() {
      try {
        const payload = await blocklogRequest<ErrorsPayload | { data?: ErrorsPayload }>(
          "/logs/errors",
        );
        const parsed = normalizePayload<ErrorsPayload>(payload, {}, "data");
        if (parsed.errors?.length) {
          setErrors(parsed.errors);
        }
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load errors");
      }
    }

    loadErrors();
  }, []);

  return (
    <>
      <DashboardTopBar title="Error Monitoring" />
      {error && <p className="muted">Live API unavailable: {error}</p>}
      <section className="card">
        <h2 style={{ marginTop: 0 }}>Failed log ingestion</h2>
        {errors.map((entry) => (
          <p key={entry}>
            <code>{entry}</code>
          </p>
        ))}
      </section>
    </>
  );
}
