const express = require("express");
const router = express.Router();

// import controller
const { signup } = require("../controllers/auth.js");

// import validators
const { userSignupValidator } = require("../validators/auth.js");
const { runValidation } = require("../validators/index.js");

router.post("/signup", userSignupValidator, runValidation, signup);

module.exports = router;
