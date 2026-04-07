const Feedback = require("../models/Feedback");

exports.submitFeedback = async (req, res) => {
  try {
    const {
      name = "",
      email = "",
      q1ChoiceOverChai,
      q2DailyFixedTime,
      q3TryPack4050,
      q4TasteRating,
      additionalNotes = "",
    } = req.body;

    if (!q1ChoiceOverChai || !q2DailyFixedTime || !q3TryPack4050 || !q4TasteRating) {
      return res.status(400).json({
        success: false,
        message: "Please answer all required questions.",
      });
    }

    const feedback = await Feedback.create({
      name,
      email,
      q1ChoiceOverChai,
      q2DailyFixedTime,
      q3TryPack4050,
      q4TasteRating,
      additionalNotes,
    });

    res.status(201).json({
      success: true,
      message: "Thanks for your feedback!",
      data: { id: feedback._id },
    });
  } catch (error) {
    console.error("Feedback submission error:", error);
    res.status(500).json({
      success: false,
      message: "Could not submit feedback right now. Please try again.",
    });
  }
};

exports.getAllFeedbackForAdmin = async (req, res) => {
  try {
    const feedback = await Feedback.find({})
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: feedback.length,
      data: feedback,
    });
  } catch (error) {
    console.error("Fetch feedback error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch feedback entries.",
    });
  }
};

exports.deleteFeedbackForAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Feedback.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Feedback entry not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Feedback entry deleted successfully.",
    });
  } catch (error) {
    console.error("Delete feedback error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete feedback entry.",
    });
  }
};
