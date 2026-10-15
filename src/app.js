const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const AuthRouter = require("./routes/auth.routes.js");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://lynk.bonto.run",
  "https://lynk-q2k0elcvh-acme-523c.vercel.app",
  "https://lynk-nine-omega.vercel.app",
  "https://lynk-1ddkf0x0v-acme-523c.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

// Parse application/json request bodies into req.body.
app.use(express.json());
// Parse Cookie headers and expose cookies on req.cookies.
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
      callback(null, true);
      return;
    }

    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

app.use(cookieParser());
app.use("/api/auth", AuthRouter);

module.exports = app;
