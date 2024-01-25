const mongoose = require("mongoose");
const objectId = mongoose.Types.ObjectId;
const offerSchema = mongoose.Schema({
  title: {
    type: String,
    default: "",
  },
  service: [
    {
      serviceId: {
        type: objectId,
        ref: "seviceName",
      },
      price: {
        type: Number,
        default: 0,
      },
    },
  ],
});
const offerModel = mongoose.model("offer", offerSchema);

module.exports = offerModel;
