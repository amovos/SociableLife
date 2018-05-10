// ==========================
// LOGIN CREATE ROUTE
// ==========================

var passport = require("passport");

var createRoute = function(req, res) {
    passport.authenticate("local", function(err, user, info) {
        if (err) {
            req.flash("errorMessage", err.message);
            return res.redirect("/login");
        } else if (!user) {
            req.flash("errorMessage", "Incorrect username or password");
            return res.redirect("/login");
        } else {
            req.logIn(user, function(err) { //as this is a custom callback we need to explicitly log the user in
                if (err) {
                    req.flash("errorMessage", err.message);
                    return res.redirect("/login");
                } else {
                    req.flash("successMessage", "Welcome to Sociable Life " + user.username);
                    res.redirect("/activities");
                }
            });
        }
    })(req, res); //confusingly this is the line that actually calls the function and passes in the arguments
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = createRoute;