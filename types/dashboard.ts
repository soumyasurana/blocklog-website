export type DashboardDecision = {
  id: string;
  actor?: string;
  model?: string;
  status?: string;
  created_at?: string;
};

export type DashboardIncident = {
  id: string;
  title: string;
  severity?: string;
  status?: string;
  owner?: string | null;
  created_at?: string;
};

export type DashboardMetrics = {
  decisionsToday: number;
  activeIncidents: number;
  integrityCoverage: number;
  traceVolume: number;
  pendingHitlReviews: number;
  complianceScore: number;
  ingestionStatus: "healthy" | "idle" | "degraded" | "unknown";
  errorStatus: "healthy" | "degraded" | "down" | "unknown";
  anchoringStatus: "synced" | "delayed" | "pending" | "unknown";
};

export type DashboardMetricsResult = DashboardMetrics & {
  decisions: DashboardDecision[];
  incidents: DashboardIncident[];
};

export type DashboardOverviewData = DashboardMetrics & {
  recentDecisions: DashboardDecision[];
  recentIncidents: DashboardIncident[];
};
