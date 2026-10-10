const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const AuthRouter = require('./routes/auth.routes.js')

const app = express();

// Parse application/json request bodies into req.body.
app.use(express.json());
// Parse Cookie headers and expose cookies on req.cookies.
app.use(cookieParser());
// Allow cross-origin requests from frontend clients.
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use("/api/auth",AuthRouter)

module.exports = app;