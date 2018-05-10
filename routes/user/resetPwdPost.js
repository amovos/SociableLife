// ==========================
// RESET PASSWORD ROUTE
// ==========================

var User = require("../../models/user");
var async = require("async");
var nodemailer = require("nodemailer");
var genericErrorResponse = require("../shared/genericErrorResponse");


var resetPwdRoute = function(req, res, next) {
    async.waterfall([
        // FUNCTION 1 - Check token is still valid, and that new passwords match
        function(done) {
            User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) { // $gt: Date.now() check that the value is greater than now
                if (!user) {
                    req.flash('errorMessage', 'Password reset token is invalid or has expired. Please request a new one');
                    return res.redirect('/forgot');
                }
                if(req.body.password === req.body.confirm) {
                    user.setPassword(req.body.password, function(err) { //.setPassword method comes from passport-local-mongoose
                        if(err){
                            genericErrorResponse(req, res, err);
                        }
                        user.resetPasswordToken = undefined;
                        user.resetPasswordExpires = undefined;
        
                        user.save(function(err) {
                            if(err){
                                genericErrorResponse(req, res, err);
                            }
                            req.logIn(user, function(err) {
                                done(err, user);
                            });
                        });
                    });
                } else {
                    req.flash("errorMessage", "Passwords do not match.");
                    return res.redirect('back');
                }
            });
        },
    
        // FUNCTION 2 - Send password reset confirmation email
        function(user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: 'SendGrid', 
                auth: {
                    user: process.env.SENDGRID_USERNAME,
                    pass: process.env.SENDGRID_APIKEY
                }
            });
            var mailOptions = {
                    to: user.email,
                    from:       'no-reply@sociablelife.uk',
                    subject:    'Your password has been changed',
                    text:       'Hello,\n\n' +
                                'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                req.flash('successMessage', 'Success! Your password has been changed.');
                done(err);
            });
        }
    ], 
    // FUNCTION AFTER WATERFALL
    function(err) {
        if (err) return next(err);
        res.redirect('/activities');
    });
};




// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = resetPwdRoute;









