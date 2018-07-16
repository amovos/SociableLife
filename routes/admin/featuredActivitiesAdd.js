// ==============================
// FEATURED ACTIVITIES ADD ROUTE
// ==============================

var Activity = require("../../models/activity");

var adminFeaturedActivititesAdd = async function(req, res){
    
    Activity.findById(req.body.newFeaturedActivity, async function(err, activity){
        if(err || !activity){
            req.flash("errorMessage", "Activity not found");
            res.redirect("/admin/featuredActivities");
        } else {
            activity.featured = true;
            await activity.save();
            res.redirect("/admin/featuredActivities");
        }
    });
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = adminFeaturedActivititesAdd;