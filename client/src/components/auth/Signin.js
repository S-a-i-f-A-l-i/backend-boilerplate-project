import React, { useState } from "react";
import { Link, redirect } from "react-router-dom";
import Layout from "../../core/Layout";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
const Signin = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
    buttonText: "Submit",
  });
  const { email, password, buttonText } = user;
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
    setUser({ ...user, buttonText: "Submitting" });
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API}/signin`,
      data: { email, password },
    })
      .then((res) => {
        console.log("SIGNIN SUCCESS ", res);
        setUser({
          ...user,
          name: "",
          email: "",
          password: "",
          buttonText: "Submitted",
        });
        toast.success(`Hey ${res.data.user.name}, Welcome back!`);
      })
      .catch((err) => {
        console.log("SIGNIN ERROR ", err.response.data);
        setUser({
          ...user,
          buttonText: "Submit",
        });
        toast.error(err.response.data.error);
      });
  };
  return (
    <Layout>
      <div className="col-md-6 offset-md-3">
        <ToastContainer />
        <h1 className="p-5 text-center">Signin</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="text-muted">Email</label>
            <input
              onChange={handleChange}
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

export default Signin;
