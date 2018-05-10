// Generic Error Response Function
// Not likely to happen
function genericErrorResponse(req, res, err){
    console.log(err);
    req.flash("errorMessage", "Something went wrong :/ sorry! Please try again");
    res.redirect("back");
}

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = genericErrorResponse;