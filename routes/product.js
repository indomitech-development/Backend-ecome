const express = require("express");
const router = express.Router();
const validateRegister = require("../validation/ProductVali");
const multer = require("multer");
const Product = require("../models/Product");

const storage = multer.diskStorage({
  destination: function (req, file, next) {
    next(null, "Images/Uploads");
  },
  filename: function (req, file, next) {
    next(null, file.originalname);
  },
});

const fileFilter = (req, file, next) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    next(null, true);
  } else {
    next(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

router.post("/register", upload.any(), (req, res) => {
  let media = [];

  req.files.forEach((files) => {
    media.push(files.filename);
  });

  // let array1 = JSON.parse(req.body.colornames)

  const { errors, isValid } = validateRegister(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }
  Product.findOne({
    product_code: req.body.product_code,
  })
    .exec()
    .then((user) => {
      if (user) {
        return res.status(400).json({ product_code: "email already exit" });
      } else {
        const NewProduct = new Product({
          ProductId: req.body.product_code,
          ProductName: req.body.product_name,
          product_price: req.body.product_price,
          Catagory: req.body.product_categorie,
          Avaliable_Quantity: req.body.available_quantity,
          Quantity: 1,
          Description: req.body.product_description,
          Size: req.body.product_size,
          total: req.body.product_price,
          User: "",
          media: media,
          // ColorPrice: array1,
          loading: false,
          SuccessMesg: false,
        });

        NewProduct.save()
          .then((staff) => {})
          .catch((error) => {
            res.status(400).json({
              success: false,
              message: " Product Register process error",
              error,
            });
          });
      }
    });
});

router.get("/getProduct", (req, res) => {
  Product.find()
    .sort({ ProductName: -1 })
    .exec()
    .then((user) => {
      res.json({
        success: true,
        message: " Fetch Staffs Successfully",
        data: user,
      });
    })
    .catch((err) => {
      res.json({
        success: false,
        message: "error are during Fetch Staff",
        err,
      });
    });
});

router.post("/PriceRange", (req, res) => {
  let high = req.body.data;
  let low = req.body.next;
  if (low === undefined) {
    Product.find({
      product_price: {
        $lte: high,
      },
    })
      .exec()
      .then((doctors) => {
        res.status(200).json({
          success: true,
          message: "All Speiclist are fatched successfully",
          data: doctors,
        });
      })
      .catch((error) => {
        res
          .status(401)
          .json({ success: false, message: "Fatching Doctors Error", error });
      });
  } else {
    Product.find({
      product_price: {
        $gte: high,
        $lte: low,
      },
    })
      .exec()
      .then((doctors) => {
        res.status(200).json({
          success: true,
          message: "All Speiclist are fatched successfully",
          data: doctors,
        });
      })
      .catch((error) => {
        res
          .status(401)
          .json({ success: false, message: "Fatching Doctors Error", error });
      });
  }
});

router.get("/deleteproduct/:id", (req, res) => {
  var id = req.params.id;

  console.log("delete id", id);
  Product.findByIdAndRemove(id)
    .exec()
    .then((doctors) => {
      res.json({
        success: true,
        message: "Product are Succesfully Deleted",
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

router.post("/updateProduct/:id", (req, res) => {
  var id = req.body._id;
  Product.findByIdAndUpdate(
    { _id: id },
    {
      $set: {
        ProductId: req.body.product_code,
        ProductName: req.body.product_name,
        product_price: req.body.product_price,
        Catagory: req.body.product_categorie,
        Avaliable_Quantity: req.body.available_quantity,
        Description: req.body.product_description,
        Size: req.body.product_size,
        // picture: req.file.filename,
      },
    }
  )
    .exec()
    .then((product) => {
      if (!product) {
        res
          .status(404)
          .json({ success: false, Error: "Product not found for this id" });
      }
    })
    .catch((err) => {
      console.log("Product update Error: ", err);
    });
});

router.post("/updateAvaliableQunaty", (req, res) => {
  let data = [];
  req.body.forEach((many) => {
    data.push(many);
  });

  for (var i = 0, l = data.length; i < l; i++) {
    Product.updateMany(
      { _id: { $in: data[i] } },
      {
        $set: {
          Avaliable_Quantity: data[i].Avaliable_Quantity,
        },
      }
    )
      .exec()
      .then((product) => {
        if (!product) {
          res
            .status(404)
            .json({ success: false, Error: "Product not found for this id" });
        }
      })
      .catch((err) => {
        console.log("Product update Error: ", err);
      });
  }
});

router.post("/updateloading/:id", (req, res) => {
  var id = req.body._id;
  Product.findByIdAndUpdate(
    { _id: id },
    {
      $set: {
        loading: true,
      },
    }
  )
    .exec()
    .then((product) => {
      if (!product) {
        res
          .status(404)
          .json({ success: false, Error: "Product not found for this id" });
      }
    })
    .catch((err) => {
      console.log("Product update Error: ", err);
    });
});

module.exports = router;
