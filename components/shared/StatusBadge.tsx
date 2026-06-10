type StatusBadgeProps = {
  value: string;
  variant?: "success" | "warning" | "danger" | "neutral";
};

const variantStyles: Record<NonNullable<StatusBadgeProps["variant"]>, string> = {
  success: "status-valid",
  warning: "status-pending",
  danger: "status-failed",
  neutral: "status-muted",
};

export default function StatusBadge({ value, variant = "neutral" }: StatusBadgeProps) {
  return <span className={`status-pill ${variantStyles[variant]}`}>{value}</span>;
}
