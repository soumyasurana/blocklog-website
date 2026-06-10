"use client";

import ConsolePageWrapper from "@/components/console/ConsolePageWrapper";

export default function AnchoringPage() {
  return (
    <ConsolePageWrapper requiredTab="Overview">
      {() => (
        <div className="space-y-6">
          <div className="liquid-glass rounded-[2rem] p-5">
            <p className="eyebrow">Anchoring</p>
            <h2 className="mt-3 text-3xl serif-italic">Blockchain Settlement</h2>
            <p className="mt-3 text-sm text-white/64">
              View cryptographic proofs committed to public ledgers for permanent immutability.
            </p>
          </div>
          <div className="liquid-glass rounded-[2.4rem] p-5 text-sm text-white/64">
            Anchoring settings and transaction explorer are available in the core Blocklog admin portal.
          </div>
        </div>
      )}
    </ConsolePageWrapper>
  );
}
