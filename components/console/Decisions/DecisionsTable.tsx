"use client";

import { Fragment, memo, useEffect, useMemo } from "react";
import type { DecisionRow } from "@/types/console";
import { useFilteredDecisions } from "@/hooks/console/useFilteredDecisions";
import { usePagination } from "@/hooks/console/usePagination";
import { getFreshnessDotClass } from "@/lib/console/traceUtils";
import { truncateId } from "@/lib/console/formatters";
import SortIcon from "./SortIcon";

export default memo(function DecisionsTable({
  decisions,
  onSelect,
  compact = false,
  expandable = false,
  selectedId = null,
}: {
  decisions: DecisionRow[];
  onSelect: (d: DecisionRow) => void;
  compact?: boolean;
  expandable?: boolean;
  selectedId?: string | null;
}) {
  const f = useFilteredDecisions(decisions);
  const pg = usePagination(f.filtered, 25);

  useEffect(() => {
    pg.reset();
  }, [f.search, f.statusF, f.agentF, pg]);

  const uniqueAgents = useMemo(() => [...new Set(decisions.map((d) => d.agent))].sort(), [decisions]);
  const uniqueStatuses = useMemo(() => [...new Set(decisions.map((d) => d.status))].sort(), [decisions]);

  return (
    <div className="liquid-glass-strong rounded-[2.4rem] p-5">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          aria-label="Search decisions"
          className="liquid-glass min-w-[200px] flex-1 rounded-full border border-white/10 bg-transparent px-4 py-2 text-sm text-white placeholder:text-white/38 focus:outline-none focus:ring-1 focus:ring-white/20"
          placeholder="Search ID, trace, agent, operation…"
          type="search"
          value={f.search}
          onChange={(e) => f.setSearch(e.target.value)}
        />
        <select
          aria-label="Filter by status"
          className="liquid-glass rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm text-white/74 focus:outline-none"
          value={f.statusF}
          onChange={(e) => f.setStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          {uniqueStatuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          aria-label="Filter by agent"
          className="liquid-glass rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm text-white/74 focus:outline-none"
          value={f.agentF}
          onChange={(e) => f.setAgent(e.target.value)}
        >
          <option value="">All Agents</option>
          {uniqueAgents.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
        {(f.search || f.statusF || f.agentF) && (
          <button
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/56 hover:text-white"
            type="button"
            onClick={f.clearFilters}
          >
            Clear
          </button>
        )}
        <span className="ml-auto text-sm text-white/46">{f.filtered.length} records</span>
      </div>

      {!compact && (
        <div className="mb-4 flex flex-wrap gap-3 text-sm text-white/54">
          <label className="flex items-center gap-2">
            From
            <input
              className="liquid-glass rounded-full border border-white/10 bg-transparent px-3 py-1.5 text-sm text-white focus:outline-none"
              type="datetime-local"
              value={f.dateFrom}
              onChange={(e) => f.setDateFrom(e.target.value)}
            />
          </label>
          <label className="flex items-center gap-2">
            To
            <input
              className="liquid-glass rounded-full border border-white/10 bg-transparent px-3 py-1.5 text-sm text-white focus:outline-none"
              type="datetime-local"
              value={f.dateTo}
              onChange={(e) => f.setDateTo(e.target.value)}
            />
          </label>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="table-grid w-full" aria-label="Decisions" role="grid">
          <thead>
            <tr>
              <th>
                <button
                  className="flex items-center hover:text-white"
                  type="button"
                  onClick={() => f.toggleSort("timestamp")}
                >
                  ID <SortIcon field="timestamp" current={f.sortField} dir={f.sortDir} />
                </button>
              </th>
              {!compact && (
                <th>
                  <button
                    className="flex items-center hover:text-white"
                    type="button"
                    onClick={() => f.toggleSort("agent")}
                  >
                    Agent <SortIcon field="agent" current={f.sortField} dir={f.sortDir} />
                  </button>
                </th>
              )}
              <th>
                <button
                  className="flex items-center hover:text-white"
                  type="button"
                  onClick={() => f.toggleSort("operation")}
                >
                  Operation <SortIcon field="operation" current={f.sortField} dir={f.sortDir} />
                </button>
              </th>
              {!compact && <th>Amount</th>}
              <th>
                <button
                  className="flex items-center hover:text-white"
                  type="button"
                  onClick={() => f.toggleSort("timestamp")}
                >
                  Timestamp <SortIcon field="timestamp" current={f.sortField} dir={f.sortDir} />
                </button>
              </th>
              {!compact && <th>Staleness</th>}
              <th>
                <button
                  className="flex items-center hover:text-white"
                  type="button"
                  onClick={() => f.toggleSort("status")}
                >
                  Status <SortIcon field="status" current={f.sortField} dir={f.sortDir} />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {pg.paged.map((d) => (
              <Fragment key={d.id}>
                <tr
                  className="cursor-pointer hover:bg-white/5 focus-within:bg-white/5"
                  tabIndex={0}
                  role="row"
                  onClick={() => onSelect(d)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelect(d);
                    }
                  }}
                >
                  <td className="mono">{truncateId(d.id)}</td>
                  {!compact && <td>{d.agent}</td>}
                  <td>{d.operation}</td>
                  {!compact && <td>{d.amount}</td>}
                  <td>{d.timestamp}</td>
                  {!compact && (
                    <td>
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${getFreshnessDotClass(d.freshness)}`} />
                        <span>{d.freshness}</span>
                      </div>
                    </td>
                  )}
                  <td>
                    <span className={`font-medium ${
                      d.status === "Approved" ? "text-emerald-400" : d.status === "Denied" ? "text-red-400" : "text-white/74"
                    }`}>
                      {d.status}
                    </span>
                  </td>
                </tr>
                {expandable && selectedId === d.id && (
                  <tr>
                    <td colSpan={compact ? 4 : 7} className="bg-white/[0.03] px-5 py-4">
                      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded-[1.2rem] border border-white/10 p-4">
                          <p className="text-[11px] uppercase tracking-[0.18em] text-white/38">Governance record</p>
                          <p className="mt-3 break-all font-mono text-sm text-white/74">{d.id}</p>
                        </div>
                        <div className="rounded-[1.2rem] border border-white/10 p-4">
                          <p className="text-[11px] uppercase tracking-[0.18em] text-white/38">Approval chain</p>
                          <p className="mt-3 text-sm text-white/74">{d.status}</p>
                        </div>
                        <div className="rounded-[1.2rem] border border-white/10 p-4">
                          <p className="text-[11px] uppercase tracking-[0.18em] text-white/38">Trace linkage</p>
                          <p className="mt-3 break-all font-mono text-sm text-white/74">{d.traceId ?? "No trace attached"}</p>
                        </div>
                        <div className="rounded-[1.2rem] border border-white/10 p-4">
                          <p className="text-[11px] uppercase tracking-[0.18em] text-white/38">Input staleness</p>
                          <div className="mt-3 flex items-center gap-2 text-sm text-white/74">
                            <span className={`h-2.5 w-2.5 rounded-full ${getFreshnessDotClass(d.freshness)}`} />
                            {d.freshness}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
            {pg.paged.length === 0 && (
              <tr>
                <td colSpan={compact ? 4 : 7} className="py-8 text-center text-sm text-white/46">
                  No decisions match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <button
          aria-label="Previous page"
          className="liquid-glass rounded-full px-4 py-3 text-sm text-white/74 disabled:opacity-40"
          disabled={!pg.canPrev}
          type="button"
          onClick={pg.prev}
        >
          Previous
        </button>
        <span className="text-sm text-white/52">Page {pg.page} of {pg.totalPages}</span>
        <button
          aria-label="Next page"
          className="liquid-glass rounded-full px-4 py-3 text-sm text-white/74 disabled:opacity-40"
          disabled={!pg.canNext}
          type="button"
          onClick={pg.next}
        >
          Next
        </button>
      </div>
    </div>
  );
});
