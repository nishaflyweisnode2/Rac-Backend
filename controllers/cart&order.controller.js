const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authConfig = require("../configs/auth.config");
var newOTP = require("otp-generators");
const User = require("../models/user.model");
const Category = require("../models/CategoryModel");
const banner = require("../models/banner");
const mongoose = require("mongoose");
const PreCheckup = require('../models/preCheckupModel');

// const vendorDetails = require("../models/vendorDetails");
// const Product = require("../models/product.model");

const Product = require("../models/productsModel");

// const Discount = require("../models/discount.model");
// const transaction = require('../models/transactionModel');
// const Wishlist = require("../models/WishlistModel");
// const Address = require("../models/AddressModel");
// const userCard = require("../models/userCard");
// const staticContent = require('../models/staticContent');
// const Faq = require("../models/faq.Model");
// const Cart = require("../models/cartModel");

const Cart = require("../models/cart.model");
const orderModel = require("../models/orders/orderModel");
const userOrder = require("../models/orders/userOrder");
const cancelReturnOrder = require("../models/orders/cancelReturnOrder");
const EndJob = require('../models/orders/endJobModel');


// const cartModel = require("../models/cart.model");
const seviceNameModel = require("../models/service");
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



exports.addToCart = async (req, res) => {
  try {
    console.log("hi");
    const userData = await User.findOne({ _id: req.user.id });
    if (!userData) {
      return res.status(404).send({ status: 404, message: "User not found" });
    } else {
      let findCart = await Cart.findOne({ userId: userData._id });
      if (!findCart) {
        findCart = new Cart({
          userId: userData._id,
          product: [],
          // totalAmountProduct: 0,
          totalItemProduct: 0,
          service: [],
          // totalAmountService: 0,
          totalItemService: 0,
          type: req.body.type,
        });
      }

      if (req.body.type === "service" && findCart.product.length === 0) {
        const findService = await seviceNameModel.findById(req.body.Id);
        if (!findService) {
          return res
            .status(404)
            .send({ status: 404, message: "Service not found" });
        }

        const existingService = findCart.service.find(
          (service) => service.serviceId.toString() === req.body.Id
        );

        if (existingService) {
          existingService.quantity += req.body.quantity;
          // existingService.total =
          //   existingService.servicePrice * existingService.quantity;
        } else {
          const total = findService.price * req.body.quantity;
          const newService = {
            serviceId: findService._id,
            vendorId: findService.vendorId,
            servicePrice: findService.price,
            quantity: req.body.quantity,
            // total: total,
            categoryId: findService.categoryId,
            subCategoryId: findService.subCategoryId,
            subsubCategoryId: findService.subsubCategoryId,
            // cGst: req.body.cGst,
            // sGst: req.body.sGst,
          };
          findCart.service.push(newService);
        }

        // findCart.totalAmountService = findCart.service.reduce(
        //   (total, service) => total + service.total,
        //   0
        // );
        findCart.totalItemService = findCart.service.length;

        await findCart.save();

        return res.status(200).json({
          status: 200,
          message: "Service added to cart successfully.",
          data: findCart,
        });
      }

      if (req.body.type === "product" && findCart.service.length === 0) {
        const findProduct = await Product.findById(req.body.Id);
        if (!findProduct) {
          return res
            .status(404)
            .send({ status: 404, message: "Product not found" });
        }

        const existingProduct = findCart.product.find(
          (product) => product.productId.toString() === req.body.Id
        );

        if (existingProduct) {
          existingProduct.quantity += req.body.quantity;
          // existingProduct.total =
          //   existingProduct.productPrice * existingProduct.quantity;
        } else {
          // const total = findProduct.price * req.body.quantity;
          const newProduct = {
            productId: findProduct._id,
            vendorId: findProduct.vendorId,
            productPrice: findProduct.price,
            productType: findProduct.productType,
            quantity: req.body.quantity,
            // total: total,
            categoryId: findProduct.categoryId,
            subCategoryId: findProduct.subCategoryId,
            subsubCategoryId: findProduct.subsubCategoryId,
            // cGst: req.body.cGst,
            // sGst: req.body.sGst,
          };
          findCart.product.push(newProduct);
        }

        // findCart.totalAmountProduct = findCart.product.reduce(
        //   (total, product) => total + product.total,
        //   0
        // );
        // findCart.totalItemProduct = findCart.product.length;

        await findCart.save();

        return res.status(200).json({
          status: 200,
          message: "Product added to cart successfully.",
          data: findCart,
        });
      }

      return res.status(200).send({
        status: 200,
        message: "Please empty your cart before adding a different item.",
      });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ status: 500, message: "Server error" + error.message });
  }
};

exports.deletesingleProductAndService = async (req, res) => {
  try {
    let cart = [];
    const productId = req.params.productId;

    // Find the index of the product in the cart
    const index = cart.findIndex((item) => item.id === productId);

    if (index !== -1) {
      // Remove the product from the cart
      cart.splice(index, 1);
      res.status(200).json({ message: "Product removed from cart." });
    } else {
      res.status(404).json({ message: "Product not found in cart." });
    }
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred");
  }
};

exports.emptyCart = async (req, res) => {
  try {
    console.log("hi");
    const cart = await Cart.findById({ _id: req.params.id });

    if (!cart) {
      throw new Error("Cart not found");
    }

    if (cart.product.length > 0) {
      cart.product = [];
    }

    if (cart.service.length > 0) {
      cart.service = [];
    }
    if (cart.totalAmountProduct > 0) {
      cart.totalAmountProduct = 0;
    }
    if (cart.totalAmountService > 0) {
      cart.totalAmountService = 0;
    }
    if (cart.totalItemService > 0) {
      cart.totalItemService = 0;
    }

    await cart.save();
    return res
      .status(200)
      .json({ status: 200, message: "Cart emptied successfully", cart });
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred");
  }
};

exports.getCart = async (req, res) => {

  try {
    const userId = req.user.id;

    const userCart = await Cart.findOne({ userId }).populate('product.productId').populate({
      path: 'service.serviceId',
      model: 'seviceName',
    });

    if (!userCart) {
      return res.status(404).json({ message: "Cart not found for the user" });
    }

    let subtotal = 0;
    let totalAmount = 0;

    if (userCart.service && userCart.service.length > 0) {
      subtotal += userCart.service.reduce((acc, service) => {
        service.total = service.quantity * service.servicePrice;
        return acc + service.total;
      }, 0);
    }

    let totalProductAmount = 0;
    if (userCart.product && userCart.product.length > 0) {
      totalProductAmount = userCart.product.reduce((acc, product) => {
        product.total = product.quantity * product.productPrice;
        return acc + product.total;
      }, 0);
    }

    const gstPercentage = 18;
    const gstAmount = (gstPercentage / 100) * totalProductAmount;

    totalAmount = subtotal + gstAmount;

    userCart.subtotal = subtotal;
    userCart.gst = gstAmount;
    userCart.totalAmount = totalAmount;
    await userCart.save();

    return res.status(200).json({
      message: "User cart retrieved successfully",
      cart: {
        ...userCart.toObject(),
        subtotal,
        gst: gstAmount,
        totalAmount,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.checkout = async (req, res) => {
  try {
    let findCart = await Cart.findOne({ userId: req.user._id });

    if (findCart) {
      let orderId = await reffralCode();

      for (const product of findCart.product) {
        const orderObj = {
          orderId: orderId,
          userId: findCart.userId,
          category: product.category,
          productId: product.productId,
          productPrice: product.productPrice,
          quantity: product.quantity,
          total: product.total,
          paidAmount: product.paidAmount,
          cGst: product.cGst,
          sGst: product.sGst,
          timeslot: req.body.timeslot,
          address: req.body.address,
          day: req.body.day,
        };

        const createdOrder = await orderModel.create(orderObj);

        if (createdOrder) {
          await updateUserOrder(
            findCart.userId,
            orderId,
            createdOrder._id,
            req.body
          );
        }
      }

      for (const service of findCart.service) {
        const orderObj = {
          orderId: orderId,
          userId: findCart.userId,
          categoryId: service.categoryId,
          subCategoryId: service.subCategoryId,
          subsubCategoryId: service.subsubCategoryId,
          serviceId: service.serviceId,
          servicePrice: service.servicePrice,
          cGst: service.cGst,
          sGst: service.sGst,
          quantity: service.quantity,
          total: service.total,
          timeslot: req.body.timeslot,
          address: req.body.address,
          day: req.body.day,
        };

        const createdOrder = await orderModel.create(orderObj);

        if (createdOrder) {
          await updateUserOrder(
            findCart.userId,
            orderId,
            createdOrder._id,
            req.body
          );
        }
      }

      let findUserOrder = await userOrder
        .findOne({ orderId: orderId })
        .populate("Orders");
      res.status(200).json({
        status: 200,
        message: "Order created successfully.",
        data: findUserOrder,
      });
    } else {
      res
        .status(404)
        .json({ status: 404, message: "Cart not found", data: {} });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: 500, message: "Server error.", data: {} });
  }
};

async function updateUserOrder(userId, orderId, orderIdToUpdate, requestBody) {
  let findUserOrder = await userOrder.findOne({ orderId: orderId });

  if (findUserOrder) {
    await userOrder.findByIdAndUpdate(
      { _id: findUserOrder._id },
      { $push: { Orders: orderIdToUpdate } },
      { new: true }
    );
  } else {
    let Orders = [];
    Orders.push(orderIdToUpdate);
    let obj1 = {
      userId: userId,
      orderId: orderId,
      Orders: Orders,
      timeslot: requestBody.timeslot,
      address: requestBody.address,
      total: requestBody.total,
      paidAmount: requestBody.paidAmount,
      totalItem: requestBody.totalItem,
      day: requestBody.day,
    };
    await userOrder.create(obj1);
  }
}

exports.placeOrder = async (req, res) => {
  try {
    let findUserOrder = await userOrder.findOne({
      orderId: req.params.orderId,
    });

    if (findUserOrder) {
      if (req.body.paymentStatus == "paid") {
        let updatedUserOrder = await userOrder.findByIdAndUpdate(
          { _id: findUserOrder._id },
          { $set: { orderStatus: "confirmed", paymentStatus: "paid" } },
          { new: true }
        );

        if (
          updatedUserOrder &&
          updatedUserOrder.Orders &&
          updatedUserOrder.Orders.length > 0
        ) {
          for (let i = 0; i < updatedUserOrder.Orders.length; i++) {
            let updatedOrder = await orderModel.findByIdAndUpdate(
              { _id: updatedUserOrder.Orders[i]._id },
              { $set: { orderStatus: "confirmed", paymentStatus: "paid" } },
              { new: true }
            );

            console.log(updatedOrder);

            if (
              updatedOrder &&
              updatedOrder.serviceId &&
              Array.isArray(updatedOrder.serviceId)
            ) {
              for (let j = 0; j < updatedOrder.serviceId.length; j++) {
                let updatedService = await seviceNameModel.findByIdAndUpdate(
                  { _id: updatedOrder.serviceId.noOfBook },
                  { $inc: { noOfBook: 1 } },
                  { new: true }
                );

                console.log(updatedService);
              }
            }
          }

          res.status(200).json({
            message: "Payment success.",
            status: 200,
            data: updatedUserOrder,
          });
        } else {
          return res
            .status(404)
            .json({ message: "No order data found", data: {} });
        }
      } else if (req.body.paymentStatus == "failed") {
        res.status(201).json({
          message: "Payment failed.",
          status: 201,
          orderId: req.params.orderId,
        });
      }
    } else {
      return res.status(404).json({ message: "No data found", data: {} });
    }
  } catch (error) {
    console.error("Error in placeOrder:", error);
    res.status(501).send({ status: 501, message: "server error.", data: {} });
  }
};

exports.cancelReturnOrder = async (req, res, next) => {
  try {
    const orders = await orderModel.findById({ _id: req.params.id });
    if (!orders) {
      return res
        .status(404)
        .json({ status: 404, message: "Orders not found", data: {} });
    } else {
      let obj = {
        userId: orders.userId,
        vendorId: orders.vendorId,
        Orders: orders._id,
        reason: req.body.reason,
        orderStatus: req.body.orderStatus,
      };
      const data = await cancelReturnOrder.create(obj);
      let update = await orderModel
        .findByIdAndUpdate(
          { _id: orders._id },
          {
            $set: { returnOrder: data._id, returnStatus: req.body.orderStatus },
          },
          { new: true }
        )
        .populate("returnOrder");
      if (update) {
        res.status(200).json({
          message: `Order ${req.body.orderStatus} Successfully.`,
          status: 200,
          data: update,
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(501).send({ status: 501, message: "server error.", data: {} });
  }
};
exports.updateStatus = async (req, res, next) => {
  try {
    console.log("Updating status for order...");

    const orderId = req.params.orderId;
    const serviceBoy = req.user.id;
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: 'Invalid orderId' });
    }
    let order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    order.serviceBoy = serviceBoy;
    order.acceptOrRejected = "accept";

    console.log("Saving updated order...", order);
    let updatedOrder = await orderModel.findByIdAndUpdate({ _id: orderId }, { $set: { serviceBoy: serviceBoy, acceptOrRejected: "accept" } }, { new: true });
    console.log("Order updated successfully.");

    return res.status(200).json({ message: "Order accepted successfully", order: updatedOrder }); // Return the updated order
  } catch (error) {
    console.error("Error updating order:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


//   try {
//     const orderId = req.params.orderId;
//     const vendorId=req.user.id;
//     console.log("hi");
//     console.log(orderId);
//     const order = await orderModel.findOne({ _orderId: orderId });
// console.log(order);
//     if (!order) {
//       return res.status(404).json({ status: 404, message: "Order not found", data: {} });
//     }

//     if (order.acceptOrRejected === "accept") {
//       return res.status(400).json({ status: 400, message: "Order has already been accepted" });
//     }
//     let update = await orderModel.findByIdAndUpdate(
//       { _orderId: req.params._orderId },
//       {  vendor: vendorId,
//         acceptOrRejected: req.body.acceptOrRejected,
//       },
//       { new: true }
//     );
//     if (update) {
//       res.status(200).send({
//         status: 200,
//         message: "Status updated successfully.",
//         data: update,
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .send({ status: 500, message: "Server error" + error.message });
//   }
// };
exports.updateStartTime = async (req, res, next) => {
  try {
    const orders = await orderModel.findOne({ _id: req.params.id });
    if (!orders) {
      return res
        .status(404)
        .json({ status: 404, message: "Orders not found", data: {} });
    }
    const otp = newOTP.generate(4, {
      alphabets: false,
      upperCase: false,
      specialChar: false,
    });
    const otpExpiration = new Date(Date.now() + 5 * 60 * 1000);
    const accountVerification = false;

    let update = await orderModel.findByIdAndUpdate(
      { _id: req.params.id },
      {
        startTime: req.body.startTime,
        otp: otp,
        otpExpiration: otpExpiration,
        accountVerification: accountVerification,
      },
      { new: true }
    );
    let obj = {
      id: update._id,
      otp: update.otp,
      startTime: req.body.startTime,
    };
    return res.status(200).send({ status: 200, message: "OTP", data: obj });
    if (update) {
      res.status(200).send({
        status: 200,
        message: "otp send successfully.",
        data: update,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ status: 500, message: "Server error" + error.message });
  }
};
exports.updateEndTime = async (req, res, next) => {
  try {
    const orders = await orderModel.findOne({ _id: req.params.id });
    if (!orders) {
      return res
        .status(404)
        .json({ status: 404, message: "Orders not found", data: {} });
    }
    const otp = newOTP.generate(4, {
      alphabets: false,
      upperCase: false,
      specialChar: false,
    });
    const otpExpiration = new Date(Date.now() + 5 * 60 * 1000);
    const accountVerification = false;

    let update = await orderModel.findByIdAndUpdate(
      { _id: req.params.id },
      {
        endTime: req.body.endTime,
        otp: otp,
        otpExpiration: otpExpiration,
        accountVerification: accountVerification,
      },
      { new: true }
    );
    let obj = {
      id: update._id,
      otp: update.otp,
      endTime: req.body.endTime,
    };
    return res.status(200).send({ status: 200, message: "OTP", data: obj });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: 500, message: "Server error" + error.message });
  }
};
exports.verifyOtpOfPartner = async (req, res) => {
  try {
    const { otp } = req.body;
    const user = await orderModel.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ message: "user not found" });
    }
    if (user.otp !== otp || user.otpExpiration < Date.now()) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    const updated = await orderModel.findByIdAndUpdate(
      { _id: user._id },
      { accountVerification: true },
      { new: true }
    );
    // const accessToken = jwt.sign({ id: user._id }, authConfig.secret, {
    //   expiresIn: authConfig.accessTokenTime,
    // });
    let obj = {
      id: updated._id,
      otp: updated.otp,
      // phone: updated.phone,
      // accessToken: accessToken,
    };
    return res
      .status(200)
      .send({ status: 200, message: "logged in successfully", data: obj });
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .send({ error: "internal server error" + err.message });
  }
};
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await userOrder
      .find({ orderStatus: "confirmed" })
      .populate("Orders");
    if (orders.length == 0) {
      return res
        .status(404)
        .json({ status: 404, message: "Orders not found", data: {} });
    }
    return res
      .status(200)
      .json({ status: 200, msg: "orders of user", data: orders });
  } catch (error) {
    console.log(error);
    res.status(501).send({ status: 501, message: "server error.", data: {} });
  }
};
exports.getOrders = async (req, res, next) => {
  try {
    const orders = await orderModel
      .find({ userId: req.user._id })
      .populate("userId")
      .populate("address")
      .populate("timeslot")
      .populate("serviceId");

    if (orders.length === 0) {
      return res
        .status(404)
        .json({ status: 404, message: "Orders not found", data: {} });
    }

    return res
      .status(200)
      .json({ status: 200, message: "Orders of the user", data: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Server error", data: {} });
  }
};
exports.getserviceOrder = async (req, res, next) => {
  try {
    const orders = await orderModel
      .find({
        userId: req.user._id,
        serviceId: { $exists: true }, // Check if serviceId exists in the order
      })
      .populate("serviceId");

    if (orders.length === 0) {
      return res
        .status(404)
        .json({ status: 404, message: "Service orders not found", data: {} });
    }

    return res.status(200).json({
      status: 200,
      message: "Service orders of the user",
      data: orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Server error", data: {} });
  }
};
exports.getproductOrder = async (req, res, next) => {
  try {
    const orders = await orderModel
      .find({
        userId: req.user._id,
        productId: { $exists: true }, // Check if serviceId exists in the order
      })
      .populate("productId");

    if (orders.length === 0) {
      return res
        .status(404)
        .json({ status: 404, message: "Service orders not found", data: {} });
    }

    return res.status(200).json({
      status: 200,
      message: "Service orders of the user",
      data: orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Server error", data: {} });
  }
};
exports.getcancelReturnOrder = async (req, res, next) => {
  try {
    const orders = await cancelReturnOrder
      .find({ userId: req.user._id })
      .populate("Orders");
    if (orders.length == 0) {
      return res
        .status(404)
        .json({ status: 404, message: "Orders not found", data: {} });
    }
    return res
      .status(200)
      .json({ status: 200, msg: "orders of user", data: orders });
  } catch (error) {
    console.log(error);
    res.status(501).send({ status: 501, message: "server error.", data: {} });
  }
};
exports.getOrderbyId = async (req, res, next) => {
  try {
    const orders = await orderModel
      .findById({ _id: req.params.id })
      .populate("userId")
      .populate("address")
      .populate("timeslot")
      .populate("serviceId");
    if (!orders) {
      return res
        .status(404)
        .json({ status: 404, message: "Orders not found", data: {} });
    }
    return res
      .status(200)
      .json({ status: 200, msg: "orders of user", data: orders });
  } catch (error) {
    console.log(error);
    res.status(501).send({ status: 501, message: "server error.", data: {} });
  }
};
exports.allTransactionUser = async (req, res) => {
  try {
    const data = await transaction
      .find({ user: req.user._id })
      .populate("user orderId");
    res.status(200).json({ data: data });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
exports.allcreditTransactionUser = async (req, res) => {
  try {
    const data = await transaction.find({ user: req.user._id, type: "Credit" });
    res.status(200).json({ data: data });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
exports.allDebitTransactionUser = async (req, res) => {
  try {
    const data = await transaction.find({ user: req.user._id, type: "Debit" });
    res.status(200).json({ data: data });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
const reffralCode = async () => {
  var digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let OTP = "";
  for (let i = 0; i < 9; i++) {
    OTP += digits[Math.floor(Math.random() * 36)];
  }
  return OTP;
};

exports.missed = async (req, res, next) => {
  try {
    // Get the ID of the logged-in vendor
    const loggedInVendorId = req.user.id; // Adjust this based on your authentication setup
    console.log(loggedInVendorId);
    const rejectedJobs = await orderModel
      .find({
        // acceptOrRejected: 'pending',
        rejectedByVendors: loggedInVendorId, // Check if the logged-in vendor has rejected the job
      })
      .populate("serviceId");

    console.log(rejectedJobs);
    res.status(200).json({ rejectedJobs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching rejected jobs" });
  }
};

exports.allNewOrders = async (req, res) => {
  console.log("hi");
  try {
    // Get the ID of the logged-in vendor
    const loggedInVendorId = req.user.id; // Adjust this based on your authentication setup
    console.log(loggedInVendorId);
    // Find orders that are pending and were not rejected by the logged-in vendor
    const pendingOrders = await orderModel
      .find({
        acceptOrRejected: "pending",
        orderStatus: "unconfirmed",
        rejectedByVendors: { $nin: [loggedInVendorId] }, // Exclude orders rejected by the logged-in vendor
      })
      .populate("serviceId").populate("address").populate("timeslot").populate("userId");

    return res.status(200).json({
      success: true,
      count: pendingOrders.length,
      data: pendingOrders,
    });
  } catch (error) {
    // Handle errors
    console.error(error);
    return res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// try {
//   const pendingOrders = await orderModel.find({ acceptOrRejected: 'pending' }).populate('serviceId');;

//   return res.status(200).json({
//     success: true,
//     count: pendingOrders.length,
//     data: pendingOrders,
//   });
// } catch (error) {
//   // Handle errors
//   console.error(error);
//   return res.status(500).json({
//     success: false,
//     error: 'Server error',
//   });
// }
// };
exports.ongoingJob = async (req, res, next) => {
  try {
    const serviceBoy = req.params.vendorId;
    console.log("serviceBoy", serviceBoy);
    // Check if the vendor exists in the database
    const boy = await User.findById(serviceBoy);

    if (!boy) {
      return res.status(404).json({
        success: false,
        error: "serviceBoy not found",
      });
    }
    // Find ongoing orders for the specified vendor with "acceptOrRejected" status set to "accept"
    const ongoingOrders = await orderModel
      .find({
        serviceBoy: boy,
        acceptOrRejected: "accept",
      })
      .populate("serviceId").populate("address").populate("timeslot").populate("userId");

    if (ongoingOrders.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No ongoing orders found for this vendor",
      });
    }

    return res.status(200).json({
      success: true,
      count: ongoingOrders.length,
      data: ongoingOrders,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

exports.cancelJob = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;

    // Find the order by ID
    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // // Check if the order belongs to the vendor
    // if (order.vendor.toString() !== req.user._id.toString()) {
    //   return res.status(403).json({ message: "You are not authorized to cancel this order" });
    // }

    // Update the order status to 'pending' and remove the vendor ID
    order.acceptOrRejected = "pending";
    order.serviceBoy = null; // Remove the vendor ID from the order

    // Save the updated order
    await order.save();

    return res
      .status(200)
      .json({ message: "Order canceled successfully", order });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.rejectJob = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;

    // Find the job by ID
    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "order not found" });
    }

    // // Check if the job's vendor matches the vendor rejecting the job
    // if (job.vendor.toString() !== req.user._id.toString()) {
    //   return res.status(403).json({ message: "You are not authorized to reject this job" });
    // }

    // Update the job's status to "rejected" or another appropriate status
    // job.status = "rejected";

    // Push the ID of the vendor who rejected the job into the rejectedByVendors array
    order.rejectedByVendors.push(req.user._id);

    // Save the updated job
    await order.save();

    return res
      .status(200)
      .json({ message: "Job rejected successfully", order });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getJobHistory = async (req, res) => {
  try {
    const vendorId = req.params.vendorId; // Extract the vendor ID from the URL

    // Find orders that match the vendor ID and have a deliveryStatus of "delivered"
    const jobHistory = await orderModel.find({
      serviceBoy: vendorId,
      deliveryStatus: "delivered",
    });

    // If there are no matching orders, return a response with a message
    if (jobHistory.length === 0) {
      return res
        .status(200)
        .json({ message: "No job history found", jobHistory: [] });
    }

    // If matching orders are found, return them as a JSON response
    return res
      .status(200)
      .json({ message: "Job history retrieved successfully", jobHistory });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.deliverStatus = async (req, res, next) => {
  const orderId = req.params.orderId;

  try {
    // Find the order by ID
    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Update the order status to "delivered"
    order.deliveryStatus = "delivered";

    // Save the updated order
    await order.save();

    res.json({
      success: true,
      message: 'Order status updated to "delivered"',
      order,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.increaseServiceQuantity = async (req, res) => {

  try {
    // Assuming user ID is available in req.user.id
    const userId = req.user.id;

    // Find the user's cart
    const userCart = await Cart.findOne({ userId });
    console.log();
    if (!userCart) {
      return res.status(404).json({ message: "Cart not found for the user" });
    }

    const itemId = req.params.itemId;

    // Determine whether it's a service or product based on the structure of the cart
    const isService = userCart.service.some((item) => item.serviceId.toString() === itemId);
    const isProduct = userCart.product.some((item) => item.productId.toString() === itemId);

    if (!isService && !isProduct) {
      return res.status(404).json({ message: "Item not found in the cart" });
    }

    // Increase the quantity of the item
    if (isService) {
      const serviceIndex = userCart.service.findIndex((item) => item.serviceId.toString() === itemId);
      userCart.service[serviceIndex].quantity += 1;
    } else if (isProduct) {
      const productIndex = userCart.product.findIndex((item) => item.productId.toString() === itemId);
      userCart.product[productIndex].quantity += 1;
    }

    // Save the changes
    const updatedCart = await userCart.save();

    return res.status(200).json({
      message: "Item quantity increased successfully",
      cart: updatedCart,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.decrementServiceQuantity = async (req, res) => {

  try {
    // Assuming user ID is available in req.user.id
    const userId = req.user.id;

    // Find the user's cart
    const userCart = await Cart.findOne({ userId });

    if (!userCart) {
      return res.status(404).json({ message: "Cart not found for the user" });
    }

    const itemId = req.params.itemId;

    // Determine whether it's a service or product based on the structure of the cart
    const isService = userCart.service.some((item) => item.serviceId.toString() === itemId);
    const isProduct = userCart.product.some((item) => item.productId.toString() === itemId);

    if (!isService && !isProduct) {
      return res.status(404).json({ message: "Item not found in the cart" });
    }

    // Decrease the quantity of the item
    if (isService) {
      const serviceIndex = userCart.service.findIndex((item) => item.serviceId.toString() === itemId);

      if (userCart.service[serviceIndex].quantity > 1) {
        userCart.service[serviceIndex].quantity -= 1;
      } else {
        return res.status(400).json({ message: "Quantity cannot be less than 1" });
      }
    } else if (isProduct) {
      const productIndex = userCart.product.findIndex((item) => item.productId.toString() === itemId);

      if (userCart.product[productIndex].quantity > 1) {
        userCart.product[productIndex].quantity -= 1;
      } else {
        return res.status(400).json({ message: "Quantity cannot be less than 1" });
      }
    }

    // Save the changes
    const updatedCart = await userCart.save();

    return res.status(200).json({
      message: "Item quantity decreased successfully",
      cart: updatedCart,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.jobCard = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found", orderId });
    }

    upload.array("images")(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ msg: err.message });
      }

      let imagePaths = [];

      if (Array.isArray(req.files)) {
        for (let i = 0; i < req.files.length; i++) {
          imagePaths.push(req.files[i] ? req.files[i].path : "");
        }
      } else {
        imagePaths.push(req.files ? req.files.path : "");
      }

      const {otp, item, itemName, partnerType, capacity, regNo, otherDetails, workDone, preCheckup } = req.body;

      if (preCheckup && preCheckup.length > 0) {
        const invalidPreCheckups = await PreCheckup.find({
          _id: preCheckup,
        });
        console.log("invalidPreCheckups", invalidPreCheckups);
        if (!invalidPreCheckups) {
          return res.status(404).json({
            success: false,
            message: "Invalid Pre-checkup IDs",
            invalidPreCheckups: invalidPreCheckups.map(pc => pc._id),
          });
        }
      }

      order.serviceJobCard = {
        otp,
        item,
        itemName,
        partnerType,
        images: imagePaths,
        preCheckup,
        capacity,
        regNo,
        otherDetails,
        workDone,
      };

      const updatedOrder = await order.save();

      res.status(201).json({
        message: "Service Job Card added successfully",
        order: updatedOrder,
      });
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.endJobCard = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const { quantity, EndCheckup } = req.body;

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found", orderId });
    }

    const endJob = await EndJob.findById(EndCheckup);
    if (!endJob) {
      return res.status(404).json({ message: "End Job not found", EndCheckup });
    }

    const endJobTotalPrice = endJob.price * quantity;

    order.total += endJobTotalPrice;

    order.serviceJobCard = {
      quantity,
      EndCheckup,
    };

    const updatedOrder = await order.save();

    res.status(201).json({
      message: "Service Job Card added successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


exports.navigate = async (req, res) => {
  try {
    const { userAddress, servicePersonAddress, apiKey } = req.body;

    // Get coordinates for user's address
    const userCoordinates = await getCoordinates(userAddress);

    if (!userCoordinates) {
      return res.json({ success: false, message: "User location not found" });
    }

    // Get coordinates for service person's address
    const servicePersonCoordinates = await getCoordinates(servicePersonAddress);

    if (!servicePersonCoordinates) {
      return res.json({
        success: false,
        message: "Service person location not found",
      });
    }

    // Calculate the route between user and service person
    const route = await getRoute(
      userCoordinates,
      servicePersonCoordinates,
      apiKey
    );

    res.json({ success: true, route });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
