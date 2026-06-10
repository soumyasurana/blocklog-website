import type { ReactNode } from "react";

type MetricPanelProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export default function MetricPanel({ title, description, children }: MetricPanelProps) {
  return (
    <section className="card metric-panel">
      <div className="section-header">
        <div>
          <p className="eyebrow" style={{ marginBottom: 8 }}>{title}</p>
          {description ? <p className="muted" style={{ margin: 0 }}>{description}</p> : null}
        </div>
      </div>
      <div className="metric-panel-body">{children}</div>
    </section>
  );
}
