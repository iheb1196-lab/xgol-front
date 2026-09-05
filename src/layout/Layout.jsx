import "./layout.scss";
import React from "react";
import Sidebar from "../components/Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="layout-container">
      <Sidebar />
      <div className="children-wrapper">{children}</div>
    </div>
  );
};

export default Layout;
