import { Helmet } from "react-helmet-async";
import DashboardView from "../../views/dashboardView";

// ----------------------------------------------------------------------

export default function DashboardPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard </title>
      </Helmet>

      <DashboardView />
    </>
  );
}
