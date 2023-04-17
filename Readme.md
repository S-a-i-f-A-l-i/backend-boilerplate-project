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
        - cors for cors error because both server are running diff domain(3000 & 8000)
        - dotenv for add .env file
        - express-jwt this help for json token validation
        - express-validator input filled validator
        - google-auth-library for login with google
        - jsonwebtoken to generate token
        - mongoose for database
        - morgan helping with developing with endpoints
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