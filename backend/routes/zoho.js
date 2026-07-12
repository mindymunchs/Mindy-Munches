const express = require('express');
const router = express.Router();
const { authenticate, requireAdmin } = require('../middleware/auth');
const ctrl = require('../controllers/zohoController');

// Admin — manually trigger invoice for an order
router.post('/orders/:id/invoice', authenticate, requireAdmin, ctrl.createInvoice);

// Admin — manually sync user to CRM
router.post('/users/:id/sync-contact', authenticate, requireAdmin, ctrl.syncContact);

module.exports = router;
