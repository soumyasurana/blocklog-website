import ApiCommandCenter from "@/components/ApiCommandCenter";
import DashboardTopBar from "@/components/DashboardTopBar";

export default function PlaygroundPage() {
  return (
    <>
      <DashboardTopBar title="Playground" />
      <ApiCommandCenter />
    </>
  );
}
