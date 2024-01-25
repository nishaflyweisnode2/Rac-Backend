const Subsubcategory = require("../models/subsubcategory");

exports.createSubsubcategory = async (req, res) => {
  try {
    const { name, categoryId, subCategoryId, vendorId, status } = req.body;

    const newSubsubcategory = new Subsubcategory({
      name,
      categoryId,
      subCategoryId,
      vendorId,
      status,
    });

    const createdSubsubcategory = await newSubsubcategory.save();
    res.status(201).json(createdSubsubcategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getSubsubcategoryById = async (req, res) => {
  try {
    const subsubcategory = await Subsubcategory.findById(req.params.id).populate("categoryId subCategoryId vendorId")

      if (!subsubcategory) {
      return res.status(404).json({ message: "Subsubcategory not found" });
    }

    res.status(200).json({msg:subsubcategory});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getSubsubcategory = async (req, res) => {
  try {
    const subsubcategory = await Subsubcategory.find().populate("categoryId subCategoryId vendorId")

      if (!subsubcategory) {
      return res.status(404).json({ message: "Subsubcategory not found" });
    }

    res.status(200).json({msg:subsubcategory});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

exports.updateSubsubcategory = async (req, res) => {
  try {
    const subsubcategory = await Subsubcategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!subsubcategory) {
      return res.status(404).json({ message: "Subsubcategory not found" });
    }

    res.status(200).json(subsubcategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteSubsubcategory = async (req, res) => {
  try {
    const subsubcategory = await Subsubcategory.findByIdAndDelete(req.params.id);

    if (!subsubcategory) {
      return res.status(404).json({ message: "Subsubcategory not found" });
    }

    res.status(200).json({ message: "Subsubcategory deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.subsubById = async (req, res) => {
   
  try {
    const subCategoryId = req.params.subsubCategoryId;
    const subcategories = await Subsubcategory.find({ subCategoryId }).populate("subCategoryId");

    res.status(200).json({ status: 200, data: subcategories });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Internal server error", data: error.message });
  }
};
