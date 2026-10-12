const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const AuthRouter = require("./routes/auth.routes.js");

const app = express();

// Parse application/json request bodies into req.body.
app.use(express.json());
// Parse Cookie headers and expose cookies on req.cookies.
// Allow cross-origin requests from frontend clients.

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://lynk-q2k0elcvh-acme-523c.vercel.app",
    "https://lynk-nine-omega.vercel.app",
  ],
  credentials: true,
}));

app.use(cookieParser());
app.use("/api/auth", AuthRouter);

module.exports = app;
