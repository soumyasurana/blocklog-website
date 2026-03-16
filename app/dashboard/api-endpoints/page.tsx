import ApiCommandCenter from "@/components/ApiCommandCenter";
import DashboardTopBar from "@/components/DashboardTopBar";

export default function ApiEndpointsPage() {
  return (
    <>
      <DashboardTopBar title="API Command Center" />
      <ApiCommandCenter />
    </>
  );
}
