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
exports.update = async (req, res) => {
  console.log("UPDATED REQUEST");
  const userId = req.params.id;
  // console.log("USER ID", userId);
  // console.log("UPDATED USER", req.user, "BODY", req.body);

  const { name, password } = req.body;
  if (!userId) {
    return res.status(400).json({ error: "Please send user Id" });
  }
  try {
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    if (!name) return res.status(400).json({ error: "Name is required" });
    if (password) {
      if (password.length < 6) {
        return res
          .status(400)
          .json({ error: "Password should be min 6 characters long" });
      } else {
        user.password = password;
      }
    }
    user.name = name;
    await user.save();

    // console.log(user);
    user.salt = undefined;
    user.hashed_password = undefined;
    res.status(200).json(user);
  } catch (error) {
    return res.json({ error: error });
  }
};
