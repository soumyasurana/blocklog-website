"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LiveBackdrop } from "@/components/site/Primitives";
import { blocklogRequest, normalizePayload, writeSession } from "@/lib/blocklog";

const roles = ["Engineer", "CTO/VP Eng", "Head of Risk/Compliance", "Founder", "Other"];
const companySizes = ["1-20", "20-100", "100-300", "300+"];
const frameworks = ["LangChain", "OpenAI Agents SDK", "CrewAI", "Temporal", "Custom", "Other"];
const volumes = ["< 1,000", "1,000 – 10,000", "10,000 – 100,000", "100,000+"];
const triggers = ["Recent incident", "Upcoming audit", "New deployment", "Board/investor question", "Just exploring"];

type SignupResponse = {
  access_token?: string;
  company_id?: string;
  expires_in?: number;
};

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    password: "",
    role: roles[0],
    companySize: companySizes[0],
    framework: frameworks[0],
    decisions: "",
    volume: volumes[0],
    trigger: triggers[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buildUsername = () => {
    const fromName = form.name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
    if (fromName.length >= 3) return fromName.slice(0, 40);
    const emailLocal = form.email.split("@")[0]?.toLowerCase().replace(/[^a-z0-9_]/g, "") || "pilot_user";
    return emailLocal.slice(0, 40);
  };

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = await blocklogRequest<SignupResponse | { data?: SignupResponse }>(
        "/auth/signup",
        "POST",
        {
          username: buildUsername(),
          email: form.email,
          password: form.password,
          workspace_name: form.company,
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
      setStep(3);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to start pilot");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black px-4 pt-24">
      <LiveBackdrop minimal />
      <div className="mx-auto flex min-h-[80vh] max-w-2xl items-center justify-center">
        <div className="liquid-glass-strong w-full rounded-[2.5rem] p-8 md:p-10">
          {step === 1 ? (
            <>
              <h1 className="text-4xl serif-italic">Start Your 30-Day Pilot</h1>
              <p className="mt-4 text-sm text-white/68">Free. No production impact. First forensic report in 30 days.</p>
              <div className="mt-8 grid gap-4">
                <input className="liquid-glass rounded-full px-5 py-4 bg-transparent text-white placeholder:text-white/28" placeholder="Full name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
                <input className="liquid-glass rounded-full px-5 py-4 bg-transparent text-white placeholder:text-white/28" placeholder="Work email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
                <input className="liquid-glass rounded-full px-5 py-4 bg-transparent text-white placeholder:text-white/28" placeholder="Company name" value={form.company} onChange={(event) => setForm({ ...form, company: event.target.value })} />
                <input className="liquid-glass rounded-full px-5 py-4 bg-transparent text-white placeholder:text-white/28" placeholder="Create password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
                <select className="liquid-glass rounded-full px-5 py-4 bg-transparent text-white" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
                  {roles.map((item) => <option className="bg-black" key={item}>{item}</option>)}
                </select>
                <select className="liquid-glass rounded-full px-5 py-4 bg-transparent text-white" value={form.companySize} onChange={(event) => setForm({ ...form, companySize: event.target.value })}>
                  {companySizes.map((item) => <option className="bg-black" key={item}>{item}</option>)}
                </select>
                <button className="rounded-full bg-white px-5 py-4 text-sm font-medium text-black" onClick={() => setStep(2)} type="button">
                  Continue
                </button>
              </div>
            </>
          ) : null}

          {step === 2 ? (
            <>
              <h1 className="text-4xl serif-italic">Tell Us About Your AI</h1>
              <p className="mt-4 text-sm text-white/68">This helps us calibrate your shadow mode defaults correctly.</p>
              <div className="mt-8 grid gap-4">
                <select className="liquid-glass rounded-full px-5 py-4 bg-transparent text-white" value={form.framework} onChange={(event) => setForm({ ...form, framework: event.target.value })}>
                  {frameworks.map((item) => <option className="bg-black" key={item}>{item}</option>)}
                </select>
                <textarea className="liquid-glass min-h-32 rounded-[2rem] px-5 py-4 bg-transparent text-white placeholder:text-white/28" placeholder="What financial decisions does your AI make?" value={form.decisions} onChange={(event) => setForm({ ...form, decisions: event.target.value })} />
                <select className="liquid-glass rounded-full px-5 py-4 bg-transparent text-white" value={form.volume} onChange={(event) => setForm({ ...form, volume: event.target.value })}>
                  {volumes.map((item) => <option className="bg-black" key={item}>{item}</option>)}
                </select>
                <div className="grid gap-3 md:grid-cols-2">
                  {triggers.map((item) => (
                    <button className={`rounded-full px-4 py-3 text-left text-sm ${form.trigger === item ? "bg-white text-black" : "liquid-glass text-white/68"}`} key={item} onClick={() => setForm({ ...form, trigger: item })} type="button">
                      {item}
                    </button>
                  ))}
                </div>
                {error ? <p className="text-sm text-white/64">{error}</p> : null}
                <button className="rounded-full bg-white px-5 py-4 text-sm font-medium text-black" disabled={loading} onClick={submit} type="button">
                  {loading ? "Starting..." : "Start Pilot"}
                </button>
              </div>
            </>
          ) : null}

          {step === 3 ? (
            <>
              <h1 className="text-4xl serif-italic">You&apos;re in.</h1>
              <p className="mt-4 text-sm text-white/68">We&apos;ll review your application and send SDK installation instructions within 48 hours.</p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link className="rounded-full bg-white px-5 py-4 text-center text-sm font-medium text-black" href="/docs">
                  Read the Quick Start Docs
                </Link>
                <button className="liquid-glass rounded-full px-5 py-4 text-center text-sm text-white/78" onClick={() => router.push("/console")} type="button">
                  Open Console
                </button>
                <Link className="liquid-glass rounded-full px-5 py-4 text-center text-sm text-white/78" href="/pricing">
                  See How Pricing Works
                </Link>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </main>
  );
}
