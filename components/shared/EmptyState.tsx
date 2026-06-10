type EmptyStateProps = {
  message: string;
};

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="empty-state" style={{ padding: "32px 24px", textAlign: "center" }}>
      <p>{message}</p>
    </div>
  );
}
