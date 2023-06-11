import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Signup from "./components/auth/Signup";
import Signin from "./components/auth/Signin";
import AccountActivate from "./components/auth/AccountActivate";
import Private from "./core/Private";
import Admin from "./core/Admin";
import PrivateRoute from "./components/auth/PrivateRoute";
import AdminRoute from "./components/auth/AdminRoute";

const AllRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact Component={App} />
        <Route path="/signup" Component={Signup} />
        <Route path="/signin" Component={Signin} />
        <Route path="/auth/activate/:token" element={<AccountActivate />} />
        <Route
          path="/private"
          element={
            <PrivateRoute>
              <Private />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminRoute>
                <Admin />
              </AdminRoute>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AllRoutes;
