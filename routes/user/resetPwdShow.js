// ==========================
// RESET PASSWORD ROUTE
// ==========================

var User = require("../../models/user");

var resetPwdRoute = function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('errorMessage', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('users/reset', {token: req.params.token});
  });
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = resetPwdRoute;









