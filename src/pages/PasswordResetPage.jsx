import React from "react";
import { Helmet } from "react-helmet-async";
import PasswordResetView from "../views/passwordReset";

const PasswordResetPage = () => {
  return (
    <>
      <Helmet>
        <title>password reset</title>
      </Helmet>

      <PasswordResetView />
    </>
  );
};

export default PasswordResetPage;
