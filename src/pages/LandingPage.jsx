import React from "react";
import LandingView from "../views/landing";
import { Helmet } from "react-helmet-async";

const LandingPage = () => {
  return (
    <>
      <Helmet>
        <title>XGOL</title>
      </Helmet>
      <LandingView />
    </>
  );
};

export default LandingPage;
