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
