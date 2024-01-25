const mongoose = require("mongoose");

const subsubcategorySchema = new mongoose.Schema({
    name: {
        type: String,
    },
    categoryId: {
        type: mongoose.Schema.ObjectId,
        ref: "Category",
    },
    subCategoryId:{
        type: mongoose.Schema.ObjectId,
        ref: "subCategory",        
    },
    vendorId:{
        type: mongoose.Schema.ObjectId,
        ref: "user",
    },
    image: {
        type: String,
        default:
          "https://static.vecteezy.com/system/resources/thumbnails/008/154/360/small/student-logo-vector.jpg",
      },
    status: {
        type: String,
        enum: ["Active", "Block"],
        default: "Active"
    },
});

module.exports = mongoose.model("subsubcategory", subsubcategorySchema);
