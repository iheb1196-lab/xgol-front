import React from "react";
import { Helmet } from "react-helmet-async";
import ForgotPasswordView from "../views/forgotPassword";

const ForgotPasswordPage = () => {
  return (
    <>
      <Helmet>
        <title>forgot password</title>
      </Helmet>
      <ForgotPasswordView />
    </>
  );
};

export default ForgotPasswordPage;
