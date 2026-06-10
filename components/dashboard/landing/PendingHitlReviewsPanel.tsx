import MetricPanel from "@/components/shared/MetricPanel";

type PendingHitlReviewsPanelProps = {
  pendingHitlReviews: number;
};

export default function PendingHitlReviewsPanel({ pendingHitlReviews }: PendingHitlReviewsPanelProps) {
  return (
    <MetricPanel title="Pending HITL Reviews" description="Human-in-the-loop review items awaiting attention.">
      <div className="dashboard-summary-row">
        <div>
          <p className="eyebrow">Pending reviews</p>
          <h3>{pendingHitlReviews}</h3>
        </div>
      </div>
    </MetricPanel>
  );
}
