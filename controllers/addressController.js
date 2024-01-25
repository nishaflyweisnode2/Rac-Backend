const address = require('../models/addressModel')




exports.addAddress = async (req, res) => {
    try {
      const addressData = await address.create({
        userId: req.user.id,
        // Add other properties from req.body here
        street: req.body.street,
        name: req.body.name,
        email:req.body.email,
        mobile: req.body.mobile,
        altMobile:req.body.altMobile,
        pncode:req.body.pncode,
        state:req.body.state,
        city: req.body.city,
        house:req.body.house,landmark: req.body.landmark,
        city:req.body.city,
        country:req.body.country,
        // Add more properties as needed
      });
  
      res.status(200).json({
        data: addressData,
        message: "Address data added",
      });
    } catch (err) {
      console.error(err);
      res.status(400).send({ message: err.message });
    }
  };
  
exports.getAddress = async(req,res) => {
    try {
        const data = await address.find();

        res.status(200).json({
            addresss  : data
        })
        
    }catch(err)
    {
        res.status(400).send({mesage : err.mesage});
    }
}

exports.getUserAddresses = async (req, res) => {
    try {
      // Assuming user ID is available in req.user.id
      const userId = req.user.id;
  
      // Fetch addresses for the user
      const addresses = await address.find({ userId });
  
      res.status(200).json({
        data: addresses,
        message: 'User addresses retrieved successfully',
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  exports.updateAddress = async (req, res) => {
    try {
      // Assuming user ID is available in req.user.id
      const userId = req.user.id;
  
      // Find the address to update
      const addressId = req.params.addressId;
      const updatedAddress = req.body;
  
      // Update the address
      const result = await address.findOneAndUpdate(
        { _id: addressId, userId },
        { $set: updatedAddress },
        { new: true }
      );
  
      if (!result) {
        return res.status(404).json({ message: 'Address not found or does not belong to the user' });
      }
  
      res.status(200).json({
        data: result,
        message: 'Address updated successfully',
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

  exports.deleteAddress = async (req, res) => {
    try {
      // Assuming user ID is available in req.user.id
      const userId = req.user.id;
  
      // Find the address to delete
      const addressId = req.params.addressId;
  
      // Delete the address
      const result = await address.findOneAndDelete({ _id: addressId, userId });
  
      if (!result) {
        return res.status(404).json({ message: 'Address not found or does not belong to the user' });
      }
  
      res.status(200).json({
        data: result,
        message: 'Address deleted successfully',
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };