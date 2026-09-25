const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const Authrouter = require('./routes/auth.routes.js')
require('dotenv').config();

const app = express();

// Allow frontend communication (cross-origin requests)
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// Middleware setup
app.use(express.json());
app.use(cookieParser());

// Use routes
app.use("/api/auth",Authrouter)

module.exports = app;
