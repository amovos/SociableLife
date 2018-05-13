// ==========================
// USER CREATE ROUTE
// ==========================

var passport = require("passport");
var User = require("../../models/user");
var genericErrorResponse = require("../shared/genericErrorResponse");
var cloudinary = require('cloudinary');
var cloudinaryConf = require("../shared/cloudinary");

var createRoute = async function(req, res){
    
    // Check if invite code is correct
    if(req.body.inviteCode === process.env.INVITE_CODE){
    
        // need to do it this long hand way so that the password isn't stored in the database
        var newUser = new User(
            {
                username: req.body.email,
                email: req.body.email,
                displayName: req.body.displayName,
                firstName: req.body.firstName,
                lastName: req.body.lastName
            }
        );
        
        //if an image has been added on create then upload it to Cloudinary
        if(req.file){
            // CLOUDINARY
            cloudinary.config(cloudinaryConf);
        
            // set image location to correct folder on Cloudinary
            var public_id = "sl-" + process.env.ENV_ID + "/avatars/" + req.file.filename; //could change to a random string
            
            // Upload the image to Cloudinary and wait for a response
            await cloudinary.v2.uploader.upload(req.file.path, {public_id: public_id}, function(err, result) {
                if(err) {
                    req.flash('errorMessage', err.message);
                    return res.redirect('back');
                }
                // add cloudinary url for the image to the newUser
                newUser.avatar = result.secure_url;
                // add image's public_id to newUser object
                newUser.avatarId = result.public_id;
            });
        }
        
        //if admin code is correct make the new user an admin
        if(req.body.adminCode === process.env.ADMIN_CODE){
            newUser.isAdmin = true;
        }
        
        
        User.register(newUser, req.body.password, function(err, user){ //pass the password to the passport-local-mongoose method. This means you don't store the password in plain text, only the hash.
            if(err){
                // if duplicate email address then database spits back a complicated string, so catch it here and display a nicer message
                if(err.code === 11000){
                    req.flash("errorMessage", "A user with the given email is already registered, please login or reset your password");
                    return res.redirect("back");
                } else {
                    //passport-local-mongoose renders a nice err.message if the username is a duplicate
                    req.flash("errorMessage", err.message);
                    return res.redirect("back"); //return required so it doesn't continue with the rest of the code. Could also use "else if"
                }
            }
            //once the user has been created, log them in
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
                            genericErrorResponse(req, res, err);
                        } else {
                            req.flash("successMessage", "Welcome to Sociable Life " + user.username);
                            res.redirect("/activities");
                        }
                    });
                }
            })(req, res); //confusingly this is the line that actually calls the function and passes in the arguments
        }); 
        
    } else {
        req.flash("errorMessage", "Sorry, that invite code isn't right :/");
        return res.redirect("back");
    }
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = createRoute;