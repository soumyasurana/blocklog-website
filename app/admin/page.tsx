"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { blocklogRequest, normalizePayload, readSession } from "@/lib/blocklog";

type MePayload = {
  email?: string;
  username?: string;
  is_admin?: boolean;
};

type AdminOverviewAction = {
  action?: string;
  actor?: string;
  company_id?: string;
  created_at?: string;
};

type AdminOverviewPayload = {
  company_count?: number;
  active_company_count?: number;
  suspended_company_count?: number;
  api_key_count?: number;
  revoked_api_key_count?: number;
  log_count?: number;
  batch_count?: number;
  anchored_batch_count?: number;
  recent_admin_actions?: AdminOverviewAction[];
};

type CompanySummary = {
  company_id?: string;
  company_name?: string;
  status?: string;
  created_at?: string;
  monthly_event_limit?: number;
  pilot_status?: string;
  refund_status?: string;
  notes?: string | null;
  api_key_count?: number;
  active_api_key_count?: number;
  log_count?: number;
  batch_count?: number;
};

type CompanyControlsResponse = {
  company_id?: string;
  company_name?: string;
  status?: string;
  monthly_event_limit?: number;
  pilot_status?: string;
  refund_status?: string;
  notes?: string | null;
};

type CompanyApiKey = {
  key_id?: string;
  name?: string;
  key_prefix?: string;
  revoked?: boolean;
  usage_count?: number;
  rate_limit_per_minute?: number;
  created_at?: string;
  last_used_at?: string | null;
};

type CompanyApiKeysPayload = {
  company_id?: string;
  keys?: CompanyApiKey[];
};

type KillSwitchPayload = {
  company_status?: string;
  revoked_api_keys?: number;
  message?: string;
};

const fallbackOverview = {
  company_count: 0,
  active_company_count: 0,
  suspended_company_count: 0,
  api_key_count: 0,
  revoked_api_key_count: 0,
  log_count: 0,
  batch_count: 0,
  anchored_batch_count: 0,
  recent_admin_actions: [] as AdminOverviewAction[],
};

export default function AdminPortalPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [killing, setKilling] = useState(false);
  const [keyLoading, setKeyLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [access, setAccess] = useState<"checking" | "granted" | "denied">("checking");
  const [operator, setOperator] = useState({ email: "founder@blocklogsecurity.com", username: "founder" });
  const [overview, setOverview] = useState<AdminOverviewPayload>(fallbackOverview);
  const [companies, setCompanies] = useState<CompanySummary[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [apiKeys, setApiKeys] = useState<CompanyApiKey[]>([]);
  const [killReason, setKillReason] = useState("");
  const [controls, setControls] = useState({
    company_name: "",
    status: "ACTIVE",
    monthly_event_limit: "2000000",
    pilot_status: "inactive",
    refund_status: "not_requested",
    notes: "",
  });

  const selectedCompany = companies.find((company) => company.company_id === selectedCompanyId) ?? null;

  useEffect(() => {
    async function loadPortal() {
      if (!readSession().accessToken) {
        setAccess("denied");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const mePayload = await blocklogRequest<MePayload | { data?: MePayload }>("/auth/me");
        const me = normalizePayload<MePayload>(mePayload, {}, "data");

        if (!me.is_admin) {
          setAccess("denied");
          setLoading(false);
          return;
        }

        const [overviewPayload, companiesPayload] = await Promise.all([
          blocklogRequest<AdminOverviewPayload | { data?: AdminOverviewPayload }>("/admin/overview"),
          blocklogRequest<CompanySummary[] | { data?: CompanySummary[] }>("/admin/companies"),
        ]);

        const nextOverview = normalizePayload<AdminOverviewPayload>(overviewPayload, fallbackOverview, "data");
        const companyList = normalizePayload<CompanySummary[]>(companiesPayload, [], "data");

        setOperator({
          email: me.email ?? "founder@blocklogsecurity.com",
          username: me.username ?? "founder",
        });
        setOverview(nextOverview);
        setCompanies(companyList);
        if (companyList.length > 0) {
          setSelectedCompanyId((current) => current || companyList[0].company_id || "");
        }
        setAccess("granted");
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load admin portal");
      } finally {
        setLoading(false);
      }
    }

    loadPortal();
  }, []);

  useEffect(() => {
    if (!selectedCompany) {
      setApiKeys([]);
      return;
    }

    setControls({
      company_name: selectedCompany.company_name ?? "",
      status: selectedCompany.status ?? "ACTIVE",
      monthly_event_limit: String(selectedCompany.monthly_event_limit ?? 2_000_000),
      pilot_status: selectedCompany.pilot_status ?? "inactive",
      refund_status: selectedCompany.refund_status ?? "not_requested",
      notes: selectedCompany.notes ?? "",
    });
  }, [selectedCompany]);

  useEffect(() => {
    async function loadKeys() {
      if (!selectedCompanyId || access !== "granted") {
        return;
      }

      setKeyLoading(true);
      try {
        const payload = await blocklogRequest<CompanyApiKeysPayload | { data?: CompanyApiKeysPayload }>(
          `/admin/companies/${encodeURIComponent(selectedCompanyId)}/api-keys`,
        );
        const normalized = normalizePayload<CompanyApiKeysPayload>(payload, {}, "data");
        setApiKeys(normalized.keys ?? []);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load company API keys");
      } finally {
        setKeyLoading(false);
      }
    }

    loadKeys();
  }, [selectedCompanyId, access]);

  if (!loading && access === "denied") {
    notFound();
  }

  async function refreshCompanies(preserveSelected = true) {
    const payload = await blocklogRequest<CompanySummary[] | { data?: CompanySummary[] }>("/admin/companies");
    const nextCompanies = normalizePayload<CompanySummary[]>(payload, [], "data");
    setCompanies(nextCompanies);
    if (!preserveSelected && nextCompanies.length > 0) {
      setSelectedCompanyId(nextCompanies[0].company_id ?? "");
    }
  }

  async function refreshOverview() {
    const payload = await blocklogRequest<AdminOverviewPayload | { data?: AdminOverviewPayload }>("/admin/overview");
    setOverview(normalizePayload<AdminOverviewPayload>(payload, fallbackOverview, "data"));
  }

  async function onSaveControls(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedCompanyId) return;

    setSaving(true);
    setError(null);
    setNotice(null);

    try {
      const payload = await blocklogRequest<CompanyControlsResponse>(
        `/admin/companies/${encodeURIComponent(selectedCompanyId)}/controls`,
        "PATCH",
        {
          company_name: controls.company_name,
          status: controls.status,
          monthly_event_limit: Number(controls.monthly_event_limit),
          pilot_status: controls.pilot_status,
          refund_status: controls.refund_status,
          notes: controls.notes,
        },
      );

      setControls({
        company_name: payload.company_name ?? controls.company_name,
        status: payload.status ?? controls.status,
        monthly_event_limit: String(payload.monthly_event_limit ?? controls.monthly_event_limit),
        pilot_status: payload.pilot_status ?? controls.pilot_status,
        refund_status: payload.refund_status ?? controls.refund_status,
        notes: payload.notes ?? "",
      });
      await Promise.all([refreshCompanies(), refreshOverview()]);
      setNotice("Admin controls saved.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to save admin controls");
    } finally {
      setSaving(false);
    }
  }

  async function onKillSwitch() {
    if (!selectedCompanyId) return;

    setKilling(true);
    setError(null);
    setNotice(null);

    try {
      const payload = await blocklogRequest<KillSwitchPayload>(
        `/admin/companies/${encodeURIComponent(selectedCompanyId)}/kill-switch`,
        "POST",
        { reason: killReason || undefined, revoke_api_keys: true, suspend_company: true },
      );
      await Promise.all([refreshCompanies(), refreshOverview()]);
      const keyPayload = await blocklogRequest<CompanyApiKeysPayload | { data?: CompanyApiKeysPayload }>(
        `/admin/companies/${encodeURIComponent(selectedCompanyId)}/api-keys`,
      );
      setApiKeys(normalizePayload<CompanyApiKeysPayload>(keyPayload, {}, "data").keys ?? []);
      setKillReason("");
      setNotice(payload.message ?? "Kill switch executed.");
    } catch (killError) {
      setError(killError instanceof Error ? killError.message : "Failed to execute kill switch");
    } finally {
      setKilling(false);
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="container section">
        <section className="section-header">
          <div>
            <p className="eyebrow">Internal admin portal</p>
            <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4.2rem)", margin: 0 }}>
              Founder-only control plane for tenants, pilots, abuse response, and operational overrides.
            </h1>
          </div>
          <p className="section-lead">
            This route is hidden behind admin access and now includes real write controls for company state,
            pilot workflow, refund tracking, and kill-switch execution.
          </p>
        </section>

        {loading && (
          <div className="notice" style={{ marginTop: 16 }}>
            <div className="spinner" />
            <span>Loading admin portal...</span>
          </div>
        )}
        {error && <p className="error-banner" style={{ marginTop: 16 }}>{error}</p>}
        {notice && <p className="notice" style={{ marginTop: 16 }}>{notice}</p>}

        {access === "granted" && (
          <>
            <section className="stats" style={{ marginTop: 16 }}>
              <article className="card stat glass-card">
                <p className="eyebrow" style={{ marginBottom: 10 }}>Companies</p>
                <h3>{overview.company_count ?? 0}</h3>
              </article>
              <article className="card stat glass-card">
                <p className="eyebrow" style={{ marginBottom: 10 }}>Active / suspended</p>
                <h3>{`${overview.active_company_count ?? 0} / ${overview.suspended_company_count ?? 0}`}</h3>
              </article>
              <article className="card stat glass-card">
                <p className="eyebrow" style={{ marginBottom: 10 }}>API keys</p>
                <h3>{`${overview.api_key_count ?? 0} total`}</h3>
              </article>
              <article className="card stat glass-card">
                <p className="eyebrow" style={{ marginBottom: 10 }}>Logs / batches</p>
                <h3>{`${overview.log_count ?? 0} / ${overview.batch_count ?? 0}`}</h3>
              </article>
            </section>

            <section className="console-hero-grid" style={{ marginTop: 16 }}>
              <article className="card glass-card console-hero-card">
                <p className="eyebrow">Operator profile</p>
                <h2 style={{ marginTop: 8, marginBottom: 10 }}>Admin session active for {operator.username}.</h2>
                <div className="console-signal-list">
                  <div className="console-signal-item">
                    <strong>{overview.anchored_batch_count ?? 0}</strong>
                    <span>anchored batches visible across the environment</span>
                  </div>
                  <div className="console-signal-item">
                    <strong>{overview.revoked_api_key_count ?? 0}</strong>
                    <span>revoked keys tracked from abuse response and lifecycle changes</span>
                  </div>
                  <div className="console-signal-item">
                    <strong>{(overview.recent_admin_actions ?? []).length}</strong>
                    <span>recent administrative actions recorded in the audit log</span>
                  </div>
                </div>
              </article>

              <article className="card glass-card console-hero-card">
                <p className="eyebrow">Admin action center</p>
                <h2 style={{ marginTop: 8, marginBottom: 12 }}>Real controls are live on this page now.</h2>
                <div className="grid" style={{ gap: 10 }}>
                  <div className="status-pill">Override monthly event limits per tenant</div>
                  <div className="status-pill">Suspend companies and revoke all active API keys</div>
                  <div className="status-pill">Track pilot state and refund status per company</div>
                  <div className="status-pill">Inspect tenant API keys without leaving the portal</div>
                </div>
                <div className="button-row" style={{ marginTop: 16 }}>
                  <Link className="btn btn-primary" href="/dashboard/system/pipeline">
                    Debug Pipeline
                  </Link>
                  <Link className="btn" href="/dashboard/monitoring/integrity">
                    Integrity Monitor
                  </Link>
                  <Link className="btn" href="/auditor">
                    Auditor Portal
                  </Link>
                </div>
              </article>
            </section>

            <section className="grid grid-2" style={{ marginTop: 16 }}>
              <article className="card glass-card">
                <div className="section-header" style={{ marginBottom: 16 }}>
                  <div>
                    <p className="eyebrow">Tenant controls</p>
                    <h2 style={{ marginBottom: 8 }}>Select a company and change live admin controls.</h2>
                  </div>
                </div>

                {companies.length === 0 ? (
                  <div className="empty-state">No companies are available yet.</div>
                ) : (
                  <form className="form" onSubmit={onSaveControls}>
                    <div>
                      <label>Tenant</label>
                      <select value={selectedCompanyId} onChange={(event) => setSelectedCompanyId(event.target.value)}>
                        {companies.map((company) => (
                          <option key={company.company_id} value={company.company_id}>
                            {company.company_name} ({company.company_id})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-2">
                      <div>
                        <label>Company name</label>
                        <input
                          value={controls.company_name}
                          onChange={(event) => setControls((current) => ({ ...current, company_name: event.target.value }))}
                        />
                      </div>
                      <div>
                        <label>Status</label>
                        <select
                          value={controls.status}
                          onChange={(event) => setControls((current) => ({ ...current, status: event.target.value }))}
                        >
                          <option value="ACTIVE">Active</option>
                          <option value="SUSPENDED">Suspended</option>
                          <option value="REVIEW">Review</option>
                        </select>
                      </div>
                      <div>
                        <label>Monthly event limit</label>
                        <input
                          type="number"
                          min="1"
                          value={controls.monthly_event_limit}
                          onChange={(event) =>
                            setControls((current) => ({ ...current, monthly_event_limit: event.target.value }))
                          }
                        />
                      </div>
                      <div>
                        <label>Pilot status</label>
                        <select
                          value={controls.pilot_status}
                          onChange={(event) => setControls((current) => ({ ...current, pilot_status: event.target.value }))}
                        >
                          <option value="inactive">Inactive</option>
                          <option value="active">Active</option>
                          <option value="extended">Extended</option>
                          <option value="converted">Converted</option>
                          <option value="expired">Expired</option>
                        </select>
                      </div>
                      <div>
                        <label>Refund status</label>
                        <select
                          value={controls.refund_status}
                          onChange={(event) => setControls((current) => ({ ...current, refund_status: event.target.value }))}
                        >
                          <option value="not_requested">Not requested</option>
                          <option value="under_review">Under review</option>
                          <option value="approved">Approved</option>
                          <option value="credited">Credited</option>
                          <option value="declined">Declined</option>
                        </select>
                      </div>
                      <div>
                        <label>Selected tenant stats</label>
                        <input
                          readOnly
                          value={
                            selectedCompany
                              ? `${selectedCompany.log_count ?? 0} logs, ${selectedCompany.batch_count ?? 0} batches, ${selectedCompany.active_api_key_count ?? 0} active keys`
                              : "No company selected"
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <label>Admin notes</label>
                      <textarea
                        value={controls.notes}
                        onChange={(event) => setControls((current) => ({ ...current, notes: event.target.value }))}
                        rows={4}
                      />
                    </div>
                    <div className="button-row">
                      <button className="btn btn-primary" type="submit" disabled={saving || !selectedCompanyId}>
                        {saving ? "Saving..." : "Save Controls"}
                      </button>
                    </div>
                  </form>
                )}
              </article>

              <article className="card glass-card">
                <p className="eyebrow">Abuse response</p>
                <h2 style={{ marginTop: 8 }}>Kill switch and API key review.</h2>

                <div className="form">
                  <div>
                    <label>Kill-switch reason</label>
                    <textarea
                      rows={4}
                      placeholder="Explain why the tenant is being suspended or why keys are being revoked."
                      value={killReason}
                      onChange={(event) => setKillReason(event.target.value)}
                    />
                  </div>
                  <div className="button-row">
                    <button className="btn btn-primary" type="button" disabled={killing || !selectedCompanyId} onClick={onKillSwitch}>
                      {killing ? "Executing..." : "Run Kill Switch"}
                    </button>
                  </div>
                </div>

                <div className="section-header" style={{ marginTop: 20, marginBottom: 12 }}>
                  <div>
                    <p className="eyebrow">API key inventory</p>
                    <h2 style={{ marginBottom: 8 }}>Tenant keys and usage posture.</h2>
                  </div>
                </div>

                {keyLoading ? (
                  <div className="notice">
                    <div className="spinner" />
                    <span>Loading API keys...</span>
                  </div>
                ) : apiKeys.length === 0 ? (
                  <div className="empty-state">No API keys returned for this tenant.</div>
                ) : (
                  <div className="table-shell">
                    <table>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Prefix</th>
                          <th>Status</th>
                          <th>Usage</th>
                          <th>Rate / min</th>
                        </tr>
                      </thead>
                      <tbody>
                        {apiKeys.map((key) => (
                          <tr key={key.key_id}>
                            <td>{key.name ?? "unnamed"}</td>
                            <td>{key.key_prefix ?? "n/a"}</td>
                            <td>{key.revoked ? "Revoked" : "Active"}</td>
                            <td>{key.usage_count ?? 0}</td>
                            <td>{key.rate_limit_per_minute ?? 0}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </article>
            </section>

            <section className="card glass-card" style={{ marginTop: 16 }}>
              <div className="section-header">
                <div>
                  <p className="eyebrow">Recent admin actions</p>
                  <h2 style={{ marginBottom: 8 }}>Audit trail for founder and internal ops changes.</h2>
                </div>
              </div>
              {(overview.recent_admin_actions ?? []).length === 0 ? (
                <div className="empty-state">No recent admin actions recorded yet.</div>
              ) : (
                <div className="table-shell">
                  <table>
                    <thead>
                      <tr>
                        <th>Action</th>
                        <th>Actor</th>
                        <th>Company</th>
                        <th>When</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(overview.recent_admin_actions ?? []).map((entry, index) => (
                        <tr key={`${entry.action}-${entry.created_at}-${index}`}>
                          <td>{entry.action ?? "unknown"}</td>
                          <td>{entry.actor ?? "unknown"}</td>
                          <td>{entry.company_id ?? "n/a"}</td>
                          <td>{entry.created_at ? new Date(entry.created_at).toISOString() : "Unknown"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
