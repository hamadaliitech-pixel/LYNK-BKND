const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

const usermodel = mongoose.model("user", UserSchema);

module.exports = usermodel;
