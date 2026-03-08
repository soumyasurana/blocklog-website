"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { blocklogRequest } from "@/lib/blocklog";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    try {
      await blocklogRequest("/auth/forgot-password", "POST", { email });
      setMessage("If the account exists, a reset link has been sent.");
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
