import MetricPanel from "@/components/shared/MetricPanel";
import StatusBadge from "@/components/shared/StatusBadge";

type IntegrityCoveragePanelProps = {
  integrityCoverage: number;
  complianceScore: number;
};

export default function IntegrityCoveragePanel({ integrityCoverage, complianceScore }: IntegrityCoveragePanelProps) {
  return (
    <MetricPanel title="Integrity Coverage" description="Live compliance and coverage metrics for verified data.">
      <div className="dashboard-summary-row">
        <div>
          <p className="eyebrow">Coverage</p>
          <h3>{integrityCoverage}%</h3>
        </div>
        <StatusBadge value={integrityCoverage > 90 ? "Healthy" : integrityCoverage > 50 ? "At Risk" : "Degraded"} variant={integrityCoverage > 90 ? "success" : integrityCoverage > 50 ? "warning" : "danger"} />
      </div>
      <div className="dashboard-summary-row">
        <div>
          <p className="eyebrow">Compliance score</p>
          <h3>{complianceScore}%</h3>
        </div>
      </div>
    </MetricPanel>
  );
}
