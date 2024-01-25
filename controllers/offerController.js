const offerModel = require("../models/offerModel");

exports.createOffer = async (req, res) => {
  try {
    const { title, service } = req.body;
    if (!title || title.trim() === "") {
      return res.status(400).json({ error: "Title is required" });
    }

    if (!service || !Array.isArray(service) || service.length === 0) {
      return res.status(400).json({ error: "Service must be a non-empty array" });
    }

    const offer = await offerModel.create({
      title,
      service,
    });


    res.status(200).send({
        status: 200,
        message: "Registered successfully ",
        data: offer
      });
   
  } catch (error) {
    console.error("Error creating offer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllOffers = async (req, res) => {
  try {
    const offers = await offerModel.find();
    res.status(200).json({msg:offers});
  } catch (error) {
    console.error("Error retrieving offers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getOfferById = async (req, res) => {
  try {
    const { id } = req.params;
    const offer = await offerModel.findById(id);

    if (!offer) {
      return res.status(404).json({ error: "Offer not found" });
    }

    res.status(200).json({msg:offer});
  } catch (error) {
    console.error("Error retrieving offer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateAddOffer = async (req, res) => {
    try {
      const { id } = req.params;
      const { title, service,price } = req.body;
      if (!title || title.trim() === "") {
        return res.status(400).json({ error: "Title is required" });
      }
  
      if (!service , /*|| !Array.isArray(service) ||*/ service.length === 0) {
        return res.status(400).json({ error: "Service must be a non-empty array" });
      }
  
      const existingOffer = await offerModel.findById(id);
  
      if (!existingOffer) {
        return res.status(404).json({ error: "Offer not found" });
      }
  
      existingOffer.title = title;
      existingOffer.service.push({ serviceId: service, price:price });
  
      const updatedOffer = await existingOffer.save();
  
      res.status(200).json(updatedOffer);
    } catch (error) {
      console.error("Error updating offer:", error);
      res.status(500).json({ error: "Internal server error" });
    }
};

exports.updateOffer = async (req, res) => {
    try {
      const { id } = req.params;
      const { serviceId, price,Id } = req.body;
  
      // Validate input
      if (!serviceId) {
        return res.status(400).json({ error: "Service ID is required" });
      }
  
      if (!price || isNaN(price)) {
        return res.status(400).json({ error: "Price must be a valid number" });
      }
  
      const existingOffer = await offerModel.findById(id);
  
      if (!existingOffer) {
        return res.status(404).json({ error: "Offer not found" });
      }
  
      // Find the index of the service within the service array
      const serviceIndex = existingOffer.service.findIndex(
        (service) => service./*serviceId*/_id.toString() === /*serviceId*/Id
      );
  
console.log(serviceIndex);

      if (serviceIndex === -1) {
        return res.status(404).json({ error: "Service not found" });
      }
  
      // Update the service price
      existingOffer.service[serviceIndex].serviceId = serviceId;
      existingOffer.service[serviceIndex].price = price;
  
      const updatedOffer = await existingOffer.save();
  
      res.status(200).json(updatedOffer);
    } catch (error) {
      console.error("Error updating offer:", error);
      res.status(500).json({ error: "Internal server error" });
    }
};

exports.deleteOffer = async (req, res) => {
  try {
    const { id } = req.params;

    const offer = await offerModel.findByIdAndDelete(id);

    if (!offer) {
      return res.status(404).json({ error: "Offer not found" });
    }

    res.status(200).json({ message: "Offer deleted successfully" });
  } catch (error) {
    console.error("Error deleting offer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

