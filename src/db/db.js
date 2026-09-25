const mongoose = require("mongoose");
require("dotenv").config();

async function connectDB(req, res) {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("database is connected");
  } catch (error) {
    console.error("Database isnt connected:",error);
  }
}

module.exports = connectDB;
