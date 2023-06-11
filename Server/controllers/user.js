const User = require("../models/user.js");

exports.read = async (req, res) => {
  const userId = req.params.id;
  // console.log("Read User Req ID", userId);
  if (!userId) {
    return res.status(400).json({ error: "Please send user Id" });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }
    // console.log(user);
    user.hashed_password = undefined;
    user.salt = undefined;
    res.status(200).json(user);
  } catch (error) {
    console.log("READ USER ERROR", error);
    return res.status(404).json({
      error: "User not found",
    });
  }
};
