import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError, generateRandomNumber } from "../utils/misc.js";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const zeroCard = {
      cardNumber: generateRandomNumber(),
      balance: 0,
    };

    let newUser;

    if (req.body.role === "admin") {
      newUser = await User.create({
        ...req.body,
        password: hash,
      });
    } else {
      newUser = await User.create({
        ...req.body,
        password: hash,
        zeroCard,
      });
    }

    res.status(200).json({ message: "User has been created.", newUser });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  const { email, username } = req.body;
  try {
    const user = await User.findOne({ email, username });
    if (!user) return next(createError(404, "User not found!"));

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect) return next(createError(400, "Wrong password!"));

    const token = jwt.sign(
      { id: user._id, role: user.role, zeroCardNumber: user.zeroCard },
      process.env.JWT,
      {
        expiresIn: 60 * 60,
      }
    );

    const { password, ...otherDetails } = user._doc;
    res
      .cookie("token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({ ...otherDetails, token: token });
  } catch (err) {
    next(err);
  }
};
