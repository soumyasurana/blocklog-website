"use client";

type TimelineItem = {
  log_id: string;
  event_type: string;
  source: string;
  timestamp: string;
  attempt_no: number;
  integrity_status: string;
  is_human_authorized: boolean;
  payload: Record<string, unknown>;
};

export default function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <div className="card glass-card" style={{ display: "grid", gap: 12 }}>
      {items.map((item) => (
        <article key={item.log_id} className="card" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <strong>{item.event_type}</strong>
              <p className="muted" style={{ margin: "4px 0 0 0" }}>
                {item.source} · attempt {item.attempt_no}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <span className={`status-pill status-${item.integrity_status}`}>{item.integrity_status}</span>
              <p className="muted" style={{ margin: "4px 0 0 0" }}>
                {new Date(item.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
          {item.is_human_authorized && (
            <div className="notice" style={{ marginTop: 12 }}>
              Human approval captured for this event.
            </div>
          )}
          <pre style={{ overflowX: "auto", marginTop: 12 }}>{JSON.stringify(item.payload, null, 2)}</pre>
        </article>
      ))}
    </div>
  );
}
