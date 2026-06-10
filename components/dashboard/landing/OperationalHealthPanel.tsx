import MetricPanel from "@/components/shared/MetricPanel";
import StatusBadge from "@/components/shared/StatusBadge";

type OperationalHealthPanelProps = {
  ingestionStatus: string;
  errorStatus: string;
  anchoringStatus: string;
};

function renderBadge(label: string, value: string) {
  const variant = value === "healthy" || value === "synced" ? "success" : value === "pending" || value === "idle" ? "warning" : "danger";
  return <StatusBadge value={`${label}: ${value}`} variant={variant} />;
}

export default function OperationalHealthPanel({ ingestionStatus, errorStatus, anchoringStatus }: OperationalHealthPanelProps) {
  return (
    <MetricPanel title="Operational Health" description="Platform telemetry and service readiness status.">
      <div className="dashboard-health-grid">
        {renderBadge("Ingestion", ingestionStatus)}
        {renderBadge("Error monitor", errorStatus)}
        {renderBadge("Anchoring", anchoringStatus)}
      </div>
    </MetricPanel>
  );
}
