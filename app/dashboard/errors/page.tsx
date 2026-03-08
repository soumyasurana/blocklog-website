import DashboardTopBar from "@/components/DashboardTopBar";

const errors = [
  "Error: Invalid API key",
  "Error: Schema mismatch",
  "Error: Signature mismatch",
  "Error: Timestamp missing",
];

export default function ErrorsPage() {
  return (
    <>
      <DashboardTopBar title="Error Monitoring" />
      <section className="card">
        <h2 style={{ marginTop: 0 }}>Failed log ingestion</h2>
        {errors.map((error) => (
          <p key={error}>
            <code>{error}</code>
          </p>
        ))}
      </section>
    </>
  );
}
