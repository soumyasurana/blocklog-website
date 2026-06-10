import KpiCard from "@/components/shared/KpiCard";

type DashboardMiniKpiCardProps = {
  label: string;
  value: string | number;
  description?: string;
  delta?: string;
};

export default function DashboardMiniKpiCard({ label, value, description, delta }: DashboardMiniKpiCardProps) {
  return <KpiCard label={label} value={value} description={description} delta={delta} />;
}
