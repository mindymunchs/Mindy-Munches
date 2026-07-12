const express = require('express');
const router = express.Router();
const { authenticate, requireAdmin } = require('../middleware/auth');
const ctrl = require('../controllers/shiprocketController');

// Public — Shiprocket webhook (no auth, Shiprocket calls this)
router.post('/webhook', ctrl.webhook);

// Public — pincode serviceability check (called from checkout)
router.get('/serviceability', ctrl.checkServiceability);

// Admin — manually push order to Shiprocket
router.post('/orders/:id/push', authenticate, requireAdmin, ctrl.pushOrder);

// User — get live tracking for their order
router.get('/orders/:id/tracking', authenticate, ctrl.getTracking);

module.exports = router;
