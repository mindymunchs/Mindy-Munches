const Order = require('../models/Order');
const User = require('../models/User');
const zoho = require('../services/zohoService');

// Manually trigger invoice creation for an order (admin)
exports.createInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'email');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (order.zohoInvoiceId) {
      return res.status(400).json({ success: false, message: 'Invoice already exists', invoiceId: order.zohoInvoiceId });
    }

    const invoiceId = await zoho.createInvoice({ ...order.toObject(), customerEmail: order.user?.email });
    if (!invoiceId) return res.status(503).json({ success: false, message: 'Zoho Books not configured' });

    order.zohoInvoiceId = invoiceId;
    await order.save();

    res.json({ success: true, invoiceId });
  } catch (err) {
    console.error('[Zoho] createInvoice error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Manually sync a user to Zoho CRM (admin)
exports.syncContact = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const contactId = await zoho.syncContact(user);
    if (!contactId) return res.status(503).json({ success: false, message: 'Zoho CRM not configured' });

    user.zohoContactId = contactId;
    await user.save();

    res.json({ success: true, contactId });
  } catch (err) {
    console.error('[Zoho] syncContact error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
