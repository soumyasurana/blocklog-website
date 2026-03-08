import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="auth-page">
      <section className="card auth-card">
        <h1 style={{ marginTop: 0 }}>Log in</h1>
        <form className="form">
          <div>
            <label>Email</label>
            <input type="email" placeholder="you@company.com" />
          </div>
          <div>
            <label>Password</label>
            <input type="password" placeholder="Enter your password" />
          </div>
          <button className="btn btn-primary" type="submit">
            Login
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
