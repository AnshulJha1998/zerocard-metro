import User from "../models/User.js";

export const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
};
export const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted.");
  } catch (err) {
    next(err);
  }
};
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

export const recordJourney = async (req, res) => {
  const { userId, journeyDetails } = req.body;

  try {
    const user = await User.findById(userId).populate("zeroCard");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const journey = {
      travelDate: new Date(),
      isReturnJourney: journeyDetails.isReturnJourney,
      passengerType: user.passengerType,
      fare: journeyDetails.fare,
      discount: journeyDetails.discount,
    };

    user.journeys.push(journey);
    await user.save();

    const summary =
      (await Summary.findOne({ date: new Date().setHours(0, 0, 0, 0) })) ||
      new Summary({ date: new Date().setHours(0, 0, 0, 0) });
    summary.totalAmountCollected += journey.fare;
    summary.totalDiscountGiven += journey.discount;
    summary.passengerSummary[user.passengerType] += 1;

    await summary.save();

    res
      .status(200)
      .json({ message: "Journey recorded successfully", user, summary });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
