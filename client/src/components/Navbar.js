import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { isAuth, signout } from "./auth/helpers";

const Navbar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    signout(() => {
      navigate("/");
    });
  };
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
      {isAuth() && isAuth().role === "admin" && (
        <li className="nav-item">
          <NavLink
            to="/admin"
            className="nav-link bg-primary"
            style={({ isActive }) =>
              isActive ? { color: "#000" } : { color: "#fff" }
            }
          >
            {isAuth().name}
          </NavLink>
        </li>
      )}
      {isAuth() && isAuth().role === "subscriber" && (
        <li className="nav-item">
          <NavLink
            to="/private"
            className="nav-link bg-primary"
            style={({ isActive }) =>
              isActive ? { color: "#000" } : { color: "#fff" }
            }
          >
            {isAuth().name}
          </NavLink>
        </li>
      )}
      {/* {isAuth() && (
        <li>
          <span className="nav-link">{isAuth().name}</span>
        </li>
      )} */}
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
