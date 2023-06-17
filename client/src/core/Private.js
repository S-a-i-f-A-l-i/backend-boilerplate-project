import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import {
  getCookie,
  isAuth,
  signout,
  authenticate,
} from "../components/auth/helpers";

const Private = () => {
  const [user, setUser] = useState({
    role: "",
    name: "",
    email: "",
    password: "",
    buttonText: "Update",
  });
  const navigate = useNavigate();
  const { role, name, email, password, buttonText } = user;
  const handleChange = (e) => {
    // console.log(e.target.name, e.target.value);
    setUser((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setUser({ ...user, buttonText: "Updating" });
    axios({
      method: "PATCH",
      url: `${process.env.REACT_APP_API}/user/update/${isAuth()._id}`,
      data: { name, password },
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
      },
    })
      .then((res) => {
        console.log("UPDATE SUCCESS ", res);
        setUser({
          ...user,
          name: res.data.name,
          email: res.data.email,
          password: "",
          buttonText: "Update",
        });
        toast.success(`Hey ${res.data.name}, Information Updated!`);
      })
      .catch((err) => {
        console.log("UPDATE ERROR ", err.response.data);
        setUser({
          ...user,
          buttonText: "Update",
        });
        toast.error(err.response.data.error);
      });
  };
  const getProfile = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API}/user/${isAuth()._id}`,
        {
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        }
      );
      console.log("GET PROFILE RESPONSE", res);
      setUser((user) => ({
        ...user,
        role: res.data.role,
        name: res.data.name,
        email: res.data.email,
      }));
    } catch (error) {
      console.log("GET PROFILE ERROR", error);
      if (error.response.status === 401) {
        signout(() => {
          navigate("/");
        });
      }
    }
  };
  useEffect(() => {
    getProfile();
  }, []);
  return (
    <Layout>
      <div className="col-md-6 offset-md-3">
        <ToastContainer />
        <h1 className="p-5 text-center">Update Profile</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="text-muted">Role</label>
            <select
              name="role"
              disabled={true}
              defaultValue={role}
              className="form-control"
            >
              <option value="subscriber">Subscriber</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="form-group">
            <label className="text-muted">Name</label>
            <input
              onChange={handleChange}
              type="text"
              name="name"
              value={name}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label className="text-muted">Email</label>
            <input
              disabled={true}
              type="email"
              name="email"
              value={email}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label className="text-muted">Password</label>
            <input
              onChange={handleChange}
              type="password"
              name="password"
              value={password}
              className="form-control"
            />
          </div>
          <div>
            <button className="btn btn-primary" type="Submit">
              {buttonText}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Private;
