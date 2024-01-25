const seviceNameModel = require("../models/service");

exports.getAllSevice = async (req, res) => {
  try {
    const seviceNames = await seviceNameModel.find().populate({
      path: "subsubCategoryId",
      populate: {
        path: "vendorId subCategoryId categoryId",
      },
    });
    if (!seviceNames) {
      return res.status(404).json({ error: "ServiceNames not found" });
    }

    res.status(200).json({ msg: seviceNames });
  } catch (error) {
    console.error("Error retrieving SeviceNames:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getSeviceById = async (req, res) => {
  try {
    // const { _id } = req.user;
    const { id } = req.params;
    // const seviceName = await seviceNameModel.findById(id).populate("subsubCategoryId")

    const seviceName = await seviceNameModel.findById(id).populate({
      path: "subsubCategoryId",
      populate: {
        path: "vendorId subCategoryId categoryId",
      },
    });
    if (!seviceName) {
      return res.status(404).json({ error: "ServiceName not found" });
    }

    res.status(200).json({
      msg: "Data Get Successfully",
      data: seviceName
    });
    
  } catch (error) {
    console.error("Error retrieving ServiceName:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.createSevice = async (req, res) => {
  try {
    console.log("hi");
    const { name, categoryId, subCategoryId,descriptions, subsubCategoryId, vendorId, feature, status, image, price, items } = req.body;
    console.log(image);

    const seviceName = await seviceNameModel.create({
      name,
      image,
      descriptions,
      categoryId,
      subCategoryId,
      subsubCategoryId,
      vendorId,
      status,
      feature,
      price,
      items,
    });

    res.status(201).json(seviceName);
  } catch (error) {
    console.error("Error creating ServiceName:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateSevice = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, categoryId, subCategoryId, subsubCategoryId, vendorId, status, price, count } = req.body;

    const seviceName = await seviceNameModel.findByIdAndUpdate(id, {
      name,
      categoryId,
      subCategoryId,
      subsubCategoryId,
      vendorId,
      status,
      price,
      count,
    }, { new: true });

    if (!seviceName) {
      return res.status(404).json({ error: "ServiceName not found" });
    }

    res.status(200).json(seviceName);
  } catch (error) {
    console.error("Error updating ServiceName:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteSevice = async (req, res) => {
  try {
    const { id } = req.params;
    const seviceName = await seviceNameModel.findByIdAndDelete(id);
    if (!seviceName) {
      return res.status(404).json({ error: "ServiceName not found" });
    }

    res.status(200).json({ message: "ServiceName deleted successfully" });
  } catch (error) {
    console.error("Error deleting ServiceName:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.search = async (req, res, next) => {
     console.log("hi");
  const seviceNameModelCount = await seviceNameModel.count();
  console.log(seviceNameModelCount);
  let apiFeature = await seviceNameModel.aggregate([
    {
      $lookup: { from: "categories", localField: "categoryId", foreignField: "_id", as: "categoryId" },
    },
    { $unwind: "$categoryId" },
    {
      $lookup: { from: "subcategories", localField: "subCategoryId", foreignField: "_id", as: "subCategoryId", },
    },
    { $unwind: "$subCategoryId" },
  ]);
  console.log("hi");

  if (req.query.search != (null || undefined)) {
    let data1 = [
      {
        $lookup: { from: "categories", localField: "categoryId", foreignField: "_id", as: "categoryId" },
      },
      { $unwind: "$categoryId" },
      {
        $lookup: { from: "subcategories", localField: "subCategoryId", foreignField: "_id", as: "subCategoryId", },
      },
      { $unwind: "$subCategoryId" },
      {
        $match: {
          $or: [
            { "categoryId.name": { $regex: req.query.search, $options: "i" }, },
            { "subCategoryId.name": { $regex: req.query.search, $options: "i" }, },
            { "name": { $regex: req.query.search, $options: "i" }, },
            { "description": { $regex: req.query.search, $options: "i" }, },
            { "colors": { $regex: req.query.search, $options: "i" }, }
          ]
        }
      }
    ]
    apiFeature = await seviceNameModel.aggregate(data1);
  }
  res.status(200).json({ success: true, seviceNameModelCount, apiFeature, });
};

exports.minimumPrice = async (req, res, next) => {
try {
  const categoryId = req.params.categoryId;


  // Find the services of the given category and get the minimum price
  const minPrice = await seviceNameModel.findOne({ categoryId: categoryId })
    .sort('price')
    .select('price');

  if (!minPrice) {
    return res.status(404).json({ message: 'No services found for the category' });
  }

  res.json({ minPrice: minPrice.price });
} catch (error) {
  console.error(error);
  res.status(500).json({ message: 'Server error' });
}
};


exports.getsubsubbyservice = async (req, res, next) => {

  try {
    const { serviceId } = req.params;

    // Find the service by ID and populate its subcategories
    const service = await seviceNameModel.findById(serviceId);

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    // Extract and send the subcategories
    const subcategories = service.subsubCategoryId;
    res.status(200).json({ success: true, subcategories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.getServicesBySubCategoryId = async (req, res, next) => {
  try {
    const { subCategoryId } = req.params;

    // Assuming 'subCategoryId' is a valid ObjectId
    const services = await seviceNameModel.find({ subCategoryId }).populate('subCategoryId').populate('categoryId').populate('subsubCategoryId')  ;

    res.status(200).json({
      success: true,
      data: services,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

exports.updateServiceType = async (req, res, next) => {
  try {
    const { serviceId } = req.params;
    const { type } = req.body;

    // Find and update the service
    const updatedService = await seviceNameModel.findByIdAndUpdate(
      serviceId,
      { type },
      { new: true, runValidators: true }
    );

    if (!updatedService) {
      return res.status(404).json({
        success: false,
        message: 'Service not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: updatedService,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

exports.getServicesByType = async (req, res, next) => {
  try {
    const { type } = req.params;

   
    // Find services by type
    const services = await seviceNameModel.find({ type });

    res.status(200).json({
      success: true,
      data: services,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};
exports.getItems = async (req, res, next) => {

  try {
    const serviceId = req.params.serviceId;

    // Find the service by ID
    const service = await seviceNameModel.findById(serviceId);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Extract and return the items of the service
    const items = service.items;
    return res.status(200).json({ items });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }};