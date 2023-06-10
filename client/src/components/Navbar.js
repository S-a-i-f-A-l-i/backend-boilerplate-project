import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <ul className="nav nav-tabs bg-primary">
      <li className="nav-item">
        <NavLink
          to="/"
          style={({ isActive }) =>
            isActive ? { color: "#000" } : { color: "#fff" }
          }
          className="nav-link bg-primary"
        >
          Home
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink
          to="/signin"
          className="nav-link bg-primary"
          style={({ isActive }) =>
            isActive ? { color: "#000" } : { color: "#fff" }
          }
        >
          Signin
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink
          to="/signup"
          className="nav-link bg-primary"
          style={({ isActive }) =>
            isActive ? { color: "#000" } : { color: "#fff" }
          }
        >
          Signup
        </NavLink>
      </li>
    </ul>
  );
};

export default Navbar;
