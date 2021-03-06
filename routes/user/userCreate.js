// ==========================
// USER CREATE ROUTE
// ==========================

var User = require("../../models/user");
var genericErrorResponse = require("../shared/genericErrorResponse");
var request = require("request");
//var cloudinary = require('cloudinary');
//var cloudinaryConf = require("../shared/cloudinary");

var createRoute = async function(req, res){
    
    // CHECK USER INPUTS FOR INVALID CHARACTERS
    if(checkUserInput(res, req.body.firstName, "First Name")) {return}
    if(checkUserInput(res, req.body.lastName, "Last Name")) {return}
    if(checkUserInput(res, req.body.displayName, "Display Name")) {return}
    
    // CHECK FOR LENGTH OF INPUTS (MAX 30 CHARACTERS)
    if(req.body.firstName.length    > 30) {return res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> First Name is too long (30 characters max)"})}
    if(req.body.lastName.length     > 30) {return res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> Last Name is too long (30 characters max)"})}
    if(req.body.displayName.length  > 30) {return res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> Display Name is too long (30 characters max)"})}

    
    // CHECK TERMS AND CONDITIONS CHECKBOX
    if(req.body.termsCheck === "false") {
        console.log("terms not checked");
        return res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> To create an account please accept our terms and conditions and our privacy policy"});
    }
    
    // CHECK CAPTCHA
    if (!req.body.captcha) {
        return res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> Please select reCAPTCHA"});
    } else {
        // secret key
        var secretKey = process.env.CAPTCHA_SECRET;
        // Verify URL
        var verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}`;
        // Make request to Verify URL
        await request.get(verifyURL, (err, response, body) => {
            if(err){
                return res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> Captcha failed, please try again"});
            }
            // if not successful
            if (body.success !== undefined && !body.success) {
                return res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> Captcha failed, please try again"});
            }
        });
    }
    
    // CHECK MAILING LIST CHECKBOX
    var mailingList = false;
    
    if(req.body.mailingList === "true") {
        mailingList = true;
    }
    
    
    // CREATE NEW USER OBJECT
    // need to do it this long hand way so that the password isn't stored in the database
    var newUser = new User(
        {
            username: req.body.email.toLowerCase(),
            email: req.body.email.toLowerCase(),
            displayName: req.body.displayName,
            lowerDisplayName: req.body.displayName.toLowerCase(),
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            mailingList: mailingList,
            termsCheck: true
        }
    );
    
    User.register(newUser, req.body.password, function(err, registeredUser){ //pass the password to the passport-local-mongoose method. This means you don't store the password in plain text, only the hash.
        if(err && err.code === 11000){
            return res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> Sorry, the display name \"" + req.body.displayName + "\" is already being used, please try a different one</a>"});
        } else if(err) {
            return res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> Sorry, a user with the email \"" + req.body.email + "\" is already registered, please <a href='/login'>login</a> or <a href='/forgot'>reset your password</a>"});
        } else req.logIn(registeredUser, function(err) { //as this is a custom callback we need to explicitly log the user in
            if (err) {
                return res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> Error logging in, please try again"});
            } else {
                //TO DO - add the new user to mail chimp mailing list that only sends out the first intro email
                return res.send({type: "success", message: registeredUser._id}); //not currently doing anything with the id on the client side
            }
        });
    }); 
};

function checkUserInput(res, input, Str){
    if(!input.match(/^[a-zA-Z0-9]+([_ -]?[a-zA-Z0-9])*$/)){ //Special characters (_, , -) have to be followed by an alphanumeric character. The first and last characters must be alphanumeric characters.
        res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> " + Str + " isn't valid (it can only contain letters, numbers, -, _ , or spaces (it also can't start or end with spaces)"});
        return true;
    } else {
        return false;
    }
}

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = createRoute;