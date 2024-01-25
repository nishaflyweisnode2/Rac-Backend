const cityModel = require('../models/selectcity');

const imagePattern = "[^\\s]+(.*?)\\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$";
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
cloudinary.config({ 
    cloud_name: 'dtijhcmaa', 
    api_key: '624644714628939', 
    api_secret: 'tU52wM1-XoaFD2NrHbPrkiVKZvY' 
  });
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "images/image",
    allowed_formats: ["jpg", "jpeg", "png", "PNG", "xlsx", "xls", "pdf", "PDF"],
  },
});
const upload = multer({ storage: storage });

exports.getCity = async (req, res) => {
  try {
    const cities = await cityModel.find();
    // res.json(cities);
    res.status(200).json({
      msg: "Data Get Successfully",
      data: cities
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateCity = async (req, res) => {
  try {
    const { id } = req.params;
    const { selectcity } = req.body;
    const updatedCity = await cityModel.findByIdAndUpdate(
      id,
      { selectcity },
      { new: true }
    );
    res.json(updatedCity);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.createCity = async (req, res) => {
  try {
    let findCategory = await cityModel.findOne({ name: req.params.name });
    console.log(req.params.name)
    if (findCategory) {
      res.status(409).json({ message: "category already exit.", status: 404, data: {} });
    } else {
      upload.single("image")(req, res, async (err) => {
        if (err) { return res.status(400).json({ msg: err.message }); }
        const fileUrl = req.file ? req.file.path : "";
        const data = { name: req.params.name, image: fileUrl };
        const category = await cityModel.create(data);
        res.status(200).json({ message: "category add successfully.", status: 200, data: category });
      })
    }

  } catch (error) {
    res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
  }
};


exports.deleteCity = async (req, res) => {
  try {
    const { id } = req.params;
    await cityModel.findByIdAndDelete(id);
    res.json({ message: 'City deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
