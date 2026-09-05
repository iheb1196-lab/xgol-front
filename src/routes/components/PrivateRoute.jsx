import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children, allowedRoles }) {
  const user = useSelector((state) => state.auth.user);

  if (!user?.accessToken) {
    // Redirect to login if user is not authenticated
    return <Navigate to="/login" replace />;
  }

  if (user && user?.user?.roles?.find((role) => allowedRoles?.includes(role))) {
    // Redirect to home if user doesn't have required roles
    return children;
  }

  // Render children if user is authenticated and has required roles
  return <Navigate to={user?.user?.roles?.includes("EXPERT") ? "/coach/inbox" : "/dashboard"} replace={true} />;
}

PrivateRoute.propTypes = {
  children: PropTypes.node,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
};

export default PrivateRoute;
