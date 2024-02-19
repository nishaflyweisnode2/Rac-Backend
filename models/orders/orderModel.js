const mongoose = require("mongoose");
const schema = mongoose.Schema;
const DocumentSchema = schema({
  vendor: {
    type: String
  },
  userId: {
    type: schema.Types.ObjectId,
    ref: "user"
  },
  vendorId: {
    type: schema.Types.ObjectId,
    ref: "user",
  },
  category: {
    type: schema.Types.ObjectId,
    ref: "Category",
  },
  productId: {
    type: schema.Types.ObjectId,
    ref: "Product"
  },
  serviceBoy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",

  },
  rejectedByVendors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  productPrice: {
    type: Number
  },
  quantity: {
    type: Number,
    default: 1
  },
  cGst: {
    type: Number,
  },
  sGst: {
    type: Number,
  },
  total: {
    type: Number,
    default: 0
  },
  paidAmount: {
    type: Number,
    default: 0
  },
  address: {
    type: schema.Types.ObjectId,
    ref: "address"
  },
  timeslot: {
    type: schema.Types.ObjectId,
    ref: "timeslot"
  },
  day: {
    type: String,
  },
  vendorIdService: {
    type: schema.Types.ObjectId,
    ref: "user",
  },
  categoryId: {
    type: mongoose.Schema.ObjectId,
    ref: "Category",
  },
  subCategoryId: {
    type: mongoose.Schema.ObjectId,
    ref: "subCategory",
  },
  subsubCategoryId: {
    type: mongoose.Schema.ObjectId,
    ref: "subsubcategory",
  },
  serviceId: {
    type: schema.Types.ObjectId,
    ref: "seviceName",
  },
  servicePrice: {
    type: Number,
  },
  cGstService: {
    type: Number,
  },
  sGstService: {
    type: Number,
  },
  quantityService: {
    type: Number,
    default: 1,
  },
  totalService: {
    type: Number,
    default: 0,
  },
  paidAmountService: {
    type: Number,
    default: 0
  },
  address: {
    type: schema.Types.ObjectId,
    ref: "address"
  },
  timeslot: {
    type: schema.Types.ObjectId,
    ref: "timeslot"
  },
  day: {
    type: String,
  },
  userPhone: {
    type: String,
  },
  pickUpaddress: {
    street1: {
      type: String,
    },
    street2: {
      type: String
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String
    }
  },
  pickUpInstruction: {
    type: String,
  },
  deliveryInstruction: {
    type: String,
  },
  courierWithBag: {
    type: Boolean,
    default: false
  },
  notificationRecipent: {
    type: Boolean,
    default: false
  },
  discountId: {
    type: schema.Types.ObjectId,
    ref: "discount"
  },
  parcelValue: {
    type: Number,
    default: 0
  },
  yourPhone: {
    type: String,
  },
  vendorPhone: {
    type: String,
  },
  sending: {
    type: String,
  },
  orderStatus: {
    type: String,
    enum: ["unconfirmed", "confirmed", "unconfirme"],
    default: "unconfirmed",
  },
  returnStatus: {
    type: String,
    enum: ["return", "cancel", ""],
    default: ""
  },
  returnOrder: {
    type: schema.Types.ObjectId,
    ref: "cancelReturnOrder",
  },
  paymentType: {
    type: String,
    enum: ["Online", "Cash"],
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending"
  },
  orderType: {
    type: String,
    enum: ["Package", "Other"],
    default: "Other"
  },
  preparingStatus: {
    type: String,
    enum: ["New", "Preparing", "Ready", "out_for_delivery", "delivered", ""],
    default: "New"
  },
  deliveryStatus: {
    type: String,
    enum: ["assigned", "out_for_delivery", "delivered", ""],
    default: ""
  },
  acceptOrRejected: {
    type: String,
    enum: ["accept", "reject", "pending"],
    default: "pending"
  },
  startTime: {
    type: String,
    default: ""
  },
  endTime: {
    type: String,
    default: ""
  },
  otp: {
    type: Number,
    default: ""
  },
  otpExpiration: {
    type: Date,
  },
  accountVerification: {
    type: Boolean,
    default: false,
  },
  serviceJobCard: {
    item: {
      type: String,
    },
    itemName: {
      type: String,
    },
    partnerType: {
      type: String,
    },
    images: {
      type: [String],
    },
    capacity: {
      type: String,
    },
    regNo: {
      type: String,
    },
    otherDetails: {
      type: String,
    },
    preCheckup: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PreCheckup",
      },
    ],
    workDone: {
      type: String,
    },
    EndCheckup: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "EndJob",
      },
    ],
    quantity: {
      type: Number,
    },
  },
  newService: {
    serviceName: {
      type: String,
    },
    price: {
      type: Number,
      default: 0
    }
  },
}, { timestamps: true })
module.exports = mongoose.model("Order", DocumentSchema);