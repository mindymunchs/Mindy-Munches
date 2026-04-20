const express = require('express');
const router = express.Router();
const videoTestimonialController = require('../controllers/videoTestimonialController');

// Public route - GET all video testimonials (no auth required)
router.get('/video-testimonials', videoTestimonialController.getAllVideoTestimonials);

module.exports = router;
