// =================================
// FEATURED ACTIVITIES REMOVE ROUTE
// =================================

var Activity = require("../../models/activity");

var adminFeaturedActivititesRemove = async function(req, res){
    
    Activity.findById(req.params.id, async function(err, activity){
        if(err || !activity){
            req.flash("errorMessage", "Activity not found");
            res.redirect("/admin/featuredActivities");
        } else {
            activity.featured = false;
            await activity.save();
            res.redirect("/admin/featuredActivities");
        }
    });
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = adminFeaturedActivititesRemove;