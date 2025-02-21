import PropTypes from "prop-types";
import { useContext } from "react";

import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthProvider";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <h1>Loaging......</h1>;
  if (user) return children;
  return (
    <Navigate to="/login" state={{ from: location.pathname }} replace="true" />
  );
};

PrivateRoute.propTypes = {
  children: PropTypes.element,
};

export default PrivateRoute;
