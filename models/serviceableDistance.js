const mongoose = require("mongoose");

const seviceDistSchema = new mongoose.Schema({
    value: {
        type: String,
        required: [true, "service Required"],
    },
    type:{
        type:String,
        default:"km"
    }
   
});

module.exports = mongoose.model("seviceDist", seviceDistSchema);
