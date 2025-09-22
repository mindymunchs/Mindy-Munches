const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { sendOrderConfirmation } = require("../services/emailService");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = "INR", orderData } = req.body;

    if (!amount || amount < 100) {
      return res.status(400).json({
        success: false,
        message: "Minimum order amount is ₹1",
      });
    }

    const options = {
      amount: Math.round(amount), // Amount in paise
      currency,
      receipt: `receipt_${Date.now()}`,
      notes: {
        customer_name: orderData?.name || "Guest",
        customer_email: orderData?.email || "",
        customer_phone: orderData?.phone || "",
      },
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.json({
      success: true,
      id: razorpayOrder.id,
      currency: razorpayOrder.currency,
      amount: razorpayOrder.amount,
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};

// tot payment and create order
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderDetails,
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    // Generate order number
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    const orderNumber = `MM${timestamp.slice(-6)}${random}`;

    // Prepare order items
    const orderItems = orderDetails.items.map((item) => ({
      product: item.product?._id || item._id,
      name: item.product?.name || item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.product?.images?.[0]?.url || item.image || "",
    }));

    // Create order in database
    const newOrder = new Order({
      user: req.user?._id || null,
      orderNumber,
      items: orderItems,
      shippingAddress: {
        name: orderDetails.name,
        phone: orderDetails.phone,
        street: orderDetails.address.street,
        city: orderDetails.address.city,
        state: orderDetails.address.state,
        zipCode: orderDetails.address.pincode,
        country: "India",
      },
      paymentMethod: "razorpay",
      paymentStatus: "paid",
      orderStatus: "confirmed",
      subtotal: orderDetails.subtotal || orderDetails.totalAmount,
      shippingCost: orderDetails.shipping || 0,
      totalAmount: orderDetails.totalAmount,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    const savedOrder = await newOrder.save();

    // Update product stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    // Clear cart if authenticated user
    if (req.user) {
      await Cart.findOneAndUpdate(
        { user: req.user._id },
        { items: [], totalAmount: 0 }
      );
    }

    // Send order confirmation email via SendPulse
    if (orderDetails.email) {
      try {
        await sendOrderConfirmation(orderDetails.email, {
          orderId: savedOrder.orderNumber,
          items: orderItems,
          totalAmount: orderDetails.totalAmount,
          shippingAddress: savedOrder.shippingAddress,
        });
        console.log("Order confirmation email sent via SendPulse");
      } catch (emailError) {
        console.error(" Brevo email failed:", emailError);
      }
    }

    res.json({
      success: true,
      message: "Payment verified and order created successfully",
      orderId: savedOrder._id,
      orderNumber: savedOrder.orderNumber,
      order: {
        items: orderItems,
        subtotal: savedOrder.subtotal,
        shippingCost: savedOrder.shippingCost,
        totalAmount: savedOrder.totalAmount,
        shippingAddress: savedOrder.shippingAddress,
      },
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message,
    });
  }
};
// Webhook handler for Razorpay events
exports.handleWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const webhookSignature = req.headers["x-razorpay-signature"];
    const webhookBody = JSON.stringify(req.body);

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(webhookBody)
      .digest("hex");

    if (expectedSignature !== webhookSignature) {
      console.log("❌ Invalid webhook signature");
      return res.status(400).send("Invalid signature");
    }

    console.log("✅ Webhook verified:", req.body.event);

    // Handle different payment events
    const { event, payload } = req.body;

    switch (event) {
      case "payment.captured":
        await handlePaymentCaptured(payload.payment.entity);
        break;

      case "payment.failed":
        await handlePaymentFailed(payload.payment.entity);
        break;

      case "order.paid":
        await handleOrderPaid(payload.order.entity);
        break;

      default:
        console.log("Unhandled event:", event);
    }

    res.status(200).send("OK");
  } catch (error) {
    console.error("❌ Webhook error:", error);
    res.status(500).send("Webhook error");
  }
};

// Webhook event handlers
async function handlePaymentCaptured(payment) {
  try {
    console.log("💰 Payment captured via webhook:", payment.id);

    // Update order status if payment was successful
    const order = await Order.findOne({
      razorpayPaymentId: payment.id,
    });

    if (order) {
      order.paymentStatus = "captured";
      order.orderStatus = "confirmed";
      await order.save();
      console.log("📦 Order status updated:", order.orderNumber);
    }
  } catch (error) {
    console.error("Error handling payment captured:", error);
  }
}

async function handlePaymentFailed(payment) {
  try {
    console.log("❌ Payment failed via webhook:", payment.id);

    // Update order status if payment failed
    const order = await Order.findOne({
      razorpayOrderId: payment.order_id,
    });

    if (order) {
      order.paymentStatus = "failed";
      order.orderStatus = "cancelled";
      await order.save();
      console.log("🚫 Order marked as failed:", order.orderNumber);
    }
  } catch (error) {
    console.error("Error handling payment failed:", error);
  }
}

async function handleOrderPaid(order) {
  try {
    console.log("📦 Order paid via webhook:", order.id);
    // Additional order processing if needed
  } catch (error) {
    console.error("Error handling order paid:", error);
  }
}
