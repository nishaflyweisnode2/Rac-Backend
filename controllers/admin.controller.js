const authConfig = require("../configs/auth.config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var newOTP = require("otp-generators");
const User = require("../models/user.model");
const Category = require("../models/CategoryModel");
const subCategory = require("../models/subCategoryModel");
const imagePattern = "[^\\s]+(.*?)\\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$";
const multer = require("multer");
const PreCheckup = require('../models/preCheckupModel');
const EndJob = require('../models/orders/endJobModel');
const TodoItem = require('../models/todolistModel');
const Notification = require('../models/notifcation');
const nodemailer = require('nodemailer');
const schedule = require('node-schedule');
const { Permission, Role } = require('../models/roleModel');
const IDCard = require('../models/idCardModel');
const Subsubcategory = require("../models/subsubcategory");



const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { checkout } = require("../routes/admin.route");
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

const reffralCode = async () => {
  var digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let OTP = '';
  for (let i = 0; i < 5; i++) {
    OTP += digits[Math.floor(Math.random() * 36)];
  }
  return OTP;
}

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
    console.log("ac", authConfig.secret,);
    console.log("ac", accessToken);
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
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (user) {
      return res.status(200).json({ status: 200, message: 'User found', data: user });
    } else {
      return res.status(404).json({ status: 404, message: 'User not found', data: {} });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: 'Internal server error', data: {} });
  }
};
exports.deleteUserById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (deletedUser) {
      return res.status(200).json({ status: 200, message: 'User deleted successfully', data: deletedUser });
    } else {
      return res.status(404).json({ status: 404, message: 'User not found', data: {} });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: 'Internal server error', data: {} });
  }
};
exports.updateUserById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { fullName, firstName, lastName, email, phone, password } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.fullName = fullName || user.fullName;
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.phone = phone || user.phone;

    if (password) {
      user.password = bcrypt.hashSync(password, 8);
    }

    const updatedUser = await user.save();

    return res.status(200).json({ message: 'User updated successfully', data: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
exports.createUser = async (req, res) => {
  try {
    const { fullName, firstName, lastName, email, password, userType } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      userType
    });

    await newUser.save();

    res.status(201).json({ message: 'User created successfully', data: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
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
console.log("1111");
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
          subCategoryId: req.body.subCategoryId,
          vendorId: req.body.vendorId,
          status: req.body.status,
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

exports.getSubCategoriesByCategoryId = async (req, res) => {

  const findSubcategory = await subCategory.find({ categoryId: req.params.id }).populate("categoryId");
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

exports.getSubcategoriesByCategoryID = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const subcategories = await Subsubcategory.find({ categoryId: categoryId });

    if (subcategories.length === 0) {
      return res.status(404).json({ status: 404, message: "Subcategories not found", data: [] });
    }

    return res.status(200).json({ status: 200, message: "Subcategories found", data: subcategories });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, message: "Internal server error", data: {} });
  }
};

exports.getSubcategoriesBySubcategoryID = async (req, res) => {
  try {
    const subcategoryId = req.params.id;
    const subcategory = await Subsubcategory.find({ subCategoryId: subcategoryId });

    if (!subcategory) {
      return res.status(404).json({ status: 404, message: "Subcategory not found", data: {} });
    }

    return res.status(200).json({ status: 200, message: "Subcategory found", data: subcategory });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, message: "Internal server error", data: {} });
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
    const vendors = await User.find({ userType: "VENDOR" }).populate("subscription");

    const vendorCount = await User.countDocuments({ userType: "VENDOR" });

    if (vendors) {
      return res.status(200).json({
        status: 200,
        message: "Vendors fetched successfully",
        data: { vendorCount, vendors }
      });
    } else {
      return res.status(404).json({
        status: 404,
        message: "No vendors found",
        data: { vendorCount: 0 }
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: "Server error",
      data: { vendorCount: 0 }
    });
  }
};


exports.getAllUser = async (req, res) => {
  try {
    const users = await User.find({});

    const userCount = await User.countDocuments();

    if (users) {
      return res.status(200).json({
        status: 200,
        message: "Users fetched successfully",
        data: { userCount, users }
      });
    } else {
      return res.status(404).json({
        status: 404,
        message: "No users found",
        data: { userCount: 0 }
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: "Server error",
      data: { userCount: 0 }
    });
  }
};


exports.createTodoItem = async (req, res) => {
  try {
    const admin = await User.findById(req.user._id);
    if (!admin) {
      return res.status(404).json({ status: 404, message: "Admin not found" });
    }
    const { title, description, completed, reminderDate } = req.body;
    const todoItem = new TodoItem({ userId: admin._id, title, description, completed, reminderDate });
    await todoItem.save();
    res.status(201).json({ message: 'Todo item created successfully', data: todoItem });
  } catch (error) {
    console.error('Error creating todo item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllTodoItems = async (req, res) => {
  try {
    const todoItems = await TodoItem.find();
    res.status(200).json({ data: todoItems });
  } catch (error) {
    console.error('Error getting todo items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getTodoItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const todoItem = await TodoItem.findById(id);
    if (!todoItem) {
      return res.status(404).json({ message: 'Todo item not found' });
    }
    res.status(200).json({ data: todoItem });
  } catch (error) {
    console.error('Error getting todo item by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateTodoItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed, reminderDate, reminderSet } = req.body;
    const updatedTodoItem = await TodoItem.findByIdAndUpdate(id, { title, description, completed, reminderDate, reminderSet }, { new: true });
    if (!updatedTodoItem) {
      return res.status(404).json({ message: 'Todo item not found' });
    }
    res.status(200).json({ message: 'Todo item updated successfully', data: updatedTodoItem });
  } catch (error) {
    console.error('Error updating todo item by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteTodoItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTodoItem = await TodoItem.findByIdAndDelete(id);
    if (!deletedTodoItem) {
      return res.status(404).json({ message: 'Todo item not found' });
    }
    res.status(200).json({ message: 'Todo item deleted successfully', data: deletedTodoItem });
  } catch (error) {
    console.error('Error deleting todo item by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.createNotification = async (req, res) => {
  try {
    const admin = await User.findById(req.user._id);
    if (!admin) {
      return res.status(404).json({ status: 404, message: "Admin not found" });
    }

    const createNotification = async (userId) => {
      const notificationData = {
        userId,
        title: req.body.title,
        content: req.body.content,
      };
      return await Notification.create(notificationData);
    };

    if (req.body.total === "ALL") {
      const userData = await User.find({ userType: req.body.sendTo });
      if (userData.length === 0) {
        return res.status(404).json({ status: 404, message: "Users not found" });
      }

      for (const user of userData) {
        await createNotification(user._id);
      }

      await createNotification(admin._id);

      return res.status(200).json({ status: 200, message: "Notifications sent successfully to all users." });
    }

    if (req.body.total === "SINGLE") {
      const user = await User.findById(req.body._id);
      if (!user || user.userType !== req.body.sendTo) {
        return res.status(404).json({ status: 404, message: "User not found or invalid user type" });
      }

      const notificationData = await createNotification(user._id);

      return res.status(200).json({ status: 200, message: "Notification sent successfully.", data: notificationData });
    }

    return res.status(400).json({ status: 400, message: "Invalid 'total' value" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 500, message: "Server error", data: {} });
  }
};

exports.getNotificationsForUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: 404, message: 'User not found' });
    }

    const notifications = await Notification.find({
      $or: [
        { userId: userId },
      ]
    });
    return res.status(200).json({ status: 200, message: 'Notifications retrieved successfully', data: notifications });
  } catch (error) {
    return res.status(500).json({ status: 500, message: 'Error retrieving notifications', error: error.message });
  }
};

exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find();

    return res.status(200).json({ status: 200, message: 'Notifications retrieved successfully', data: notifications });
  } catch (error) {
    return res.status(500).json({ status: 500, message: 'Error retrieving notifications', error: error.message });
  }
};

exports.deleteNotification = async (req, res) => {
  const notificationId = req.params.id;

  try {
    const deletedNotification = await Notification.findByIdAndDelete(notificationId);

    if (!deletedNotification) {
      return res.status(404).json({ status: 404, message: 'Notification not found' });
    }

    return res.status(200).json({ status: 200, message: 'Notification deleted successfully', data: deletedNotification });
  } catch (error) {
    return res.status(500).json({ status: 500, message: 'Error deleting notification', error: error.message });
  }
};

schedule.scheduleJob('* * * * *', async () => {
  try {
    console.log("Entry");
    const currentDate = new Date();
    console.log("Current Date:", currentDate);

    const overdueItems = await TodoItem.find({ reminderDate: { $lte: currentDate }, completed: false });
    console.log("Overdue Items:", overdueItems);

    for (const item of overdueItems) {
      const user = await User.findById(item.userId);

      if (user) {
        // Check if a similar notification already exists
        const existingNotification = await Notification.findOne({
          userId: user._id,
          content: `You have an overdue todo item: ${item.title}. Please complete it.`,
          status: 'unread'
        });

        if (!existingNotification) {
          const notification = new Notification({
            userId: user._id,
            title: 'TodoReminder',
            content: `You have an overdue todo item: ${item.title}. Please complete it.`,
            status: 'unread',
            createdAt: new Date(),
          });
          await notification.save();
          console.log("Notification saved");
        } else {
          console.log("Notification already exists");
        }
      } else {
        console.log("User not found");
      }
    }
  } catch (error) {
    console.error('Error processing reminders:', error);
  }
});

exports.createPermission = async (req, res) => {
  try {
    const { name, description } = req.body;

    const existingPermission = await Permission.findOne({ name });
    if (existingPermission) {
      return res.status(400).json({ status: 400, message: 'Permission with this name already exists' });
    }

    const permission = new Permission({ name, description });
    await permission.save();
    res.status(201).json({ message: 'Permission created successfully', data: permission });
  } catch (error) {
    console.error('Error creating permission:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createRole = async (req, res) => {
  try {
    const { name, description, permissions, language } = req.body;

    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(400).json({ status: 400, message: 'Role with this name already exists' });
    }

    if (permissions) {
      const CheckPermission = await Permission.findOne({ permissions })
      if (!CheckPermission) {
        return res.status(404)({ status: 404, message: 'permission not found' })
      }
    }
    const role = new Role({ name, description, permissions, language });
    await role.save();
    res.status(201).json({ message: 'Role created successfully', data: role });
  } catch (error) {
    console.error('Error creating role:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find();
    res.status(200).json({ data: permissions });
  } catch (error) {
    console.error('Error getting permissions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find().populate('permissions');
    res.status(200).json({ data: roles });
  } catch (error) {
    console.error('Error getting roles:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updatePermission = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const updatedPermission = await Permission.findByIdAndUpdate(id, { name, description }, { new: true });
    if (!updatedPermission) {
      return res.status(404).json({ message: 'Permission not found' });
    }
    res.status(200).json({ message: 'Permission updated successfully', data: updatedPermission });
  } catch (error) {
    console.error('Error updating permission:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deletePermission = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPermission = await Permission.findByIdAndDelete(id);
    if (!deletedPermission) {
      return res.status(404).json({ message: 'Permission not found' });
    }
    res.status(200).json({ message: 'Permission deleted successfully' });
  } catch (error) {
    console.error('Error deleting permission:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, permissions, language } = req.body;
    if (permissions) {
      const CheckPermission = await Permission.findOne({ permissions })
      if (!CheckPermission) {
        return res.status(404)({ status: 404, message: 'permission not found' })
      }
    }
    const updatedRole = await Role.findByIdAndUpdate(id, { name, description, permissions, language }, { new: true });
    if (!updatedRole) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.status(200).json({ message: 'Role updated successfully', data: updatedRole });
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRole = await Role.findByIdAndDelete(id);
    if (!deletedRole) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.status(200).json({ message: 'Role deleted successfully' });
  } catch (error) {
    console.error('Error deleting role:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createIDCard = async (req, res) => {
  try {
    const { partnerId, name, designation, idNumber, department, degree, phone, email } = req.body;

    if (!req.file) {
      return res.status(400).json({ status: 400, error: "Image file is required" });
    }

    const existingIDCard = await IDCard.findOne({ idNumber });
    if (existingIDCard) {
      return res.status(400).json({ message: 'ID card with this ID number already exists' });
    }

    const idCard = new IDCard({
      partnerId,
      name,
      designation,
      idNumber: await reffralCode(),
      department,
      degree,
      phone,
      email,
      image: req.file.path,
    });

    await idCard.save();

    res.status(201).json({ message: 'ID card created successfully', data: idCard });
  } catch (error) {
    console.error('Error creating ID card:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllIDCards = async (req, res) => {
  try {
    const idCards = await IDCard.find();
    res.status(200).json({ data: idCards });
  } catch (error) {
    console.error('Error getting ID cards:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getIDCardById = async (req, res) => {
  try {
    const idCard = await IDCard.findById(req.params.id);
    if (!idCard) {
      return res.status(404).json({ message: 'ID card not found' });
    }
    res.status(200).json({ data: idCard });
  } catch (error) {
    console.error('Error getting ID card by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateIDCardById = async (req, res) => {
  try {
    const idCardId = req.params.id;
    const updateFields = { ...req.body };

    if (req.file) {
      updateFields.image = req.file.path;
    }

    const updatedIDCard = await IDCard.findByIdAndUpdate(idCardId, updateFields, { new: true });

    if (!updatedIDCard) {
      return res.status(404).json({ message: 'ID card not found' });
    }

    res.status(200).json({ message: 'ID card updated successfully', data: updatedIDCard });
  } catch (error) {
    console.error('Error updating ID card by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.deleteIDCardById = async (req, res) => {
  try {
    const idCard = await IDCard.findByIdAndDelete(req.params.id);
    if (!idCard) {
      return res.status(404).json({ message: 'ID card not found' });
    }
    res.status(200).json({ message: 'ID card deleted successfully' });
  } catch (error) {
    console.error('Error deleting ID card by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



