const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [200, "Product name cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    originalPrice: {
      type: Number,
      min: [0, "Original price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      enum: ["makhana", "sattu", "Other"],
    },
    images: [
      {
        url: String,
        alt: String,
        isPrimary: {
          type: Boolean,
          default: false,
        },
      },
    ],
    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    nutritionalInfo: {
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number,
      fiber: Number,
    },
    ingredients: [String],
    weight: {
      value: Number,
      unit: {
        type: String,
        enum: ["g", "kg", "ml", "l"],
        default: "g",
      },
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  },
  {
    // Add this field to your schema:

    ratings: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
      reviews: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
          rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
          },
          comment: {
            type: String,
            maxlength: 500,
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },
  }
);

// ✅ NEW: Auto-generate slug from name before saving
productSchema.pre("save", async function (next) {
  // Only generate slug if name is modified or it's a new product
  if (this.isModified("name") || !this.slug) {
    // Create base slug from product name
    let baseSlug = this.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single
      .trim();

    // Check if slug already exists
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existingProduct = await this.constructor.findOne({
        slug,
        _id: { $ne: this._id }, // Exclude current product
      });

      if (!existingProduct) {
        break;
      }

      // If slug exists, append counter
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    this.slug = slug;
  }

  next();
});

// ✅ NEW: Create index for slug
productSchema.index({ slug: 1 });

// Existing indexes
productSchema.index({ category: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Product", productSchema);
