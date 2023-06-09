import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
const AllRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact Component={App} />
        <Route path="/signup" Component={Signup} />
        <Route path="/signin" Component={Signin} />
      </Routes>
    </BrowserRouter>
  );
};

export default AllRoutes;
