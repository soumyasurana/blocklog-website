"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import {
  blocklogRequest,
  normalizePayload,
  writeSession,
} from "@/lib/blocklog";

type SignupResponse = {
  access_token?: string;
  company_id?: string;
  expires_in?: number;
};

type CompanyLookupResponse = {
  exists?: boolean;
  company_id?: string;
  company_name?: string;
  status?: string;
};

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [companyCheckLoading, setCompanyCheckLoading] = useState(false);
  const [companyState, setCompanyState] = useState<{
    exists: boolean;
    checkedId: string;
    companyName?: string;
    status?: string;
  }>({ exists: false, checkedId: "" });

  useEffect(() => {
    const normalized = companyId.trim().toLowerCase();
    if (!normalized) {
      setCompanyState({ exists: false, checkedId: "" });
      return;
    }

    const timer = setTimeout(async () => {
      setCompanyCheckLoading(true);
      try {
        const payload = await blocklogRequest<CompanyLookupResponse | { data?: CompanyLookupResponse }>(
          `/auth/companies/${encodeURIComponent(normalized)}/exists`,
        );
        const result = normalizePayload<CompanyLookupResponse>(payload, {}, "data");
        setCompanyState({
          exists: Boolean(result.exists),
          checkedId: result.company_id ?? normalized,
          companyName: result.company_name,
          status: result.status,
        });
      } catch {
        setCompanyState({ exists: false, checkedId: normalized });
      } finally {
        setCompanyCheckLoading(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [companyId]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const normalizedCompanyId = companyId.trim().toLowerCase();
      if (normalizedCompanyId && (!companyState.exists || companyState.checkedId !== normalizedCompanyId)) {
        throw new Error("Company not found. Ask your admin to create the company first.");
      }

      const payload = await blocklogRequest<SignupResponse | { data?: SignupResponse }>(
        "/auth/signup",
        "POST",
        {
          username,
          email,
          password,
          company_id: normalizedCompanyId || undefined,
          workspace_name: workspaceName.trim() || undefined,
        },
      );
      const session = normalizePayload<SignupResponse>(payload, {}, "data");

      writeSession(
        {
          accessToken: session.access_token,
          companyId: session.company_id,
        },
        session.expires_in ? session.expires_in * 1000 : undefined,
      );
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "signup", {
          method: "email",
          company_id: session.company_id ?? normalizedCompanyId,
        });
      }
      const nextPath =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search).get("next")
          : null;
      router.push(nextPath || "/dashboard");
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Unable to create account",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="card auth-card">
        <h1 style={{ marginTop: 0 }}>Create your Blocklog account</h1>
        <p className="muted" style={{ marginTop: 0 }}>
          Start as an individual developer or optionally join an existing company workspace.
        </p>
        <form className="form" onSubmit={onSubmit}>
          <div>
            <label>Username</label>
            <input
              placeholder="pilot"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </div>
          <div>
            <label>Workspace name (optional)</label>
            <input
              placeholder="Jane's Workspace"
              value={workspaceName}
              onChange={(event) => setWorkspaceName(event.target.value)}
            />
            <p className="muted" style={{ margin: "8px 0 0" }}>
              Leave company blank and Blocklog will create a personal workspace for you automatically.
            </p>
          </div>
          <div>
            <label>Existing company ID (optional)</label>
            <input
              placeholder="pilot-co"
              value={companyId}
              onChange={(event) => setCompanyId(event.target.value)}
            />
            {companyId.trim() && (
              <p className="muted" style={{ margin: "8px 0 0" }}>
                {companyCheckLoading
                  ? "Checking company..."
                  : companyState.exists
                    ? `Company found: ${companyState.companyName ?? companyState.checkedId} (${companyState.status ?? "ACTIVE"})`
                    : "Company not found. Leave this blank to continue as an individual."}
              </p>
            )}
          </div>
          <div>
            <label>Work email</label>
            <input
              type="email"
              placeholder="jane@company.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          {error && <p style={{ color: "var(--danger)", margin: 0 }}>{error}</p>}
          <button
            className="btn btn-primary"
            type="submit"
            disabled={loading || companyCheckLoading || (companyId.trim() !== "" && !companyState.exists)}
          >
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>
        <p className="muted">
          Already have an account? <Link href="/auth/login">Log in</Link>
        </p>
      </section>
    </main>
  );
}
