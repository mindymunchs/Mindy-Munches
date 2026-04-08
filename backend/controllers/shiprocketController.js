const axios = require('axios');
const Order = require('../models/Order');
const emailService = require('../services/emailService');

// Shiprocket API credentials
const SHIPROCKET_EMAIL = process.env.SHIPROCKET_EMAIL;
const SHIPROCKET_PASSWORD = process.env.SHIPROCKET_PASSWORD;
const SHIPROCKET_API_URL = 'https://apiv2.shiprocket.in/v1/external';

// Get Shiprocket auth token
let shiprocketToken = null;
let tokenExpiry = null;

const getShiprocketToken = async () => {
  try {
    // Return cached token if still valid
    if (shiprocketToken && tokenExpiry && new Date() < tokenExpiry) {
      return shiprocketToken;
    }

    const response = await axios.post(`${SHIPROCKET_API_URL}/auth/login`, {
      email: SHIPROCKET_EMAIL,
      password: SHIPROCKET_PASSWORD
    });

    shiprocketToken = response.data.token;
    // Token expires in 10 days, cache for 9 days
    tokenExpiry = new Date(Date.now() + 9 * 24 * 60 * 60 * 1000);
    
    console.log('✅ Shiprocket token obtained');
    return shiprocketToken;
  } catch (error) {
    console.error('❌ Failed to get Shiprocket token:', error.response?.data || error.message);
    throw error;
  }
};

// Create Shiprocket order
exports.createShiprocketOrder = async (order) => {
  try {
    console.log('📦 Creating Shiprocket order for:', order.orderNumber);
    
    const token = await getShiprocketToken();

    const shiprocketOrderData = {
      order_id: order.orderNumber,
      order_date: order.createdAt.toISOString().split('T')[0],
      pickup_location: "Primary", // Set your pickup location in Shiprocket dashboard
      billing_customer_name: order.shippingAddress.name,
      billing_last_name: "",
      billing_address: order.shippingAddress.street,
      billing_city: order.shippingAddress.city,
      billing_pincode: order.shippingAddress.zipCode,
      billing_state: order.shippingAddress.state,
      billing_country: order.shippingAddress.country || "India",
      billing_email: order.user?.email || 'customer@mindymunchs.com',
      billing_phone: order.shippingAddress.phone,
      shipping_is_billing: true,
      order_items: order.items.map(item => ({
        name: item.name,
        sku: item.product?.toString() || 'SKU001',
        units: item.quantity,
        selling_price: item.price,
        discount: 0,
        tax: 0,
        hsn: 0
      })),
      payment_method: order.paymentMethod === 'cod' ? 'COD' : 'Prepaid',
      sub_total: order.subtotal,
      length: 10,
      breadth: 10,
      height: 10,
      weight: 0.5
    };

    const response = await axios.post(
      `${SHIPROCKET_API_URL}/orders/create/adhoc`,
      shiprocketOrderData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Update order with Shiprocket details
    order.shiprocketOrderId = response.data.order_id?.toString();
    order.shiprocketShipmentId = response.data.shipment_id?.toString();
    order.shiprocketAwbCode = response.data.awb_code;
    order.courierName = response.data.courier_name;
    
    await order.save();

    console.log('✅ Shiprocket order created:', response.data.order_id);
    return response.data;
  } catch (error) {
    console.error('❌ Shiprocket order creation error:', error.response?.data || error.message);
    throw error;
  }
};

// ✅ UPDATED: Handle Shiprocket webhooks with email notifications
exports.handleShiprocketWebhook = async (req, res) => {
  try {
    const webhookData = req.body;
    
    console.log('📨 Shiprocket Webhook Received:', webhookData.current_status);

    const order = await Order.findOne({
      $or: [
        { shiprocketAwbCode: webhookData.awb },
        { shiprocketOrderId: webhookData.order_id }
      ]
    }).populate('user', 'email name');

    if (!order) {
      console.log('⚠️ Order not found for webhook:', webhookData);
      return res.status(404).json({ message: 'Order not found' });
    }

    // Store webhook event
    order.webhookEvents = order.webhookEvents || [];
    order.webhookEvents.push({
      event: webhookData.current_status || webhookData.status,
      data: webhookData,
      receivedAt: new Date()
    });

    let shouldSendShippedEmail = false;
    let shouldSendDeliveredEmail = false;

    // Update order status based on Shiprocket status
    switch (webhookData.current_status) {
      case 'PICKED UP':
        order.orderStatus = 'shipped';
        order.courierName = webhookData.courier_name;
        order.shiprocketAwbCode = webhookData.awb;
        order.trackingUrl = webhookData.tracking_url;
        shouldSendShippedEmail = true;
        break;
      
      case 'IN TRANSIT':
      case 'OUT FOR DELIVERY':
        order.orderStatus = 'shipped';
        order.trackingUrl = webhookData.tracking_url;
        break;
      
      case 'DELIVERED':
        order.orderStatus = 'delivered';
        order.deliveredAt = new Date();
        shouldSendDeliveredEmail = true;
        break;
      
      case 'RTO INITIATED':
      case 'RTO DELIVERED':
      case 'CANCELLED':
        order.orderStatus = 'cancelled';
        break;
    }

    await order.save();

    // ✅ Send shipment notification
    if (shouldSendShippedEmail && order.user?.email) {
      try {
        await emailService.sendShippedNotification(order.user.email, {
          orderNumber: order.orderNumber,
          shippingAddress: order.shippingAddress,
          shiprocketAwbCode: order.shiprocketAwbCode,
          courierName: order.courierName,
          estimatedDeliveryDate: order.estimatedDeliveryDate,
          trackingUrl: order.trackingUrl
        });
        console.log(`✅ Shipped email sent to ${order.user.email}`);
      } catch (emailError) {
        console.error('❌ Failed to send shipped email:', emailError);
      }
    }

    // ✅ Send delivered notification
    if (shouldSendDeliveredEmail && order.user?.email) {
      try {
        await emailService.sendDeliveredNotification(order.user.email, {
          _id: order._id,
          orderNumber: order.orderNumber,
          shippingAddress: order.shippingAddress,
          totalAmount: order.totalAmount,
          deliveredAt: order.deliveredAt
        });
        console.log(`✅ Delivered email sent to ${order.user.email}`);
      } catch (emailError) {
        console.error('❌ Failed to send delivered email:', emailError);
      }
    }

    console.log('✅ Webhook processed, order updated:', order.orderNumber);

    res.json({ success: true, message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('❌ Shiprocket webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};

// Get tracking info
exports.getTrackingInfo = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order || !order.shiprocketShipmentId) {
      return res.status(404).json({
        success: false,
        message: 'Tracking information not available'
      });
    }

    const token = await getShiprocketToken();
    
    const response = await axios.get(
      `${SHIPROCKET_API_URL}/courier/track/shipment/${order.shiprocketShipmentId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    res.json({
      success: true,
      tracking: response.data
    });
  } catch (error) {
    console.error('❌ Tracking info error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tracking information'
    });
  }
};
