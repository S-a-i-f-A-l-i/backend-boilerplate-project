import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Signup from "./components/auth/Signup";
import Signin from "./components/auth/Signin";
import AccountActivate from "./components/auth/AccountActivate";
const AllRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact Component={App} />
        <Route path="/signup" Component={Signup} />
        <Route path="/signin" Component={Signin} />
        <Route path="/auth/activate/:token" element={<AccountActivate />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AllRoutes;
