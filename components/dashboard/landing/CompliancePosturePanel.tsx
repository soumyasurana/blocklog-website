import MetricPanel from "@/components/shared/MetricPanel";
import StatusBadge from "@/components/shared/StatusBadge";

type CompliancePosturePanelProps = {
  complianceScore: number;
};

export default function CompliancePosturePanel({ complianceScore }: CompliancePosturePanelProps) {
  return (
    <MetricPanel title="Compliance Posture" description="Overview of your current control and verification posture.">
      <div className="dashboard-summary-row">
        <div>
          <p className="eyebrow">Score</p>
          <h3>{complianceScore}%</h3>
        </div>
        <StatusBadge value={complianceScore > 90 ? "Strong" : complianceScore > 60 ? "Moderate" : "Weak"} variant={complianceScore > 90 ? "success" : complianceScore > 60 ? "warning" : "danger"} />
      </div>
    </MetricPanel>
  );
}
