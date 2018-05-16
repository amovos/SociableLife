// ==========================
// CONTACT CREATE ROUTE
// ==========================

var request = require("request");
var nodemailer = require("nodemailer");
var genericErrorResponse = require("../shared/genericErrorResponse"); //require the shared function for a database error

var createRoute = async function(req, res){
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
        
    var smtpTransport = nodemailer.createTransport({
        service: 'SendGrid', 
        auth: {
            user: process.env.SENDGRID_USERNAME,
            pass: process.env.SENDGRID_APIKEY
        }
    });
     
    var mailOptions = {
        to:         "hello@sociablelife.uk",
        from:       "no-reply@sociablelife.uk",
        replyTo:    req.body.email,
        subject:    "Sociable Life Contact Form: " + req.body.name,
        text:       'You have received an email from... Name: '+ req.body.name + ' Phone: ' + req.body.phone + ' Email: ' + req.body.email + ' Message: ' + req.body.message,
        html:       '<h3>You have received an email from...</h3><ul><li>Name: ' + req.body.name + ' </li><li>Phone: ' + req.body.phone + ' </li><li>Email: ' + req.body.email + ' </li></ul><p>Message: <br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + req.body.message + ' </p>'
    };
        
    smtpTransport.sendMail(mailOptions, function(err, info){
        if(err) {
            req.flash("errorMessage", "Sorry, something went wrong... Please try again later!");
            res.redirect("/contact");
        } else {
            req.flash("successMessage", "Your message has been sent, we will respond as soon as possible :)");
            res.redirect("/activities");
        }
    });
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = createRoute;