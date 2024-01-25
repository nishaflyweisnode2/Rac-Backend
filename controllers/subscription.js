const User = require("../models/user.model");
const Subscription = require("../models/subscription");

exports.postSubscriptions = async (req, res) => {
  try {
    const { planName, amount, data } = req.body;
    const subscription = await Subscription.findOne({ planName: planName });
    if (!subscription || subscription == 0) {
      const newSubscription = await Subscription.create({
        planName,
        amount,
        data,
      });

      res.status(201).json({
        message: "Subscription created successfully",
        subscription: newSubscription,
      });
    }else{
        return res.status(404).json({ message: "this subscription already exist" });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.subscribe = async (req, res) => {
  try {
    const { userId, subscriptionId } = req.body;
    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }
    
    // Calculate the subscription expiration date (1 month from the current date)
    const subscriptionExpiration = new Date();
    subscriptionExpiration.setMonth(subscriptionExpiration.getMonth() + 1);

    const user = await User.findByIdAndUpdate(
      userId,
      {
        subscriptionId: subscription._id,
        subscriptionExpiration,
        subscriptionVerification: true,
      },
      { new: true }
    );

    res.status(200).json({
      message: "User subscription updated",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find();
    res.status(200).json({ msg: subscriptions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getSubscriptionById = async (req, res) => {
  try {
    const subscriptionId = req.params.id;
    const subscription = await Subscription.findById(subscriptionId);

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    res.status(200).json({ msg: subscription });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a subscription
exports.updateSubscription = async (req, res) => {
    try {
      const subscriptionId = req.params.id;
      const newData = req.body.data; // New data to be pushed
  
      const updatedSubscription = await Subscription.findByIdAndUpdate(
        subscriptionId,
        { $push: { data: newData } },
        { new: true }
      );
  
      if (!updatedSubscription) {
        return res.status(404).json({ message: "Subscription not found" });
      }
  
      res.status(200).json(updatedSubscription);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
};  

// Delete a subscription
exports.deleteSubscription = async (req, res) => {
  try {
    const subscriptionId = req.params.id;

    const deletedSubscription = await Subscription.findByIdAndDelete(
      subscriptionId
    );

    if (!deletedSubscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    res.status(200).json({ message: "Subscription deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
