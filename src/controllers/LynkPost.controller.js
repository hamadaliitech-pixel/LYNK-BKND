const { JsonWebTokenError } = require("jsonwebtoken");
const LynkUploadModel = require("../model/LynkSchema.js");
const uploadFile = require("../services/services.js");
const usermodel = require("../model/Usermodel.js");
const jwt = require("jsonwebtoken");
require("dotenv").config();
async function Lynk(req, res) {
  try {
    const { link, title } = req.body || {};

    const Lynkcreation = await LynkUploadModel.create({
      link,
      title,
      user: req.user._id,
    });

    res.status(201).json({
      message: "Lynk created successfully",
      lynk: {
        _id: Lynkcreation._id,
        link: Lynkcreation.link,
        title: Lynkcreation.title,
      },
    });
  } catch (error) {
    console.error("Lynk creation error:", error);

    res.status(500).json({
      message: "Unable to create Lynk",
    });
  }
}

async function getLynk(req, res) {
  try {
    const lynks = await LynkUploadModel.find({
      user: req.user._id,
    });

    const user = await usermodel
      .findById(req.user._id)
      .select("username email Profileimage");

    res.status(200).json({
      user,
      lynks,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Unable to get Lynks",
    });
  }
}

async function deleteLynk(req, res) {
  try {
    const { id } = req.params;

    const lynk = await LynkUploadModel.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!lynk) {
      return res.status(404).json({
        message: "Lynk not found",
      });
    }

    res.status(200).json({
      message: "Lynk deleted successfully",
    });
  } catch (error) {
    console.error("Lynk deletion error:", error);

    res.status(500).json({
      message: "Unable to delete Lynk",
    });
  }
}

async function uploadProfileImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No image uploaded",
      });
    }

    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWTSECRET);
    const result = await uploadFile(
      req.file.buffer.toString("base64"),
      req.file.originalname,
    );
    const user = await usermodel.findByIdAndUpdate(
      decoded.id,
      { Profileimage: result.url },
      { returnDocument: "after" },
    );

    return res.status(200).json({
      message: "Profile image updated",
      Profileimage: user.Profileimage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to upload profile image",
    });
  }
}

module.exports = { Lynk, uploadProfileImage, getLynk, deleteLynk };
