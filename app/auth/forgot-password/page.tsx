"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { blocklogRequest, normalizePayload } from "@/lib/blocklog";

type ForgotPasswordResponse = {
  message?: string;
  reset_token?: string | null;
  expires_in?: number | null;
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setResetToken(null);
    setError(null);
    setLoading(true);

    try {
      const payload = await blocklogRequest<ForgotPasswordResponse>("/auth/forgot-password", "POST", {
        email,
      });
      const response = normalizePayload<ForgotPasswordResponse>(payload, payload, "data");
      setMessage(response.message ?? "If the account exists, a reset token has been generated.");
      setResetToken(response.reset_token ?? null);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to send reset email",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="card auth-card">
        <h1 style={{ marginTop: 0 }}>Forgot password</h1>
        <p className="muted">Enter your email and we will send a reset link.</p>
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
          {message && <p style={{ color: "var(--success)", margin: 0 }}>{message}</p>}
          {resetToken && (
            <div className="code-pane">
              <strong>Reset token</strong>
              <div style={{ marginTop: 8, wordBreak: "break-all" }}>{resetToken}</div>
            </div>
          )}
          {error && <p style={{ color: "var(--danger)", margin: 0 }}>{error}</p>}
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send reset email"}
          </button>
        </form>
        <p className="muted">
          <Link href="/auth/login">Back to login</Link>
        </p>
      </section>
    </main>
  );
}
