"use client";

import { useState } from "react";
import { Footer, PageFrame, PrimaryButton, Reveal, SiteHeader } from "@/components/site/Primitives";

const pilotTimeline = [
  ["Day 0", "SDK installed, shadow mode active"],
  ["Day 1-7", "First governance records appearing"],
  ["Day 7-14", "Staleness patterns emerging"],
  ["Day 14-21", "Approval gap analysis building"],
  ["Day 21-30", "Forensic report generating"],
  ["Day 30", "Report delivered. Compliance conversation begins."],
];

const qualifications = [
  "AI agent in production making financial decisions such as refunds, fraud, credit, or chargebacks",
  "One engineer willing to spend 4-6 hours on integration",
  "A compliance or risk function that would benefit from the forensic report",
];

const disqualifications = [
  "AI making recommendations only, no autonomous financial action",
  "No regulatory exposure",
  "18-month procurement cycles",
];

export default function PilotPage() {
  const [form, setForm] = useState({
    company: "",
    role: "",
    teamSize: "1-20",
    framework: "LangChain",
    decisions: "",
    trigger: "Recent incident",
    email: "",
  });
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="page-shell">
      <SiteHeader />
      <PageFrame>
        <section className="section-block pt-32">
          <div className="content-wrap">
            <Reveal className="max-w-4xl">
              <p className="eyebrow">{`// 30-Day Pilot`}</p>
              <h1 className="section-title">Shadow Mode. Real Data. Real Report. No Risk.</h1>
              <p className="mt-6 max-w-3xl text-base leading-7 text-white/74">
                Install the SDK in under 5 minutes. Blocklog observes every AI financial decision alongside your existing system.
                After 30 days, you get a forensic report from your own production data showing what happened, why, and what your regulator would ask about it.
              </p>
              <div className="mt-8">
                <PrimaryButton href="/signup">Start Your Pilot</PrimaryButton>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="section-block">
          <div className="content-wrap grid gap-6 lg:grid-cols-3">
            {[
              ["Zero Production Impact", "Shadow mode runs in parallel. No changes to your execution path. No payment processor integration. No procurement committee."],
              ["Forensic Report at Day 30", "Real decisions from your system. Real dollar amounts. Real staleness data. Real compliance implications."],
              ["The Gate Conversation", "After 30 days, you will see exactly which decisions would have required human review under your stated policy."],
            ].map(([title, copy], index) => (
              <Reveal delay={index * 0.08} key={title}>
                <div className="liquid-glass-strong rounded-[2rem] p-6">
                  <div className="text-2xl serif-italic">{title}</div>
                  <p className="mt-4 text-sm leading-7 text-white/72">{copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="section-block">
          <div className="content-wrap">
            <Reveal className="max-w-3xl">
              <h2 className="section-title">Pilot Timeline</h2>
            </Reveal>
            <div className="mt-10 grid gap-4">
              {pilotTimeline.map(([label, detail], index) => (
                <Reveal className="grid gap-4 md:grid-cols-[120px_1px_1fr]" delay={index * 0.07} key={label}>
                  <div className="text-sm uppercase tracking-[0.24em] text-white/38">{label}</div>
                  <div className="trace-line hidden min-h-24 md:block" />
                  <div className="liquid-glass rounded-[2rem] p-5 text-sm leading-7 text-white/76">{detail}</div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section-block">
          <div className="content-wrap grid gap-6 lg:grid-cols-2">
            <Reveal>
              <div className="liquid-glass rounded-[2rem] p-6">
                <p className="eyebrow">The Right Fit for This Pilot</p>
                <div className="mt-6 grid gap-3">
                  {qualifications.map((item) => (
                    <div className="rounded-full border border-white/10 px-4 py-3 text-sm text-white/74" key={item}>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="liquid-glass rounded-[2rem] p-6">
                <p className="eyebrow">Hard Disqualifications</p>
                <div className="mt-6 grid gap-3">
                  {disqualifications.map((item) => (
                    <div className="rounded-full border border-white/10 px-4 py-3 text-sm text-white/56" key={item}>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="section-block">
          <div className="content-wrap">
            <Reveal className="mx-auto max-w-3xl">
              <div className="liquid-glass-strong rounded-[2.5rem] p-6 md:p-8">
                <p className="eyebrow">Pilot Application</p>
                <h2 className="mt-4 text-4xl serif-italic">Apply for the 30-Day Pilot</h2>
                {submitted ? (
                  <div className="mt-8 rounded-[2rem] border border-white/10 p-6">
                    <div className="text-3xl serif-italic">Application received.</div>
                    <p className="mt-4 text-sm leading-7 text-white/72">
                      We review every application personally. Response within 48 hours.
                    </p>
                  </div>
                ) : (
                  <div className="mt-8 grid gap-4">
                    <input className="liquid-glass rounded-full px-5 py-4 bg-transparent text-white placeholder:text-white/28" placeholder="Company name" value={form.company} onChange={(event) => setForm({ ...form, company: event.target.value })} />
                    <input className="liquid-glass rounded-full px-5 py-4 bg-transparent text-white placeholder:text-white/28" placeholder="Your role" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} />
                    <select className="liquid-glass rounded-full px-5 py-4 bg-transparent text-white" value={form.teamSize} onChange={(event) => setForm({ ...form, teamSize: event.target.value })}>
                      {["1-20", "20-100", "100-300", "300+"].map((value) => <option className="bg-black" key={value}>{value}</option>)}
                    </select>
                    <select className="liquid-glass rounded-full px-5 py-4 bg-transparent text-white" value={form.framework} onChange={(event) => setForm({ ...form, framework: event.target.value })}>
                      {["LangChain", "OpenAI Agents SDK", "CrewAI", "Temporal", "Custom", "Other"].map((value) => <option className="bg-black" key={value}>{value}</option>)}
                    </select>
                    <textarea className="liquid-glass min-h-32 rounded-[2rem] px-5 py-4 bg-transparent text-white placeholder:text-white/28" placeholder="What financial decisions does your AI make?" value={form.decisions} onChange={(event) => setForm({ ...form, decisions: event.target.value })} />
                    <div className="grid gap-3 md:grid-cols-2">
                      {["Recent incident", "Upcoming audit", "New deployment", "Board/investor question"].map((value) => (
                        <button
                          className={`liquid-glass rounded-full px-4 py-3 text-left text-sm ${form.trigger === value ? "text-white" : "text-white/58"}`}
                          key={value}
                          onClick={() => setForm({ ...form, trigger: value })}
                          type="button"
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                    <input className="liquid-glass rounded-full px-5 py-4 bg-transparent text-white placeholder:text-white/28" placeholder="Contact email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
                    <button className="rounded-full bg-white px-5 py-4 text-sm font-medium text-black" onClick={() => setSubmitted(true)} type="button">
                      Apply for Pilot
                    </button>
                    <p className="text-sm text-white/46">We review every application personally. Response within 48 hours.</p>
                  </div>
                )}
              </div>
            </Reveal>
          </div>
        </section>

        <Footer />
      </PageFrame>
    </div>
  );
}
