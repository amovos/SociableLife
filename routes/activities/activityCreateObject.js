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
    var age;
    var when;
    var price;
    var frequency;
    var contactEmail;
    var contactNum;
    
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
        age = req.body.activity.age;
        when = req.body.activity.when;
        price = req.body.activity.price;
        frequency = req.body.activity.frequency;
        contactEmail = req.body.activity.contactEmail;
        contactNum = req.body.activity.contactNum;
    }

    return {
        page: 'addActivity', 
        activityName: name,
        activitySummary: summary,
        activityLocation: location,
        activityDescription: description,
        activityImage: image,
        activityAge: age,
        activityWhen: when,
        activityPrice: price,
        activityFrequency: frequency,
        activityContactEmail: contactEmail,
        activityContactNum: contactNum,
        fileValidationError: req.fileValidationError
    };
}

module.exports = activityCreateObject;