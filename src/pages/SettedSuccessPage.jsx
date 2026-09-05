import React from "react";
import { Helmet } from "react-helmet-async";
import SuccessView from "../views/success";

const SettedSuccessPage = ({ type }) => {
  return (
    <>
      <Helmet>
        <title>{type} reset</title>
      </Helmet>

      <SuccessView type={type} />
    </>
  );
};

export default SettedSuccessPage;
