const express = require('express');
const passport = require('passport');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const profileUpdateValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('phone')
    .optional()
    .trim()
    .isMobilePhone('any', { strictMode: false })
    .withMessage('Please provide a valid phone number'),
  body('address.street')
    .optional()
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Street address must be between 5 and 100 characters'),
  body('address.city')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters'),
  body('address.state')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('State must be between 2 and 50 characters'),
  body('address.zipCode')
    .optional()
    .trim()
    .matches(/^[0-9]{6}$/)
    .withMessage('ZIP code must be 6 digits'),
  body('address.country')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Country must be between 2 and 50 characters')
];

const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
];

// ======= EXISTING ROUTES =======
router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.post('/logout', authenticate, authController.logout);
router.get('/profile', authenticate, authController.getProfile);
router.put('/profile', authenticate, profileUpdateValidation, authController.updateProfile);
router.post('/change-password', authenticate, changePasswordValidation, authController.changePassword);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/demo-login', authController.demoLogin);
router.post('/verify-google-token', authController.verifyGoogleToken);
// In your routes/auth.js file
router.post('/verify-google-access-token', authController.verifyGoogleAccessToken);


// ======= GOOGLE OAUTH ROUTES =======

// Initiate Google OAuth
router.get('/google', 
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

// Google OAuth callback
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth?error=oauth_failed`,
    session: false // We'll use JWT instead of sessions for consistency
  }),
  authController.googleCallback
);

// Google OAuth success route (alternative approach)
router.get('/google/success', authController.googleSuccess);

// Google OAuth failure route
router.get('/google/failure', (req, res) => {
  console.log('Google OAuth authentication failed');
  res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth?error=oauth_failed&message=Authentication failed`);
});

// ======= OAUTH TOKEN VERIFICATION ROUTE =======

// Verify Google OAuth token (for frontend-initiated OAuth)
router.post('/google/verify', authController.verifyGoogleToken);

// ======= UTILITY ROUTES =======

// Check auth status
router.get('/me', authenticate, authController.getProfile);

// Refresh token
router.post('/refresh', authController.refreshToken);

module.exports = router;
