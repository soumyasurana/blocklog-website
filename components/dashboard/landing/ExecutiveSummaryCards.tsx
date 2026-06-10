import DashboardMiniKpiCard from "@/components/dashboard/landing/DashboardMiniKpiCard";

type ExecutiveSummaryCardsProps = {
  decisionsToday: number;
  activeIncidents: number;
  integrityCoverage: number;
  traceVolume: number;
  pendingHitlReviews: number;
  complianceScore: number;
};

export default function ExecutiveSummaryCards({
  decisionsToday,
  activeIncidents,
  integrityCoverage,
  traceVolume,
  pendingHitlReviews,
  complianceScore,
}: ExecutiveSummaryCardsProps) {
  return (
    <div className="dashboard-grid dashboard-kpis">
      <DashboardMiniKpiCard label="Decisions Today" value={decisionsToday} description="Recent AI decisions" />
      <DashboardMiniKpiCard label="Active Incidents" value={activeIncidents} description="Open incident investigations" />
      <DashboardMiniKpiCard label="Integrity Coverage" value={`${integrityCoverage}%`} description="Verified production data" />
      <DashboardMiniKpiCard label="Trace Volume" value={traceVolume} description="Traces collected" />
      <DashboardMiniKpiCard label="Pending HITL Reviews" value={pendingHitlReviews} description="Human review queue" />
      <DashboardMiniKpiCard label="Compliance Posture" value={`${complianceScore}%`} description="Current compliance score" />
    </div>
  );
}
