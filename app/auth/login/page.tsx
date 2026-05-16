"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import {
  blocklogRequest,
  normalizePayload,
  writeSession,
} from "@/lib/blocklog";

type LoginResponse = {
  access_token?: string;
  company_id?: string;
  expires_in?: number;
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = await blocklogRequest<LoginResponse | { data?: LoginResponse }>(
        "/auth/login",
        "POST",
        { email, password },
      );
      const session = normalizePayload<LoginResponse>(payload, {}, "data");

      writeSession({
        accessToken: session.access_token,
        companyId: session.company_id,
      }, session.expires_in ? session.expires_in * 1000 : undefined);
      const nextPath =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search).get("next")
          : null;
      router.push(nextPath || "/dashboard");
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Unable to login",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="card auth-shell">
        <div className="auth-aside">
          <p className="eyebrow">Welcome back</p>
          <h1 style={{ marginTop: 0, marginBottom: 14 }}>Log in to your evidence console</h1>
          <p className="muted auth-lead">
            Review integrity checks, manage proofs, and monitor every critical event from one
            operational surface.
          </p>
          <div className="auth-benefits">
            <div className="auth-benefit">
              <strong>Trace every action</strong>
              <span>Audit-ready history for platform, finance, and AI workflows.</span>
            </div>
            <div className="auth-benefit">
              <strong>Verify instantly</strong>
              <span>Re-run chain and proof checks without leaving the dashboard.</span>
            </div>
          </div>
        </div>
        <div className="auth-card">
          <div className="auth-card-top">
            <div>
              <p className="eyebrow">Secure access</p>
              <h2 style={{ marginTop: 8, marginBottom: 0 }}>Continue to Blocklog</h2>
            </div>
            <Link className="btn btn-primary" href="/signup">
              Start Free
            </Link>
          </div>
          <form className="form" onSubmit={onSubmit}>
            <div>
              <label>Email</label>
              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div>
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
            {error && <p style={{ color: "var(--danger)", margin: 0 }}>{error}</p>}
            <button className="btn btn-primary auth-submit" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <div className="auth-links">
            <p className="muted">
              <Link href="/auth/forgot-password">Forgot password?</Link>
            </p>
            <p className="muted">
              No account? <Link href="/auth/signup">Create one</Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
