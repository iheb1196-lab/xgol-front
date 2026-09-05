import React from "react";
import { Helmet } from "react-helmet-async";
import CheckEmailView from "../views/checkEmail";

const CheckEmailPage = () => {
  return (
    <>
      <Helmet>
        <title>check your email</title>
      </Helmet>
      <CheckEmailView />
    </>
  );
};

export default CheckEmailPage;
