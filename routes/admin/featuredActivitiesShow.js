// ==============================
// FEATURED ACTIVITIES SHOW ROUTE
// ==============================

var Activity = require("../../models/activity");

var adminFeaturedActivitites = async function(req, res){
    
    //find all activities
    var allActivities = await Activity.find();
    
    res.render("admin/featuredActivitiesShow", {page: 'featuredActivities', activities: allActivities});
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = adminFeaturedActivitites;