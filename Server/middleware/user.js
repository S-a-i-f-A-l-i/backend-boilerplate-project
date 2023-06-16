const User = require("../models/user.js");
const { expressjwt: expressJwt } = require("express-jwt");

// jwt token verification
exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});

// admin middleware
exports.adminMiddleware = async (req, res, next) => {
  // console.log("ADMIN MIDDLEWARE", req);
  const user = await User.findById({ _id: req.auth._id });
  if (!user)
    return res.status(404).json({
      error: "User not found",
    });
  // console.log("USER MIDDLEWARE", user);
  if (user.role !== "admin") {
    return res.status(401).json({
      error: "Admin resource. Access denied.",
    });
  }
  req.profile = user;
  next();
};
