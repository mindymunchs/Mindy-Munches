const express = require('express');
const router = express.Router();
const { getDashboardStats, getAnalytics } = require('../controllers/dashboardController');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { getBestsellers } = require('../controllers/productController');
const { searchUsers, getAllAdmins, promoteUser, demoteAdmin } = require('../controllers/adminController');
const { getStockStats, updateStock, restockLowItems } = require('../controllers/stockController');
const {
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
} = require('../controllers/testimonialController');
const {
  getAllVideoTestimonials,
  createVideoTestimonial,
  updateVideoTestimonial,
  deleteVideoTestimonial
} = require('../controllers/videoTestimonialController');
const {
  getAllFeedbackForAdmin,
  deleteFeedbackForAdmin,
  getFeedbackFormConfig,
  updateFeedbackFormConfigForAdmin,
} = require('../controllers/feedbackController');

// Protect all routes
router.use(authenticate);
router.use(requireAdmin);

// Existing routes
router.get('/bestsellers', getBestsellers);
router.get('/overview-stats', getDashboardStats);
router.get('/stock/stats', getStockStats);
router.patch('/stock/:productId', updateStock);
router.post('/stock/restock-low', restockLowItems);
router.get('/users/search', searchUsers);
router.get('/admins', getAllAdmins);
router.patch('/users/:id/promote', promoteUser);
router.patch('/users/:id/demote', demoteAdmin);
router.get('/analytics', getAnalytics);

// Testimonial routes
router.get('/testimonials', getAllTestimonials);
router.post('/testimonials', createTestimonial);
router.put('/testimonials/:id', updateTestimonial);
router.delete('/testimonials/:id', deleteTestimonial);

// Video testimonial routes
router.get('/video-testimonials', getAllVideoTestimonials);
router.post('/video-testimonials', createVideoTestimonial);
router.put('/video-testimonials/:id', updateVideoTestimonial);
router.delete('/video-testimonials/:id', deleteVideoTestimonial);

// Feedback routes
router.get('/feedback', getAllFeedbackForAdmin);
router.delete('/feedback/:id', deleteFeedbackForAdmin);
router.get('/feedback/config', getFeedbackFormConfig);
router.put('/feedback/config', updateFeedbackFormConfigForAdmin);

module.exports = router;
