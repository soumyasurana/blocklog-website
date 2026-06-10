import DecisionTable from "@/components/shared/DecisionTable";
import type { DashboardDecision } from "@/types/dashboard";

type RecentDecisionsPanelProps = {
  decisions: DashboardDecision[];
};

export default function RecentDecisionsPanel({ decisions }: RecentDecisionsPanelProps) {
  return (
    <section className="card dashboard-panel">
      <div className="section-header">
        <div>
          <p className="eyebrow">Recent Activity</p>
          <h2>Recent Decisions</h2>
        </div>
      </div>
      <DecisionTable decisions={decisions} emptyLabel="No recent decisions found." />
    </section>
  );
}
