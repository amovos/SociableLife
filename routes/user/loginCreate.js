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
            if(req.body.return_url) {
                res.redirect("/login?return_url=" + req.body.return_url);
            } else {
                return res.redirect("/login");
            }
        } else {
            req.logIn(user, function(err) { //as this is a custom callback we need to explicitly log the user in
                if (err) {
                    req.flash("errorMessage", err.message);
                    return res.redirect("/login");
                } else {
                    req.flash("successMessage", "Welcome to Sociable Life " + user.displayName);
                    if(req.body.return_url) {
                        var fixedUrlString = req.body.return_url.replace(/%2F/g, "/");
                        res.redirect(fixedUrlString);
                    } else {
                        res.redirect("/activities");
                    }
                }
            });
        }
    })(req, res); //confusingly this is the line that actually calls the function and passes in the arguments
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = createRoute;