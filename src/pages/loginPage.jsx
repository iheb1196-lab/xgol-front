import { Helmet } from "react-helmet-async";
import LoginView from "../views/Login";

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title>Welcome to XGOL</title>
      </Helmet>

      <LoginView />
    </>
  );
}
