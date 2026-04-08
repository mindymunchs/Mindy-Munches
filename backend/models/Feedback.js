const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    answers: [
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
        selectedValue: {
          type: String,
          required: true,
          enum: ["yes", "no"],
        },
        selectedLabel: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
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
