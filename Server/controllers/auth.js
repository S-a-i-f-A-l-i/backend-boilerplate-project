const User = require("../models/user.js");

exports.signup = (req, res) => {
  // console.log("Req Body on Signup", req.body);
  // res.json({
  //   data: "you hit signup endpoint",
  // });
  const { name, email, password } = req.body;

  // exec methods callback function no longer accepts
  // User.findOne({ email: email }).exec((err, user) => {
  //   if (user) {
  //     return res.status(400).json({
  //       error: "Email is already exist",
  //     });
  //   }
  // });
  // it's working fine but not using because it's my app so my rules
  // const userAlreadyExists = await User.findOne({ email: email });
  // if (userAlreadyExists) {
  //   return res.status(400).json({
  //     error: "Email is already exist",
  //   });
  // }

  User.findOne({ email: email })
    .exec()
    .then((user) => {
      // console.log("find One user ", user);
      if (user) {
        return res.status(400).json({
          error: "Email is already exist",
        });
      }
      let newUser = new User({ name, email, password });
      // save callback function no longer accepted
      // newUser.save((err, success) => {
      //     if (err) {
      //         console.log('SIGNUP ERROR', err);
      //         return res.status(400).json({
      //             error: err
      //         });
      //     }
      //     res.json({
      //         message: 'Signup success! Please signin'
      //     });
      // });
      newUser
        .save()
        .then((success) => {
          res.json({
            message: "Signup success! Please Sign In",
          });
        })
        .catch((err) => {
          console.log("SIGNUP ERROR", err);
          return res.status(400).json({
            error: err,
          });
        });
    })
    .catch((err) => {
      console.log("Error in find One user", err);
      return res.status(400).json({
        error: "Some thing is wrong!! Please try after sometime",
      });
    });
};
