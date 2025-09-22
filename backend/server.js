const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const passport = require("passport");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config();

// Import User model for Google OAuth
const User = require("./models/User");

// Console override for production
if (process.env.NODE_ENV === 'production') {
  console.log = () => {};
  console.debug = () => {};
  console.info = () => {};
  console.warn = () => {};
}

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orders");
const testimonialRoutes = require("./routes/testimonials");
const adminRoutes = require("./routes/admin");
const videoTestimonialRoutes = require("./routes/videoTestimonials");
const newsletterRoutes = require("./routes/newsLetter");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

// Session configuration (MUST be BEFORE passport initialization)
app.use(session({
  secret: process.env.SESSION_SECRET || 'mindy-munchs-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // true for HTTPS in production
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Passport serialization
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('Google OAuth callback triggered for:', profile.emails[0].value);
    
    // Check if user already exists with this Google ID
    let existingUser = await User.findOne({ googleId: profile.id });
    
    if (existingUser) {
      console.log('Found existing user with Google ID');
      return done(null, existingUser);
    }

    // Check if user exists with same email
    existingUser = await User.findOne({ email: profile.emails[0].value });
    
    if (existingUser) {
      // Link Google account to existing user
      console.log('Linking Google account to existing user');
      existingUser.googleId = profile.id;
      existingUser.authProvider = 'google';
      existingUser.profilePicture = profile.photos[0]?.value;
      await existingUser.save();
      return done(null, existingUser);
    }

    // Create new user
    console.log('Creating new user from Google profile');
    const newUser = new User({
      googleId: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value,
      profilePicture: profile.photos[0]?.value,
      authProvider: 'google',
      isVerified: true, // Google accounts are pre-verified
    });

    const savedUser = await newUser.save();
    console.log('New user created successfully');
    done(null, savedUser);
  } catch (error) {
    console.error('Google OAuth error:', error);
    done(error, null);
  }
}));

// CORS configuration - Updated to include your production domain
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://www.mindymunchs.com",
    "https://mindymunchs.com",
    process.env.FRONTEND_URL,
  ],
  credentials: true, // Important for OAuth cookies
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" } // Allow cross-origin requests
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Database connection
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/mindy-munchs",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", videoTestimonialRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/payments", paymentRoutes);

// Enhanced health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Mindy Munchs API is running",
    emailService: process.env.BREVO_API_KEY ? 'Brevo API (Production Ready)' : 'No email service configured',
    googleOAuth: process.env.GOOGLE_CLIENT_ID ? 'Configured' : 'Not configured',
    corsOrigins: corsOptions.origin,
    timestamp: new Date().toISOString(),
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : "Something went wrong"
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`📧 Email Service: ${process.env.BREVO_API_KEY ? 'Brevo API (Production Ready)' : '⚠️ No Brevo API key - add BREVO_API_KEY to .env'}`);
  console.log(`🔐 Google OAuth: ${process.env.GOOGLE_CLIENT_ID ? 'Configured ✓' : '⚠️ Not configured - add Google credentials to .env'}`);
  console.log(`🌐 CORS Origins: ${corsOptions.origin.join(', ')}`);
});

module.exports = app;
