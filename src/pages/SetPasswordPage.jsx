import React from "react";
import { Helmet } from "react-helmet-async";
import SetPasswordView from "../views/setPassword";

const SetPasswordPage = () => {
  return (
    <>
      <Helmet>
        <title>set new password</title>
      </Helmet>
      <SetPasswordView />
    </>
  );
};

export default SetPasswordPage;
