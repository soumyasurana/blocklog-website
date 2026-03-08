import Link from "next/link";

export default function ResetPasswordPage() {
  return (
    <main className="auth-page">
      <section className="card auth-card">
        <h1 style={{ marginTop: 0 }}>Reset password</h1>
        <form className="form">
          <div>
            <label>New password</label>
            <input type="password" placeholder="New secure password" />
          </div>
          <div>
            <label>Confirm password</label>
            <input type="password" placeholder="Repeat password" />
          </div>
          <button className="btn btn-primary" type="submit">
            Reset password
          </button>
        </form>
        <p className="muted">
          <Link href="/auth/login">Back to login</Link>
        </p>
      </section>
    </main>
  );
}
