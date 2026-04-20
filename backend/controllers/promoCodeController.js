const PromoCode = require('../models/PromoCode');

// Validate promo code (public - used during checkout)
exports.validatePromoCode = async (req, res) => {
  try {
    const { code, subtotal } = req.body;

    const promoCode = await PromoCode.findOne({ code: code.toUpperCase() });

    if (!promoCode) {
      return res.status(404).json({
        success: false,
        message: 'Invalid promo code'
      });
    }

    if (!promoCode.isValid()) {
      return res.status(400).json({
        success: false,
        message: 'This promo code has expired or is no longer valid'
      });
    }

    if (subtotal < promoCode.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount of ₹${promoCode.minOrderAmount} required`
      });
    }

    const discount = promoCode.calculateDiscount(subtotal);

    res.json({
      success: true,
      message: 'Promo code applied successfully!',
      promoCode: {
        code: promoCode.code,
        discountType: promoCode.discountType,
        discountValue: promoCode.discountValue,
        discount: discount,
        finalAmount: subtotal - discount
      }
    });
  } catch (error) {
    console.error('Error validating promo code:', error);
    res.status(500).json({
      success: false,
      message: 'Error validating promo code',
      error: error.message
    });
  }
};

// Apply promo code to order (called during order creation)
exports.applyPromoCode = async (req, res) => {
  try {
    const { code, userId } = req.body;

    const promoCode = await PromoCode.findOne({ code: code.toUpperCase() });

    if (!promoCode || !promoCode.isValid()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired promo code'
      });
    }

    // Increment usage count
    promoCode.usageCount += 1;
    
    // Track user usage if userId provided
    if (userId) {
      promoCode.usedBy.push({ user: userId });
    }

    await promoCode.save();

    res.json({
      success: true,
      message: 'Promo code applied successfully'
    });
  } catch (error) {
    console.error('Error applying promo code:', error);
    res.status(500).json({
      success: false,
      message: 'Error applying promo code',
      error: error.message
    });
  }
};

// Admin: Get all promo codes
exports.getAllPromoCodes = async (req, res) => {
  try {
    const promoCodes = await PromoCode.find()
      .populate('createdBy', 'email name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      promoCodes
    });
  } catch (error) {
    console.error('Error fetching promo codes:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching promo codes',
      error: error.message
    });
  }
};

// Admin: Create promo code
exports.createPromoCode = async (req, res) => {
  try {
    const promoCode = new PromoCode({
      ...req.body,
      createdBy: req.user._id
    });

    await promoCode.save();

    res.status(201).json({
      success: true,
      message: 'Promo code created successfully',
      promoCode
    });
  } catch (error) {
    console.error('Error creating promo code:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating promo code',
      error: error.message
    });
  }
};

// Admin: Update promo code
exports.updatePromoCode = async (req, res) => {
  try {
    const { id } = req.params;
    const promoCode = await PromoCode.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!promoCode) {
      return res.status(404).json({
        success: false,
        message: 'Promo code not found'
      });
    }

    res.json({
      success: true,
      message: 'Promo code updated successfully',
      promoCode
    });
  } catch (error) {
    console.error('Error updating promo code:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating promo code',
      error: error.message
    });
  }
};

// Admin: Delete promo code
exports.deletePromoCode = async (req, res) => {
  try {
    const { id } = req.params;
    const promoCode = await PromoCode.findByIdAndDelete(id);

    if (!promoCode) {
      return res.status(404).json({
        success: false,
        message: 'Promo code not found'
      });
    }

    res.json({
      success: true,
      message: 'Promo code deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting promo code:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting promo code',
      error: error.message
    });
  }
};

// Admin: Toggle promo code status
exports.togglePromoCodeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const promoCode = await PromoCode.findById(id);

    if (!promoCode) {
      return res.status(404).json({
        success: false,
        message: 'Promo code not found'
      });
    }

    promoCode.isActive = !promoCode.isActive;
    await promoCode.save();

    res.json({
      success: true,
      message: `Promo code ${promoCode.isActive ? 'activated' : 'deactivated'} successfully`,
      promoCode
    });
  } catch (error) {
    console.error('Error toggling promo code status:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling promo code status',
      error: error.message
    });
  }
};
