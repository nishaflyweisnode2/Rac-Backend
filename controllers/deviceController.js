const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authConfig = require("../configs/auth.config");
var newOTP = require("otp-generators");
const User = require("../models/user.model");
const Device = require("../models/deviceModel");
// const subDevice = require("../models/subDeviceModel");
const imagePattern = "[^\\s]+(.*?)\\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$";
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "dtijhcmaa",
  api_key: "624644714628939",
  api_secret: "tU52wM1-XoaFD2NrHbPrkiVKZvY",
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "images/image",
    allowed_formats: ["jpg", "jpeg", "png", "PNG", "xlsx", "xls", "pdf", "PDF"],
  },
});
const upload = multer({ storage: storage });
exports.createDevice = async (req, res) => {
  try {
    // Handle file upload
    upload.array("images")(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ msg: err.message });
      }

      let images = [];

      // Check if req.files is an array (multer.array())
      if (Array.isArray(req.files)) {
        // Iterate through uploaded files
        for (let i = 0; i < req.files.length; i++) {
          images.push(req.files[i] ? req.files[i].path : "");
        }
      } else {
        // For single file uploads (multer.single())
        images.push(req.files ? req.files.path : "");
      }

      // Create a new Device
      const newDevice = new Device({
        name: req.body.name,
        images: images,
        user: req.user.id,
      });

      // Save the new Device to the database
      const savedDevice = await newDevice.save();

      res.status(200).json({
        message: "Device added successfully.",
        status: 200,
        data: savedDevice,
      });
    });
  } catch (error) {
    // Handle any errors that occur before file upload
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      data: error.message,
    });
  }
};

exports.getDevice = async (req, res) => {
  const devices = await Device.find({});
  res.status(201).json({ success: true, devices });
};

exports.updateDevice = async (req, res) => {
  const { id } = req.params;

  try {
    const deviceToUpdate = await Device.findById(id); // Change variable name to deviceToUpdate

    if (!deviceToUpdate) {
      return res
        .status(404)
        .json({ message: "Device Not Found", status: 404, data: {} });
    }

    upload.single("image")(req, res, async (err) => {
      try {
        if (err) {
          return res.status(400).json({ msg: err.message });
        }

        const fileUrl = req.file ? req.file.path : "";
        deviceToUpdate.image = fileUrl || deviceToUpdate.image;
        deviceToUpdate.name = req.body.name;

        const updatedDevice = await deviceToUpdate.save(); // Change variable name to updatedDevice

        res
          .status(200)
          .json({ message: "Updated Successfully", data: updatedDevice });
      } catch (error) {
        res.status(500).json({
          status: 500,
          message: "Internal server error",
          data: error.message,
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      data: error.message,
    });
  }
};
exports.removeDevice = async (req, res) => {
  const { id } = req.params;
  try {
    const deviceToRemove = await Device.findById(id); // Change variable name to deviceToRemove

    if (!deviceToRemove) {
      return res
        .status(404)
        .json({ message: "Device Not Found", status: 404, data: {} });
    }

    await Device.findByIdAndDelete(deviceToRemove._id); // Change variable name to DeviceModel

    res.status(200).json({ message: "Device Deleted Successfully !" });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      data: error.message,
    });
  }
};

exports.statusDevice = async (req, res) => {
    try {
      const deviceId = req.params.deviceId;
      const type = req.body.type;
  
      // Check if the device exists
      const device = await Device.findById(deviceId);
      if (!device) {
        return res.status(404).json({ message: "Device not found" });
      }
  
      // Update the specified status type to true
      device.status[type] = true;
  
      // Save the updated device
      const updatedDevice = await device.save();
  
      res.status(200).json({
        message: `${type} status updated to true`,
        device: updatedDevice,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  exports.statusDeviceFalse = async (req, res) => {
    try {
      const deviceId = req.params.deviceId;
      const type = req.body.type;
  
      // Check if the device exists
      const device = await Device.findById(deviceId);
      if (!device) {
        return res.status(404).json({ message: "Device not found" });
      }
  
      // Update the specified status type to true
      device.status[type] = false;
  
      // Save the updated device
      const updatedDevice = await device.save();
  
      res.status(200).json({
        message: `${type} status updated to true`,
        device: updatedDevice,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
exports.suggestion = async (req, res) => {
  try {
    const deviceId = req.params.deviceId;

    // Check if the device exists
    const device = await Device.findById(deviceId);
    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    // Extract suggestions array from the request body
    const suggestions = req.body;

    // Validate if the suggestions array is provided and is an array
    if (!Array.isArray(suggestions)) {
      return res
        .status(400)
        .json({ message: "Invalid input format for suggestions" });
    }

    // Add each suggestion to the device
    suggestions.forEach((suggestion) => {
      const { title, description } = suggestion;
      device.suggestions.push({ title, description });
    });

    // Save the updated device with the new suggestions
    const updatedDevice = await device.save();

    res.status(201).json({
      message: "Suggestions added successfully",
      device: updatedDevice,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.myDevice = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find devices associated with the user
    const devices = await Device.find({ user: userId }).populate("user");

    res.status(200).json({
      status: 200,
      message: "Devices of the logged-in user",
      data: devices,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      data: {},
    });
  }
};
