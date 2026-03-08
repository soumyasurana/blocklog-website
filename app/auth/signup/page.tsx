import Link from "next/link";

export default function SignupPage() {
  return (
    <main className="auth-page">
      <section className="card auth-card">
        <h1 style={{ marginTop: 0 }}>Create your Blocklog account</h1>
        <form className="form">
          <div>
            <label>Full name</label>
            <input placeholder="Jane Doe" />
          </div>
          <div>
            <label>Work email</label>
            <input type="email" placeholder="jane@company.com" />
          </div>
          <div>
            <label>Password</label>
            <input type="password" placeholder="Minimum 8 characters" />
          </div>
          <button className="btn btn-primary" type="submit">
            Start Free
          </button>
        </form>
        <p className="muted">
          Already have an account? <Link href="/auth/login">Log in</Link>
        </p>
      </section>
    </main>
  );
}
