const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const Authrouter = require('./routes/auth.routes.js')
require('dotenv').config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://lynk-inky.vercel.app"
];
// Allow frontend communication (cross-origin requests)
app.use(cors({
  origin: allowedOrigins,
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
