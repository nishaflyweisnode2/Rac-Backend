const jobModel = require("../models/job.model");
const User = require("../models/user.model");
const orderModel = require("../models/orders/orderModel");

exports.getallJobs = async (req, res) => {
  try {
    const jobs = await jobModel.find();
    if (!jobs) {
      return res.status(400).json({ error: "jobs not found" });
    }
    res.status(200).json({
      status: 200,
      message: "Jobs retrieved successfully.",
      data: jobs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: "Server error.",
      data: {},
    });
  }
};

exports.getJobsById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await jobModel.findById(jobId);
    if (!job) {
      return res.status(404).json({
        status: 404,
        message: "Job not found.",
        data: {},
      });
    }
    res.status(200).json({
      status: 200,
      message: "Job retrieved successfully.",
      data: job,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: "Server error.",
      data: {},
    });
  }
};

exports.createJob = async (req, res) => {
  try {
    const {
      orderid,
      item,
      itemType,
      Capacity,
      RegNo,
      otherDetail,
      images,
      condenserCoilCheck,
      gasLeakageCheck,
      compressorCheck,
    } = req.body;

    const job1 = await jobModel.findOne({ orderid: orderid });
    if (job1) {
      return res.status(400).json({ error: "job already done" });
    }
    const user = await orderModel.findOne({ _id: orderid });
    if (!user) {
      return res.status(400).json({ error: "order not found" });
    }
    const vendor = await User.findOne({ _id: user.vendorId });
    if (!vendor) {
      return res.status(400).json({ error: "vendor not found" });
    }

    const job = await jobModel.create({
      orderid,
      partnerName: vendor.fullName,
      item,
      itemType,
      Capacity,
      RegNo,
      otherDetail,
      images,
      precheckUp: {
        condenserCoilCheck,
        gasLeakageCheck,
        compressorCheck,
      },
    });

    res.status(200).json({
      status: 200,
      message: "Job created successfully.",
      data: job,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: "Server error.",
      data: {},
    });
  }
};

exports.updateJobsById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const updates = req.body;
    const updatedJob = await jobModel.findByIdAndUpdate(jobId, updates, {
      new: true,
    });

    if (!updatedJob) {
      return res.status(404).json({
        status: 404,
        message: "Job not found.",
        data: {},
      });
    }
    res.status(200).json({
      status: 200,
      message: "Job updated successfully.",
      data: updatedJob,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: "Server error.",
      data: {},
    });
  }
};

exports.updateImage = async (req, res) => {
  try {
    let productImage = [];
    for (let i = 0; i < req.files.length; i++) {
      console.log(req.files[i]);
      const product = await jobModel.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { images: req.files[i].path } },
        { new: true }
      );
    }
    const product = await jobModel.findById({ _id: req.params.id });

    res
      .status(200)
      .json({ message: "Product images updated successfully.", data: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: "Server error.",
      data: {},
    });
  }
};

exports.deleteJobsById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const deletedJob = await jobModel.findByIdAndDelete(jobId);
    if (!deletedJob) {
      return res.status(404).json({
        status: 404,
        message: "Job not found.",
        data: {},
      });
    }
    res.status(200).json({
      status: 200,
      message: "Job deleted successfully.",
      data: deletedJob,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: "Server error.",
      data: {},
    });
  }
};
