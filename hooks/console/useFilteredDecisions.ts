import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { DecisionRow, SortDir, SortField } from "@/types/console";

export function useFilteredDecisions(decisions: DecisionRow[]) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const search = sp.get("search") ?? "";
  const statusF = sp.get("status") ?? "";
  const agentF = sp.get("agent") ?? "";
  const dateFrom = sp.get("from") ?? "";
  const dateTo = sp.get("to") ?? "";
  const sortField = (sp.get("sort") ?? "timestamp") as SortField;
  const sortDir = (sp.get("dir") ?? "desc") as SortDir;

  const setParam = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(sp.toString());
      for (const [k, v] of Object.entries(updates)) {
        if (v) params.set(k, v);
        else params.delete(k);
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [sp, router, pathname],
  );

  const setSearch = (v: string) => setParam({ search: v, page: "1" });
  const setStatus = (v: string) => setParam({ status: v, page: "1" });
  const setAgent = (v: string) => setParam({ agent: v, page: "1" });
  const setDateFrom = (v: string) => setParam({ from: v });
  const setDateTo = (v: string) => setParam({ to: v });
  const toggleSort = (field: SortField) =>
    setParam({ sort: field, dir: field === sortField && sortDir === "desc" ? "asc" : "desc" });
  const clearFilters = () => {
    const params = new URLSearchParams(sp.toString());
    for (const k of ["search", "status", "agent", "from", "to"]) params.delete(k);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const filtered = useMemo(() => {
    let r = decisions.filter((d) => {
      const q = search.toLowerCase();
      if (
        q &&
        ![d.id, d.traceId ?? "", d.sessionId ?? "", d.workflowId ?? "", d.agent, d.operation]
          .some((s) => s.toLowerCase().includes(q))
      ) {
        return false;
      }
      if (statusF && d.status !== statusF) return false;
      if (agentF && d.agent !== agentF) return false;
      if (dateFrom && new Date(d.createdAt).getTime() < new Date(dateFrom).getTime()) return false;
      if (dateTo && new Date(d.createdAt).getTime() > new Date(dateTo).getTime()) return false;
      return true;
    });

    r = [...r].sort((a, b) => {
      let cmp = 0;
      if (sortField === "timestamp") cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      else if (sortField === "agent") cmp = a.agent.localeCompare(b.agent);
      else if (sortField === "operation") cmp = a.operation.localeCompare(b.operation);
      else if (sortField === "status") cmp = a.status.localeCompare(b.status);
      else if (sortField === "amount") cmp = a.amount.localeCompare(b.amount);
      return sortDir === "asc" ? cmp : -cmp;
    });

    return r;
  }, [decisions, search, statusF, agentF, dateFrom, dateTo, sortField, sortDir]);

  return {
    filtered,
    search,
    statusF,
    agentF,
    dateFrom,
    dateTo,
    sortField,
    sortDir,
    setSearch,
    setStatus,
    setAgent,
    setDateFrom,
    setDateTo,
    toggleSort,
    clearFilters,
  };
}
