import React from "react";
import { Helmet } from "react-helmet-async";
import VerifyEmail from "../views/verifyEmail";

const VerifyEmailPage = () => {
  return (
    <>
      <Helmet>
        <title>verify your email</title>
      </Helmet>
      <VerifyEmail />
    </>
  );
};

export default VerifyEmailPage;
