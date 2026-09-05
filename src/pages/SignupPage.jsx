import { Helmet } from "react-helmet-async";
import SignupView from "../views/signup/SignupView";

// ----------------------------------------------------------------------

export default function SignupPage() {
  return (
    <>
      <Helmet>
        <title>Welcome to XGOL</title>
      </Helmet>

      <SignupView />
    </>
  );
}
