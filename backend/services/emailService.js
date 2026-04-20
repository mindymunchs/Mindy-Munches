// Production-ready email service using Brevo API only
const SibApiV3Sdk = require('@sendinblue/client');

// Initialize Brevo API
let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
if (process.env.BREVO_API_KEY) {
  let apiKey = apiInstance.authentications['apiKey'];
  apiKey.apiKey = process.env.BREVO_API_KEY;
  console.log('✅ Brevo API initialized successfully');
} else {
  console.error('❌ Brevo API key missing - add BREVO_API_KEY to .env');
}

// Core email sending function
const sendEmail = async (to, subject, htmlContent, senderName = 'Mindy Munchs') => {
  try {
    if (!process.env.BREVO_API_KEY) {
      throw new Error('Brevo API key not configured. Add BREVO_API_KEY to environment variables.');
    }

    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;
    sendSmtpEmail.textContent = htmlContent.replace(/<[^>]*>/g, '');
    sendSmtpEmail.sender = { 
      name: senderName, 
      email: process.env.BREVO_SENDER_EMAIL || 'noreply@mindymunchs.com' 
    };
    sendSmtpEmail.to = [{ email: to }];

    console.log(`📧 Sending email via Brevo API to ${to}`);
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`✅ Email sent successfully via Brevo to ${to}`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to send email via Brevo to ${to}:`, error.response?.body || error.message);
    throw error;
  }
};

// Welcome Email for Newsletter Subscribers
exports.sendWelcomeEmail = async (email, name = 'Valued Customer') => {
  const subject = '🎉 Welcome to Mindy Munchs Family!';
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ff6b6b, #ee5a24); color: white; padding: 20px; text-align: center; }
        .content { padding: 30px 20px; background: #f8f9fa; }
        .button { background: #ff6b6b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; }
        .footer { text-align: center; padding: 20px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Mindy Munchs!</h1>
        </div>
        <div class="content">
          <h2>Thank you for joining our family, ${name}!</h2>
          <p>We're thrilled to have you as part of the Mindy Munchs community. You'll be the first to know about:</p>
          <ul>
            <li>🍿 New product launches</li>
            <li>🎉 Exclusive offers and discounts</li>
            <li>📰 Health tips and recipes</li>
            <li>🌟 Special promotions</li>
          </ul>
          <p>Stay tuned for delicious updates!</p>
        </div>
        <div class="footer">
          <p>© 2025 Mindy Munchs. All rights reserved.</p>
          <p><small>You received this email because you subscribed to our newsletter.</small></p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return await sendEmail(email, subject, htmlContent);
};

// Newsletter Email
exports.sendNewsletterEmail = async (email, subject, htmlContent) => {
  return await sendEmail(email, subject, htmlContent);
};

// New Product Notification
exports.sendNewProductNotification = async (email, productData, name = 'Valued Customer') => {
  const subject = `🆕 Fresh arrival from Mindy Munchs: ${productData.name}`;
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ff6b6b, #ee5a24); color: white; padding: 20px; text-align: center; }
        .product { background: white; border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .price { color: #ff6b6b; font-size: 24px; font-weight: bold; }
        .original-price { text-decoration: line-through; color: #999; margin-left: 10px; }
        .button { background: #ff6b6b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; }
        .footer { text-align: center; padding: 20px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🆕 New Product Alert!</h1>
          <h2>Hi ${name}!</h2>
        </div>
        <div class="product">
          <h2>${productData.name}</h2>
          ${productData.image ? `<img src="${productData.image}" alt="${productData.name}" style="max-width: 100%; height: auto; border-radius: 5px;">` : ''}
          <p>${productData.description || 'Discover the authentic taste and premium quality that makes this product special!'}</p>
          <div class="price">
            ₹${productData.price.toLocaleString('en-IN')}
            ${productData.originalPrice && productData.originalPrice > productData.price ? 
              `<span class="original-price">₹${productData.originalPrice.toLocaleString('en-IN')}</span>` : ''}
          </div>
          ${productData.category ? `<p><strong>Category:</strong> ${productData.category}</p>` : ''}
          <a href="${process.env.FRONTEND_URL}/product/${productData._id}" class="button">Shop Now</a>
        </div>
        <div class="footer">
          <p>© 2025 Mindy Munchs. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return await sendEmail(email, subject, htmlContent);
};

// Order Confirmation Email
exports.sendOrderConfirmation = async (email, orderData) => {
  const subject = `Order Confirmation #${orderData.orderId} - Mindy Munchs`;

  // SAFE DATE FORMATTING
  const orderDate = orderData.createdAt ? 
    new Date(orderData.createdAt).toLocaleDateString('en-IN') : 
    new Date().toLocaleDateString('en-IN');
  
  // SAFE ADDRESS FORMATTING
  const address = orderData.shippingAddress || {};
  const fullAddress = [
    address.street,
    address.city,
    address.state,
    address.pincode
  ].filter(Boolean).join(', ') || 'Address not provided';
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ff6b6b, #ee5a24); color: white; padding: 20px; text-align: center; }
        .order-details { background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .item { border-bottom: 1px solid #ddd; padding: 10px 0; }
        .total { background: #fff; padding: 15px; border-radius: 5px; margin: 10px 0; font-weight: bold; }
        .footer { text-align: center; padding: 20px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Confirmed! 🎉</h1>
        </div>
        <div class="order-details">
          <h2>Order #${orderData.orderId}</h2>
          <p><strong>Date:</strong> ${orderDate}</p>
          <p><strong>Delivery Address:</strong><br>${fullAddress}</p>
          
          <h3>Order Items:</h3>
          ${(orderData.items || []).map(item => `
            <div class="item">
              <strong>${item.name || 'Unknown Item'}</strong><br>
              Quantity: ${item.quantity || 1} × ₹${(item.price || 0).toLocaleString('en-IN')} = ₹${((item.quantity || 1) * (item.price || 0)).toLocaleString('en-IN')}
            </div>
          `).join('')}
          
          <div class="total">
            <p>Total Amount: ₹${(orderData.totalAmount || 0).toLocaleString('en-IN')}</p>
          </div>
        </div>
        <div class="footer">
          <p>Thank you for shopping with Mindy Munchs!</p>
          <p>© 2025 Mindy Munchs. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return await sendEmail(email, subject, htmlContent);
};

// ✅ NEW: Admin New Order Alert
exports.sendAdminOrderAlert = async (orderData) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@mindymunchs.com';
    
    const subject = `🔔 New Order: ${orderData.orderNumber}`;
    
    const orderDate = orderData.createdAt ? 
      new Date(orderData.createdAt).toLocaleString('en-IN') : 
      new Date().toLocaleString('en-IN');
    
    const address = orderData.shippingAddress || {};
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #F37254; color: white; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 20px; }
          .order-details { background: white; padding: 15px; margin: 15px 0; border-radius: 8px; }
          .item { padding: 10px 0; border-bottom: 1px solid #eee; }
          .total { font-size: 18px; font-weight: bold; color: #F37254; margin-top: 15px; }
          .button { background: #F37254; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 New Order Received!</h1>
          </div>
          <div class="content">
            <h2>Order #${orderData.orderNumber}</h2>
            <p><strong>Order Date:</strong> ${orderDate}</p>
            
            <div class="order-details">
              <h3>Customer Details:</h3>
              <p><strong>Name:</strong> ${address.name || 'N/A'}</p>
              <p><strong>Email:</strong> ${orderData.user?.email || 'Guest'}</p>
              <p><strong>Phone:</strong> ${address.phone || 'N/A'}</p>
              <p><strong>Address:</strong> ${address.street || ''}, ${address.city || ''}, ${address.state || ''} - ${address.zipCode || ''}</p>
            </div>

            <div class="order-details">
              <h3>Order Items:</h3>
              ${(orderData.items || []).map(item => `
                <div class="item">
                  <strong>${item.name || 'Unknown Item'}</strong><br>
                  Quantity: ${item.quantity || 1} × ₹${(item.price || 0).toLocaleString('en-IN')} = ₹${((item.quantity || 1) * (item.price || 0)).toLocaleString('en-IN')}
                </div>
              `).join('')}
              <p class="total">Total Amount: ₹${(orderData.totalAmount || 0).toLocaleString('en-IN')}</p>
              <p><strong>Payment Method:</strong> ${orderData.paymentMethod === 'razorpay' ? 'Online Payment' : 'Cash on Delivery'}</p>
              <p><strong>Payment Status:</strong> ${orderData.paymentStatus || 'Pending'}</p>
            </div>

            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/orders" class="button">View in Admin Panel</a>
          </div>
        </div>
      </body>
      </html>
    `;

    return await sendEmail(adminEmail, subject, htmlContent);
  } catch (error) {
    console.error('❌ Failed to send admin alert email:', error);
    throw error;
  }
};

// ✅ NEW: Order Shipped Notification
exports.sendShippedNotification = async (email, orderData) => {
  try {
    const subject = `📦 Your Order is Shipped - ${orderData.orderNumber}`;
    
    const address = orderData.shippingAddress || {};
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #F37254; color: white; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 20px; }
          .tracking-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; }
          .tracking-number { font-size: 24px; font-weight: bold; color: #F37254; padding: 15px; background: #fff3f0; border-radius: 5px; margin: 10px 0; }
          .button { background: #F37254; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 15px; }
          .info { background: white; padding: 15px; margin: 15px 0; border-radius: 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📦 Your Order is On Its Way!</h1>
          </div>
          <div class="content">
            <p>Hi ${address.name || 'Customer'},</p>
            <p>Great news! Your order <strong>#${orderData.orderNumber}</strong> has been shipped and is on its way to you.</p>
            
            <div class="tracking-box">
              <h3>Tracking Information</h3>
              <p><strong>AWB/Tracking Number:</strong></p>
              <div class="tracking-number">${orderData.trackingNumber || 'Generating...'}</div>
              <p><strong>Courier:</strong> ${orderData.courierName || 'Assigned Soon'}</p>
              <p><strong>Expected Delivery:</strong> ${orderData.estimatedDeliveryDate ? new Date(orderData.estimatedDeliveryDate).toLocaleDateString('en-IN') : '5-7 business days'}</p>
              ${orderData.trackingUrl ? `<a href="${orderData.trackingUrl}" class="button">Track Your Order</a>` : ''}
            </div>

            <div class="info">
              <h3>Delivery Address:</h3>
              <p>${address.street || ''}<br>
              ${address.city || ''}, ${address.state || ''}<br>
              ${address.zipCode || ''}</p>
            </div>

            <p>You'll receive another notification when your order is out for delivery.</p>
            <p>Thank you for shopping with Mindy Munchs! 🎉</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await sendEmail(email, subject, htmlContent);
  } catch (error) {
    console.error('❌ Failed to send shipped notification:', error);
    throw error;
  }
};

// ✅ NEW: Order Delivered Notification
exports.sendDeliveredNotification = async (email, orderData) => {
  try {
    const subject = `✅ Order Delivered - ${orderData.orderNumber}`;
    
    const address = orderData.shippingAddress || {};
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 20px; }
          .success-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; }
          .icon { font-size: 60px; }
          .button { background: #F37254; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px; }
          .rating { font-size: 40px; letter-spacing: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Order Delivered Successfully!</h1>
          </div>
          <div class="content">
            <div class="success-box">
              <div class="icon">🎉</div>
              <h2>Thank You, ${address.name || 'Customer'}!</h2>
              <p>Your order <strong>#${orderData.orderNumber}</strong> has been successfully delivered.</p>
              <p><strong>Delivered on:</strong> ${orderData.deliveredAt ? new Date(orderData.deliveredAt).toLocaleString('en-IN') : new Date().toLocaleString('en-IN')}</p>
            </div>

            <div class="success-box">
              <h3>We'd Love Your Feedback!</h3>
              <p>How was your experience?</p>
              <div class="rating">⭐⭐⭐⭐⭐</div>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/orders/${orderData._id}" class="button">Rate Your Order</a>
            </div>

            <p>If you have any issues or concerns, please don't hesitate to contact us.</p>
            <p><strong>Order Total:</strong> ₹${(orderData.totalAmount || 0).toLocaleString('en-IN')}</p>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/products" class="button">Continue Shopping</a>
            </div>

            <p style="text-align: center; margin-top: 20px;">Thank you for choosing Mindy Munchs! 💚</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await sendEmail(email, subject, htmlContent);
  } catch (error) {
    console.error('❌ Failed to send delivered notification:', error);
    throw error;
  }
};

// Password Reset Email
exports.sendPasswordResetEmail = async (email, resetUrl) => {
  const subject = 'Reset Your Mindy Munchs Password';
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ff6b6b, #ee5a24); color: white; padding: 20px; text-align: center; }
        .content { padding: 30px 20px; background: #f8f9fa; }
        .button { background: #ff6b6b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <h2>Reset Your Password</h2>
          <p>We received a request to reset your Mindy Munchs account password.</p>
          <p>Click the button below to create a new password. This link will expire in 15 minutes.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" class="button">Reset Password</a>
          </div>
          <div class="warning">
            <p><strong>Security Note:</strong> If you didn't request this password reset, please ignore this email. Your account remains secure.</p>
          </div>
          <p><strong>Direct link:</strong> <a href="${resetUrl}">${resetUrl}</a></p>
        </div>
        <div class="footer">
          <p>© 2025 Mindy Munchs. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return await sendEmail(email, subject, htmlContent);
};

// Export all functions
module.exports = {
  sendWelcomeEmail: exports.sendWelcomeEmail,
  sendNewsletterEmail: exports.sendNewsletterEmail,
  sendNewProductNotification: exports.sendNewProductNotification,
  sendOrderConfirmation: exports.sendOrderConfirmation,
  sendAdminOrderAlert: exports.sendAdminOrderAlert, // ✅ NEW
  sendShippedNotification: exports.sendShippedNotification, // ✅ NEW
  sendDeliveredNotification: exports.sendDeliveredNotification, // ✅ NEW
  sendPasswordResetEmail: exports.sendPasswordResetEmail
};
