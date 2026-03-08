import ThemeToggle from "./ThemeToggle";

export default function DashboardTopBar({ title }: { title: string }) {
  return (
    <div className="dashboard-top">
      <div>
        <h1 style={{ margin: 0 }}>{title}</h1>
        <p className="muted" style={{ margin: "4px 0 0" }}>
          Company: cmp_84f02 | Region: us-east-1
        </p>
      </div>
      <ThemeToggle />
    </div>
  );
}
