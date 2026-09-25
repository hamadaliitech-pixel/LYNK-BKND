const usermodel = require("../model/model.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
require('dotenv').config()
async function Register(req, res) {
  const { username, email, password } = req.body;

  //confirming user already exist or not
  const isUserAlreadyExist = await usermodel.findOne({
    $or: [{ username }, { email }],
  });
  if (isUserAlreadyExist) {
    return res.status(409).json({ message: "user already exist!" });
  }
  //Saving password in hash
  const hash = await bcrypt.hash(password, 10);
  const user = await usermodel.create({
    username,
    email,
    password: hash,
  });

  //Creating token
  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
  );
  res.cookie("token", token);

  res.status(200).json({
    message: "user registered successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}
async function LoginUser(req, res) {
  const { Username_or_email, password } = req.body;

  const user = await usermodel.findOne({
    $or: [{ username: Username_or_email }, { email: Username_or_email }],
  });

  if (!user) {
    return res.status(403).json({ message: "invalid username or password" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(403).json({ message: "invalid username or password" });
  }

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
  );

  res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
});

  res.status(200).json({
    message: "User login successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}
async function LogoutUser(req, res) {
  res.clearCookie("token");
  res.status(200).json({ message: "User logout successfully!" });
}
const Dashboard = async (req, res) => {
  res.json({
    message: "Welcome to dashboard",
    user: req.user,
  });
};
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});
async function ForgotPassword(req, res) {
  try {
    const { email } = req.body;

    const user = await usermodel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Generate random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token before saving it
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

    await user.save();

    // Reset link
    const resetURL = `http://localhost:5173/reset-password/${resetToken}`;

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Reset Your Password",
      html: `
        <h2>Password Reset</h2>

        <p>You requested a password reset.</p>

        <p>
          Click the link below to reset your password:
        </p>

        <a href="${resetURL}">
          Reset Password
        </a>

        <p>This link expires in 15 minutes.</p>
      `,
    });

    res.status(200).json({
      message: "Password reset email sent",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
}
async function ResetPassword(req, res) {
  try {
    const { token } = req.params;
    const { password } = req.body;
    
    // Hash the token received from the URL
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find user with valid, non-expired token
    const user = await usermodel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset token",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password
    user.password = hashedPassword;

    // Remove reset token so it cannot be used again
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

module.exports = { Register, LoginUser, LogoutUser, Dashboard, ForgotPassword , ResetPassword };
