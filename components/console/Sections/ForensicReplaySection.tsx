"use client";

import { useMemo } from "react";
import { Reveal } from "@/components/site/Primitives";
import type { DecisionRow } from "@/types/console";
import { getFreshnessDotClass } from "@/lib/console/traceUtils";
import { truncateId } from "@/lib/console/formatters";
import { DownloadIcon } from "@/components/site/icons";

export default function ForensicReplaySection({
  decisions,
  onOpenTrace,
}: {
  decisions: DecisionRow[];
  onOpenTrace: (decision: DecisionRow) => void;
}) {
  const importantDecisions = useMemo(
    () => decisions.filter((d) => d.status !== "Approved").slice(0, 5),
    [decisions],
  );

  return (
    <Reveal>
      <section className="grid gap-6">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="eyebrow">Forensic replay</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Trace and audit playback</h2>
              <p className="mt-2 max-w-2xl text-sm text-white/58">Dive into decisions with replayable audit proofs and event histories for fast investigations.</p>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold text-black"
              onClick={() => onOpenTrace(decisions[0])}
            >
              <DownloadIcon width={14} height={14} />
              Latest trace
            </button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {importantDecisions.map((decision) => (
              <button
                key={decision.id}
                type="button"
                onClick={() => onOpenTrace(decision)}
                className="rounded-[1.6rem] border border-white/10 p-5 text-left transition hover:border-white/20 hover:bg-white/5"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-white/38">{decision.operation}</p>
                    <h3 className="mt-2 text-lg font-semibold text-white">{truncateId(decision.id)}</h3>
                  </div>
                  <span className={`inline-flex h-3.5 w-3.5 rounded-full ${getFreshnessDotClass(decision.freshness)}`} />
                </div>
                <div className="mt-4 text-sm text-white/56">
                  {decision.agent} · {decision.timestamp}
                </div>
              </button>
            ))}
            {!importantDecisions.length && (
              <div className="rounded-[1.6rem] border border-white/10 p-5 text-sm text-white/56">
                No forensic traces are available for flagged decisions.
              </div>
            )}
          </div>
        </div>
      </section>
    </Reveal>
  );
}
