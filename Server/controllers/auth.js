const User = require("../models/user.js");
const jwt = require("jsonwebtoken");

// sendingBlue
const siMail = require("sib-api-v3-sdk");
siMail.ApiClient.instance.authentications["api-key"].apiKey =
  process.env.SENDINBLUE_API_KEY;

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
      const token = jwt.sign(
        { name, email, password },
        process.env.JWT_ACCOUNT_ACTIVATION,
        { expiresIn: "10m" }
      );
      // sendGrid
      // const emailData = {
      //   from: process.env.EMAIL_FROM,
      //   to: email,
      //   subject: `Account activation link`,
      //   html: `
      //   <h1>Please use the link to activate your account</h1>
      //   <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
      //   <hr />
      //   <p>This email may contain sensitive information </p>
      //   <p>${process.env.CLIENT_URL}</p>
      //   `,
      // };
      // sgMail.send(emailData).then(sent=>{
      // return res.json({`Email has been sent to ${email}. Follow the instruction to activate your account`})
      // }).catch((err)=>{
      //   console.log(err);
      // })
      new siMail.TransactionalEmailsApi()
        .sendTransacEmail({
          sender: { email: process.env.EMAIL_TO, name: "Saif Ali" },
          subject: "This is my default subject line",
          htmlContent:
            "<!DOCTYPE html><html><body><h1>My First Heading</h1><p>My first paragraph.</p></body></html>",
          params: {
            greeting: "This is the default greeting",
            headline: "This is the default headline",
          },
          messageVersions: [
            {
              to: [
                {
                  email: email,
                  name: name,
                },
              ],
              htmlContent: `<!DOCTYPE html><html><body>
              <h1>Please use the link to activate your account</h1>
              <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
              <p>This email may contain sensitive information </p>
              <p>${process.env.CLIENT_URL}</p>
              </body></html>`,
              subject: "Account activation link",
            },
          ],
        })
        .then(
          function (data) {
            // console.log("SignUp Email Sent Data", data);
            return res.status(200).json({
              message: `Email has been sent to ${email}. Follow the instruction to activate your account`,
            });
          },
          function (err) {
            console.error("SignUp Email Sent Error", err);
            return res.json({
              message: err.message,
            });
          }
        );
    })
    .catch((err) => {
      console.log("Error in find One user", err);
      return res.status(400).json({
        error: "Some thing is wrong!! Please try after sometime",
      });
    });
};

exports.accountActivation = (req, res) => {
  const { token } = req.body;
  // console.log("token", token);
  if (token) {
    jwt.verify(
      token,
      process.env.JWT_ACCOUNT_ACTIVATION,
      function (err, decoded) {
        if (err) {
          console.log("JWT Verify in Account Activation Error", err);
          return res.status(401).json({
            error: "Expired link. Signup again",
          });
        }
        const { name, email, password } = jwt.decode(token);
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
            return res.json({
              message: "Signup success! Please Sign In.",
            });
          })
          .catch((err) => {
            console.log("SAVE USER IN ACCOUNT ACTIVATION ERROR", err);
            return res.status(401).json({
              error: "Error saving user in database. Try signup again",
            });
          });
      }
    );
  } else {
    return res.json({
      message: "Something went wrong. Try again.",
    });
  }
};

// signin user
exports.signin = (req, res) => {
  const { email, password } = req.body;
  // checking user
  User.findOne({ email: email })
    .exec()
    .then((user) => {
      if (!user.authenticate(password)) {
        return res.status(400).json({
          error: "Email and Password do not match",
        });
      }
      // generate a token
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      const { _id, name, email, role } = user;
      return res.json({
        token,
        user: { _id, name, email, role },
      });
    })
    .catch((err) => {
      return res.status(400).json({
        error: "User with that email does not exist. Please signup",
      });
    });
};
