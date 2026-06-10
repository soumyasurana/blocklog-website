import { useCallback, useEffect, useRef, useState } from "react";
import { blocklogRequest } from "@/lib/blocklog";
import type { DashboardDecision, DashboardIncident, DashboardMetrics } from "@/types/dashboard";

const PENDING_REVIEW_STATUSES = new Set(["pending", "review", "needs_review", "action_required"]);
const EMPTY_METRICS: DashboardMetrics = {
  decisionsToday: 0,
  activeIncidents: 0,
  integrityCoverage: 0,
  traceVolume: 0,
  pendingHitlReviews: 0,
  complianceScore: 0,
  ingestionStatus: "unknown",
  errorStatus: "unknown",
  anchoringStatus: "unknown",
};

function parseDecisionItems(items: unknown[]): DashboardDecision[] {
  return items.map((item) => ({
    id: (item as { id?: string }).id ?? "",
    actor: (item as { actor?: string }).actor,
    model: (item as { model?: string }).model,
    status: (item as { status?: string }).status,
    created_at: (item as { created_at?: string }).created_at,
  }));
}

function parseIncidentItems(items: unknown[]): DashboardIncident[] {
  return items.map((item) => ({
    id: (item as { id?: string }).id ?? "",
    title: (item as { title?: string }).title ?? "Untitled incident",
    severity: (item as { severity?: string }).severity,
    status: (item as { status?: string }).status,
    owner: (item as { owner?: string | null }).owner ?? null,
    created_at: (item as { created_at?: string }).created_at,
  }));
}

function parseNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

type ApiResult<T> = { status: "fulfilled"; value: T } | { status: "rejected"; reason: Error };

export function useDashboardMetrics() {
  const [metrics, setMetrics] = useState<DashboardMetrics & {
    decisions: DashboardDecision[];
    incidents: DashboardIncident[];
  }>({
    ...EMPTY_METRICS,
    decisions: [],
    incidents: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cancelRef = useRef(false);

  const loadMetrics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const results = await Promise.allSettled([
        blocklogRequest<unknown[]>('/decisions'),
        blocklogRequest<unknown[]>('/incidents'),
        blocklogRequest<{ items?: unknown[] }>('/traces'),
        blocklogRequest<Record<string, unknown>>('/integrity/status'),
        blocklogRequest<Record<string, unknown>>('/usage'),
      ]);

      if (cancelRef.current) return;

      const [decisionsResult, incidentsResult, tracesResult, integrityResult, usageResult] = results as [
        ApiResult<unknown[]>,
        ApiResult<unknown[]>,
        ApiResult<{ items?: unknown[] }>,
        ApiResult<Record<string, unknown>>,
        ApiResult<Record<string, unknown>>,
      ];

      const errorMessages: string[] = [];
      if (decisionsResult.status === "rejected") errorMessages.push("Failed to load decisions");
      if (incidentsResult.status === "rejected") errorMessages.push("Failed to load incidents");
      if (tracesResult.status === "rejected") errorMessages.push("Failed to load traces");
      if (integrityResult.status === "rejected") errorMessages.push("Failed to load integrity status");
      if (usageResult.status === "rejected") errorMessages.push("Failed to load usage data");

      if (errorMessages.length > 0 && errorMessages.length === 5) {
        throw new Error("Unable to load dashboard data. Please check your connection and try again.");
      }

      if (errorMessages.length > 0) {
        console.warn("Some dashboard data failed to load:", errorMessages);
      }

      const decisions = decisionsResult.status === "fulfilled" ? parseDecisionItems(Array.isArray(decisionsResult.value) ? decisionsResult.value : []) : [];
      const incidents = incidentsResult.status === "fulfilled" ? parseIncidentItems(Array.isArray(incidentsResult.value) ? incidentsResult.value : []) : [];
      const traces = tracesResult.status === "fulfilled" ? (Array.isArray(tracesResult.value?.items) ? tracesResult.value.items : []) : [];
      
      const integrityData = integrityResult.status === "fulfilled" ? integrityResult.value : {};
      const usageData = usageResult.status === "fulfilled" ? usageResult.value : {};

      const logsVerified = parseNumber(integrityData.logs_verified ?? integrityData.logsVerified ?? 0);
      const totalRecords = parseNumber(usageData.logs_ingested ?? usageData.logsIngested ?? 0);
      const anchorsCreated = parseNumber(integrityData.anchors_created ?? integrityData.anchorsCreated ?? 0);
      const verificationFailures = parseNumber(integrityData.verification_failures ?? integrityData.verificationFailures ?? 0);

      const recentDecisions = decisions
        .filter((decision) => decision.created_at)
        .sort((a, b) => Number(new Date(b.created_at ?? 0)) - Number(new Date(a.created_at ?? 0)));

      const recentIncidents = incidents
        .filter((incident) => incident.created_at)
        .sort((a, b) => Number(new Date(b.created_at ?? 0)) - Number(new Date(a.created_at ?? 0)));

      const pendingHitlReviews = decisions.filter((item) => PENDING_REVIEW_STATUSES.has((item.status ?? "").toLowerCase())).length;
      const decisionsToday = decisions.filter((item) => {
        if (!item.created_at) return false;
        const created = new Date(item.created_at);
        const since = Date.now() - 1000 * 60 * 60 * 24;
        return created.getTime() >= since;
      }).length;

      const integrityCoverage = totalRecords > 0 ? Math.round((logsVerified / totalRecords) * 100) : 0;
      const complianceScore = Math.max(0, Math.min(100, integrityCoverage));

      const ingestionStatus = totalRecords > 0 ? "healthy" : "idle";
      const errorStatus = verificationFailures > 0 ? "degraded" : "healthy";
      const anchoringStatus = anchorsCreated > 0 ? "synced" : "pending";

      setMetrics({
        decisionsToday,
        activeIncidents: incidents.filter((incident) => (incident.status ?? "").toLowerCase() !== "closed").length,
        integrityCoverage,
        traceVolume: traces.length,
        pendingHitlReviews,
        complianceScore,
        ingestionStatus,
        errorStatus,
        anchoringStatus,
        decisions: recentDecisions,
        incidents: recentIncidents,
      });
    } catch (err) {
      if (!cancelRef.current) {
        const message = err instanceof Error ? err.message : "Failed to load dashboard metrics";
        setError(message);
        console.error("Dashboard metrics error:", err);
      }
    } finally {
      if (!cancelRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    cancelRef.current = false;
    void loadMetrics();
    return () => {
      cancelRef.current = true;
    };
  }, [loadMetrics]);

  return {
    ...metrics,
    decisions: metrics.decisions,
    incidents: metrics.incidents,
    loading,
    error,
    refetch: loadMetrics,
  };
}
