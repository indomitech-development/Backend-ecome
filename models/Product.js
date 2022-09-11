const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
  ProductId: {
    type: String,
    required: true,
  },
  ProductName: {
    type: String,
    required: true,
  },
  product_price: {
    type: String,
    required: true,
  },
  Catagory: {
    type: String,
    required: true,
  },

  Quantity: {
    type: Number,
  },
  Description: {
    type: String,
    required: true,
  },
  media: {
    type: String,
    required: true,
  },
  total: {
    type: String,
  },
  date: {
    type: Date,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
