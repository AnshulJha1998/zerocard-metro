import Summary from "../models/Summary.js";
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
  const { userId, from: fromStation, to: toStation, date, fare } = req.body;

  const isSameDay = (d1, d2) => {
    return (
      (d1.getDate() === d2.getDate() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getFullYear() === d2.getFullYear()) ||
      null
    );
  };

  try {
    const user = await User.findById(userId).populate("zeroCard");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const travelDate = new Date(date);
    const today = new Date();

    if (fromStation === toStation) {
      return res.status(400).json({
        message: "Starting and ending destinations cannot be the same",
      });
    }

    if (travelDate < today) {
      return res
        .status(400)
        .json({ message: "Travel date cannot be in the past" });
    }

    if (user.zeroCard.balance < fare) {
      return res
        .status(400)
        .json({ message: "Please recharge your card to continue" });
    }

    // Check if the user has already booked the same journey on the same date

    const lastJourney = user.journeys[user.journeys.length - 1];
    const secondLastJourney = user.journeys[user.journeys.length - 2];

    const sameJourney =
      lastJourney?.from === fromStation &&
      lastJourney?.to === toStation &&
      isSameDay(lastJourney?.travelDate, travelDate);

    if (sameJourney) {
      return res.status(400).json({
        message: "Journey already booked for the same date and stations.",
      });
    }

    let discount = 0;

    let returnJourney = false;
    // Check if it's a return journey on the same day

    let secondLastCondition =
      secondLastJourney?.from === fromStation &&
      secondLastJourney?.to === toStation &&
      isSameDay(secondLastJourney?.travelDate, travelDate);

    returnJourney =
      lastJourney?.from === toStation &&
      lastJourney?.to === fromStation &&
      isSameDay(lastJourney?.travelDate, travelDate);

    if (user.journeys.length % 2 === 0 && secondLastCondition) {
      returnJourney = false;
    } else if (user.journeys.length % 2 !== 0 && secondLastCondition) {
      returnJourney = true;
    }

    if (returnJourney) {
      discount = fare * 0.5;
    }

    const journey = {
      travelDate: travelDate,
      from: fromStation,
      to: toStation,
      isReturnJourney: !!returnJourney,
      passengerType: user.passengerType,
      fare: fare - discount,
      discount: discount,
    };

    // Deduct fare from the user's ZeroCard balance
    user.zeroCard.balance -= fare - discount;

    user.journeys.push(journey);

    // Update the summary
    let summary = await Summary.findOne({
      $expr: {
        $eq: [
          { $dateTrunc: { date: "$date", unit: "day" } },
          { $dateTrunc: { date: travelDate, unit: "day" } },
        ],
      },
    }).sort({ date: -1 });

    if (!summary) {
      summary = new Summary({
        date: travelDate,
        totalAmountCollected: 0,
        totalDiscountGiven: 0,
        passengerSummary: {
          kid: 0,
          adult: 0,
          old: 0,
        },
        serviceFees: {
          newDelhi: 0,
          airport: 0,
        },
      });
    }
    summary.totalAmountCollected += fare - discount;
    summary.totalDiscountGiven += discount;
    summary.passengerSummary[user.passengerType] += 1;

    await user.save();
    await summary.save();

    res.status(200).json({
      message: "Journey recorded successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const rechargeUserCard = async (req, res, next) => {
  const stations = {
    "New Delhi": "newDelhi",
    Airport: "airport",
  };

  try {
    const { userId, rechargeAmount, fromStation } = req.body;

    console.log(req.body);

    const user = await User.findById(userId).populate("zeroCard");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentDate = new Date();
    const totalAmount = rechargeAmount + 10;

    user.zeroCard.balance += totalAmount;
    user.zeroCard.lastRecharge = currentDate;

    console.log("1");
    let summary = await Summary.findOne({
      $expr: {
        $eq: [
          { $dateTrunc: { date: "$date", unit: "day" } },
          { $dateTrunc: { date: currentDate, unit: "day" } },
        ],
      },
    }).sort({ date: -1 });

    if (!summary) {
      summary = new Summary({
        date: currentDate,
        serviceFees: {
          [stations[fromStation]]: serviceFee,
        },
      });
    }

    summary.totalAmountCollected += totalAmount;
    summary.serviceFees[stations[fromStation]] += serviceFee;

    await summary.save();
    await user.save();
    res.json({ message: "Card recharged successfully" });
  } catch (err) {
    next(err);
  }
};
