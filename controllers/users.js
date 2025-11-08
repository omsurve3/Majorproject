const User = require("../models/user.js");

// ✅ Render signup page
module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup");
};

// ✅ Handle signup logic
module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Wanderlust!");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

// ✅ Render login page
module.exports.renderLoginForm = (req, res) => {
  res.render("users/login");
};

// ✅ Handle login success
module.exports.Login = async (req, res) => {
  req.flash("success", "Welcome back to Wanderlust!");
  const redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

// ✅ Handle logout
module.exports.Logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "You are logged out!");
    res.redirect("/listings");
  });
};
