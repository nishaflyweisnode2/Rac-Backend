const serviceDist = require('../models/serviceableDistance');

exports.getSeviceAreaById = async (req, res) => {
  try {
    const seviceAreaId = req.params.id;
    const seviceArea = await serviceDist.findById({ _id: seviceAreaId });
    if (!seviceArea) {
      return res.status(404).json({ error: "Sevice Area not found" });
    }
    res.status(200).json({ msg: seviceArea });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllSeviceAreas = async (req, res) => {
  try {
    const seviceAreas = await serviceDist.find();
    if (!seviceAreas || seviceAreas.length == 0) {
      return res.status(400).json({ error: "serviceArea is required" });
    }
    res.status(200).json({ msg: seviceAreas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.createSeviceArea = async (req, res) => {
  try {
    const {value,type} = req.body;
    if (!value && !type) {
      return res.status(400).json({ error: "value and type is required" });
    }

    const newSeviceArea = new serviceDist({ value,type });
    const savedSeviceArea = await newSeviceArea.save();

    res.status(201).json(savedSeviceArea);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateSeviceArea = async (req, res) => {
  try {
    const seviceAreaId = req.params.id;
    const updates = req.body;
    
    const updatedSeviceArea = await serviceDist.findByIdAndUpdate(seviceAreaId, updates, { new: true });
    
    if (!updatedSeviceArea) {
      return res.status(404).json({ error: "Sevice Area not found" });
    }
    
    res.status(200).json(updatedSeviceArea);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteSeviceArea = async (req, res) => {
  try {
    const seviceAreaId = req.params.id;
    const deletedSeviceArea = await serviceDist.findByIdAndDelete(seviceAreaId);
    
    if (!deletedSeviceArea) {
      return res.status(404).json({ error: "Sevice Area not found" });
    }
    
    res.status(200).json({ message: "Sevice Area deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};