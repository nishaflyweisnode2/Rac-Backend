const mongoose = require("mongoose");
const schema = mongoose.Schema;
const DocumentSchema = schema(
  {
    userId: {
      type: schema.Types.ObjectId,
      ref: "user",
    },
    product: [
      {
        vendorId: {
          type: schema.Types.ObjectId,
          ref: "user",
        },
        productType: {
          type: String,
          default: "",
        },
        productId: {
          type: schema.Types.ObjectId,
          ref: "Product",
        },
        productPrice: {
          type: Number,
          default:0
        },
        cGst: {
          type: Number,
        },
        sGst: {
          type: Number,
        },
        quantity: {
          type: Number,
          default: 1,
        },
        total: {
          type: Number,
          default: 0,
        },
      },
    ],
    totalAmountProduct: {
      type: Number,
      default: 0,
    },
    paidAmountProduct: {
      type: Number,
      default: 0,
    },
    totalItemProduct: {
      type: Number,
      default:0
    },
    service: [
      {
        vendorId: {
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
        cGst: {
          type: Number,
        },
        sGst: {
          type: Number,
        },
        quantity: {
          type: Number,
          default: 1,
        },
        total: {
          type: Number,
          default: 0,
        },
      },
    ],
    totalAmountService: {
      type: Number,
      default: 0,
    },
    paidAmountService: {
      type: Number,
      default: 0,
    },
    totalItemService: {
      type: Number,
      default:0
    },
    type:{
         type:String,
         enum:["service","product",""],
         default:""
    }
  },
  { timestamps: true }
);


module.exports = mongoose.model("cart", DocumentSchema);
