// ==========================
// ACTIVITY SEARCH API ROUTE
// ==========================

var genericErrorResponse = require("../shared/genericErrorResponse"); //require the shared function for a database error
var Activity = require("../../models/activity"); //require the activity database model

var filteredActivities = function(req, res) {
    var searchQuery = req.params.searchQuery;
    
    //if a search query has been entered then use it to refine the database search
    if(searchQuery) {
        const regex = new RegExp(searchRegex(searchQuery), 'gi'); // g: global, i: ignore case?
        
        Activity.find()
        .or([   { 'name': { $regex: regex }}, 
                { 'summary': { $regex: regex }}, 
                { 'description': { $regex: regex }}, 
                { 'tags': { $regex: regex }}
            ])
        .sort({createdAt: -1})
        .then(function(foundActivities){
            res.json(foundActivities);
        })
        .catch(function(err){
            res.send(err);
        });
    
    //if no search query is sent then just return all activities
    } else { 
        Activity.find().sort({createdAt: -1})
        .then(function(foundActivities){
            res.json(foundActivities);
        })
        .catch(function(err){
            res.send(err);
        });
    }
};

function searchRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = filteredActivities;