const express = require('express');
const router = express.Router();

// Mock service disabled for production deploy path.
// const shiprocketService = require('../services/shiprocketMockService');
const shiprocketService = require('../controllers/shiprocketController');

// Shiprocket webhook endpoint
router.post('/shiprocket', shiprocketService.handleShiprocketWebhook);

module.exports = router;

