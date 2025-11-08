const express = require('express');
const router = express.Router();
const { getDashboardStats, getAnalytics } = require('../controllers/dashboardController');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { getBestsellers } = require('../controllers/productController');
const { searchUsers, getAllAdmins, promoteUser, demoteAdmin } = require('../controllers/adminController');
const { getStockStats, updateStock, restockLowItems } = require('../controllers/stockController');

// ✅ Import testimonial controllers
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

// Protect all routes and allow only admins
router.use(authenticate);
router.use(requireAdmin);

// Existing routes
router.get('/bestsellers', getBestsellers);
router.get('/overview-stats', getDashboardStats);

// Stock management routes
router.get('/stock/stats', getStockStats);
router.patch('/stock/:productId', updateStock);
router.post('/stock/restock-low', restockLowItems);

// User management routes
router.get('/users/search', searchUsers);
router.get('/admins', getAllAdmins);
router.patch('/users/:id/promote', promoteUser);
router.patch('/users/:id/demote', demoteAdmin);
router.get('/analytics', getAnalytics);

// ✅ TEXT TESTIMONIAL ROUTES (CRUD)
router.get('/testimonials', getAllTestimonials);           // Get all
router.post('/testimonials', createTestimonial);           // Create
router.put('/testimonials/:id', updateTestimonial);        // Update
router.delete('/testimonials/:id', deleteTestimonial);     // Delete

// ✅ VIDEO TESTIMONIAL ROUTES (CRUD)
router.get('/video-testimonials', getAllVideoTestimonials);           // Get all
router.post('/video-testimonials', createVideoTestimonial);           // Create
router.put('/video-testimonials/:id', updateVideoTestimonial);        // Update
router.delete('/video-testimonials/:id', deleteVideoTestimonial);     // Delete

module.exports = router;
