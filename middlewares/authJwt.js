const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const authConfig = require("../configs/auth.config");

const verifyToken = (req, res, next) => {
  const token =
    req.get("Authorization")?.split("Bearer ")[1] ||
    req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "no token provided! Access prohibited",
    });
  }

  jwt.verify(token, authConfig.secret, async (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).send({
          message: "Token expired",
        });
      }
      console.log(err);
      return res.status(401).send({
        message: "UnAuthorised !",
      });
    }
    const user = await User.findOne({ _id: decoded.id, userType: "USER" });
    const user1 = await User.findOne({ _id: decoded.id, userType: "USER" });
    if (!user && !user1) {
      return res.status(400).send({
        message: "The USER that this token belongs to does not exist",
      });
    }
    req.user = user || user1;
    next();
  });
};
const vendorverifyToken = (req, res, next) => {
  const token =
    req.get("Authorization")?.split("Bearer ")[1] ||
    req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "no token provided! Access prohibited",
    });
  }

  jwt.verify(token, authConfig.secret, async (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).send({
          message: "Token expired",
        });
      }
      console.log(err);
      return res.status(401).send({
        message: "UnAuthorised !",
      });
    }
    const user = await User.findOne({ _id: decoded.id, userType: "VENDOR" });
    const user1 = await User.findOne({ _id: decoded.id, userType: "VENDOR" });
    if (!user && !user1) {
      return res.status(400).send({
        message: "The VENDOR that this token belongs to does not exist",
      });
    }
    req.user = user || user1;
    next();
  });
};


const isAdmin = async (req, res, next) => {
  const token =
    req.headers["x-access-token"] ||
    req.get("Authorization")?.split("Bearer ")[1];

  if (!token) {
    return res.status(403).send({
      message: "No token provided! Access prohibited",
    });
  }

  try {
    const decoded = await jwt.verify(token, authConfig.secret);

    if (!decoded) {
      return res.status(401).send({
        message: "Unauthorized! Admin role is required!",
      });
    }

    const user = await User.findOne({ _id: decoded.id });

    if (!user) {
      return res.status(400).send({
        message: "The admin that this token belongs to does not exist",
      });
    }

    const isAdmin = user.userType === "ADMIN";

    if (!isAdmin) {
      return res.status(403).send({
        message: "You are not an admin",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).send({
        message: "Token expired",
      });
    } else {
      return res.status(401).send({
        message: "Unauthorized",
      });
    }
  }
};


module.exports = {
  verifyToken,
  vendorverifyToken,
  isAdmin,
};
