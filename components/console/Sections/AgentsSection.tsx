"use client";

import { useMemo } from "react";
import { Reveal } from "@/components/site/Primitives";
import type { DecisionRow } from "@/types/console";

export default function AgentsSection({
  decisions,
}: {
  decisions: DecisionRow[];
}) {
  const agentStats = useMemo(() => {
    return decisions.reduce<Record<string, { total: number; approved: number }>>((acc, decision) => {
      const metrics = acc[decision.agent] ?? { total: 0, approved: 0 };
      metrics.total += 1;
      if (decision.status === "Approved") metrics.approved += 1;
      acc[decision.agent] = metrics;
      return acc;
    }, {});
  }, [decisions]);

  return (
    <Reveal>
      <section className="grid gap-6">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="eyebrow">Agent insights</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Per-agent decision performance</h2>
              <p className="mt-2 max-w-2xl text-sm text-white/58">Understand which policy agents are acting on the right signals and where exceptions are happening.</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Object.entries(agentStats).map(([agent, stats]) => (
              <div key={agent} className="rounded-[1.6rem] border border-white/10 p-5">
                <p className="text-sm text-white/48">{agent}</p>
                <div className="mt-4 flex items-baseline gap-4">
                  <p className="text-4xl font-semibold text-white">{stats.total}</p>
                  <p className="text-sm text-white/56">Approved {stats.approved}</p>
                </div>
                <div className="mt-4 h-2 rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-emerald-400" style={{ width: `${(stats.approved / stats.total) * 100}%` }} />
                </div>
                <p className="mt-3 text-xs uppercase tracking-[0.24em] text-white/34">Approval rate</p>
              </div>
            ))}
            {!Object.keys(agentStats).length && (
              <div className="rounded-[1.6rem] border border-white/10 p-5 text-sm text-white/56">
                No agent decisions captured yet.
              </div>
            )}
          </div>
        </div>
      </section>
    </Reveal>
  );
}
