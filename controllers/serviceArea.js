const serviceArea = require('../models/serviceArea');

exports.createSeviceArea = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const newSeviceArea = new serviceArea({ name });
    const savedSeviceArea = await newSeviceArea.save();

    res.status(201).json(savedSeviceArea);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllSeviceAreas = async (req, res) => {
  try {
    const seviceAreas = await serviceArea.find();
    if (!seviceAreas || serviceArea.length==0) {
        return res.status(400).json({ error: "serviceArea is required" });
      }
    res.status(200).json({msg:seviceAreas});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getSeviceAreaById = async (req, res) => {
  try {
    const seviceAreaId = req.params.id;
    const seviceArea = await serviceArea.findById({_id:seviceAreaId});
        if (!seviceArea) {
      return res.status(404).json({ error: "Sevice Area not found" });
    }
        res.status(200).json({msg:seviceArea});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateSeviceArea = async (req, res) => {
  try {
    const seviceAreaId = req.params.id;
    const updates = req.body;
    
    const updatedSeviceArea = await serviceArea.findByIdAndUpdate(seviceAreaId, updates, { new: true });
    
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
    const deletedSeviceArea = await serviceArea.findByIdAndDelete(seviceAreaId);
    
    if (!deletedSeviceArea) {
      return res.status(404).json({ error: "Sevice Area not found" });
    }
    
    res.status(200).json({ message: "Sevice Area deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


