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

// Suppress verbose logs in production; keep error active
if (process.env.NODE_ENV === 'production') {
  console.log = () => {};
  console.debug = () => {};
  console.info = () => {};
  console.warn = () => {};
}

// Guard: SESSION_SECRET must be set in production
if (process.env.NODE_ENV === 'production' && !process.env.SESSION_SECRET) {
  console.error('FATAL: SESSION_SECRET must be set in production');
  process.exit(1);
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
const feedbackRoutes = require("./routes/feedback");
const promoCodeRoutes = require("./routes/promoCodes");

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

// Google OAuth Strategy (optional in environments where credentials are not set)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  }, async (accessToken, refreshToken, profile, done) => {
    const isDev = process.env.NODE_ENV !== 'production';
    try {
      if (isDev) console.log('Google OAuth callback triggered for:', profile.emails[0].value);

      let existingUser = await User.findOne({ googleId: profile.id });

      if (existingUser) {
        if (isDev) console.log('Found existing user with Google ID');
        return done(null, existingUser);
      }

      existingUser = await User.findOne({ email: profile.emails[0].value });

      if (existingUser) {
        if (isDev) console.log('Linking Google account to existing user');
        existingUser.googleId = profile.id;
        existingUser.authProvider = 'google';
        existingUser.profilePicture = profile.photos[0]?.value;
        await existingUser.save();
        return done(null, existingUser);
      }

      if (isDev) console.log('Creating new user from Google profile');
      const newUser = new User({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        profilePicture: profile.photos[0]?.value,
        authProvider: 'google',
        isVerified: true,
      });

      const savedUser = await newUser.save();
      if (isDev) console.log('New user created successfully');
      done(null, savedUser);
    } catch (error) {
      console.error('Google OAuth error:', error);
      done(error, null);
    }
  }));
} else {
  if (process.env.NODE_ENV !== 'production') {
    console.warn("Google OAuth credentials not set. Skipping GoogleStrategy initialization.");
  }
}

// CORS configuration
const envOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://www.mindymunchs.com",
  "https://mindymunchs.com",
  ...envOrigins,
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server tools or same-origin requests without Origin header.
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Do not throw for unknown origins; just omit CORS headers.
    // Throwing here can make health checks fail with 500 responses.
    return callback(null, false);
  },
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

// Rate limiting — global
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// Stricter rate limit for auth endpoints (brute-force protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many authentication attempts. Please try again later.",
});

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
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", videoTestimonialRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/promo-codes", promoCodeRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
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
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  }

  // Self-ping every 14 minutes to prevent Render cold starts
  if (process.env.BACKEND_URL) {
    const https = require("https");
    const http = require("http");
    const pingUrl = `${process.env.BACKEND_URL}/api/health`;
    const client = pingUrl.startsWith("https") ? https : http;

    setInterval(() => {
      try {
        client.get(pingUrl, (res) => {
          if (process.env.NODE_ENV !== 'production') {
            console.log(`[health-ping] ok — status ${res.statusCode}`);
          }
          res.resume();
        }).on("error", (err) => {
          console.error("[health-ping] failed:", err.message);
        });
      } catch (err) {
        console.error("[health-ping] error:", err.message);
      }
    }, 14 * 60 * 1000);
  }
});

module.exports = app;
