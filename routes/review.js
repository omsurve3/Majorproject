const express = require("express");
const router = express.Router({ mergeParams: true });

// ✅ Fixed relative imports
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

// ✅ Import middleware in one place
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");

// ✅ Import controller
const reviewController = require("../controllers/reviews.js");

// 🧭 Routes

// CREATE Review
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

// DELETE Review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.deleteReview)
);

module.exports = router;
