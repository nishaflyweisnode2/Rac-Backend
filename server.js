const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const compression = require("compression");
const serverless = require("serverless-http");
const app = express();
const path = require("path");
app.use(compression({ threshold: 500 }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
if (process.env.NODE_ENV == "production") {
    console.log = function () { };
}

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use('/api/v1/user', require('./routes/user.route'));
app.use('/api/v1/vendor', require('./routes/vendor.routes'));
app.use('/api/v1/admin', require('./routes/admin.route'));
app.use("/api/v1/images", require("./routes/banner"));
app.use("/api/v1/serviceArea",require("./routes/serviceArea"))
app.use("/api/v1/serviceableDist",require("./routes/serviceableDistance"))
app.use("/api/v1/service",require("./routes/service"))
app.use("/api/v1/noti",require("./routes/notifcation"))
app.use("/api/v1/city",require("./routes/selectcity"))
app.use("/api/v1/wallett",require("./routes/wallet"))
app.use("/api/v1/terms",require("./routes/termsAndCondition"))
app.use("/api/v1/privacy",require("./routes/privacyRoute"))
app.use("/api/v1/address",require("./routes/addressRoute"))
app.use("/api/v1/support",require("./routes/supportRoute"))
app.use("/api/v1/subscriptionn",require("./routes/subscription"))
app.use("/api/v1/subsubcategoryy",require("./routes/subsubcategory"))
app.use("/api/v1/offerr",require("./routes/offerRoute"))
app.use("/api/v1/productt",require("./routes/productRoute"))
app.use("/api/v1/coupenn",require("./routes/coupencode"))
app.use("/api/v1/cartAndOrder",require("./routes/cart&order.route"))
app.use("/api/v1/jobportall",require("./routes/job.route"))
app.use("/api/v1/history",require("./routes/paymentRoute"))
app.use("/api/v1/timeslot",require("./routes/timeslotRoute"))
app.use("/api/v1/aboutus",require("./routes/aboutusRoute"))
app.use("/api/v1/device",require("./routes/deviceRoute"))


mongoose.Promise = global.Promise;
mongoose.set("strictQuery", true);

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true, }).then((data) => {
    console.log(`Mongodb connected with server: ${data.connection.host}`);
});

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}!`);
});

module.exports = app;
module.exports.handler = serverless(app)