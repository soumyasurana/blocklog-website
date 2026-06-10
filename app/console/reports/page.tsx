"use client";

import ConsolePageWrapper from "@/components/console/ConsolePageWrapper";
import ComplianceSection from "@/components/console/Sections/ComplianceSection";

export default function ReportsPage() {
  return (
    <ConsolePageWrapper requiredTab="Overview">
      {({ stats }) => (
        <ComplianceSection
          complianceScore={stats?.integrityCoverage ?? 0}
          activeReports={stats?.activeReports ?? 2}
        />
      )}
    </ConsolePageWrapper>
  );
}