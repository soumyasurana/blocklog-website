"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import {
  blocklogRequest,
  ensureUserApiKey,
  normalizePayload,
  writeSession,
} from "@/lib/blocklog";

type SignupResponse = {
  access_token?: string;
  company_id?: string;
  expires_in?: number;
};

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = await blocklogRequest<SignupResponse | { data?: SignupResponse }>(
        "/auth/signup",
        "POST",
        {
          username,
          email,
          password,
          company_id: companyId,
          company_name: companyName || undefined,
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
      await ensureUserApiKey();
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
            <label>Company ID</label>
            <input
              placeholder="pilot-co"
              value={companyId}
              onChange={(event) => setCompanyId(event.target.value)}
              required
            />
          </div>
          <div>
            <label>Company name</label>
            <input
              placeholder="Pilot Company"
              value={companyName}
              onChange={(event) => setCompanyName(event.target.value)}
            />
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
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Start Free"}
          </button>
        </form>
        <p className="muted">
          Already have an account? <Link href="/auth/login">Log in</Link>
        </p>
      </section>
    </main>
  );
}
