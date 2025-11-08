const express = require('express');
const router = express.Router();
const { getAllTestimonials } = require('../controllers/testimonialController');
const { getAllVideoTestimonials } = require('../controllers/videoTestimonialController');

// Public routes (no auth required)
router.get('/', getAllTestimonials);
router.get('/video-testimonials', getAllVideoTestimonials);

module.exports = router;
