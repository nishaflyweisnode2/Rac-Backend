const productModel = require("../models/productsModel");

const imagePattern = "[^\\s]+(.*?)\\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$";
const multer = require("multer");
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
const mongoose = require('mongoose');

exports.createProduct = async (req, res) => {
  // console.log("hi");
  try {
    const vendorId = req.params.id;

    if (
      req.files &&
      req.files["frontImage"] &&
      req.files["backImage"] &&
      req.files["panImage"]
    ) {
      let front = req.files["frontImage"];
      let back = req.files["backImage"];
      let pan = req.files["panImage"];

      req.body.frontSide = front[0].path;
      req.body.backSide = back[0].path;
      req.body.panSide = pan[0].path;
    }
    const coordinates = [
      parseFloat(req.body.longitude),
      parseFloat(req.body.latitude),
    ];

    // Create a new product
    const newProduct = new productModel({
      vendor: vendorId, // Assuming you have a vendor ID associated with the product
      ...req.body, // Save all data from req.body as-is
      frontSide: req.body.frontSide,
      backSide: req.body.backSide,
      panSide: req.body.panSide,
      location: {
        type: "Point",
        coordinates: coordinates,
      },
    });

    // Save the product to the database
    await newProduct.save();

    res.json({ message: "company added successfully", newProduct });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.createVendorProduct = async (req, res, next) => {
  console.log("hi2");
  try {
    upload.array("image")(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ msg: err.message });
      }
      let images = [];
      //   console.log(req.files);
      if (req.files) {
        for (let i = 0; i < req.files.length; i++) {
          images.push(req.files[i] ? req.files[i].path : "");
        }
      }
      console.log(req.params.id);
      const data = {
        images: images,
        vendor: req.params.id,
        productName: req.body.productName,
        brandName: req.body.brandName,
        description: req.body.description,
        capacity: req.body.capacity,
        rating: req.body.rating,
        price: req.body.price,
        discount: req.body.discount,
        stock: req.body.stock,
        deliveryCharge: req.body.deliveryCharge,
        warranty: req.body.warranty,
        replacement: req.body.replacement,
      };
      console.log(data);
      const product = await productModel.create(data);
      return res
        .status(200)
        .json({
          message: "product add successfully.",
          status: 200,
          data: product,
        });
    });
  } catch (error) {
    console.log(req.body);
    res
      .status(500)
      .json({
        status: 500,
        message: "internal server error ",
        data: error.message,
      });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).send({
      status: 200,
      message: "success",
      data: product,
    });
  } catch (error) {
    console.error("Error retrieving product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllProduct = async (req, res) => {
  try {
    const product = await productModel.find();

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).send({
      status: 200,
      message: "success",
      data: product,
    });
  } catch (error) {
    console.error("Error retrieving product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      productName,
      productType,
      desc,
      price,
      offerPrice,
      discount,
      brand,
      capacity,
      features,
      colour,
    } = req.body;

    if (!productName || !productType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existingProduct = await productModel.findById(id);

    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    existingProduct.productName = productName;
    existingProduct.productType = productType;
    existingProduct.desc = desc;
    existingProduct.price = price;
    existingProduct.offerPrice = offerPrice;
    existingProduct.discount = discount;
    existingProduct.brand = brand;
    existingProduct.capacity = capacity;
    existingProduct.features = features;
    existingProduct.colour = colour;

    const updatedProduct = await existingProduct.save();
    res.status(200).send({
      status: 200,
      message: "updated",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await productModel.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).send({
      status: 200,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateProductImages = async (req, res) => {
  try {
    let productImage = [];
    for (let i = 0; i < req.files.length; i++) {
      console.log(req.files[i]);
      const product = await productModel.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { productImage: req.files[i].path } },
        { new: true }
      );
    }
    const product = await productModel.findById({ _id: req.params.id });

    res
      .status(200)
      .json({ message: "Product images updated successfully.", data: product });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error });
  }
};

exports.addProductReview1 = async (req, res) => {
  try {
    const { userId, rating } = req.body;
    const productId = req.params.id;

    if (!userId || !rating) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const existingReview = product.review.find(
      (review) => review.userId.toString() === userId.toString()
    );

    if (existingReview) {
      return res
        .status(400)
        .json({ error: "User already gave a rating for this product" });
    }

    product.review.push({ userId, rating, reviews });

    let totalRating = 0;
    let avgStarRating = 0;

    product.review.forEach((review) => {
      totalRating += review.rating;
    });

    avgStarRating = totalRating / product.review.length;

    product.totalRating = totalRating;
    product.avgStarRating = avgStarRating;

    const updatedProduct = await product.save();

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error adding product review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.addProductReview = async (req, res) => {
  try {
    const { userId, rating } = req.body;
    const productId = req.params.id;

    if (!userId || !rating) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Initialize 'reviews' field as an empty array if needed
    if (!Array.isArray(product.reviews)) {
      product.reviews = [];
    }

    const userIdObject = new mongoose.Types.ObjectId(userId);

    product.reviews.push({ userId: userIdObject, rating });

    let totalRating = 0;
    let avgStarRating = 0;

    product.reviews.forEach((review) => {
      totalRating += review.rating;
    });

    avgStarRating = totalRating / product.reviews.length;

    product.totalRating = product.reviews.length;
    product.avgStarRating = avgStarRating;

    const updatedProduct = await product.save();

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error adding product review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getProductsByUserLocation = async (req, res) => {
  const userLatitude = parseFloat(req.params.latitude);
  const userLongitude = parseFloat(req.params.longitude);

  if (isNaN(userLatitude) || isNaN(userLongitude)) {
    return res.status(400).json({ error: "Invalid coordinates provided" });
  }

  const maxDistanceInKm = 5; // 5 kilometers

  try {
    const maxDistanceInMeters = maxDistanceInKm * 1000; // Convert to meters

    const productsWithinDistance = await productModel.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [userLongitude, userLatitude],
          },
          distanceField: "distance",
          maxDistance: maxDistanceInMeters,
          spherical: true,
        },
      },
    ]);

    // Extract distance and remove the "_id" field
    const formattedProducts = productsWithinDistance.map((product) => ({
      ...product,
      distance: product.distance / 1000, // Convert meters to kilometers
    }));

    if (formattedProducts.length === 0) {
      // Calculate distance between the user and a hypothetical product
      const hypotheticalProductCoordinates = {
        latitude: 40.0,
        longitude: -75.0,
      }; // Example coordinates
      const distanceToHypotheticalProduct = geolib.getDistance(
        { latitude: userLatitude, longitude: userLongitude },
        hypotheticalProductCoordinates
      );

      return res.status(404).json({
        error: "No products found within 5km",
        hypotheticalDistance: distanceToHypotheticalProduct / 1000, // Convert meters to kilometers
      });
    }

    res.json({ success: true, products: formattedProducts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
