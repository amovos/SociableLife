function activityCreateObject(req, res) {
    
    // USED IN
    // routes/activities/create.js
    // routes/activities/new.js
    // routes/activities/newReview.js
    // routes/activities/newPostReturn.js
    
    var name;
    var summary;
    var location;
    var description;
    var image;
    
    //if a name has been set in the query string then set it as the name
    if(req.body.queryName) {
        name = req.body.queryName;
    }
    
    //if there is an activity body (because it has returned from a future step) then set all the variables
    if(req.body.activity){
        name = req.body.activity.name;
        summary = req.body.activity.summary;
        location = req.body.activity.location;
        description = req.body.activity.description;
    }

    return {
        page: 'addActivity', 
        activityName: name,
        activitySummary: summary,
        activityLocation: location,
        activityDescription: description,
        activityImage: image,
        fileValidationError: req.fileValidationError
    };
}

module.exports = activityCreateObject;