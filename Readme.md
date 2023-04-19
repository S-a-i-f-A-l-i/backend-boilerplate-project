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
