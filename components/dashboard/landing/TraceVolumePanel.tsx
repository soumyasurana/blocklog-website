import MetricPanel from "@/components/shared/MetricPanel";

type TraceVolumePanelProps = {
  traceVolume: number;
};

export default function TraceVolumePanel({ traceVolume }: TraceVolumePanelProps) {
  return (
    <MetricPanel title="Trace Volume" description="End-to-end trace activity across your environment.">
      <div className="dashboard-summary-row">
        <div>
          <p className="eyebrow">Total traces</p>
          <h3>{traceVolume}</h3>
        </div>
      </div>
    </MetricPanel>
  );
}
