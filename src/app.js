const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const Authrouter = require('./routes/auth.routes.js')
require('dotenv').config();

const app = express();

// Allow frontend communication (cross-origin requests)
app.use(cors({
  origin: "https://lynk-inky.vercel.app",
  credentials: true
}));

// Middleware setup
app.use(express.json());
app.use(cookieParser());

// Use routes
app.use("/api/auth",Authrouter)
app.get("/", (req, res) => {
  res.send("Lynk Backend is running!");
});

module.exports = app;
