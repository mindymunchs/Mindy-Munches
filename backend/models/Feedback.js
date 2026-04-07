const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    q1ChoiceOverChai: {
      type: String,
      required: true,
      enum: ["yes", "maybe", "no"],
    },
    q2DailyFixedTime: {
      type: String,
      required: true,
      enum: ["yes", "maybe", "no"],
    },
    q3TryPack4050: {
      type: String,
      required: true,
      enum: ["yes", "maybe", "no"],
    },
    q4TasteRating: {
      type: String,
      required: true,
      enum: ["game-up", "excellent", "good", "average", "poor"],
    },
    additionalNotes: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
