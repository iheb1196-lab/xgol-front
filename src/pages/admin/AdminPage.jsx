import { Helmet } from "react-helmet-async";
import AdminView from "../../views/admin/AdminView";

// ----------------------------------------------------------------------

export default function AdminPage() {
  return (
    <>
      <Helmet>
        <title> Admin</title>
      </Helmet>

      <AdminView/>
    </>
  );
}
