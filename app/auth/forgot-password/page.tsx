import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <main className="auth-page">
      <section className="card auth-card">
        <h1 style={{ marginTop: 0 }}>Forgot password</h1>
        <p className="muted">Enter your email and we will send a reset link.</p>
        <form className="form">
          <div>
            <label>Email</label>
            <input type="email" placeholder="you@company.com" />
          </div>
          <button className="btn btn-primary" type="submit">
            Send reset email
          </button>
        </form>
        <p className="muted">
          <Link href="/auth/login">Back to login</Link>
        </p>
      </section>
    </main>
  );
}
