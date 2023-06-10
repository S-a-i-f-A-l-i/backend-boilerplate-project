## client install

    - npx create-react-app client

## Server

    - npm init -y
    - npm i express nodemon

- server.js file

  ```
  const express = require("express");

  const app = express();

  app.get("/api/signup", (req, res) => {
  res.json({
  data: "you hit signup endpoint",
  });
  });

  const port = process.env.PORT || 8000;

  app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  });

  ```

  - in Server package.json file

  ```
  remove

  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  }
  add

  "scripts": {
    "start": "nodemon server.js"
  },

  ```

  - install some package

  ```
    npm i body-parser cors dotenv express-jwt express-validator google-auth-library jsonwebtoken mongoose morgan @sandgrid/mail


        - body-parse for get from req body json data
        - cors for cors error because both server are running diff domain(3000 & 8000) so cors allows all origins
        - dotenv for add .env file
        - express-jwt this help for json token validation
        - express-validator input filled validator
        - google-auth-library for login with google
        - jsonwebtoken to generate token
        - mongoose for database
        - morgan helping with developing with endpoints. console in terminal request endpoint like /api/signup
        - @sandgrid/main send email
  ```

### routes folder added in Server

    ```
    auth.js code
        const express = require("express");
    const router = express.Router();

    router.get("/signup", (req, res) => {
    res.json({
        data: "you hit signup endpoint",
    });
    });

    module.exports = router;

    server.js added

    // import routes
    const authRoutes = require("./routes/auth.js");
    // middleware
    app.use("/api", authRoutes);

    ```

### controller folder added in Server

    ```
    in controller
    auth.js code

    exports.signup = (req, res) => {
    res.json({
        data: "you hit signup endpoint",
    });
    };

    in router
    auth.js code

    // import controller
    const { signup } = require("../controllers/auth.js");

    router.get("/signup", signup);

    ```

### module folder added in Server

    ```
    auth.js code

    const mongoose = require("mongoose");
    const crypto = require("crypto");

    // user schema

    const userSchema = new mongoose.Schema(
      {
        name: {
          type: String,
          trim: true,
          required: true,
          max: 32,
          min: 3,
        },
        email: {
          type: String,
          trim: true,
          required: true,
          unique: true,
          lowercase: true,
        },
        hashed_password: {
          type: String,
          required: true,
        },
        salt: String,
        role: {
          type: String,
          default: "subscriber",
        },
        resetPasswordLink: {
          data: String,
          default: "",
        },
      },
      { timestamps: true }
    );

    // virtual
    userSchema
      .virtual("password")
      .set(function (password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password);
      })
      .get(function () {
        return this._password;
      });

    // methods
    userSchema.methods = {
      authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
      },
      encryptPassword: function (password) {
        if (!password) return "";
        try {
          return crypto
            .createHmac("sha1", this.salt)
            .update(password)
            .digest("hex");
        } catch (error) {
          return "";
        }
      },

      makeSalt: function () {
        return Math.round(new Date().valueOf() * Math.random()) + "";
      },
    };

    module.exports = mongoose.model("User", userSchema);
    ```

### mongoDB Atlas URL added

    ```
    server.js code

      mongoose
    .connect(
      process.env.DATABASE

      // due to new version no need to add code for mongoose deprecationwarning 👇👇
      // ,{
      //   useNewUrlParser: true,
      //   useFindAndModify: false,
      //   useUnifiedTopology: true,
      //   useCreateIndex: true,
      // }
    )
    .then(() => console.log("DB connected"))
    .catch((err) => console.log("DB error", err));

    ```

### validators folder added in Server

```
- validators/auth.js code

const { check } = require("express-validator");
exports.userSignupValidator = [
  check("name").not().isEmpty().withMessage("Name is required"),
  check("email").isEmail().withMessage("Must be a valid email address"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

- validators/index.js code

const { validationResult } = require("express-validator");
exports.runValidation = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }
  next();
};

- import validators in routes/auth.js and applied

// import validators
const { userSignupValidator } = require("../validators/auth.js");
const { runValidation } = require("../validators/index.js");

router.post("/signup", userSignupValidator, runValidation, signup);


```

### SignUp flow

```
 1. in server app.use("/api", authRoutes);
 2. in routes router.post("/signup", userSignupValidator, runValidation, signup);
 - after userSignupValidator, runValidation
 3. in Controller auth.js


    controller auth.js code
      exports.signup = (req, res) => {
      const { name, email, password } = req.body;
      User.findOne({ email: email })
        .exec()
        .then((user) => {
          // console.log("find One user ", user);
          if (user) {
          return res.status(400).json({
          error: "Email is already exist",
          });
          }
          let newUser = new User({ name, email, password });
          newUser
          .save()
          .then((success) => {
          res.json({
          message: "Signup success! Please Sign In",
          });
        })
        .catch((err) => {
          console.log("SIGNUP ERROR", err);
          return res.status(400).json({
          error: err,
          });
        });
      })
      .catch((err) => {
        console.log("Error in find One user", err);
        return res.status(400).json({
        error: "Some thing is wrong!! Please try after sometime",
        });
      });
    };


```

### SendInBlue email send done

```
controllers auth.js code

  const jwt = require("jsonwebtoken");

  // sendingBlue
  const siMail = require("sib-api-v3-sdk");
  siMail.ApiClient.instance.authentications["api-key"].apiKey =
    process.env.SENDINBLUE_API_KEY;
  User.findOne({ email: email })
    .exec()
    .then((user) => {
      // console.log("find One user ", user);
      // if (user) {
      //   return res.status(400).json({
      //     error: "Email is already exist",
      //   });
      // }
      const token = jwt.sign(
        { name, email, password },
        process.env.JWT_ACCOUNT_ACTIVATION,
        { expiresIn: "30m" }
      );
      // if you want to use sendGrid then use commented code
      // const emailData = {
      //   from: process.env.EMAIL_FROM,
      //   to: email,
      //   subject: `Account activation link`,
      //   html: `
      //   <h1>Please use the link to activate your account</h1>
      //   <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
      //   <hr />
      //   <p>This email may contain sensitive information </p>
      //   <p>${process.env.CLIENT_URL}</p>
      //   `,
      // };
      // sgMail.send(emailData).then(sent=>{
      // return res.json({`Email has been sent to ${email}. Follow the instruction to activate your account`})
      // }).catch((err)=>{
      //   console.log(err);
      // })
      new siMail.TransactionalEmailsApi()
        .sendTransacEmail({
          sender: { email: process.env.EMAIL_TO, name: "Saif Ali" },
          subject: "This is my default subject line",
          htmlContent:
            "<!DOCTYPE html><html><body><h1>My First Heading</h1><p>My first paragraph.</p></body></html>",
          params: {
            greeting: "This is the default greeting",
            headline: "This is the default headline",
          },
          messageVersions: [
            {
              to: [
                {
                  email: email,
                  name: name,
                },
              ],
              htmlContent: `<!DOCTYPE html><html><body>
              <h1>Please use the link to activate your account</h1>
              <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
              <p>This email may contain sensitive information </p>
              <p>${process.env.CLIENT_URL}</p>
              </body></html>`,
              subject: "Account activation link",
            },
          ],
        })
        .then(
          function (data) {
            // console.log("SignUp Email Sent Data", data);
            return res.status(200).json({
              message: `Email has been sent to ${email}. Follow the instruction to activate your account`,
            });
          },
          function (error) {
            console.error("SignUp Email Sent Error", error);
          }
        );
    })
    .catch((err) => {
      console.log("Error in find One user", err);
      return res.status(400).json({
        error: "Some thing is wrong!! Please try after sometime",
      });
    });

```

### Signup account activation

```

  routes
  auth.js code
  router.post("/account-activation", accountActivation);

  controllers
  auth.js code

  exports.accountActivation = (req, res) => {
      const { token } = req.body;
      console.log(token);
      if (token) {
        jwt.verify(
          token,
          process.env.JWT_ACCOUNT_ACTIVATION,
          function (err, decoded) {
            if (err) {
              console.log("JWT Verify in Account Activation Error", err);
              return res.status(401).json({
                error: "Expired link. Signup again",
              });
            }
            const { name, email, password } = jwt.decode(token);
            let newUser = new User({ name, email, password });
            // save callback function no longer accepted
            // newUser.save((err, success) => {
            //     if (err) {
            //         console.log('SIGNUP ERROR', err);
            //         return res.status(400).json({
            //             error: err
            //         });
            //     }
            //     res.json({
            //         message: 'Signup success! Please signin'
            //     });
            // });
            newUser
              .save()
              .then((success) => {
                return res.json({
                  message: "Signup success! Please Sign In.",
                });
              })
              .catch((err) => {
                console.log("SAVE USER IN ACCOUNT ACTIVATION ERROR", err);
                return res.status(401).json({
                  error: "Error saving user in database. Try signup again",
                });
              });
          }
        );
      } else {
        return res.json({
          message: "Something went wrong. Try again.",
        });
      }
    };

```

### user signin

```
routes
auth.js
  router.post("/signin", userSigninValidator, runValidation, signin);

validators
auth.js
  exports.userSigninValidator = [
    check("email").isEmail().withMessage("Must be a valid email address"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ];

controllers
auth.js
  // signin user
  exports.signin = (req, res) => {
    const { email, password } = req.body;
    // checking user
    User.findOne({ email: email })
      .exec()
      .then((user) => {
        if (!user.authenticate(password)) {
          return res.status(400).json({
            error: "Email and Password do not match",
          });
        }
        // generate a token
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });
        const { _id, name, email, role } = user;
        return res.json({
          token,
          user: { _id, name, email, role },
        });
      })
      .catch((err) => {
        return res.status(400).json({
          error: "User with that email does not exist. Please signup",
        });
      });
  };

```

## Frontend work

index.html

```
<head>
...
<link
      rel="stylesheet"
      href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css"
      integrity="sha384-9gVQ4dYFwwWSjIDZnLEWnxCjeSWFphJiwGPXr1jddIhOegiu1FwO5qRGvFXOdJZ4"
      crossorigin="anonymous"
    />
</head>
```

index.js

```
import React from "react";
import ReactDOM from "react-dom/client";
import AllRoutes from "./AllRoutes";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AllRoutes />
  </React.StrictMode>
);

```

App.js

```
import Layout from "./core/Layout";
function App() {
  return (
    <Layout>
      <h1>Hello React</h1>
    </Layout>
  );
}

export default App;
```

AllRoutes.js

```
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Signup from "./components/Signup";
const AllRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact Component={App} />
        <Route path="/signup" Component={Signup} />
      </Routes>
    </BrowserRouter>
  );
};

export default AllRoutes;

```

core/Layout.js

```
import React, { Fragment } from "react";
import Navbar from "../components/Navbar";

const Layout = ({ children }) => {
  return (
    <Fragment>
      <Navbar />
      <div className="container">{children}</div>
    </Fragment>
  );
};

export default Layout;
```

component/Navbar.js

```
import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <ul className="nav nav-tabs bg-primary">
      <li className="nav-item">
        <Link to="/" className="text-light nav-link">
          Home
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/signup" className="text-light nav-link">
          Signup
        </Link>
      </li>
    </ul>
  );
};

export default Navbar;

```

component/Signup.js

```
import React, { useState } from "react";
import { Link, redirect } from "react-router-dom";
import Layout from "../core/Layout";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const Signup = () => {
  return (
    <Layout>
      <ToastContainer />
      <h1>Signup</h1>
    </Layout>
  );
};

export default Signup;

```

### Signup Component

```
axios package for API
react-toastify - for showing response message (ex- Success, Error)
```

signup.js form created

```
import React, { useState } from "react";
import { Link, redirect } from "react-router-dom";
import Layout from "../core/Layout";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const Signup = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    buttonText: "Submit",
  });
  const { name, email, password, buttonText } = user;
  const handleChange = (e) => {
    console.log(e.target.name, e.target.value);
    setUser((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(user);
  };
  return (
    <Layout>
      <div className="col-md-6 offset-md-3">
        <ToastContainer />
        <h1 className="p-5 text-center">Signup</h1>
        <form onSubmit={handleSubmit}>
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

export default Signup;

```

### Signup request sent

```
const handleSubmit = (e) => {
    e.preventDefault();
    setUser({ ...user, buttonText: "Submitting" });
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API}/signup`,
      data: { name, email, password },
    })
      .then((res) => {
        console.log("SIGNUP SUCCESS ", res);
        setUser({
          ...user,
          name: "",
          email: "",
          password: "",
          buttonText: "Submited",
        });
        toast.success(res.data.message);
      })
      .catch((err) => {
        console.log("SIGNUP ERROR ", err.response.data);
        setUser({
          ...user,
          buttonText: "Submit",
        });
        toast.error(err.response.data.error);
      });
  };
```

### signin component req

```
  Navbar.js
      <li className="nav-item">
        <Link to="/signin" className="text-light nav-link">
          Signin
        </Link>
      </li>
  AllRoutes.js
      <Route path="/signin" Component={Signin} />
  Signin.js
      import React, { useState } from "react";
      import { Link, redirect } from "react-router-dom";
      import Layout from "../core/Layout";
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
              toast.success(`Hey ${res.data.message}, Welcome back!`);
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
              <h1 className="p-5 text-center">Signup</h1>
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

```

### AccountActivate

```
 Routes.js
 <Route path="/auth/activate/:token" element={<AccountActivate />} />

 AccountActivate.js
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

```
