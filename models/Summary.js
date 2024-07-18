import mongoose from "mongoose";

const SummarySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true,
  },
  totalAmountCollected: {
    type: Number,
    default: 0,
  },
  totalDiscountGiven: {
    type: Number,
    default: 0,
  },
  passengerSummary: {
    kid: {
      type: Number,
      default: 0,
    },
    adult: {
      type: Number,
      default: 0,
    },
    senior: {
      type: Number,
      default: 0,
    },
  },
});

export default mongoose.model("Summary", SummarySchema);
