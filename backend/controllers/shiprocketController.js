const Order = require('../models/Order');
const shiprocket = require('../services/shiprocketService');

// Manually push an order to Shiprocket (admin action)
exports.pushOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'email');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (order.shiprocketOrderId) {
      return res.status(400).json({ success: false, message: 'Order already pushed to Shiprocket' });
    }

    const result = await shiprocket.createShipment({ ...order.toObject(), customerEmail: order.user?.email });
    if (!result) {
      return res.status(503).json({ success: false, message: 'Shiprocket not configured' });
    }

    order.shiprocketOrderId = result.shiprocketOrderId;
    order.shiprocketShipmentId = result.shipmentId;
    order.trackingNumber = result.awb;
    order.courierName = result.courierName;
    order.trackingUrl = result.trackingUrl;
    await order.save();

    res.json({ success: true, message: 'Order pushed to Shiprocket', data: result });
  } catch (err) {
    console.error('[Shiprocket] pushOrder error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get live tracking for an order
exports.getTracking = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (!order.trackingNumber) {
      return res.json({ success: true, data: null, message: 'No tracking number yet' });
    }

    const tracking = await shiprocket.getTracking(order.trackingNumber);
    res.json({ success: true, data: tracking });
  } catch (err) {
    console.error('[Shiprocket] getTracking error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Check pincode serviceability
exports.checkServiceability = async (req, res) => {
  try {
    const { pincode, weight } = req.query;
    if (!pincode) return res.status(400).json({ success: false, message: 'pincode is required' });

    const result = await shiprocket.checkServiceability(pincode, weight || 0.5);
    if (!result) return res.json({ success: true, serviceable: true, message: 'Shiprocket not configured — assuming serviceable' });

    res.json({ success: true, ...result });
  } catch (err) {
    console.error('[Shiprocket] serviceability error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Webhook — Shiprocket pushes status updates here
exports.webhook = async (req, res) => {
  try {
    const { awb, current_status, order_id } = req.body;

    const statusMap = {
      'Pickup Scheduled': 'processing',
      'Pickup Generated': 'processing',
      'Out For Pickup': 'processing',
      'Picked Up': 'processing',
      'In Transit': 'shipped',
      'Out For Delivery': 'shipped',
      'Delivered': 'delivered',
      'RTO Initiated': 'cancelled',
      'RTO Delivered': 'cancelled',
      'Cancelled': 'cancelled',
    };

    const newStatus = statusMap[current_status];
    if (!newStatus) return res.status(200).send('OK');

    const order = await Order.findOne({
      $or: [
        { trackingNumber: awb },
        { shiprocketOrderId: order_id?.toString() }
      ]
    });

    if (!order) return res.status(200).send('OK');

    order.orderStatus = newStatus;
    if (newStatus === 'delivered') order.deliveredAt = new Date();

    order.statusHistory = order.statusHistory || [];
    order.statusHistory.push({ status: newStatus, note: `Shiprocket: ${current_status}`, updatedAt: new Date() });

    await order.save();
    console.log(`[Shiprocket Webhook] Order ${order.orderNumber} → ${newStatus}`);

    res.status(200).send('OK');
  } catch (err) {
    console.error('[Shiprocket Webhook] error:', err.message);
    res.status(500).send('Error');
  }
};
