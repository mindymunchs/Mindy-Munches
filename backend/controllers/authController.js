const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const User = require("../models/User");
const emailService = require("../services/emailService");
const crypto = require("crypto");
const Guest = require("../models/Guest");
const { OAuth2Client } = require('google-auth-library'); // Add this import

// Initialize Google OAuth client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Register new user
const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
    });

    await user.save();

    // ** AUTO-SUBSCRIBE TO NEWSLETTER **
    try {
      // Check if email already exists in Guest collection
      const existingGuest = await Guest.findOne({ email: user.email });
      if (!existingGuest) {
        // Create new guest subscriber
        const guest = new Guest({
          email: user.email,
          name: user.name,
          newsletterSubscribed: true,
        });
        await guest.save();
      }

      // Send welcome email
      await emailService.sendWelcomeEmail(user.email, user.name);
      console.log(`✅ Auto-subscribed and welcomed: ${user.email}`);
    } catch (emailError) {
      console.error("Newsletter auto-subscription error:", emailError);
      // Don't fail registration if newsletter fails
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Remove password from response
    user.password = undefined;

    res.json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

// ======= GOOGLE OAUTH METHODS =======

// Google OAuth callback handler (server-side flow)
const googleCallback = async (req, res) => {
  try {
    // User is attached to req by Passport
    if (!req.user) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth?error=oauth_failed`);
    }

    const user = req.user;
    
    // Generate JWT token
    const token = generateToken(user._id);
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();

    console.log(`✅ Google OAuth login successful: ${user.email}`);

    // Redirect to frontend with token
    const redirectURL = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth?token=${token}&success=true`;
    res.redirect(redirectURL);

  } catch (error) {
    console.error('Google OAuth callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth?error=oauth_callback_failed`);
  }
};

// Google OAuth success handler
const googleSuccess = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Google authentication failed'
      });
    }

    const token = generateToken(req.user._id);
    
    res.json({
      success: true,
      message: 'Google authentication successful',
      data: {
        token,
        user: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
          profilePicture: req.user.profilePicture,
          authProvider: req.user.authProvider
        },
      },
    });
  } catch (error) {
    console.error('Google success error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete Google authentication',
      error: error.message,
    });
  }
};

// Verify Google OAuth token (client-side flow)
const verifyGoogleToken = async (req, res) => {
  try {
    const { credential } = req.body;
    
    if (!credential) {
      return res.status(400).json({
        success: false,
        message: 'Google credential is required'
      });
    }

    // Verify the Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    console.log('Google token verified for:', email);

    // Check if user already exists with this Google ID
    let user = await User.findOne({ googleId });

    if (user) {
      // User exists, update last login
      user.lastLogin = new Date();
      await user.save();
    } else {
      // Check if user exists with same email
      user = await User.findOne({ email });
      
      if (user) {
        // Link Google account to existing user
        user.googleId = googleId;
        user.authProvider = 'google';
        user.profilePicture = picture;
        user.lastLogin = new Date();
        await user.save();
      } else {
        // Create new user
        user = new User({
          googleId,
          name,
          email,
          profilePicture: picture,
          authProvider: 'google',
          isVerified: true,
          lastLogin: new Date()
        });

        await user.save();

        // Auto-subscribe to newsletter
        try {
          const existingGuest = await Guest.findOne({ email });
          if (!existingGuest) {
            const guest = new Guest({
              email,
              name,
              newsletterSubscribed: true,
            });
            await guest.save();
          }

          await emailService.sendWelcomeEmail(email, name);
          console.log(`✅ Google user auto-subscribed: ${email}`);
        } catch (emailError) {
          console.error("Google user newsletter subscription error:", emailError);
        }
      }
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Google authentication successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profilePicture: user.profilePicture,
          authProvider: user.authProvider
        },
      },
    });

  } catch (error) {
    console.error('Google token verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Google authentication failed',
      error: error.message,
    });
  }
};

// Refresh JWT token
const refreshToken = async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token is required'
      });
    }

    // Verify the existing token (even if expired)
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
    
    // Find the user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate new token
    const newToken = generateToken(user._id);

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        token: newToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      error: error.message,
    });
  }
};

// ======= EXISTING METHODS =======

// Demo login
const demoLogin = async (req, res) => {
  try {
    const { type } = req.body; // 'user' or 'admin'

    let email;
    if (type === "admin") {
      email = "admin@demo.com";
    } else {
      email = "user@demo.com";
    }

    let user = await User.findOne({ email });

    // Create demo users if they do not exist
    if (!user) {
      user = new User({
        name: type === "admin" ? "Admin Demo" : "User Demo",
        email: email,
        password: "demo123",
        role: type === "admin" ? "admin" : "user",
      });
      await user.save();
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: "Demo login successful",
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    console.error("Demo login error:", error);
    res.status(500).json({
      success: false,
      message: "Demo login failed",
      error: error.message,
    });
  }
};

// Logout user
const logout = async (req, res) => {
  try {
    res.json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Logout failed",
      error: error.message,
    });
  }
};

// Get user profile
const getProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get profile",
      error: error.message,
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, address },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select("+password");

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to change password",
      error: error.message,
    });
  }
};

// Forgot password
const forgotPassword = async (req, res) => {
  let user;
  try {
    const { email } = req.body;

    // Find user
    user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with this email address",
      });
    }

    // Create reset token & save without validation
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Build complete reset URL with query parameter
    const baseURL = process.env.FRONTEND_URL || `${req.protocol}://${req.get("host")}`;
    const resetURL = `${baseURL}/reset-password?token=${resetToken}`;

    // Send email with complete URL (not just token)
    await emailService.sendPasswordResetEmail(user.email, resetURL);
    console.log(`Password reset email sent to ${user.email}`);

    return res.json({
      success: true,
      message: "Password reset instructions sent to your email",
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    // Roll back token fields if anything fails
    if (user) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to process forgot password request",
      error: error.message,
    });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Hash the token to compare with the one in the database
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // Set new password
    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reset password",
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  demoLogin,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  // Google OAuth methods
  googleCallback,
  googleSuccess,
  verifyGoogleToken,
  refreshToken,
};
