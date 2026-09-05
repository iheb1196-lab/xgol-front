import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function PublicRoute({ children }) {
  const user = useSelector((state) => state.auth.user);

  // Render children if user is authenticated and has required roles
  return user?.accessToken ? <Navigate to="/dashboard" replace /> : children;
}

PublicRoute.propTypes = {
  children: PropTypes.node,
};

export default PublicRoute;
