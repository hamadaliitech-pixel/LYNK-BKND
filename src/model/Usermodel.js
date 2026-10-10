const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  Profileimage: {
    type: String,
    required: false,
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

const usermodel = mongoose.model("user", userSchema);

module.exports = usermodel;
