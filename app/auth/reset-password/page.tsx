"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { blocklogRequest } from "@/lib/blocklog";

export default function ResetPasswordPage() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await blocklogRequest("/auth/reset-password", "POST", { token, password });
      setMessage("Password updated successfully. You can now login.");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to reset password",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="card auth-card">
        <h1 style={{ marginTop: 0 }}>Reset password</h1>
        <form className="form" onSubmit={onSubmit}>
          <div>
            <label>Reset token</label>
            <input
              placeholder="Paste token from email"
              value={token}
              onChange={(event) => setToken(event.target.value)}
              required
            />
          </div>
          <div>
            <label>New password</label>
            <input
              type="password"
              placeholder="New secure password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          <div>
            <label>Confirm password</label>
            <input
              type="password"
              placeholder="Repeat password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </div>
          {message && <p style={{ color: "var(--success)", margin: 0 }}>{message}</p>}
          {error && <p style={{ color: "var(--danger)", margin: 0 }}>{error}</p>}
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset password"}
          </button>
        </form>
        <p className="muted">
          <Link href="/auth/login">Back to login</Link>
        </p>
      </section>
    </main>
  );
}
