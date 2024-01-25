const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
    message: {
        type: String, 
    },
    image: {
    type: String,
    default:
      "https://static.vecteezy.com/system/resources/thumbnails/008/154/360/small/student-logo-vector.jpg",
  },
  title:{
    type:String,
    default:""
  }
 
},{timestamps:true})


module.exports = mongoose.model('notify', notificationSchema);


