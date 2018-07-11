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
    var isAdult;
    var isChild;
    var isPhysical;
    var isLearning;
    var when;
    var price;
    var frequency;
    var contactEmail;
    var contactNum;
    var website;
    var facebook;
    var twitter;
    
    var isOwner;
    
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
        isAdult = req.body.activity.isAdult;
        isChild = req.body.activity.isChild;
        isPhysical = req.body.activity.isPhysical;
        isLearning = req.body.activity.isLearning;
        when = req.body.activity.when;
        price = req.body.activity.price;
        frequency = req.body.activity.frequency;
        contactEmail = req.body.activity.contactEmail;
        contactNum = req.body.activity.contactNum;
        website = req.body.activity.website;
        facebook = req.body.activity.facebook;
        twitter = req.body.activity.twitter;
        
        isOwner = req.body.activity.isOwner;
    }

    return {
        page: 'addActivity', 
        activityName: name,
        activitySummary: summary,
        activityLocation: location,
        activityDescription: description,
        activityImage: image,
        activityIsAdult: isAdult,
        activityIsChild: isChild,
        activityIsPhysical: isPhysical,
        activityIsLearning: isLearning,
        activityWhen: when,
        activityPrice: price,
        activityFrequency: frequency,
        activityContactEmail: contactEmail,
        activityContactNum: contactNum,
        activityWebsite: website,
        activityFacebook: facebook,
        activityTwitter: twitter,
        activityIsOwner: isOwner,
        fileValidationError: req.fileValidationError
    };
}

module.exports = activityCreateObject;