const express = require("express");
const imagesRouter = express.Router();
const {
  addBanner,
  getBannerById,
  getbanner,
  Deletebanner,
  UpdateBanner,
  getBannersByType
} = require("../controllers/banner");




imagesRouter.post("/", addBanner);
imagesRouter.get("/:id", getBannerById);
imagesRouter.get("/", getbanner);
imagesRouter.put("/:id", UpdateBanner);
imagesRouter.delete("/:id", Deletebanner);

imagesRouter.get("/banner/:type", getBannersByType);

module.exports = imagesRouter;
