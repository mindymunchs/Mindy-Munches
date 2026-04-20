const express = require('express');
const router = express.Router();
const { authenticate, requireAdmin } = require('../middleware/auth');
const {
  validatePromoCode,
  applyPromoCode,
  getAllPromoCodes,
  createPromoCode,
  updatePromoCode,
  deletePromoCode,
  togglePromoCodeStatus
} = require('../controllers/promoCodeController');

// Public routes
router.post('/validate', validatePromoCode); // Validate during checkout
router.post('/apply', applyPromoCode); // Apply after order confirmation

// Admin routes
router.use(authenticate);
router.use(requireAdmin);

router.get('/', getAllPromoCodes);
router.post('/', createPromoCode);
router.put('/:id', updatePromoCode);
router.delete('/:id', deletePromoCode);
router.patch('/:id/toggle', togglePromoCodeStatus);

module.exports = router;
