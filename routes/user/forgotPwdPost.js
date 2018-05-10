// ==========================
// FORGOT PASSWORD ROUTE
// ==========================

var User = require("../../models/user");
var async = require("async");
var crypto = require("crypto");
var nodemailer = require("nodemailer");
var genericErrorResponse = require("../shared/genericErrorResponse");

var forgotPwdRoute = function(req, res, next) {
    async.waterfall([
        // FUNCTION 1 - Create reset token
        function(done) {
            crypto.randomBytes(20, function(err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        
        // FUNCTION 2 - if email exists, add reset token to user
        function(token, done) {
            User.findOne({ email: req.body.email }, function(err, user) {
                if (err){
                    genericErrorResponse(req, res, err);
                } else if (!user) {
                    req.flash('errorMessage', 'No account with that email address exists.');
                    return res.redirect('/forgot');
                }
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
            
                user.save(function(err) {
                    done(err, token, user);
                });
            });
        },
        
        // FUNCTION 3 - SENDGRID send email
        function(token, user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: 'SendGrid', 
                auth: {
                    user: process.env.SENDGRID_USERNAME,
                    pass: process.env.SENDGRID_APIKEY
                }
            });
            var mailOptions = {
                    to:         user.email,
                    from:       'no-reply@sociablelife.uk',
                    subject:    'Sociable Life Password Reset',
                    text:       'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                                'https://' + req.headers.host + '/reset/' + token + '\n\n' +
                                'This link will only work for 1 hour. You will need to reset your passowrd again if the link has expired\n\n' +
                                'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                req.flash('successMessage', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                done(err, 'done');
            });
        }
    ],
    // FUNCTION AFTER WATERFALL
    function(err) {
        if (err) return next(err);
        res.redirect('/forgot');
    });
};


// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = forgotPwdRoute;