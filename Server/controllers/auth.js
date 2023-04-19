exports.signup = (req, res) => {
  console.log("Req Body on Signup", req.body);
  res.json({
    data: "you hit signup endpoint",
  });
};
