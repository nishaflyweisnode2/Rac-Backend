const mongoose = require("mongoose");
const objectId = mongoose.Types.ObjectId;
const jobSchema = mongoose.Schema({
  orderid: {
    type: objectId,
    ref: "Order",
  },
  vendorIdService: {
    type: objectId,
    ref: "user",
  },
  partnerName:{
    type:String,
    default:""
  },
  item:{
    type:String,
    default:""
  },
  itemType:{
    type:String,
    default:""
  },
  Capacity:{
    type:String,
    default:""
  },
  RegNo:{
    type:String,
    default:""
  },
  otherDetail:{
    type:String,
    default:""
  },
  images:{
    type:Array
  },
  precheckUp:{
    condenserCoilCheck:{
        type:String,
        default:""
    },
    gasLeakageCheck:{
        type:String,
        default:""
    },
    compressorCheck:{
        type:String,
        default:""
    }
  }
});
const jobModel = mongoose.model("job", jobSchema);

module.exports = jobModel;
