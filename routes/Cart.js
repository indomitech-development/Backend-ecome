const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
router.post('/register', function (req, res) {

    console.log("res", req.body.products)
    const cart = new Cart({
      products : req.body.products

    })
    cart.save()
        .then(user => {
            if (!user) {
                res.status(400).json({ success: false, message: " Not working " })

            }

            res.status(200).json({ success: true, message: " Working Good", data: user })
        })
        .catch(error => {
            res.status(401).json({ success: false, message: " Error During send data", error })
        })





})




router.get('/Get_Cart', (req, res) => {
    Cart.find({})
        .exec()
        .then(Salary => {

            res.json({ success: true, message: "All salary Successfully fatched", data: Salary })
        })
        .catch(error => {
            res.json({ success: false, message: "Fatching Salary Error", error })
        })

})

router.get('/Get_all_cart', (req, res) => {
    Cart.find({})
        .populate('_id')
        .exec()
        .then(userToken => {
            if (!userToken) {
                res.status(400).json({ success: false, message: "Token not found" })
            }
        })
        .catch(error => {
            return res.status(500).json({ success: false, Error: 'Error during save user :', error })

        })

})





router.get('/Delete_cart/:_id', (req, res) => {
    var id = req.params._id

    Cart.findOneAndRemove(id)
        .exec()
        .then(Salary => {

            res.json({ success: true, message: "Salary are Succesfully Deleted", data: Salary })
        })
        .catch(error => {
            res.json({ success: false, message: " Deleting process have an error" })
        })
})



router.post('/updateClientProduct/:_id', (req, res) => {
    Cart.findOneAndUpdate({ ProductId: req.body.ProductId }, {
        $set: {

            Quantity: req.body.Quantity++

        }
    }
    )

        .exec()
        .then(Salary => {
            console.log("Updated Response from Api", Salary.data)
            res.json({ success: true, message: "Updating are Succesfully Geted on base id", data: Salary })
        })
        .catch(error => {
            res.json({ success: false, message: " Client Giver Data are not Correct", error })
        })

})






router.post('/updateQuanty/:_id', (req, res) => {

    var id = req.body._id
    Cart.findOneAndUpdate({ _id: id }, {
        $set: {

            ProductName: req.body.ProductName,
            product_price: req.body.product_price,
            Catagory: req.body.Catagory,
            Quantity: req.body.Quantity,
            Avaliable_Quantity: req.body.available_quantity,
            Description: req.body.Description,
            Size: req.body.Size,
            picture: req.body.picture,
            total: req.body.product_price,
        }
    }
    )
        .exec()
        .then(Salary => {
            console.log("Updated Response from Api", Salary.data)
            res.json({ success: true, message: "Updating are Succesfully Geted on base id", data: Salary })
        })
        .catch(error => {
            res.json({ success: false, message: " Updating process have an error", error })
        })

})






module.exports = router;