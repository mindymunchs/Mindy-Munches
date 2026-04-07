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
// ✅ NEW: Import promo code controller
const {
  getAllPromoCodes,
  createPromoCode,
  updatePromoCode,
  deletePromoCode,
  togglePromoCodeStatus
} = require('../controllers/promoCodeController');
const { getAllFeedbackForAdmin, deleteFeedbackForAdmin } = require('../controllers/feedbackController');

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

// ✅ NEW: Promo Code routes
router.get('/promo-codes', getAllPromoCodes);
router.post('/promo-codes', createPromoCode);
router.put('/promo-codes/:id', updatePromoCode);
router.delete('/promo-codes/:id', deletePromoCode);
router.patch('/promo-codes/:id/toggle', togglePromoCodeStatus);
router.get('/feedback', getAllFeedbackForAdmin);
router.delete('/feedback/:id', deleteFeedbackForAdmin);

module.exports = router;
