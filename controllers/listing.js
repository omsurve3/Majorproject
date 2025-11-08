const Listing = require("../models/listing");

// ✅ Display all listings
module.exports.index = async (req, res) => {
  const alllistings = await Listing.find({});
  res.render("listings/index", { alllistings });
};

// ✅ Render form to create new listing
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};

// ✅ Show a single listing
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested does not exist");
    return res.redirect("/listings");
  }

  res.render("listings/show", { listing });
};

// ✅ Create a new listing
module.exports.createListing = async (req, res, next) => {
  try {
    const url = req.file.path;
    const filename = req.file.filename;

    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image = { url, filename };

    await newlisting.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  } catch (err) {
    next(err);
  }
};

// ✅ Render edit form for an existing listing
module.exports.rendereditform = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing you requested does not exist");
    return res.redirect("/listings");
  }

  let ogimgurl = listing.image.url.replace("/upload", "/upload/h_300,w_250");
  res.render("listings/edit", { listing, ogimgurl });
};

// ✅ Update a listing
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;

  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    const url = req.file.path;
    const filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

// ✅ Delete a listing
module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
