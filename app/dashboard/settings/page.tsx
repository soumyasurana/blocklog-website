"use client";

import { useEffect, useState } from "react";
import DashboardTopBar from "@/components/DashboardTopBar";
import { blocklogRequest, normalizePayload } from "@/lib/blocklog";

type MePayload = {
  email?: string;
  full_name?: string;
  company_id?: string;
};

type CompanyPayload = {
  company_name?: string;
  company_id?: string;
  region?: string;
};

type PolicyPayload = {
  default_days?: number;
  policy_name?: string;
};

const fallback = {
  company_name: "Acme Financial",
  company_id: "cmp_84f02",
  region: "us-east-1",
  email: "founder@blocklogsecurity.com",
  full_name: "Blocklog Admin",
  retention_days: 365,
  policy_name: "standard-retention",
};

export default function SettingsPage() {
  const [details, setDetails] = useState(fallback);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        const mePayload = await blocklogRequest<MePayload | { data?: MePayload }>("/auth/me");
        const me = normalizePayload<MePayload>(mePayload, {}, "data");
        const companyId = me.company_id ?? fallback.company_id;

        const [companyPayload, policyPayload] = await Promise.all([
          blocklogRequest<CompanyPayload | { data?: CompanyPayload }>(
            `/companies/${companyId}`,
          ),
          blocklogRequest<PolicyPayload | { data?: PolicyPayload }>(
            "/policy/retention",
          ),
        ]);

        const company = normalizePayload<CompanyPayload>(companyPayload, {}, "data");
        const policy = normalizePayload<PolicyPayload>(policyPayload, {}, "data");

        setDetails({
          company_name: company.company_name ?? fallback.company_name,
          company_id: company.company_id ?? companyId,
          region: company.region ?? fallback.region,
          email: me.email ?? fallback.email,
          full_name: me.full_name ?? fallback.full_name,
          retention_days: policy.default_days ?? fallback.retention_days,
          policy_name: policy.policy_name ?? fallback.policy_name,
        });
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load settings");
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  return (
    <>
      <DashboardTopBar title="Company / Project Settings" />
      {loading && (
        <div className="notice button-row" style={{ alignItems: "center", marginBottom: 12 }}>
          <div className="spinner" />
          <span>Loading project settings...</span>
        </div>
      )}
      {error && <p className="error-banner">Live API unavailable: {error}</p>}
      <section className="card">
        <div className="grid grid-2">
          <div>
            <label>Company name</label>
            <input value={details.company_name} readOnly />
          </div>
          <div>
            <label>Company ID</label>
            <input value={details.company_id} readOnly />
          </div>
          <div>
            <label>Region</label>
            <input value={details.region} readOnly />
          </div>
          <div>
            <label>Retention policy</label>
            <input value={`${details.policy_name} (${details.retention_days} days)`} readOnly />
          </div>
          <div>
            <label>Owner</label>
            <input value={details.full_name} readOnly />
          </div>
          <div>
            <label>Owner email</label>
            <input value={details.email} readOnly />
          </div>
        </div>
      </section>
    </>
  );
}
