const express = require("express");
const router = express.Router();
const wrapAsync = require("E:/Majorproject/utils/wrapAsync.js")
const ExpressError = require("E:/Majorproject/utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("E:/Majorproject/schema.js");
const Listing = require("E:/Majorproject/models/listing.js");
const {isLoggedIn} =require("../middleware.js");
const {isOwner} = require("../middleware.js");
const {validateListing} = require("../middleware.js");
const listingcontroller = require("../controllers/listing.js");
const multer = require('multer');
const {storage} =require("../cloudConfig.js");
const upload = multer({storage});



router
.route("/")
.get(wrapAsync(listingcontroller.index))//index route
.post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingcontroller.createListing)
); //Create route



//new route
router.get("/new",isLoggedIn,listingcontroller.renderNewForm);

router
.route("/:id")
.get(wrapAsync(listingcontroller.showListing))
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingcontroller.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingcontroller.deleteListing))

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingcontroller.rendereditform));

module.exports= router;