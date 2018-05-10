// ==========================
// USER CREATE ROUTE
// ==========================

var passport = require("passport");
var User = require("../../models/user");

var createRoute = function(req, res){
    // need to do it this long hand way so that the password isn't stored in the database
    var newUser = new User(
        {
            username: req.body.username,
            avatar: req.body.avatar,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email
        }
    );
    
    //if admin code is correct make the new user an admin
    if(req.body.adminCode === process.env.ADMIN_CODE){ //make an ENV variable to hide
        newUser.isAdmin = true;
    }
    //eval(require('locus'));
    User.register(newUser, req.body.password, function(err, user){ //pass the password to the passport-local-mongoose method. This means you don't store the password in plain text, only the hash.
        if(err){
            console.log(err);
            req.flash("errorMessage", err.message);
            return res.redirect("back"); //return required so it doesn't continue with the rest of the code. Could also use "else if"
        }
        //once the user has been created, log them in
        passport.authenticate("local", function(err, user, info) {
            if (err) {
                console.log(err);
                req.flash("errorMessage", err.message);
                return res.redirect("/login");
            } else if (!user) {
                req.flash("errorMessage", "Incorrect username or password");
                return res.redirect("/login");
            } else {
                req.logIn(user, function(err) { //as this is a custom callback we need to explicitly log the user in
                    if (err) {
                        console.log(err);
                        req.flash("errorMessage", err.message);
                        return res.redirect("/login");
                    } else {
                        req.flash("successMessage", "Welcome to Sociable Life " + user.username);
                        res.redirect("/activities");
                    }
                });
            }
        })(req, res); //confusingly this is the line that actually calls the function and passes in the arguments
    }); 
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = createRoute;