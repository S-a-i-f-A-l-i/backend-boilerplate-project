import React, { useState, useEffect } from "react";
import { Link, redirect, useParams } from "react-router-dom";
import Layout from "../../core/Layout";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import jwt_decode from "jwt-decode";

const AccountActivate = () => {
  let url = useParams();
  const [user, setUser] = useState({
    name: "",
    token: "",
    show: true,
  });
  const { name, token, show } = user;
  const handleSubmit = (e) => {
    e.preventDefault();
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API}/auth/activate/`,
      data: { token },
    })
      .then((res) => {
        console.log("ACCOUNT ACTIVATE SUCCESS ", res);
        setUser({
          ...user,
          show: false,
        });
        toast.success(res.data.message);
      })
      .catch((err) => {
        console.log("ACCOUNT ACTIVATE ERROR ", err.response.data.error);
        toast.error(err.response.data.error);
      });
  };
  useEffect(() => {
    console.log(url.token);
    let { name } = jwt_decode(url.token);
    console.log(name);
    if (url.token) {
      setUser({ ...user, name, token: url.token });
    }
  }, []);
  return (
    <Layout>
      <div className="col-md-6 offset-md-3 text-center">
        <ToastContainer />
        <div>
          <h1 className="p-5 text-center">
            Hey {name}, Ready to Activate Account?
          </h1>
          <button className="btn btn-outline-primary" onClick={handleSubmit}>
            Activate Account
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default AccountActivate;
