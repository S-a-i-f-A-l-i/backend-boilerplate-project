import React from "react";
import { isAuth } from "./helpers";
import { Navigate } from "react-router-dom";
import Layout from "../../core/Layout";

const PrivateRoute = ({ children }) => {
  if (!isAuth()) {
    return <Navigate to="/signin" />;
  }
  return children;
};

export default PrivateRoute;
