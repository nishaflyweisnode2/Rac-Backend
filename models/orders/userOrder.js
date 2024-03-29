const mongoose = require("mongoose");
const schema = mongoose.Schema;
const DocumentSchema = schema(
  {
    userId: {
      type: schema.Types.ObjectId,
      ref: "user",
    },
    orderId: {
      type: String,
    },
    Orders: [
      {
        type: schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    address: {
      type: schema.Types.ObjectId,
      ref: "address",
    },
    timeslot: {
      type: schema.Types.ObjectId,
      ref: "timeslot",
    },
    day: {
      type: String,
    },
    discountPrice: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
    totalItem: {
      type: Number,
    },
    paidAmount: {
      type: Number,
      default: 0,
    },
    orderStatus: {
      type: String,
      enum: ["unconfirmed", "confirmed"],
      default: "unconfirmed",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    acceptOrRejected: {
      type: String,
      enum: ["accept", "reject", "pending"],
      default: "pending",
    },
    serviceBoy: {
      type: String,
      required: false,
      default: "",
    },
    serviceJobCard: {
      item: {
        type: String,
        // required: true,
      },
      itemName: {
        type: String,
        // required: true,
      },
      partnerType: {
        type: String,
        // required: true,
      },
      images: {
        type: [String],
        required: true,
      },
      preCheckup: {
        type: String,
        // required: true,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("userOrder", DocumentSchema);
