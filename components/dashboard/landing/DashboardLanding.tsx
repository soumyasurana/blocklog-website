"use client";

import QuickLinksPanel from "@/components/dashboard/landing/QuickLinksPanel";
import ExecutiveSummaryCards from "@/components/dashboard/landing/ExecutiveSummaryCards";
import RecentDecisionsPanel from "@/components/dashboard/landing/RecentDecisionsPanel";
import RecentIncidentsPanel from "@/components/dashboard/landing/RecentIncidentsPanel";
import IntegrityCoveragePanel from "@/components/dashboard/landing/IntegrityCoveragePanel";
import TraceVolumePanel from "@/components/dashboard/landing/TraceVolumePanel";
import PendingHitlReviewsPanel from "@/components/dashboard/landing/PendingHitlReviewsPanel";
import CompliancePosturePanel from "@/components/dashboard/landing/CompliancePosturePanel";
import OperationalHealthPanel from "@/components/dashboard/landing/OperationalHealthPanel";
import LoadingState from "@/components/shared/LoadingState";
import { useDashboardOverview } from "@/hooks/dashboard/useDashboardOverview";

export default function DashboardLanding() {
  const {
    decisionsToday,
    activeIncidents,
    integrityCoverage,
    traceVolume,
    pendingHitlReviews,
    complianceScore,
    ingestionStatus,
    errorStatus,
    anchoringStatus,
    recentDecisions,
    recentIncidents,
    loading,
    error,
  } = useDashboardOverview();

  return (
    <div className="dashboard-landing">
      <header className="dashboard-landing-header">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>Executive operational overview</h1>
          <p className="muted">A single view for what is happening across trust, operations, and monitoring.</p>
        </div>
      </header>

      {loading ? (
        <LoadingState label="Loading dashboard metrics..." />
      ) : error ? (
        <div className="card error-banner">{error}</div>
      ) : (
        <>
          <ExecutiveSummaryCards
            decisionsToday={decisionsToday}
            activeIncidents={activeIncidents}
            integrityCoverage={integrityCoverage}
            traceVolume={traceVolume}
            pendingHitlReviews={pendingHitlReviews}
            complianceScore={complianceScore}
          />

          <div className="dashboard-grid dashboard-panels">
            <RecentDecisionsPanel decisions={recentDecisions} />
            <RecentIncidentsPanel incidents={recentIncidents} />
          </div>

          <div className="dashboard-grid dashboard-panels">
            <OperationalHealthPanel
              ingestionStatus={ingestionStatus}
              errorStatus={errorStatus}
              anchoringStatus={anchoringStatus}
            />
            <IntegrityCoveragePanel integrityCoverage={integrityCoverage} complianceScore={complianceScore} />
            <TraceVolumePanel traceVolume={traceVolume} />
            <PendingHitlReviewsPanel pendingHitlReviews={pendingHitlReviews} />
            <CompliancePosturePanel complianceScore={complianceScore} />
          </div>

          <QuickLinksPanel />
        </>
      )}
    </div>
  );
}
