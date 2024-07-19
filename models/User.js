import mongoose from "mongoose";

const ZeroCardSchema = new mongoose.Schema(
  {
    cardNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    lastRecharge: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true }
);

const JourneySchema = new mongoose.Schema(
  {
    travelDate: {
      type: Date,
      required: true,
    },
    isReturnJourney: {
      type: Boolean,
      default: false,
    },
    passengerType: {
      type: String,
      enum: ["kid", "adult", "old"],
      required: true,
    },
    fare: {
      type: Number,
      required: true,
    },
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },

    discount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 10,
      minlength: 10,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    passengerType: {
      type: String,
      enum: ["kid", "adult", "old"],
      default: "adult",
    },

    zeroCard: {
      type: ZeroCardSchema,
      required: false,
    },
    journeys: [JourneySchema],
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
