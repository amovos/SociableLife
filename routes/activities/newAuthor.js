// ==========================
// ACTIVITY NEW AUTHOR ROUTE
// ==========================

var newCheckRoute = function(req, res){

    //if user is logged in then redirect straight to activity creation page (and send name with it)
    if(req.user){
        var activityName = "";
        if(req.query.activityName) {
            activityName = "?activityName=" + req.query.activityName;
        }
        
        var url = "/activities/new" + activityName;
        res.redirect(url);
    } else {
        res.render("activities/newAuthor", {page: 'addActivity', activityName: req.query.activityName});   
    }
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = newCheckRoute;