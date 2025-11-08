const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("E:/Majorproject/utils/wrapAsync.js")
const ExpressError = require("E:/Majorproject/utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("E:/Majorproject/schema.js");
const Listing = require("E:/Majorproject/models/listing.js");
const Review = require("E:/Majorproject/routes/review.js")
const {validateReview} = require("../middleware.js")

const {isLoggedIn} =require("../middleware.js");
const {isOwner} = require("../middleware.js");
const {isReviewAuthor} =  require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

//Reviews route
router.post("/",isLoggedIn,isReviewAuthor,validateReview,wrapAsync(reviewController.createreview));
 
 //Delete review route
 router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deletereview))

 module.exports =router;