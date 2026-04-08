const express = require("express");
const router = express.Router();
const {
  submitFeedback,
  getFeedbackFormConfig,
} = require("../controllers/feedbackController");

router.get("/config", getFeedbackFormConfig);
router.post("/", submitFeedback);

module.exports = router;
