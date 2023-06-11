import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { isAuth, signout } from "./auth/helpers";

const Navbar = ({ history }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    `1`;
    signout(() => {
      navigate("/");
    });
  };
  return (
    <ul className="nav nav-tabs bg-primary">
      {JSON.stringify(history)}
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
      {!isAuth() && (
        <>
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
        </>
      )}
      {isAuth() && (
        <li>
          <span className="nav-link">{isAuth().name}</span>
        </li>
      )}
      {isAuth() && (
        <li>
          <span
            className="nav-link"
            style={{
              cursor: "pointer",
              color: "white",
            }}
            onClick={handleLogout}
          >
            Signout
          </span>
        </li>
      )}
    </ul>
  );
};

export default Navbar;
