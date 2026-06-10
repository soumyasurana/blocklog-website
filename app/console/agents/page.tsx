"use client";

import ConsolePageWrapper from "@/components/console/ConsolePageWrapper";
import AgentsSection from "@/components/console/Sections/AgentsSection";

export default function AgentsPage() {
  return (
    <ConsolePageWrapper requiredTab="Agents">
      {({ decisions }) => (
        <AgentsSection decisions={decisions} />
      )}
    </ConsolePageWrapper>
  );
}
