import { useMemo } from "react";
import { useDashboardMetrics } from "@/hooks/dashboard/useDashboardMetrics";
import type { DashboardOverviewData } from "@/types/dashboard";

function takeRecent<T>(items: T[], limit = 5) {
  return items.slice(0, limit);
}

export function useDashboardOverview() {
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
    decisions,
    incidents,
    loading,
    error,
    refetch,
  } = useDashboardMetrics();

  const overview = useMemo<DashboardOverviewData>(() => ({
    decisionsToday,
    activeIncidents,
    integrityCoverage,
    traceVolume,
    pendingHitlReviews,
    complianceScore,
    ingestionStatus,
    errorStatus,
    anchoringStatus,
    recentDecisions: takeRecent(decisions),
    recentIncidents: takeRecent(incidents),
  }), [
    decisionsToday,
    activeIncidents,
    integrityCoverage,
    traceVolume,
    pendingHitlReviews,
    complianceScore,
    ingestionStatus,
    errorStatus,
    anchoringStatus,
    decisions,
    incidents,
  ]);

  return {
    ...overview,
    loading,
    error,
    refetch,
  };
}
