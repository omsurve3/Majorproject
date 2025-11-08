const express = require("express");
const router = express.Router();

// ✅ Fixed relative imports
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");

// ✅ Middleware imports
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

// ✅ Controller import
const listingController = require("../controllers/listing.js");

// ✅ Multer and Cloudinary setup
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// 🧭 Routes

// INDEX & CREATE ROUTES
router
  .route("/")
  .get(wrapAsync(listingController.index)) // show all listings
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
  ); // create new listing

// NEW ROUTE (form)
router.get("/new", isLoggedIn, listingController.renderNewForm);

// SHOW, UPDATE, DELETE ROUTES
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

// EDIT ROUTE (form)
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.rendereditform)
);

module.exports = router;
