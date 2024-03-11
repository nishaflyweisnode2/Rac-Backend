const banner = require("../models/banner");
const imagePattern = "[^\\s]+(.*?)\\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$";

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dbrvq9uxa",
  api_key: "567113285751718",
  api_secret: "rjTsz9ksqzlDtsrlOPcTs_-QtW4",
});

const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Images",
    allowed_formats: ["jpg", "jpeg", "png", "PNG"],
  },
});
const imageUpload = multer({ storage: imageStorage });

exports.addBanner = async (req, res) => {
  try {
    imageUpload.single("uploadBanner")(req, res, async (imageErr) => {
      if (imageErr) {
        return res.status(400).json({ msg: imageErr.message });
      }
      imageUrl = req.file ? req.file.path : "";
      console.log(imageUrl);

      const bannerData = await banner.create({
        image: imageUrl || req.body.image,
        desc: req.body.desc,
        date: req.body.date,
        status: req.body.status,
        type: req.body.type
      });
      //   if(!imagePattern.test(bannerData.image)) {res .status(400).send({msg:"invalid extennsion"})
      // }
      if (!bannerData.image.match(imagePattern)) {
        return res.status(400).send({ msg: "invalid extennsion" });
      }
      return res.status(200).json({
        message: "Banner Added ",
        details: bannerData,
      });
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: err.message,
    });
  }
};

exports.getBannerById = async (req, res) => {
  try {
    const bannerDetails = await banner.findById({ _id: req.params.id });
    console.log(bannerDetails);
    res.status(200).json({
      details: bannerDetails,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getbanner = async (req, res) => {
  try {
    const allbanner = await banner.find();
    console.log(allbanner);
    res.status(200).json({
      message: "All banner ",
      Data: allbanner,
    });
  } catch (err) {
    console.log(err);
    res.status(200).json({
      message: err.message,
    });
  }
};

exports.Deletebanner = async (req, res) => {
  try {
    const id = req.params.id;
    await banner.deleteOne({ _id: id });
    res.status(200).send({ message: "banner  deleted " });
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: err.message });
  }
};

exports.UpdateBanner1 = async (req, res) => {
  try {

    imageUpload.single("uploadBanner")(req, res, async (imageErr) => {
      if (imageErr) {
        return res.status(400).json({ msg: imageErr.message });
      }
      imageUrl = req.file ? req.file.path : "";
      console.log(imageUrl);

      const UpdatedData = await banner
        .findOneAndUpdate({
          image: imageUrl || req.body.image,
          desc: req.body.desc,
          date: req.body.date,
          status: req.body.status,
          type: req.body.type
        });
      //   if(!imagePattern.test(bannerData.image)) {res .status(400).send({msg:"invalid extennsion"})
      // }
      // if (!bannerData.image.match(imagePattern)) {
      //   return res.status(400).send({ msg: "invalid extennsion" });
      // }

      console.log(UpdatedData);
      res.status(200).send({ message: "banner Updated  ", data: UpdatedData });
    })
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: err.message });
  }
};

exports.UpdateBanner = async (req, res) => {
  try {
    imageUpload.single("uploadBanner")(req, res, async (imageErr) => {
      if (imageErr) {
        return res.status(400).json({ msg: imageErr.message });
      }

      const imageUrl = req.file ? req.file.path : "";
      console.log(imageUrl);

      const UpdatedData = await banner.findOneAndUpdate(
        { _id: req.params.id },
        {
          image: imageUrl || req.body.image,
          desc: req.body.desc,
          date: req.body.date,
          status: req.body.status,
          type: req.body.type
        },
        { new: true }
      );

      console.log(UpdatedData);
      res.status(200).send({ message: "Banner updated", data: UpdatedData });
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: err.message });
  }
};

exports.getBannersByType = async (req, res) => {
  try {
    const { type } = req.params;
    const banners = await banner.find({ type });

    res.status(200).json({ status: 200, data: banners });
  } catch (error) {
    res.status(500).json({ status: 500, message: 'Internal server error', data: error.message });
  }
};