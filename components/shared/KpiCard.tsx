type KpiCardProps = {
  label: string;
  value: string | number;
  delta?: string;
  description?: string;
};

export default function KpiCard({ label, value, delta, description }: KpiCardProps) {
  return (
    <article className="card kpi-card">
      <div className="kpi-card-header">
        <p className="eyebrow">{label}</p>
        {delta ? <span className="kpi-card-delta">{delta}</span> : null}
      </div>
      <p className="kpi-card-value">{value}</p>
      {description ? <p className="muted" style={{ marginTop: 8 }}>{description}</p> : null}
    </article>
  );
}
