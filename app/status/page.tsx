"use client";

import { useEffect, useState } from "react";
import { Footer, PageFrame, Reveal, SiteHeader } from "@/components/site/Primitives";

const metrics = [
  ["Hash Chain Integrity", 99.999, "%"],
  ["Proof Verification Latency", 30, "Sec"],
  ["Record Ingestion", 1284421, ""],
  ["Authorization Gate Uptime", 99.97, "%"],
  ["Forensic Replay Engine", 100, "%"],
  ["Compliance Report Generation", 100, "%"],
];

const services = [
  ["Governance Record Store", "Operational", "< 5ms", "99.99%"],
  ["Authorization Gate", "Operational", "< 12ms", "99.97%"],
  ["Forensic Replay Engine", "Operational", "< 2min", "99.95%"],
  ["Compliance Report Generator", "Operational", "< 20min", "99.92%"],
  ["Policy Evaluation Engine", "Operational", "< 8ms", "99.98%"],
  ["Hash Chain Verification", "Operational", "< 3ms", "100%"],
  ["SDK Ingestion API", "Operational", "< 15ms", "99.99%"],
  ["Audit Export API", "Operational", "< 30s", "99.96%"],
];

function useCountUp(target: number) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let frame = 0;
    const duration = 1200;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setValue(target * progress);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  return value;
}

function MetricValue({ value, suffix }: { value: number; suffix: string }) {
  const animated = useCountUp(value);
  const display = value > 1000 ? Math.round(animated).toLocaleString() : animated.toFixed(value % 1 === 0 ? 0 : 3);
  return <span>{display}{suffix ? ` ${suffix}` : ""}</span>;
}

export default function StatusPage() {
  return (
    <div className="page-shell">
      <SiteHeader />
      <PageFrame>
        <section className="section-block pt-32">
          <div className="content-wrap">
            <Reveal className="max-w-4xl">
              <p className="eyebrow">{`// System Status`}</p>
              <h1 className="section-title">Blocklog Infrastructure — Live Status</h1>
              <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/12 px-5 py-4 text-sm text-white liquid-glass">
                <span className="status-dot" />
                All Systems Operational
              </div>
            </Reveal>
          </div>
        </section>

        <section className="section-block">
          <div className="content-wrap grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {metrics.map(([label, value, suffix], index) => (
              <Reveal delay={index * 0.05} key={String(label)}>
                <div className="liquid-glass rounded-[2rem] p-6">
                  <p className="text-xs uppercase tracking-[0.22em] text-white/40">{label}</p>
                  <div className="mt-4 text-4xl serif-italic">
                    <MetricValue value={Number(value)} suffix={String(suffix)} />
                  </div>
                  <p className="mt-3 text-sm text-white/54">Last updated {new Date().toLocaleTimeString()}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="section-block">
          <div className="content-wrap">
            <Reveal className="liquid-glass-strong rounded-[2.5rem] p-4 md:p-6">
              <table className="table-grid">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Status</th>
                    <th>Latency</th>
                    <th>Uptime (30d)</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map(([service, status, latency, uptime]) => (
                    <tr key={String(service)}>
                      <td>{service}</td>
                      <td>
                        <span className="inline-flex items-center gap-3">
                          <span className="status-dot" />
                          {status}
                        </span>
                      </td>
                      <td>{latency}</td>
                      <td>{uptime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Reveal>
          </div>
        </section>

        <section className="section-block">
          <div className="content-wrap grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <Reveal>
              <div className="liquid-glass rounded-[2rem] p-6">
                <h2 className="text-3xl serif-italic">Incident History</h2>
                <div className="mt-6 rounded-[1.5rem] border border-white/10 p-5 text-sm text-white/68">
                  No incidents in the last 30 days.
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="liquid-glass rounded-[2rem] p-6">
                <h2 className="text-3xl serif-italic">Subscribe to Updates</h2>
                <div className="mt-6 grid gap-4">
                  <input className="liquid-glass rounded-full px-5 py-4 bg-transparent text-white placeholder:text-white/28" placeholder="Email address" />
                  <button className="rounded-full bg-white px-5 py-4 text-sm font-medium text-black" type="button">
                    Subscribe to Incidents
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <Footer />
      </PageFrame>
    </div>
  );
}
