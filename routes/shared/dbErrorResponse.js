// Database Error Response Function
// Not likely to happen to as immediately before it always checks the user in the DB
function dbErrorResponse(req, res, err){
    console.log(err);
    req.flash("errorMessage", err.message);
    res.redirect("back");
}

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = dbErrorResponse;