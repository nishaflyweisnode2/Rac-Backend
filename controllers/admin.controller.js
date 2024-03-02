const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authConfig = require("../configs/auth.config");
var newOTP = require("otp-generators");
const User = require("../models/user.model");
const Category = require("../models/CategoryModel");
const subCategory = require("../models/subCategoryModel");
const imagePattern = "[^\\s]+(.*?)\\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$";
const multer = require("multer");
const PreCheckup = require('../models/preCheckupModel');
const EndJob = require('../models/orders/endJobModel');



const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "dtijhcmaa",
  api_key: "624644714628939",
  api_secret: "tU52wM1-XoaFD2NrHbPrkiVKZvY",
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "images/image",
    allowed_formats: ["jpg", "jpeg", "png", "PNG", "xlsx", "xls", "pdf", "PDF"],
  },
});
const upload = multer({ storage: storage });
exports.registration = async (req, res) => {
  const { phone, email } = req.body;
  try {
    req.body.email = email.split(" ").join("").toLowerCase();
    let user = await User.findOne({
      $and: [{ $or: [{ email: req.body.email }, { phone: phone }] }],
      userType: "ADMIN",
    });
    if (!user) {
      req.body.password = bcrypt.hashSync(req.body.password, 8);
      req.body.userType = "ADMIN";
      req.body.accountVerification = true;
      const userCreate = await User.create(req.body);
      res
        .status(200)
        .send({ message: "registered successfully ", data: userCreate });
    } else {
      res.status(409).send({ message: "Already Exist", data: [] });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email, userType: "ADMIN" });
    if (!user) {
      return res
        .status(404)
        .send({ message: "user not found ! not registered" });
    }
    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) {
      return res.status(401).send({ message: "Wrong password" });
    }
    const accessToken = jwt.sign({ id: user._id }, authConfig.secret, {
      expiresIn: authConfig.accessTokenTime,
    });
    res.status(201).send({ data: user, accessToken: accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" + error.message });
  }
};
exports.update = async (req, res) => {
  try {
    const { fullName, firstName, lastName, email, phone, password } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).send({ message: "not found" });
    }
    user.fullName = fullName || user.fullName;
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    if (req.body.password) {
      user.password = bcrypt.hashSync(password, 8) || user.password;
    }
    const updated = await user.save();
    res.status(200).send({ message: "updated", data: updated });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "internal server error " + err.message,
    });
  }
};
exports.createCategory = async (req, res) => {
  try {
    //   const name  = req.body.name;
    //   const findCategory = await Category.findOne({ name });

    //   if (findCategory) {
    //     return res
    //       .status(409)
    //       .json({ message: "Category already exists.", status: 409 });
    //   }

    // Handle file upload
    upload.single("image")(req, res, async (err) => {
      try {
        if (err) {
          return res.status(400).json({ msg: err.message });
        }

        const fileUrl = req.file ? req.file.path : "";

        // Create a new category
        const newCategory = new Category({
          name: req.body.name,
          image: fileUrl,
        });

        // Save the new category to the database
        const category = await newCategory.save();

        res.status(200).json({
          message: "Category added successfully.",
          status: 200,
          data: category,
        });
      } catch (error) {
        // Handle any errors that occur during category creation
        res.status(500).json({
          status: 500,
          message: "Internal server error",
          data: error.message,
        });
      }
    });
  } catch (error) {
    // Handle any errors that occur before file upload
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      data: error.message,
    });
  }
};

exports.getCategories = async (req, res) => {
  const categories = await Category.find({});
  res.status(201).json({ success: true, categories });
};

exports.updateCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id);

    if (!category) {
      return res
        .status(404)
        .json({ message: "Category Not Found", status: 404, data: {} });
    }

    upload.single("image")(req, res, async (err) => {
      try {
        if (err) {
          return res.status(400).json({ msg: err.message });
        }

        const fileUrl = req.file ? req.file.path : "";
        category.image = fileUrl || category.image;
        category.name = req.body.name;

        const updatedCategory = await category.save();

        res
          .status(200)
          .json({ message: "Updated Successfully", data: updatedCategory });
      } catch (error) {
        res
          .status(500)
          .json({
            status: 500,
            message: "Internal server error",
            data: error.message,
          });
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({
        status: 500,
        message: "Internal server error",
        data: error.message,
      });
  }
};
exports.removeCategory = async (req, res) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {
    res
      .status(404)
      .json({ message: "Category Not Found", status: 404, data: {} });
  } else {
    await Category.findByIdAndDelete(category._id);
    res.status(200).json({ message: "Category Deleted Successfully !" });
  }
};
exports.createSubCategory = async (req, res) => {
  try {
    // let findCategory = await Category.findById({ _id: req.body.category });

    // if (!findCategory) {
    //     return res.status(404).json({ message: "Category not found.", status: 404, data: {} });
    // }

    upload.single("image")(req, res, async (err) => {
      try {
        if (err) {
          return res.status(400).json({ msg: err.message });
        }

        const fileUrl = req.file ? req.file.path : "";
        const data = {
          name: req.body.name,
          image: fileUrl,
          categoryId: req.body.categoryId,
        };
        const subcategory = await subCategory.create(data);

        res
          .status(200)
          .json({
            message: "Subcategory added successfully.",
            status: 200,
            data: subcategory,
          });
      } catch (error) {
        res
          .status(500)
          .json({
            status: 500,
            message: "Internal server error",
            data: error.message,
          });
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({
        status: 500,
        message: "Internal server error",
        data: error.message,
      });
  }
};
exports.getSubCategories = async (req, res) => {
  const findSubcategory = await subCategory.find({}).populate("categoryId");
  res.status(201).json({ success: true, findSubcategory });
};
exports.updateSubCategory = async (req, res) => {
  const { id } = req.params;
  const findSubcategory = await subCategory.findById(id);
  if (!findSubcategory) {
    res
      .status(404)
      .json({ message: "Sub Category Not Found", status: 404, data: {} });
  }
  let findCategory = await Category.findById({ _id: req.body.category });
  if (!findCategory) {
    res
      .status(404)
      .json({ message: "category Not found.", status: 404, data: {} });
  }
  findSubcategory.categoryId = findCategory._id || findSubcategory.categoryId;
  findSubcategory.name = req.body.name || findSubcategory.name;
  let update = await findSubcategory.save();
  res.status(200).json({ message: "Updated Successfully", data: update });
};
exports.removeSubCategory = async (req, res) => {
  const { id } = req.params;
  const findSubcategory = await subCategory.findById(id);
  if (!findSubcategory) {
    res
      .status(404)
      .json({ message: "Sub Category Not Found", status: 404, data: {} });
  } else {
    await subCategory.findByIdAndDelete(findSubcategory._id);
    res.status(200).json({ message: "Sub Category Deleted Successfully !" });
  }
};

exports.getsubofcat = async (req, res) => {
  try {
    const categories = await Category.find({});
    if (categories.length == 0) {
      return res
        .status(404)
        .json({ message: "Data not found.", status: 404, data: {} });
    } else {
      let Array = [];
      for (let i = 0; i < categories.length; i++) {
        const data = await subCategory.find({ categoryId: categories[i]._id });
        let obj = {
          category: categories[i],
          subCategory: data,
        };
        Array.push(obj);
      }
      return res
        .status(200)
        .json({
          status: 200,
          message: "Sub Category data found.",
          data: Array,
        });
    }
  } catch (err) {
    return res
      .status(500)
      .send({ msg: "internal server error ", error: err.message });
  }
};

exports.subById = async (req, res) => {

  try {
    const categoryId = req.params.categoryId;
    const subcategories = await subCategory.find({ categoryId }).populate("categoryId");

    res.status(200).json({ status: 200, data: subcategories });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Internal server error", data: error.message });
  }
};

exports.createPreCheckup = async (req, res) => {
  try {
    const { name, status } = req.body;
    const preCheckup = await PreCheckup.create({ name, status });
    res.status(201).json({ success: true, data: preCheckup });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAllPreCheckups = async (req, res) => {
  try {
    const preCheckups = await PreCheckup.find();
    res.status(200).json({ success: true, data: preCheckups });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getPreCheckupById = async (req, res) => {
  try {
    const preCheckup = await PreCheckup.findById(req.params.id);
    if (!preCheckup) {
      return res.status(404).json({ success: false, message: 'Pre-checkup not found' });
    }
    res.status(200).json({ success: true, data: preCheckup });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updatePreCheckup = async (req, res) => {
  try {
    const { name, status } = req.body;
    const preCheckup = await PreCheckup.findByIdAndUpdate(req.params.id, { name, status }, { new: true });
    if (!preCheckup) {
      return res.status(404).json({ success: false, message: 'Pre-checkup not found' });
    }
    res.status(200).json({ success: true, data: preCheckup });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deletePreCheckup = async (req, res) => {
  try {
    const preCheckup = await PreCheckup.findByIdAndDelete(req.params.id);
    if (!preCheckup) {
      return res.status(404).json({ success: false, message: 'Pre-checkup not found' });
    }
    res.status(200).json({ success: true, message: 'Pre-checkup deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createEndJob = async (req, res) => {
  try {
    const { name, price, status } = req.body;
    const preCheckup = await EndJob.create({ name, price, status });
    res.status(201).json({ success: true, data: preCheckup });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAllEndJob = async (req, res) => {
  try {
    const preCheckups = await EndJob.find();
    res.status(200).json({ success: true, data: preCheckups });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getEndJobById = async (req, res) => {
  try {
    const preCheckup = await EndJob.findById(req.params.id);
    if (!preCheckup) {
      return res.status(404).json({ success: false, message: 'End job not found' });
    }
    res.status(200).json({ success: true, data: preCheckup });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateEndJob = async (req, res) => {
  try {
    const { name, price, status } = req.body;
    const preCheckup = await EndJob.findByIdAndUpdate(req.params.id, { name, price, status }, { new: true });
    if (!preCheckup) {
      return res.status(404).json({ success: false, message: 'End job not found' });
    }
    res.status(200).json({ success: true, data: preCheckup });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteEndJob = async (req, res) => {
  try {
    const preCheckup = await PreCheckup.findByIdAndDelete(req.params.id);
    if (!preCheckup) {
      return res.status(404).json({ success: false, message: 'End job not found' });
    }
    res.status(200).json({ success: true, message: 'End job deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAllVendor = async (req, res) => {
  try {
    const data = await User.find().populate("subscription");
    if (data) {
      return res
        .status(200)
        .json({ status: 200, message: "get Profile", data: data });
    } else {
      return res
        .status(404)
        .json({ status: 404, message: "No data found", data: {} });
    }
  } catch (error) {
    console.log(error);
    res.status(501).send({ status: 501, message: "server error.", data: {} });
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const data = await User.find({});
    if (data) {
      return res
        .status(200)
        .json({ status: 200, message: "get Profile", data: data });
    } else {
      return res
        .status(404)
        .json({ status: 404, message: "No data found", data: {} });
    }
  } catch (error) {
    console.log(error);
    res.status(501).send({ status: 501, message: "server error.", data: {} });
  }
};