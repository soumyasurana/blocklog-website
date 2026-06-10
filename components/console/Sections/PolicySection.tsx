"use client";

import { Reveal } from "@/components/site/Primitives";
import type { DecisionRow } from "@/types/console";
import DecisionsTable from "@/components/console/Decisions/DecisionsTable";

export default function PolicySection({
  decisions,
  selectedId,
  onSelect,
}: {
  decisions: DecisionRow[];
  selectedId: string | null;
  onSelect: (decision: DecisionRow) => void;
}) {
  return (
    <Reveal>
      <section className="grid gap-6">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="eyebrow">Policy engine</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Decision authority and rule validation</h2>
              <p className="mt-2 max-w-2xl text-sm text-white/58">Inspect policy decisions and identify the rules that influenced the final approval state.</p>
            </div>
          </div>
          <div className="mt-6">
            <DecisionsTable
              decisions={decisions}
              onSelect={onSelect}
              expandable
              selectedId={selectedId}
            />
          </div>
        </div>
      </section>
    </Reveal>
  );
}
