const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
    },
    categoryId: {
        type: mongoose.Schema.ObjectId,
        ref: "Category",
    },
    image: {
        type: String,
      },
    status: {
        type: String,
        enum: ["Active", "Block"],
        default: "Active"
    },
});

module.exports = mongoose.model("subCategory", categorySchema);
