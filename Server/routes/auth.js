const express = require("express");
const router = express.Router();

// import controller
const { signup, accountActivation, signin } = require("../controllers/auth.js");

// import validators
const {
  userSignupValidator,
  userSigninValidator,
} = require("../validators/auth.js");
const { runValidation } = require("../validators/index.js");

router.post("/signup", userSignupValidator, runValidation, signup);
router.post("/auth/activate", accountActivation);
router.post("/signin", userSigninValidator, runValidation, signin);
module.exports = router;
