// Load environment variables in development mode
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Core modules
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");

// Middleware
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

// Models & Utilities
const User = require("./models/user.js");
const ExpressError = require("./utils/ExpressError.js");

// Routers (✅ fixed relative imports)
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// MongoDB Connection
const dbUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/wanderlust";

console.log("🧩 Connecting to:", dbUrl);

async function main() {
  try {
    await mongoose.connect(dbUrl);
    console.log("✅ Connected to MongoDB Atlas");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
}
main();

// App Configuration
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Session configuration
const sessionOptions = {
  secret: process.env.SECRET || "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash + Current User Middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// Routes
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

// Handle 404s
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// Centralized Error Handler
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong!";
  res.status(statusCode).render("listings/error.ejs", { err });
});

// Server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
