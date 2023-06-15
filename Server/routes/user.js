const express = require("express");
const router = express.Router();

const { requireSignin } = require("../middleware/user.js");
const { read, update } = require("../controllers/user.js");

router.get("/user/:id", requireSignin, read);
router.patch("/user/update/:id", requireSignin, update);

module.exports = router;
