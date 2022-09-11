const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const NewNotification = new Schema({
  UserId: {
    type: String,
  },
  name: {
    type: String,
  },
  IsNotification: {
    type: Boolean,
    default: false,
  },
  IsChecked: {
    type: Boolean,
    default: true,
  },
  picture: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Notification = mongoose.model("Notification", NewNotification);

module.exports = Notification;
