"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { LiveBackdrop } from "@/components/site/Primitives";
import { blocklogRequest, normalizePayload, writeSession } from "@/lib/blocklog";

type LoginResponse = {
  access_token?: string;
  company_id?: string;
  expires_in?: number;
};

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = await blocklogRequest<LoginResponse | { data?: LoginResponse }>(
        "/auth/login",
        "POST",
        { email, password },
      );
      const session = normalizePayload<LoginResponse>(payload, {}, "data");
      writeSession(
        {
          accessToken: session.access_token,
          companyId: session.company_id,
        },
        session.expires_in ? session.expires_in * 1000 : undefined,
      );
      const nextPath =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search).get("next")
          : null;
      router.push(nextPath || "/console");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black px-4 pt-24">
      <LiveBackdrop minimal />
      <div className="mx-auto flex min-h-[80vh] max-w-xl items-center justify-center">
        <form className="liquid-glass-strong relative z-10 w-full rounded-[2.5rem] p-8 md:p-10" onSubmit={submit}>
          <div className="mx-auto mb-8 flex h-12 w-12 items-center justify-center rounded-full liquid-glass text-[2rem] serif-italic">
            b
          </div>
          <div className="text-center">
            <h1 className="text-4xl serif-italic">Sign in to Blocklog</h1>
            <p className="mt-4 text-sm text-white/68">Access your governance console.</p>
          </div>
          <div className="mt-8 grid gap-4">
            <input className="liquid-glass rounded-full px-5 py-4 bg-transparent text-white placeholder:text-white/28" placeholder="Email address" value={email} onChange={(event) => setEmail(event.target.value)} />
            <div className="liquid-glass flex items-center rounded-full px-5 py-4">
              <input className="w-full bg-transparent text-white outline-none placeholder:text-white/28" placeholder="Password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} />
              <button className="text-sm text-white/56" onClick={() => setShowPassword((value) => !value)} type="button">
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {error ? <p className="text-sm text-white/64">{error}</p> : null}
            <button className="rounded-full bg-white px-5 py-4 text-sm font-medium text-black" type="submit">
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </div>
          <div className="my-6 text-center text-sm text-white/34">or</div>
          <button className="liquid-glass w-full rounded-full px-5 py-4 text-sm text-white/78" onClick={(event) => event.preventDefault()} type="button">
            Continue with Google
          </button>
          <div className="mt-8 text-center text-sm text-white/56">
            Don&apos;t have an account? <Link href="/signup" className="text-white">Join Pilot</Link> · <Link href="/auth/forgot-password" className="text-white">Forgot password?</Link>
          </div>
        </form>
      </div>
    </main>
  );
}
