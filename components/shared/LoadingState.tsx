type LoadingStateProps = {
  label?: string;
};

export default function LoadingState({ label = "Loading..." }: LoadingStateProps) {
  return (
    <div className="loading-state">
      <div className="spinner" aria-hidden="true" />
      <p>{label}</p>
    </div>
  );
}
