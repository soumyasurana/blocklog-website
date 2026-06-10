"use client";

import ConsolePageWrapper from "@/components/console/ConsolePageWrapper";
import OverviewSection from "@/components/console/Sections/OverviewSection";

export default function ConsoleOverviewPage() {
  return (
    <ConsolePageWrapper requiredTab="Overview">
      {({ decisions, loading }) => (
        <OverviewSection decisions={decisions} loading={loading} />
      )}
    </ConsolePageWrapper>
  );
}
