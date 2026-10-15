const usermodel = require("../model/Usermodel.js");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

async function SignUp(req, res) {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res
      .status(400)
      .json({ message: "username, email and password are required" });
    }
    
    const existing = await usermodel.findOne({
      $or: [{ username }, { email }],
    });
    if (existing) {
      if (existing.username === username) {
        return res
          .status(409)
          .json({ message: "Username already exists", field: "username" });
        }
        if (existing.email === email) {
          return res
          .status(409)
          .json({ message: "Email already exists", field: "email" });
        }
        return res.status(409).json({ message: "User already exists" });
      }
    const hash = await bcrypt.hash(password, 10); //hashing pw

    const user = await usermodel.create({
      username,
      email,
      password: hash,
    });
    console.log(user);

    const token = await jwt.sign({ id: user._id }, process.env.JWTSECRET);
    res.cookie("token", token, cookieOptions);

    return res.status(201).json({
      message: "user register successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to register user" });
  }
}

// Keep cookieOptions defined ONCE, outside both functions
const isProduction = process.env.NODE_ENV === "production" || process.env.FRONTEND_URL?.startsWith("https://");

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
};


async function Loginuser(req, res) {
  const { username, email, password } = req.body;

  try {
    const user = await usermodel.findOne({
      $or: [{ username }, { email }],
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWTSECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      message: "user login successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        image: null,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      message: "Unable to login user",
    });
  }
}

async function Logoutuser(req, res) {
  res.clearCookie("token", cookieOptions);

  return res.status(200).json({
    message: "Logout successfully",
  });
}

async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    const user = await usermodel.findOne({ email });

    if (!user) {
      return res.status(200).json({
        message: "If that email exists, a reset link has been sent.",
      });
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token for database
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

    await user.save();

    const frontendBaseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetURL = `${frontendBaseUrl}/reset-password/${resetToken}`;

    await transporter.sendMail({
      from: `"LYNK Support" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Reset your LYNK password",
      html: `
        <h2>Reset your LYNK password</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetURL}">Reset Password</a>
        <p>This link expires in 15 minutes.</p>
      `,
    });

    res.status(200).json({
      message: "If that email exists, a reset link has been sent.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
}

async function resetPassword(req, res) {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await usermodel.findOne({
      resetPasswordToken: hashedToken,
    });
    if (!user) {
      return res.status(400).json({
        message: "Reset link is invalid or expired",
      });
    }

    // Hash new password
    user.password = await bcrypt.hash(password, 10);

    // Destroy reset token
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
}

module.exports = {
  SignUp,
  Loginuser,
  Logoutuser,
  forgotPassword,
  resetPassword,
};
