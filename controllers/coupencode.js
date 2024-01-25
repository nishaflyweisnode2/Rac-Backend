const coupencodeModel = require("../models/coupencode");
const moment = require("moment");


exports.createCoupencode = async (req, res) => {
  try {
    const { coupencode, price, expireAt, maximumUser, expiration } = req.body;

    // Validate input
    if (!coupencode || !price || !expireAt || !maximumUser || !expiration) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newCoupencode = new coupencodeModel({
      coupencode,
      price,
      expireAt,
      maximumUser,
      expiration,
    });

    const savedCoupencode = await newCoupencode.save();

    res.status(201).send({
      status: 200,
      message: "success",
      data: savedCoupencode,
    });
  } catch (error) {
    console.error("Error creating coupencode:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.getAllCoupencodes = async (req, res) => {
  try {
    const coupencodes = await coupencodeModel.find();
    if (!coupencodes) {
      return res.status(404).json({ error: "Coupencode not found" });
    }
    res.status(200).send({
      status: 200,
      message: "success",
      data: coupencodes,
    });
  } catch (error) {
    console.error("Error retrieving coupencodes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.getCoupencodeById = async (req, res) => {
  try {
    const { id } = req.params;
    const coupencode = await coupencodeModel.findById(id);

    if (!coupencode) {
      return res.status(404).json({ error: "Coupencode not found" });
    }
    res.status(200).send({
      status: 200,
      message: "success",
      data: coupencode,
    });
  } catch (error) {
    console.error("Error retrieving coupencode:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.updateCoupencode = async (req, res) => {
  try {
    const { id } = req.params;
    const { coupencode, price, expireAt, maximumUser, expiration } =
      req.body;

    // Validate input
    if (
      !coupencode ||
      !price ||
      !expireAt ||
      !maximumUser ||
      !expiration
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existingCoupencode = await coupencodeModel.findById(id);

    if (!existingCoupencode) {
      return res.status(404).json({ error: "Coupencode not found" });
    }

    existingCoupencode.coupencode = coupencode;
    existingCoupencode.price = price;
    existingCoupencode.expireAt = expireAt;
    existingCoupencode.maximumUser = maximumUser;
    existingCoupencode.expiration = expiration;

    const updatedCoupencode = await existingCoupencode.save();

    res.status(200).send({
      status: 200,
      message: "success",
      data: updatedCoupencode,
    });
  } catch (error) {
    console.error("Error updating coupencode:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.deleteCoupencode = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCoupencode = await coupencodeModel.findByIdAndDelete(id);

    if (!deletedCoupencode) {
      return res.status(404).json({ error: "Coupencode not found" });
    }

    res.status(200).send({
      status: 200,
      message: "Coupencode deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting coupencode:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.addUserToCoupencode = async (req, res) => {
  try {
   
    const { coupencode } = req.params;
    const userId = req.user._id;
    
    // console.log(req.user._id) // Assuming the user ID is available in req.user.id through authentication middleware

    // Find the coupencode
    let coupencodeObj = await coupencodeModel.findOne({ coupencode:coupencode });
   
    if (!coupencodeObj) {
      return res.status(404).json({ error: "Coupencode not found" });
    }

    // Check if the user already exists in the array
    if (coupencodeObj.user.includes(userId)) {
      return res.status(400).json({ error: "User already used this coupencode" });
    }
    
    // Get the maximum user count
    let maximumUserCount = coupencodeObj.maximumUser;
    
    // Check if the maximum user count has been reached
    if (maximumUserCount > 0 && coupencodeObj.user.length >= maximumUserCount) {
      return res.status(400).json({ error: "Maximum user count reached for this coupencode" });
    }

    // Add the user to the array
    coupencodeObj.user.push(userId);
   
    // Decrease the maximumUserCount by one
    maximumUserCount--;

    // Check if the maximumUserCount has reached zero before expireAt
    
    if (maximumUserCount === 0 && moment().isBefore(coupencodeObj.expireAt)) {
      coupencodeObj.expiration = "true";
    }
    //console.log(coupencodeObj)
    // Update the maximumUserCount in the coupencode
    coupencodeObj.maximumUser = maximumUserCount;
   
    // Save the coupencode
    const updatedCoupencode = await coupencodeObj.save();

    res.status(200).json(updatedCoupencode);
  } catch (error) {
    console.error("Error adding user to coupencode:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
