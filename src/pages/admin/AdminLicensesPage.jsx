import { Helmet } from "react-helmet-async";

import LicensesView from "../../views/admin/LicensesView";

// ----------------------------------------------------------------------

export default function AdminLicensesPage() {
  return (
    <>
      <Helmet>
        <title>Admin Licenses</title>
      </Helmet>

      <LicensesView />
    </>
  );
}
