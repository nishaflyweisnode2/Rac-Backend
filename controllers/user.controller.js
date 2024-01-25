const jwt = require("jsonwebtoken");
const authConfig = require("../configs/auth.config");
var newOTP = require("otp-generators");
const User = require("../models/user.model");
const path = require("path");
// const bcrypt = require("bcryptjs");
const productModel = require("../models/productsModel");

exports.registration = async (req, res) => {
  try {
    var { phone, referalCode, referalCodeUnique } = req.body;
    var user = await User.findOne({ phone: phone, userType: "USER" });

    if (!user) {
      req.body.otp = newOTP.generate(4, {
        alphabets: false,
        upperCase: false,
        specialChar: false,
      });
      req.body.otpExpiration = new Date(Date.now() + 5 * 60 * 1000);
      req.body.accountVerification = false;
      req.body.userType = "USER";

      let referalUser = null;

      const userCreate = await User.create({
        phone,
        referalCodeUnique,
        ...req.body,
      });

      if (referalCode) {
        referalUser = await User.findOne({ referalCode: referalCode });
        if (referalUser) {
          referalUser.referalData.push(userCreate._id);
          referalUser.Coin += 200;
          await referalUser.save();
        }
      }

      userCreate.referalBy = referalUser ? referalUser._id : null;
      await userCreate.save();

      let obj = {
        id: userCreate._id,
        otp: userCreate.otp,
        phone: userCreate.phone,
      };

      res.status(200).send({
        status: 200,
        message: "Registered successfully ",
        data: obj,
      });
    } else {
      return res.status(409).send({ status: 409, msg: "Already Exit" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.loginWithPhone = async (req, res) => {
  try {
    const { phone } = req.body;
    const user = await User.findOne({ phone: phone, userType: "USER" });
    if (!user) {
      return res.status(400).send({ msg: "not found" });
    }
    const userObj = {};
    userObj.otp = newOTP.generate(4, {
      alphabets: false,
      upperCase: false,
      specialChar: false,
    });
    userObj.otpExpiration = new Date(Date.now() + 5 * 60 * 1000);
    userObj.accountVerification = false;
    const updated = await User.findOneAndUpdate(
      { phone: phone, userType: "USER" },
      userObj,
      { new: true }
    );
    let obj = {
      id: updated._id,
      otp: updated.otp,
      phone: updated.phone,
    };
    res
      .status(200)
      .send({ status: 200, message: "logged in successfully", data: obj,user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ message: "user not found" });
    }
    if (user.otp !== otp || user.otpExpiration < Date.now()) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    const updated = await User.findByIdAndUpdate(
      { _id: user._id },
      { accountVerification: true },
      { new: true }
    );
    const accessToken = jwt.sign({ id: user._id }, authConfig.secret, {
      expiresIn: authConfig.accessTokenTime,
    });
    let obj = {
      id: updated._id,
      otp: updated.otp,
      phone: updated.phone,
      accessToken: accessToken,
    };
    res
      .status(200)
      .send({ status: 200, message: "logged in successfully", data: obj });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ error: "internal server error" + err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const data = await User.findOne({ _id: req.user._id });
    if (data) {
      return res
        .status(200)
        .json({ status: 200, message: "get Profile", data: data });
    } else {
      return res
        .status(404)
        .json({ status: 404, message: "No data found", data: {} });
    }
  } catch (error) {
    console.log(error);
    res.status(501).send({ status: 501, message: "server error.", data: {} });
  }
};

exports.resendOTP = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ _id: id, userType: "USER" });
    if (!user) {
      return res.status(404).send({ status: 404, message: "User not found" });
    }
    const otp = newOTP.generate(4, {
      alphabets: false,
      upperCase: false,
      specialChar: false,
    });
    const otpExpiration = new Date(Date.now() + 5 * 60 * 1000);
    const accountVerification = false;
    const updated = await User.findOneAndUpdate(
      { _id: user._id },
      { otp, otpExpiration, accountVerification },
      { new: true }
    );
    let obj = {
      id: updated._id,
      otp: updated.otp,
      phone: updated.phone,
    };
    res.status(200).send({ status: 200, message: "OTP resent", data: obj });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ status: 500, message: "Server error" + error.message });
  }
};

exports.updateLocation = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id });
    if (!user) {
      return res.status(404).send({ status: 404, message: "User not found" });
    } else {
      if (req.body.currentLat || req.body.currentLong) {
        coordinates = [
          parseFloat(req.body.currentLat),
          parseFloat(req.body.currentLong),
        ];
        req.body.currentLocation = { type: "Point", coordinates };
      }
      let update = await User.findByIdAndUpdate(
        { _id: user._id },
        {
          $set: {
            currentLocation: req.body.currentLocation,
            city: req.body.city,
          },
        },
        { new: true }
      );
      if (update) {
        res.status(200).send({
          status: 200,
          message: "Location update successfully.",
          data: update,
        });
      }
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ status: 500, message: "Server error" + error.message });
  }
};

exports.uploadSelfie = async (req, res) => {
  try {
    const findUser = await User.findById({ _id: req.user._id });
    if (findUser) {
      let fileUrl;
      if (req.file) {
        fileUrl = req.file ? req.file.path : "";
      }
      const user = await User.findOneAndUpdate(
        { _id: req.user._id },
        { $set: { uploadSelfie: fileUrl || findUser.uploadSelfie } },
        { new: true }
      );
      console.log(user);
      return res
        .status(200)
        .json({ msg: "profile updated successfully", user: user });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ status: 500, message: "Server error" + error.message });
  }
};


exports.editProfile = async (req, res) => {
  try {
    const findUser = await User.findById({ _id: req.user._id });
    if (findUser) {
      const data = {
        fullName: req.body.fullName || findUser.fullName,
        email: req.body.email || findUser.email,
        phone: req.body.phone || findUser.phone,
        address: req.body.address || findUser.address,
        subscription: req.body.subscription || findUser.subscription,
      };
      const user = await User.findByIdAndUpdate({ _id: req.user._id }, data, {
        new: true,
      });
      return res
        .status(200)
        .json({ msg: "profile details updated", user: user });
    } else {
      return res.status(404).json({ msg: "user not found", user: {} });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ status: 500, message: "Server error" + error.message });
  }
};

exports.nearbyShop = async (req, res) => {
  const { longitude, latitude, maxDistance } = req.query;

  if (!longitude || !latitude || !maxDistance) {
    return res.status(400).json({ error: 'Invalid parameters' });
  }

  // Convert maxDistance from meters to centimeters
  const maxDistanceInCentimeters = maxDistance * 100;

  // Find nearby shops using geospatial queries
  const nearbyShops = await productModel.find({
    location: {
      $nearSphere: {
        $geometry: {
          type: 'Point',
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
        $maxDistance: maxDistanceInCentimeters,
      },
    },
  });

  res.json({ shops: nearbyShops });
};
