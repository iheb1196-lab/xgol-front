import Banner from "../components/banner/Banner";
import "./outsideLayout.scss";

import React from "react";

const OutsideLayout = ({ children }) => {
  return (
    <div className="outisde-layout-container">
      <div className="banner-container">
        <Banner />
      </div>
      <div className="children-wrapper">{children}</div>
    </div>
  );
};

export default OutsideLayout;
