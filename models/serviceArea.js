const mongoose = require("mongoose");

const seviceAreaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "service Required"],
    },
});

module.exports = mongoose.model("seviceArea", seviceAreaSchema);
