const mongoose = require("mongoose");

const feedbackQuestionSchema = new mongoose.Schema(
  {
    questionId: {
      type: String,
      required: true,
      trim: true,
    },
    questionText: {
      type: String,
      required: true,
      trim: true,
    },
    yesLabel: {
      type: String,
      required: true,
      trim: true,
      default: "Yes",
    },
    noLabel: {
      type: String,
      required: true,
      trim: true,
      default: "No",
    },
  },
  { _id: false }
);

const feedbackFormConfigSchema = new mongoose.Schema(
  {
    productTitle: {
      type: String,
      trim: true,
      default: "About Daily Performance Fuel",
    },
    productDescription: {
      type: String,
      trim: true,
      default:
        "A light, convenient daily drink designed to help maintain steady energy during busy routines.",
    },
    productHighlights: {
      type: [String],
      default: [
        "Quick to prepare and easy to carry",
        "Built for work, travel, and post-lunch routines",
        "Made to support consistent daily performance",
      ],
    },
    questions: {
      type: [feedbackQuestionSchema],
      default: [
        {
          questionId: "q1",
          questionText:
            "Would you choose this over chai/snacks for a daily energy top-up?",
          yesLabel: "Yes",
          noLabel: "No",
        },
        {
          questionId: "q2",
          questionText:
            "Can you see yourself having this daily at a fixed time?",
          yesLabel: "Yes",
          noLabel: "No",
        },
        {
          questionId: "q3",
          questionText:
            "Would you try a 10-day pack if it helps avoid energy dips?",
          yesLabel: "Yes",
          noLabel: "No",
        },
        {
          questionId: "q4",
          questionText: "Did the taste work for you overall?",
          yesLabel: "Yes",
          noLabel: "No",
        },
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FeedbackFormConfig", feedbackFormConfigSchema);
