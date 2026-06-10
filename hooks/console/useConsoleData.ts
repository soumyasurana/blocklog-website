import { useCallback, useEffect, useRef, useState } from "react";
import { blocklogRequest } from "@/lib/blocklog";
import type {
  CompanyResponse,
  ConsoleStats,
  DecisionRow,
  IntegrityStatusResponse,
  LogsResponse,
  TracesResponse,
  UsageResponse,
} from "@/types/console";
import { mapLogToDecision } from "@/lib/console/decisionUtils";

const EMPTY_STATS: ConsoleStats = {
  totalRecords: 0,
  integrityCoverage: 0,
  activeTraces: 0,
  anchorsCreated: 0,
  gbProcessed: 0,
  apiCalls: 0,
};

export function useConsoleData(accessToken: string | null | undefined, companyId: string | null | undefined) {
  const [stats, setStats] = useState<ConsoleStats>(EMPTY_STATS);
  const [decisions, setDecisions] = useState<DecisionRow[]>([]);
  const [workspace, setWorkspace] = useState("Blocklog Workspace");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cancelRef = useRef(false);
  const fetchingRef = useRef(false);

  const fetchData = useCallback(async () => {
    if (!accessToken || !companyId || fetchingRef.current) return;
    fetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const [usage, integrity, logs, traces, company] = await Promise.all([
        blocklogRequest<UsageResponse>("/usage"),
        blocklogRequest<IntegrityStatusResponse>("/integrity/status"),
        blocklogRequest<LogsResponse>("/logs?limit=100"),
        blocklogRequest<TracesResponse>("/traces?limit=50"),
        blocklogRequest<CompanyResponse>(`/companies/${companyId}`),
      ]);

      if (cancelRef.current) return;

      const totalRecords = usage.logs_ingested ?? 0;
      const logsVerified = integrity.logs_verified ?? 0;

      setStats({
        totalRecords,
        integrityCoverage: totalRecords > 0 ? Math.round((logsVerified / totalRecords) * 100) : 0,
        activeTraces: traces.items.length,
        anchorsCreated: integrity.anchors_created ?? 0,
        gbProcessed: usage.gb_processed ?? 0,
        apiCalls: usage.api_calls ?? 0,
      });
      setDecisions(logs.items.map(mapLogToDecision));
      setWorkspace(company.company_name || company.company_id);
    } catch (err) {
      if (!cancelRef.current) {
        setError(err instanceof Error ? err.message : "Unable to load console data");
      }
    } finally {
      if (!cancelRef.current) {
        setLoading(false);
      }
      fetchingRef.current = false;
    }
  }, [accessToken, companyId]);

  useEffect(() => {
    if (!accessToken || !companyId) return;
    cancelRef.current = false;
    void fetchData();

    let es: EventSource | null = null;
    let poll: ReturnType<typeof setInterval> | null = null;

    try {
      es = new EventSource(`/api/events?companyId=${companyId}&token=${accessToken}`);
      es.addEventListener("log", () => {
        void fetchData();
      });
      es.onerror = () => {
        es?.close();
        es = null;
        poll = setInterval(() => {
          void fetchData();
        }, 30000);
      };
    } catch {
      poll = setInterval(() => {
        void fetchData();
      }, 30000);
    }

    return () => {
      cancelRef.current = true;
      es?.close();
      if (poll) clearInterval(poll);
    };
  }, [accessToken, companyId, fetchData]);

  return { stats, decisions, workspace, loading, error, refetch: fetchData };
}
