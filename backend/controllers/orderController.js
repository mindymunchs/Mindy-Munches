const { validationResult } = require('express-validator');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const emailService = require('../services/emailService');
const User = require('../models/User');

// Create order
const createOrder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { shippingAddress, paymentMethod, notes, promoCode } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'name price images stock');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Validate stock availability
    for (const item of cart.items) {
      if (!item.product || !item.product.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product ${item.product?.name || 'Unknown'} is no longer available`
        });
      }

      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.product.name}. Only ${item.product.stock} available`
        });
      }
    }

    // Calculate order totals
    const subtotal = cart.totalAmount;
    const shippingCost = subtotal > 500 ? 0 : 50;

    // ✅ Handle promo code discount
    let discount = 0;
    let promoCodeData = null;
    
    if (promoCode && promoCode.code) {
      const PromoCode = require('../models/PromoCode');
      const promo = await PromoCode.findOne({ code: promoCode.code.toUpperCase() });
      
      if (promo && promo.isValid()) {
        discount = promo.calculateDiscount(subtotal);
        promoCodeData = {
          code: promo.code,
          discount: discount
        };
        
        promo.usageCount += 1;
        if (req.user) {
          promo.usedBy.push({ user: req.user._id });
        }
        await promo.save();
      }
    }

    const totalAmount = subtotal + shippingCost - discount;

    // Create order items
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      price: item.price,
      quantity: item.quantity,
      image: item.product.images?.[0]?.url || ''
    }));

    // Create order
    const order = new Order({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      subtotal,
      shippingCost,
      promoCode: promoCodeData,
      totalAmount,
      notes,
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    await order.save();

    // Send emails (customer confirmation + admin alert)
    try {
      const user = await User.findById(req.user._id);
      const orderData = {
        orderId: order._id,
        orderNumber: order.orderNumber,
        createdAt: order.createdAt,
        items: orderItems,
        totalAmount,
        shippingAddress,
        paymentMethod,
        paymentStatus: order.paymentStatus,
        user: user
      };
      
      // Customer confirmation email
      await emailService.sendOrderConfirmation(user.email, orderData);
      console.log(`✅ Order confirmation email sent to ${user.email}`);
      
      // Admin alert email
      await emailService.sendAdminOrderAlert(orderData);
      console.log(`✅ Admin alert email sent`);
      
    } catch (emailError) {
      console.error('❌ Failed to send emails:', emailError);
      // Don't fail the order if email fails
    }

    // Update product stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(
        item.product._id,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Clear cart
    await cart.clearCart();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: { order }
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};

// Get user's orders
const getUserOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const filter = { user: req.user._id };

    if (status) {
      filter.orderStatus = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('items.product', 'name images');

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalOrders: total,
          hasNextPage: skip + orders.length < total,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};

// Get single order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'name images');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: { order }
    });

  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
};

// Cancel order
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (!['pending', 'confirmed'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      });
    }

    order.orderStatus = 'cancelled';
    await order.save();

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } }
      );
    }

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: { order }
    });

  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: error.message
    });
  }
};

// Get all orders (Admin only)
const getAllOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      paymentStatus,
      startDate,
      endDate
    } = req.query;

    const filter = {};

    if (status) {
      filter.orderStatus = status;
    }

    if (paymentStatus) {
      filter.paymentStatus = paymentStatus;
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'name email')
      .populate('items.product', 'name');

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalOrders: total,
          hasNextPage: skip + orders.length < total,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};

// Update order status (Admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, trackingNumber, note } = req.body;
    const order = await Order.findById(req.params.id).populate('user', 'email name');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const previousStatus = order.orderStatus;

    if (orderStatus) order.orderStatus = orderStatus;
    if (trackingNumber) order.trackingNumber = trackingNumber;

    if (note) {
      order.statusHistory = order.statusHistory || [];
      order.statusHistory.push({
        status: orderStatus || order.orderStatus,
        note,
        updatedAt: new Date()
      });
    }

    if (orderStatus === 'delivered') {
      order.deliveredAt = new Date();
    }

    await order.save();

    // Send status-change emails (non-blocking)
    if (orderStatus && orderStatus !== previousStatus && order.user?.email) {
      if (orderStatus === 'shipped') {
        emailService.sendShippedNotification(order.user.email, {
          orderNumber: order.orderNumber,
          shippingAddress: order.shippingAddress,
          courierName: order.courierName,
          estimatedDeliveryDate: order.estimatedDeliveryDate,
          trackingUrl: order.trackingUrl,
          trackingNumber: order.trackingNumber
        }).catch(err => console.error('Shipped email failed:', err));
      } else if (orderStatus === 'delivered') {
        emailService.sendDeliveredNotification(order.user.email, {
          _id: order._id,
          orderNumber: order.orderNumber,
          shippingAddress: order.shippingAddress,
          totalAmount: order.totalAmount,
          deliveredAt: order.deliveredAt
        }).catch(err => console.error('Delivered email failed:', err));
      }
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: { order }
    });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
};

// Get order analytics (Admin only)
const getOrderAnalytics = async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const analytics = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
          averageOrderValue: { $avg: '$totalAmount' },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ['$orderStatus', 'pending'] }, 1, 0] }
          },
          completedOrders: {
            $sum: { $cond: [{ $eq: ['$orderStatus', 'delivered'] }, 1, 0] }
          },
          cancelledOrders: {
            $sum: { $cond: [{ $eq: ['$orderStatus', 'cancelled'] }, 1, 0] }
          }
        }
      }
    ]);

    const result = analytics[0] || {
      totalOrders: 0,
      totalRevenue: 0,
      averageOrderValue: 0,
      pendingOrders: 0,
      completedOrders: 0,
      cancelledOrders: 0
    };

    res.json({
      success: true,
      data: {
        analytics: result,
        period: `${days} days`
      }
    });

  } catch (error) {
    console.error('Get order analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order analytics',
      error: error.message
    });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderAnalytics
};


