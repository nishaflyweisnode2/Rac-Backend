const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authConfig = require("../configs/auth.config");
var newOTP = require("otp-generators");
const User = require("../models/user.model")
const Helper = require("../models/helper")

const Order = require("../models/orders/orderModel");
exports.registrationVendor = async (req, res) => {
  try {
    const { phone } = req.body;
    const user = await User.findOne({ phone: phone, userType: "VENDOR" });
    if (!user) {
      req.body.otp = newOTP.generate(4, {
        alphabets: false,
        upperCase: false,
        specialChar: false,
      });
      req.body.otpExpiration = new Date(Date.now() + 5 * 60 * 1000);
      req.body.accountVerification = false;
      req.body.userType = "VENDOR";
      const userCreate = await User.create(req.body);
      let obj = {
        id: userCreate._id,
        otp: userCreate.otp,
        fullName: userCreate.fullName,
        phone: userCreate.phone,
        email: userCreate.email,
        pincode: userCreate.pincode,
        serviceArea: userCreate.serviceArea,
        serviceDistance: userCreate.serviceDistance,
        serviceName: userCreate.serviceName,
        //   uploadSelfie
        // pancard:
        // uploadPanCard:
        // aadharCard:
        // frontSide:
        // backSide:
      };
      res
        .status(200)
        .send({ status: 200, message: "Registered successfully ", data: obj });
    } else {
      return res.status(409).send({ status: 409, msg: "Already Exit" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.loginWithPhoneVendor = async (req, res) => {
  try {
    const { phone } = req.body;
    const user = await User.findOne({ phone: phone, userType: "VENDOR" });
    if (!user) {
      return res.status(400).send({ msg: "not found" });
    }
    const userObj = {};
    userObj.otp = newOTP.generate(4, {
      alphabets: false,
      upperCase: false,
      specialChar: false,
    });
    // userObj.otpExpiration = new Date(Date.now() + 5 * 60 * 1000);
    userObj.accountVerification = false;
    const updated = await User.findOneAndUpdate(
      { phone: phone, userType: "VENDOR" },
      userObj,
      { new: true }
    );
    let obj = {
      id: updated._id,
      otp: updated.otp,
      phone: updated.phone,
      fullName: updated.fullName,
      email: updated.email,
    };
    res
      .status(200)
      .send({ status: 200, message: "logged in successfully", data: obj, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.verifyOtpVendor = async (req, res) => {
  try {
    const { otp } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ message: "user not found" });
    }
    // if (user.otp !== otp || user.otpExpiration < Date.now()) {
    //   return res.status(400).json({ message: "Invalid OTP" });
    // }
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

exports.getProfileVendor = async (req, res) => {
  try {
    const data = await User.findOne({ _id: req.user.id }).populate("subscription");
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

exports.resendOTPVendor = async (req, res) => {
  const { phone } = req.body;
  try {
    const user = await User.findOne({ phone });
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

exports.updateLocationVendor = async (req, res) => {
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

exports.deleteUserById = async (req, res) => {
  try {
    const findUser = await User.findById({ _id: req.params.id });
    if (findUser) {
      await User.deleteOne({ _id: findUser._id });
      return res.status(200).send({ message: "data deleted " });
    } else {
      return res.status(404).json({ msg: "user not found", user: {} });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: err.message });
  }
};

exports.updateFileAndDocumentVendor = async (req, res) => {
  try {
    if (
      req.files &&
      req.files["frontImage"] &&
      req.files["backImage"] &&
      req.files["pic"] &&
      req.files["panCard"]
    ) {
      let front = req.files["frontImage"];
      let back = req.files["backImage"];
      let pic = req.files["pic"];
      let panCard = req.files["panCard"];
      req.body.frontSide = front[0].path;
      req.body.backSide = back[0].path;
      req.body.uploadSelfie = pic[0].path;
      req.body.uploadPanCard = panCard[0].path;
    }

    const user = await User.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          fullName: req.body.fullName,
          email: req.body.email,
          phone: req.body.phone,
          fatherName: req.body.fatherName,
          dateOfBirth: req.body.dateOfBirth,
          matrialStatus: req.body.matrialStatus,
          address1: req.body.address1,
          address: req.body.address,
          frontSide: req.body.frontSide,
          backSide: req.body.backSide,
          uploadSelfie: req.body.uploadSelfie,
          uploadPanCard: req.body.uploadPanCard,
          pancard: req.body.pancardNumber,
          aadharCard: req.body.aadharCardNumber,
          document: req.body.document,
          city: req.body.city,
          pincode: req.body.pincode,
          serviceArea: req.body.serviceArea,
          serviceDistance: req.body.serviceDistance,
          serviceName: req.body.serviceName,
          BankName: req.body.BankName,
          BranchName: req.body.BranchName,
          holderName: req.body.holderName,
          AccountNumber: req.body.AccountNumber,
          confirmAccountNumber: req.body.confirmAccountNumber,
          ifscCode: req.body.ifscCode,
        },
      },
      { new: true }
    );

    return res
      .status(200)
      .json({ msg: "profile updated successfully", user: user });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ status: 500, message: "Server error" + error.message });
  }
};

exports.uploadProfilePic = async (req, res) => {
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


exports.addHelpers = async (req, res) => {
  try {
    const vendorId = req.params.id;
    const { name, aadharNumber, mobileNumber } = req.body;

    if (req.files && req.files["frontImage"] && req.files["backImage"]) {
      let front = req.files["frontImage"];
      let back = req.files["backImage"];

      req.body.frontSide = front[0].path;
      req.body.backSide = back[0].path;
    }

    // Create a new helper
    const newHelper = new Helper({
      vendor: vendorId, // Assuming you have a vendor ID associated with the helper
      name: name,
      aadharNumber: aadharNumber,
      mobileNumber: mobileNumber,
      frontSide: req.body.frontSide,
      backSide: req.body.backSide,
    });

    // Save the helper to the database
    await newHelper.save();

    res.json({ message: 'Helper added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};




exports.getHelpers = async (req, res) => {
  try {
    // Find the vendor associated with the logged-in user
    const vendor = await User.findOne({ _id: req.user.id });

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    // Find helpers of the vendor
    const helpers = await Helper.find({ vendor: vendor._id });

    res.json(helpers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAllHelpers = async (req, res) => {
  try {
    // Find all helpers
    const helpers = await Helper.find();

    res.json(helpers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
exports.totalEarn = async (req, res) => {
  const vendorId = req.params.vendorId;
  try {
    const totalAmountEarned = await Order.aggregate([
      { $match: { vendorId } },
      { $group: { _id: null, totalAmount: { $sum: '$total' } } },
    ]);

    const totalEarned = totalAmountEarned.length ? totalAmountEarned[0].totalAmount : 0;

    res.status(200).json({ totalEarned });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching total earnings' });
  }
};

exports.updateAreaAndDistance = async (req, res) => {
  try {
    const vendorId = req.params.vendorId; // Extract the vendor ID from the URL
    const { serviceArea, serviceDistance } = req.body; // Extract area and serviceable distance from the request body

    // Find the vendor by ID
    const vendor = await User.findById(vendorId);

    // If the vendor is not found, return an error response
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    // Update the area and serviceable distance
    vendor.serviceArea = serviceArea;
    vendor.serviceDistance = serviceDistance;

    // Save the updated vendor
    await vendor.save();

    // Return a success response
    res.status(200).json({ message: 'Area and serviceable distance updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.filterTotal = async (req, res) => {
  try {
    const vendorId = req.params.vendorId;
    const filter = req.query.filter; // Extract the filter from query parameters

    // Calculate earnings based on the filter
    let filteredEarnings;

    if (filter === 'week') {
      // Calculate weekly earnings
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7); // Go back 7 days
      filteredEarnings = await calculateEarnings(vendorId, startDate);
    } else if (filter === 'month') {
      // Calculate monthly earnings
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1); // Go back 1 month
      filteredEarnings = await calculateEarnings(vendorId, startDate);
    } else if (filter === 'year') {
      // Calculate yearly earnings
      const startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 1); // Go back 1 year
      filteredEarnings = await calculateEarnings(vendorId, startDate);
    } else {
      return res.status(400).json({ error: 'Invalid filter. Use week, month, or year.' });
    }

    // Respond with the filtered earnings
    return res.status(200).json({
      success: true,
      earnings: filteredEarnings,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Function to calculate earnings based on the start date
async function calculateEarnings(vendorId, startDate) {
  // Implement your logic to query the database and calculate earnings
  // Here's a simplified example that sums earnings for orders placed after the start date
  const orders = await Order.find({
    vendor: vendorId,
    orderDate: { $gte: startDate },
  });

  const totalEarnings = orders.reduce((total, order) => total + order.totalAmount, 0);

  return totalEarnings;
}

exports.editvendorProfile = async (req, res) => {
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