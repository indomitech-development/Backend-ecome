const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const nodeMailer = require("nodemailer");
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");
// const async = require('async')
const crypto = require("crypto");
const Admin = require("../models/Admin");
router.post("/register", function (req, res) {
  console.log("req body", req.body);

  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }
  Admin.findOne({
    email: req.body.useremail,
  }).then((user) => {
    if (user) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    } else {
      const avatar = gravatar.url(req.body.useremail, {
        s: "200",
        r: "pg",
        d: "mm",
      });
      const newUser = new Admin({
        name: req.body.name,
        email: req.body.useremail,
        password: req.body.userpassword,
      });

      bcrypt.genSalt(10, (err, salt) => {
        if (err) console.error("There was an error", err);
        else {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) console.error("There was an error", err);
            else {
              newUser.password = hash;
              newUser
                .save()

                .then((user) => {
                  res.status(200).json({
                    success: true,
                    message: " Admin are created",
                    data: user,
                  });
                  // var token = crypto.randomBytes(16).toString('hex');
                  // const Newtoken = new Token({ _userId: user._id, token: token });
                  // Newtoken.save()
                  // .then(Verify => {
                  //     console.log("verify and user", Verify.email)
                  //     var smtpTransport = nodeMailer.createTransport({
                  //         service: 'Gmail',
                  //         auth: {
                  //             user: 'laherasif@gmail.com',
                  //             pass: 'laher6565'
                  //         }
                  //     });

                  //     var mailOptions = {

                  //         to: user.email,
                  //         from: 'laherasif@gmail.com',
                  //         subject: 'Node.js Verification',
                  //         text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                  //             'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                  //             'http://localhost:3000/Verification/' + token + '\n\n' +
                  //             'If you did not request this, please ignore this email and your password will remain unchanged.\n'

                  //     };

                  //     smtpTransport.sendMail(mailOptions, function (err) {
                  //         res.status(200).json({ success: true, message: 'An e-mail has been sent to ' + user.email + ' with further instructions.' });
                  //         console.log('sent')
                  //     });
                  // })
                })
                .catch((error) => {
                  res.status(200).json({
                    success: false,
                    message: "error are occure in admin creating",
                    error,
                  });
                });
            }
          });
        }
      });
    }
  });
});

router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  Admin.findOne({ email }).then((user) => {
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: " Email not found" });
    }
    bcrypt
      .compare(password, user.password)
      .then((isMatch) => {
        if (isMatch) {
          const payload = {
            id: user.id,
            name: user.name,
            avatar: user.avatar,
          };
          jwt.sign(
            payload,
            "secret",
            {
              expiresIn: 3600,
            },
            (err, token) => {
              if (err) console.error("There is some error in token", err);
              else {
                res.status(200).json({
                  success: true,
                  token: `Bearer ${token}`,
                  data: user,
                });
              }
            }
          );
        } else {
          return res
            .status(400)
            .json({ success: false, message: "Incorrect password" });
        }
      })
      .catch((error) => {
        res.status(401).json({
          success: false,
          message: "error in login user process ",
          error,
        });
      });
  });
});

router.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    return res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    });
  }
);

router.post("/forgot", (req, res) => {
  Admin.findOne({ email: req.body.email })
    .exec()
    .then((user) => {
      if (!user) {
        res.status(400).json({ success: false, message: " Email not found" });
      }
      crypto.randomBytes(20, function (err, buf) {
        var token = crypto.randomBytes(16).toString("hex");

        console.log("token", token);

        (user.resetPasswordToken = token),
          (user.resetPasswordExpires = Date.now() + 3600000);

        user.save().then((UserEmail) => {
          var smtpTransport = nodeMailer.createTransport({
            service: "Gmail",
            secure: false,
            auth: {
              user: "laherasif@gmail.com",
              pass: "laher6565",
            },
          });

          var mailOptions = {
            to: UserEmail.email,
            from: "laherasif@gmail.com",
            subject: "Node.js Password Reset",
            text:
              "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
              "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
              "http://localhost:3000/Resetpassword/" +
              token +
              "\n\n" +
              "If you did not request this, please ignore this email and your password will remain unchanged.\n",
          };

          smtpTransport.sendMail(mailOptions, function (err) {
            res.status(200).json({
              success: true,
              message:
                "An e-mail has been sent to " +
                user.email +
                " with further instructions.",
            });
            console.log("sent");
          });
        });
      });
    })
    .catch((error) => {
      res.status(200).json({
        success: false,
        message:
          "An e-mail not sent to " + user.email + " with further instructions.",
        error,
      });
    });
});

router.get("/reset/:token", (req, res) => {
  Admin.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  })
    .then((user) => {
      res.status(200).json({
        success: true,
        message: " Get data according to token",
        data: user,
      });
    })
    .catch((err) => {
      res.status(401).json({
        success: false,
        message: " Get data error according to token",
        err,
      });
    });
});

router.post("/Updatepassword/:token", (req, res) => {
  Admin.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  })
    .exec()
    .then((user) => {
      if (!user) {
        res.status(403).json({
          success: false,
          message: "Password reset token is invalid or has expired.",
        });
      }

      user.password = req.body.password;
      bcrypt.genSalt(10, (err, salt) => {
        if (err) console.error("There was an error", err);
        else {
          bcrypt.hash(user.password, salt, (err, hash) => {
            user.password = hash;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save().then((ResEmail) => {
              var smtpTrans = nodeMailer.createTransport({
                service: "Gmail",
                auth: {
                  user: "laherasif@gmail.com",
                  pass: "laher6565",
                },
              });
              var mailOptions = {
                to: ResEmail.email,
                from: "myemail",
                subject: "Your password has been changed",
                text:
                  "Hello,\n\n" +
                  " - This is a confirmation that the password for your account " +
                  ResEmail.email +
                  " has just been changed.\n",
              };
              smtpTrans.sendMail(mailOptions, function (err) {
                if (err) {
                  res.status(400).json({
                    success: false,
                    message: "Sorry! Your password has not been changed.",
                  });
                }
                res.status(200).json({
                  success: true,
                  message: "Success! Your password has been changed.",
                });
              });
              res.status(201).json({
                success: true,
                message: "Success! Your password has been changed.",
                data: ResEmail,
              });
            });
          });
        }
      });
    })
    .catch((error) => {
      res
        .status(402)
        .json({ success: false, message: " Password canrnot Updated", error });
    });
});

module.exports = router;
