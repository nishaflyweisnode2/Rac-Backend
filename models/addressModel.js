const mongoose = require("mongoose");
const schema = mongoose.Schema;
const addressSchema = mongoose.Schema({
    userId: {
        type: schema.Types.ObjectId,
        ref: "user",
      },
    name: String,
    email: String,
    mobile: String,
    altMobile: String,
    pncode: String,
    state: String,
    city: String,
    house: String, landmark: String,
    street: String,
    city: String,
    country: String
})



const address  = mongoose.model('address', addressSchema);

module.exports = address;