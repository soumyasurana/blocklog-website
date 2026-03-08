"use client";

import { FormEvent, useEffect, useState } from "react";
import DashboardTopBar from "@/components/DashboardTopBar";
import { blocklogRequest, normalizePayload } from "@/lib/blocklog";

type SettingsPayload = {
  company_name?: string;
  company_id?: string;
  api_endpoint?: string;
  region?: string;
};

const fallback = {
  company_name: "Acme Financial",
  company_id: "cmp_84f02",
  api_endpoint: "https://api.blocklog.dev/v1",
  region: "us-east-1",
};

export default function SettingsPage() {
  const [form, setForm] = useState(fallback);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const payload = await blocklogRequest<SettingsPayload | { data?: SettingsPayload }>(
          "/company/settings",
        );
        const data = normalizePayload<SettingsPayload>(payload, {}, "data");
        setForm({
          company_name: data.company_name ?? fallback.company_name,
          company_id: data.company_id ?? fallback.company_id,
          api_endpoint: data.api_endpoint ?? fallback.api_endpoint,
          region: data.region ?? fallback.region,
        });
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load settings");
      }
    }

    loadSettings();
  }, []);

  async function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    try {
      await blocklogRequest("/company/settings", "PUT", form);
      setNotice("Settings updated.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to save settings");
    }
  }

  async function rotateKeys() {
    setError(null);
    setNotice(null);
    try {
      await blocklogRequest("/company/rotate-keys", "POST");
      setNotice("Keys rotated.");
    } catch (rotateError) {
      setError(rotateError instanceof Error ? rotateError.message : "Failed to rotate keys");
    }
  }

  async function deleteProject() {
    setError(null);
    setNotice(null);
    try {
      await blocklogRequest("/company/project", "DELETE");
      setNotice("Project deleted.");
    } catch (deleteError) {
      setError(
        deleteError instanceof Error ? deleteError.message : "Failed to delete project",
      );
    }
  }

  return (
    <>
      <DashboardTopBar title="Company / Project Settings" />
      {error && <p className="muted">Live API unavailable: {error}</p>}
      {notice && <p className="muted">{notice}</p>}
      <form className="card" onSubmit={saveSettings}>
        <div className="grid grid-2">
          <div>
            <label>Company name</label>
            <input
              value={form.company_name}
              onChange={(event) => setForm({ ...form, company_name: event.target.value })}
            />
          </div>
          <div>
            <label>Company ID</label>
            <input value={form.company_id} readOnly />
          </div>
          <div>
            <label>API endpoint</label>
            <input value={form.api_endpoint} readOnly />
          </div>
          <div>
            <label>Region</label>
            <input value={form.region} onChange={(event) => setForm({ ...form, region: event.target.value })} />
          </div>
        </div>
        <button className="btn btn-primary" style={{ marginTop: 12 }} type="submit">
          Save settings
        </button>
      </form>
      <section className="grid grid-2" style={{ marginTop: 12 }}>
        <article className="card">
          <h2 style={{ marginTop: 0 }}>Rotate keys</h2>
          <p className="muted">Regenerate all active keys and invalidate old credentials.</p>
          <button className="btn" onClick={rotateKeys} type="button">
            Rotate
          </button>
        </article>
        <article className="card">
          <h2 style={{ marginTop: 0 }}>Delete project</h2>
          <p className="muted">Permanent action for this project and all related logs.</p>
          <button className="btn" onClick={deleteProject} type="button">
            Delete project
          </button>
        </article>
      </section>
    </>
  );
}
