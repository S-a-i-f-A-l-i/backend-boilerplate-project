const express = require("express");
const router = express.Router();

const { requireSignin } = require("../middleware/auth.js");
const { read } = require("../controllers/user.js");

router.get("/user/:id", requireSignin, read);

module.exports = router;
