"use client";

import Link from "next/link";
import type { DashboardDecision } from "@/types/dashboard";

type DecisionTableProps = {
  decisions: DashboardDecision[];
  title?: string;
  hrefBase?: string;
  emptyLabel?: string;
};

export default function DecisionTable({ decisions, title, hrefBase = "/dashboard/decisions", emptyLabel = "No decisions available." }: DecisionTableProps) {
  if (decisions.length === 0) {
    return <div className="empty-state">{emptyLabel}</div>;
  }

  return (
    <div className="table-shell">
      {title ? <h3>{title}</h3> : null}
      <table>
        <thead>
          <tr>
            <th>Decision</th>
            <th>Actor</th>
            <th>Model</th>
            <th>Status</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {decisions.map((decision) => (
            <tr key={decision.id}>
              <td>
                <Link href={`${hrefBase}/${decision.id}`}>
                  {decision.id?.slice(0, 10) ?? "unknown"}
                </Link>
              </td>
              <td>{decision.actor ?? "System"}</td>
              <td>{decision.model ?? "unknown"}</td>
              <td>{decision.status ?? "pending"}</td>
              <td>{decision.created_at ? new Date(decision.created_at).toLocaleString() : "n/a"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
