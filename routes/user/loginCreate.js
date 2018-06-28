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
            
            var redirectUrl = "/login";

            if(req.body.return_url) {
                redirectUrl += "?return_url=" + req.body.return_url;
            }
            
            //used to redirect users to the activity create page after loggin in and retain the activity name they entered
            if(req.body.activityName) {
                redirectUrl += "&activityName=" + req.body.activityName;
            }
            
            return res.redirect(redirectUrl);
            
        } else {
            req.logIn(user, function(err) { //as this is a custom callback we need to explicitly log the user in
                if (err) {
                    req.flash("errorMessage", err.message);
                    return res.redirect("/login");
                } else {
                    req.flash("successMessage", "Welcome to Sociable Life " + user.displayName);
                    if(req.body.return_url) {
                        var fixedUrlString = req.body.return_url.replace(/%2F/g, "/");
                        
                        if(req.body.activityName) {
                            res.redirect(fixedUrlString + "?activityName=" + req.body.activityName);
                        } else {
                            res.redirect(fixedUrlString);
                        }
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