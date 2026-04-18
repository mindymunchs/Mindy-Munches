const express = require("express");
const { body, query } = require("express-validator");
const productController = require("../controllers/productController");
const {
  authenticate,
  requireAdmin,
  optionalAuth,
} = require("../middleware/auth");

const router = express.Router();

// Validation rules (keep as is)
const productValidation = [
  body("name").trim().isLength({ min: 2, max: 100 }),
  body("description").trim().isLength({ min: 10, max: 2000 }),
  body("shortDescription").optional().trim().isLength({ max: 200 }),
  body("price").isNumeric().isFloat({ min: 0 }),
  body("originalPrice").optional().isNumeric().isFloat({ min: 0 }),
  body("category").isIn([
    "Snacks",
    "Sweets",
    "Health Mix",
    "Beverages",
    "Other",
  ]),
  body("subcategory").optional().trim().isLength({ max: 50 }),
  body("stock").isInt({ min: 0 }),
  body("sku").optional().trim().isLength({ min: 3, max: 20 }),
  body("images").optional().isArray(),
  body("weight.value").optional().isNumeric(),
  body("weight.unit").optional().isIn(["g", "kg", "ml", "l"]),
  body("tags").optional().isArray(),
  body("isActive").optional().isBoolean(),
  body("isFeatured").optional().isBoolean(),
  body("isOrganic").optional().isBoolean(),
  body("isBestseller").optional().isBoolean(),
  body("origin").optional().trim().isLength({ max: 100 }),
];

const reviewValidation = [
  body("rating").isInt({ min: 1, max: 5 }),
  body("comment").optional().trim().isLength({ max: 500 }),
];

const searchValidation = [
  query("q").optional().trim().isLength({ min: 1, max: 100 }),
  query("category")
    .optional()
    .isIn([ "makhana","sattu","Other"]),
  query("minPrice").optional().isFloat({ min: 0 }),
  query("maxPrice").optional().isFloat({ min: 0 }),
];

// ✅ CORRECT ROUTE ORDER:

// 1. Specific static routes FIRST
router.get("/featured", productController.getFeaturedProducts);
router.get("/categories", productController.getCategories);
router.get("/bestsellers", productController.getBestsellers);
router.get("/search", searchValidation, productController.searchProducts);

// 2. List all products (root with query params)
router.get("/", optionalAuth, productController.getAllProducts);

// 3. Admin CRUD operations (protected, using :id)
router.post(
  "/",
  authenticate,
  requireAdmin,
  productValidation,
  productController.createProduct
);
router.put(
  "/:id",
  authenticate,
  requireAdmin,
  productValidation,
  productController.updateProduct
);
router.delete(
  "/:id",
  authenticate,
  requireAdmin,
  productController.deleteProduct
);
router.patch(
  "/:id/status",
  authenticate,
  requireAdmin,
  productController.toggleProductStatus
);

// 4. ✅ REVIEW ROUTES - MUST BE BEFORE /:slug (they use :id)
router.post(
  "/:id/reviews",
  authenticate,
  reviewValidation,
  productController.addReview
);
router.get("/:id/reviews", productController.getProductReviews);

// 5. ✅ DYNAMIC SLUG ROUTE - MUST BE LAST!
router.get("/:slug", optionalAuth, productController.getProductBySlug);

module.exports = router;
