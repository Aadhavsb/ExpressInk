import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element: Component }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated");

  return isAuthenticated === "true" ? (
    Component
  ) : (
    <Navigate to="/login" replace />
  );
};

export default PrivateRoute;
