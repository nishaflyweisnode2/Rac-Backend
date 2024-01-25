const mongoose = require("mongoose");

const seviceNameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default:
      "https://res.cloudinary.com/dbrvq9uxa/image/upload/v1696661430/images/image/iehbvj6rbdwazp6yvrl7.jpg",
  },
  categoryId: {
    type: mongoose.Schema.ObjectId,
    ref: "Category",
  },
  subCategoryId: {
    type: mongoose.Schema.ObjectId,
    ref: "subCategory",
  },
  feature: [String],

  subsubCategoryId: {
    type: mongoose.Schema.ObjectId,
    ref: "subsubcategory",
  },
  vendorId: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
  },
  status: {
    type: String,
    enum: ["Active", "Block"],
    default: "Active",
  },
  price: {
    type: Number,
    default: 0,
  },
  descriptions: [{
    type: String,
    required: true,
  }],
  items: [
    {
      name: {
        type: String,
        required: true,
      },

      cost: {
        type: Number,
        default: 0,
      },
      serviceCharges: {
        type: Number,
        default: 0,
      },
    },
  ],
});

module.exports = mongoose.model("seviceName", seviceNameSchema);
