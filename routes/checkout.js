const express = require("express");
const router = express.Router();
// const stripe = require('stripe')('sk_test_jA1Pk82NYeG6ESOapfteCFS600V3ZGZxUm')
const Checkout = require("../models/Checkout");
const gravatar = require("gravatar");
const Notification = require("../models/Notification");
const Cart = require("../models/Cart");
router.post("/Payment", function (req, res) {
  try {
    const Newcheckout = new Checkout({
      customer_id: req.body.client,
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      mobile: req.body.mobile,
      state: req.body.country,
      city: req.body.city,
      zipcode: req.body.zipcode,
      address: req.body.address,
      products: req.body.products,
      amount: req.body.amount,
    });

    const avatar = gravatar.url(req.body.email, {
      s: "200",
      r: "pg",
      d: "mm",
    });
    const notifi = new Notification({
      IsNotification: true,
      name: req.body.fname,
      picture: avatar,
    });
    //  const cart = new Cart({
    //   products: req.body.products,

    //  })

    Newcheckout.save();
    notifi
      .save()
      // cart.save()
      .then((staff) => {
        res.status(200).json({
          success: true,
          message: " Product Register process Success",
          data: staff,
        });
      })
      .catch((error) => {
        res.status(400).json({
          success: false,
          message: " Product Register process error",
          error,
        });
      });
  } catch (err) {
    res.send(err);
  }

  //   console.log("req from payment" , req.body)
  // try {
  //     stripe.customers
  //       .create({
  //         name: req.body.name,
  //         email: req.body.email,
  //         token: req.body.token.id
  //       })
  //       .then(customer =>
  //         stripe.charges.create({
  //             amount: req.body.amount * 100,
  //             currency: "usd",
  //             customer: customer.id

  //         })

  //       )
  //       .then((res) => res.status(200).json( { success : true , message : " well work" , }))
  //       .catch(err => console.log(err));
  //   } catch (err) {
  //     res.send(err);
  //   }
});

// var cron = require('node-cron');

// cron.schedule('* * * * *', () => {
//   console.log("its working")
//   Checkout.aggregate([

//     { $group:
//         { _id: {yearBillDate: "$date", monthBillDate:"$date"},
//         }
//     }
//     ], function(err, result) {
//         console.log(err, result)});
// })

router.get("/clientinfo/:id", (req, res) => {
  var id = req.params.id;

  console.log("delete id", id);
  Checkout.find({ customer_id: id })
    .exec()
    .then((doctors) => {
      res.json({
        success: true,
        message: "Doctor are Succesfully Deleted",
        data: doctors,
      });
    })
    .catch((error) => {
      res.json({
        success: false,
        message: " Deleting process have an error",
        error,
      });
    });
});

router.get("/getCheckout", (req, res) => {
  Checkout.find({})
    .exec()
    .then((doctors) => {
      res.json({
        success: true,
        message: "Doctor are Succesfully Deleted",
        data: doctors,
      });
    })
    .catch((error) => {
      res.json({
        success: false,
        message: " Deleting process have an error",
        error,
      });
    });
});

module.exports = router;
