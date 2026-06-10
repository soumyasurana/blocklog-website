"use client";

import ConsolePageWrapper from "@/components/console/ConsolePageWrapper";
import PolicySection from "@/components/console/Sections/PolicySection";

export default function PolicyPage() {
  return (
    <ConsolePageWrapper requiredTab="Policy Engine">
      {({ decisions, selected, handleSelect }) => (
        <PolicySection 
          decisions={decisions} 
          selectedId={selected?.id ?? null} 
          onSelect={handleSelect} 
        />
      )}
    </ConsolePageWrapper>
  );
}
