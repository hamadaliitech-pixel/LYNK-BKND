const express = require("express");
const UserControllerRegister = require("../controllers/auth.controller");
const AuthMiddleware = require("../Middleware/auth.middleware.js");
const ValidationMiddleware = require("../Middleware/validation.middleware.js");

const router = express.Router();
router.post("/login", UserControllerRegister.LoginUser);
router.post("/logout",AuthMiddleware.Authuser,UserControllerRegister.LogoutUser);
router.get(
  "/dashboard",
  AuthMiddleware.Authuser,
  UserControllerRegister.Dashboard
);
router.post("/register",UserControllerRegister.Register)
router.post("/forgot-password", UserControllerRegister.ForgotPassword);
router.post("/reset-password/:token",UserControllerRegister.ResetPassword);

module.exports = router;
