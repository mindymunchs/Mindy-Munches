const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto"); // for forget password

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: function () {
        // Password is required only for local authentication
        return this.authProvider === "local" || !this.authProvider;
      },
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // exclude password from query results by default
    },

    // ======= GOOGLE OAUTH FIELDS =======
    googleId: {
      type: String,
      unique: true,
      sparse: true, // allows null values to be unique
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    profilePicture: {
      type: String,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false, // Google users will be auto-verified
    },

    // ======= EXISTING FIELDS =======
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: { type: String, default: "India" },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
    newsletterSubscribed: {
      type: Boolean,
      default: false,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true, // adds createdAt and updatedAt timestamps automatically
  }
);

// ======= INDEXES FOR PERFORMANCE =======
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });
userSchema.index({ authProvider: 1 });

// ======= PRE-SAVE MIDDLEWARE =======
// Hash password before saving to database (only for local auth)
userSchema.pre("save", async function (next) {
  // Only hash password if it's modified and user is using local auth
  if (!this.isModified("password") || this.authProvider === "google") {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// ======= INSTANCE METHODS =======

// Method to compare input password with hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
  // Don't allow password comparison for Google users
  if (this.authProvider === "google") {
    throw new Error("Google users cannot use password authentication");
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove sensitive fields when returning user object as JSON
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.passwordResetToken;
  delete userObject.passwordResetExpires;
  // Keep googleId hidden from frontend for security
  delete userObject.googleId;
  return userObject;
};

// Generate password reset token
userSchema.methods.getResetPasswordToken = function () {
  // Don't allow password reset for Google users
  if (this.authProvider === "google") {
    throw new Error(
      "Google users cannot reset password. Please use Google sign-in."
    );
  }

  // Generate a random token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Hash the token and save it to the database
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set the token's expiration time to 15 minutes
  this.passwordResetExpires = Date.now() + 15 * 60 * 1000;

  // Return the unhashed token for the email link
  return resetToken;
};

// Check if user can use password authentication
userSchema.methods.canUsePasswordAuth = function () {
  return this.authProvider === "local" || !this.authProvider;
};

// Get user's display name
userSchema.methods.getDisplayName = function () {
  return this.name || this.email.split("@")[0];
};

// Check if profile is complete
userSchema.methods.isProfileComplete = function () {
  return !!(
    this.name &&
    this.email &&
    (this.phone || this.authProvider === "google")
  );
};

// ======= STATIC METHODS =======

// Find user by email or Google ID
userSchema.statics.findByEmailOrGoogleId = function (email, googleId) {
  const query = { email };
  if (googleId) {
    query.$or = [{ email }, { googleId }];
  }
  return this.findOne(query);
};

// Find or create Google user
userSchema.statics.findOrCreateGoogleUser = async function (profile) {
  try {
    const { id: googleId, emails, displayName, photos } = profile;
    const email = emails[0].value;
    const profilePicture = photos[0]?.value;

    // Check if user exists with Google ID
    let user = await this.findOne({ googleId });
    if (user) return user;

    // Check if user exists with email
    user = await this.findOne({ email });
    if (user) {
      // Link Google account to existing user
      user.googleId = googleId;
      user.authProvider = "google";
      user.profilePicture = profilePicture;
      user.isVerified = true;
      return await user.save();
    }

    // Create new user
    user = new this({
      googleId,
      name: displayName,
      email,
      profilePicture,
      authProvider: "google",
      isVerified: true,
    });

    return await user.save();
  } catch (error) {
    throw new Error(`Failed to find or create Google user: ${error.message}`);
  }
};

module.exports = mongoose.model("User", userSchema);
