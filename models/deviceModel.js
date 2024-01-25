const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: [true, "name device Required"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
  },
  images: {
    type: [String],
    required: true,
  },
  status: {
    active: {
      type: Boolean,
      default: false,
    },
    acServiceCheckup: {
      type: Boolean,
      default: false,
    },
    acGasLeakageCheckupStart: {
      type: Boolean,
      default: false,
    },
    pcbCheckupStart: {
      type: Boolean,
      default: false,
    },
    indoorSensorCheckupStart: {
      type: Boolean,
      default: false,
    },
    outdoorSensorCheckupStart: {
      type: Boolean,
      default: false,
    },
    acCompressorCheckup: {
      type: Boolean,
      default: false,
    },
    electricityConsumptionCheckup: {
      type: Boolean,
      default: false,
    },
  },
  suggestions: [
    {
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model("Device", deviceSchema);
