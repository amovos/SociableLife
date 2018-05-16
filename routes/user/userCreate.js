// ==========================
// USER CREATE ROUTE
// ==========================

var User = require("../../models/user");
var genericErrorResponse = require("../shared/genericErrorResponse");
//var cloudinary = require('cloudinary');
//var cloudinaryConf = require("../shared/cloudinary");
var request = require("request");

var createRoute = async function(req, res){
    
    // Check if invite code is correct
    if(req.body.inviteCode === process.env.INVITE_CODE){
    
        const captcha = req.body["g-recaptcha-response"];
        if (!captcha) {
            req.flash("errorMessage", "Please select captcha");
            return res.redirect("back");
        }
        // secret key
        var secretKey = process.env.CAPTCHA_SECRET;
        // Verify URL
        var verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}&remoteip=${req.connection.remoteAddress}`;
        // Make request to Verify URL
        await request.get(verifyURL, (err, response, body) => {
            if(err){
                genericErrorResponse(req, res, err);
            }
            // if not successful
            if (body.success !== undefined && !body.success) {
                req.flash("errorMessage", "Captcha Failed");
                return res.redirect("/contact");
            }
        });
        
        
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
        
        // REMOVED FOR NOW TO AVOID CLASH WITH RECAPTCHA
        // ADD PROFILE PICTURE AFTER ON THE EDIT PROFILE SCREEN (AND USE THIS CODE)
        //if an image has been added on create then upload it to Cloudinary
        // if(req.file){
        //     // CLOUDINARY
        //     cloudinary.config(cloudinaryConf);
        
        //     // set image location to correct folder on Cloudinary
        //     var public_id = "sl-" + process.env.ENV_ID + "/avatars/" + req.file.filename; //could change to a random string
            
        //     // Upload the image to Cloudinary and wait for a response
        //     await cloudinary.v2.uploader.upload(req.file.path, {public_id: public_id}, function(err, result) {
        //         if(err) {
        //             req.flash('errorMessage', err.message);
        //             return res.redirect('back');
        //         }
        //         // add cloudinary url for the image to the newUser
        //         newUser.avatar = result.secure_url;
        //         // add image's public_id to newUser object
        //         newUser.avatarId = result.public_id;
        //     });
        // }
        
        //if admin code is correct make the new user an admin
        if(req.body.adminCode === process.env.ADMIN_CODE){
            newUser.isAdmin = true;
        }
        
        
        User.register(newUser, req.body.password, function(err, registeredUser){ //pass the password to the passport-local-mongoose method. This means you don't store the password in plain text, only the hash.
            if(err){
                // NEED TO CHECK DUPLICATE DISPLAY NAMES
                
                //passport-local-mongoose renders a nice err.message if the username is a duplicate
                req.flash("errorMessage", "A user with the given email is already registered, please login or reset your password");
                return res.redirect("back"); //return required so it doesn't continue with the rest of the code. Could also use "else if"
            
            } else req.logIn(registeredUser, function(err) { //as this is a custom callback we need to explicitly log the user in
                if (err) {
                    genericErrorResponse(req, res, err);
                } else {
                    req.flash("successMessage", "Welcome to Sociable Life " + registeredUser.displayName);
                    res.redirect("/activities");
                }
            });
        }); 
        
    } else {
        req.flash("errorMessage", "Sorry, that invite code isn't right");
        return res.redirect("back");
    }
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = createRoute;