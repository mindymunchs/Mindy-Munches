const Feedback = require("../models/Feedback");
const FeedbackFormConfig = require("../models/FeedbackFormConfig");

const getOrCreateFeedbackConfig = async () => {
  let config = await FeedbackFormConfig.findOne({});
  if (!config) {
    config = await FeedbackFormConfig.create({});
  }
  return config;
};

const normalizeIndianPhone = (input) => {
  const digitsOnly = String(input || "").replace(/\D/g, "");
  if (!digitsOnly) return "";
  const withoutCountryCode = digitsOnly.startsWith("91") && digitsOnly.length === 12
    ? digitsOnly.slice(2)
    : digitsOnly;
  return withoutCountryCode;
};

exports.submitFeedback = async (req, res) => {
  try {
    const {
      name = "",
      phone = "",
      answers = [],
      additionalNotes = "",
    } = req.body;

    const config = await getOrCreateFeedbackConfig();
    const configuredQuestions = Array.isArray(config.questions) ? config.questions : [];
    const normalizedPhone = normalizeIndianPhone(phone);

    if (!configuredQuestions.length) {
      return res.status(400).json({
        success: false,
        message: "No active questions configured for feedback form.",
      });
    }

    if (!Array.isArray(answers) || answers.length !== configuredQuestions.length) {
      return res.status(400).json({
        success: false,
        message: "Please answer all required questions.",
      });
    }

    if (!normalizedPhone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required.",
      });
    }

    if (normalizedPhone && !/^[6-9]\d{9}$/.test(normalizedPhone)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid Indian phone number.",
      });
    }

    const questionMap = new Map(
      configuredQuestions.map((question) => [question.questionId, question])
    );

    const normalizedAnswers = [];
    for (const answer of answers) {
      const question = questionMap.get(answer.questionId);
      if (!question) {
        return res.status(400).json({
          success: false,
          message: "Invalid question submitted.",
        });
      }

      if (!["yes", "no"].includes(answer.selectedValue)) {
        return res.status(400).json({
          success: false,
          message: "Only Yes/No answers are allowed.",
        });
      }

      normalizedAnswers.push({
        questionId: question.questionId,
        questionText: question.questionText,
        selectedValue: answer.selectedValue,
        selectedLabel: answer.selectedValue === "yes" ? question.yesLabel : question.noLabel,
      });
    }

    const feedback = await Feedback.create({
      name,
      phone: normalizedPhone,
      answers: normalizedAnswers,
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

exports.getFeedbackFormConfig = async (req, res) => {
  try {
    const config = await getOrCreateFeedbackConfig();
    res.status(200).json({
      success: true,
      data: config,
    });
  } catch (error) {
    console.error("Fetch feedback config error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch feedback form configuration.",
    });
  }
};

exports.updateFeedbackFormConfigForAdmin = async (req, res) => {
  try {
    const {
      productTitle = "",
      productDescription = "",
      productHighlights = [],
      questions = [],
    } = req.body;

    if (!Array.isArray(questions) || !questions.length) {
      return res.status(400).json({
        success: false,
        message: "At least one question is required.",
      });
    }

    const cleanedQuestions = questions.map((question, idx) => ({
      questionId: String(question.questionId || `q${idx + 1}`).trim(),
      questionText: String(question.questionText || "").trim(),
      yesLabel: String(question.yesLabel || "Yes").trim(),
      noLabel: String(question.noLabel || "No").trim(),
    }));

    const invalidQuestion = cleanedQuestions.find(
      (question) =>
        !question.questionId ||
        !question.questionText ||
        !question.yesLabel ||
        !question.noLabel
    );

    if (invalidQuestion) {
      return res.status(400).json({
        success: false,
        message: "Each question must have id, text, yes option, and no option.",
      });
    }

    const uniqueQuestionIds = new Set(cleanedQuestions.map((question) => question.questionId));
    if (uniqueQuestionIds.size !== cleanedQuestions.length) {
      return res.status(400).json({
        success: false,
        message: "Question ids must be unique.",
      });
    }

    const cleanedHighlights = Array.isArray(productHighlights)
      ? productHighlights
          .map((item) => String(item || "").trim())
          .filter(Boolean)
      : [];

    const config = await getOrCreateFeedbackConfig();
    config.productTitle = String(productTitle || "").trim();
    config.productDescription = String(productDescription || "").trim();
    config.productHighlights = cleanedHighlights;
    config.questions = cleanedQuestions;
    await config.save();

    res.status(200).json({
      success: true,
      message: "Feedback form configuration updated successfully.",
      data: config,
    });
  } catch (error) {
    console.error("Update feedback config error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update feedback form configuration.",
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
