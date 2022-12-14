const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");
const User = require("../models/User");
const Notification = require("../models/Notification");
router.post("/register", function (req, res) {
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({
    email: req.body.email,
  }).then((user) => {
    if (user) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200",
        r: "pg",
        d: "mm",
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        picture: avatar,
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
                    message: " User are created",
                    data: user,
                  });
                })
                .catch((error) => {
                  res.status(200).json({
                    success: false,
                    message: "error are occure in User creating",
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

  User.findOne({ email }).then((user) => {
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

router.get("/GetUsers", (req, res) => {
  User.find({})
    .exec()
    .then((user) => {
      res
        .status(200)
        .json({ success: true, message: "All User are Fetched", data: user });
    })
    .catch((error) => {
      res
        .status(400)
        .json({ success: false, message: "All User are not  Fetched", error });
    });
});

module.exports = router;
