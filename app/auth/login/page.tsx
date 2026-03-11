"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { blocklogRequest, normalizePayload, writeSession } from "@/lib/blocklog";

type LoginResponse = {
  token?: string;
  api_key?: string;
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
        token: session.token,
        apiKey: session.api_key,
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
      <section className="card auth-card">
        <h1 style={{ marginTop: 0 }}>Log in</h1>
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
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="muted">
          <Link href="/auth/forgot-password">Forgot password?</Link>
        </p>
        <p className="muted">
          No account? <Link href="/auth/signup">Create one</Link>
        </p>
      </section>
    </main>
  );
}
