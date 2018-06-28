// ==========================
// ACTIVITY NEW ROUTE
// ==========================

var newReviewRoute =  function(req, res){
    
    res.render("activities/newReview", {page: 'addActivity'});
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = newReviewRoute;