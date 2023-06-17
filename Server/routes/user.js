const express = require("express");
const router = express.Router();

const { requireSignin, adminMiddleware } = require("../middleware/user.js");
const { read, update } = require("../controllers/user.js");

router.get("/user/:id", requireSignin, read);
router.patch("/user/update/:id", requireSignin, update);
// router.patch("/admin/update/:id", requireSignin, adminMiddleware, update);

module.exports = router;
