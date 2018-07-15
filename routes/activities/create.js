// ==========================
// ACTIVITIES CREATE ROUTE
// ==========================

var genericErrorResponse = require("../shared/genericErrorResponse");
var ActivityUpdateHistory = require("../../models/activityUpdateHistory");
var Activity = require("../../models/activity");
var Comment = require("../../models/comment");
var User = require("../../models/user");
var geocoder = require("../shared/geocoder");
var cloudinary = require('cloudinary');
var cloudinaryConf = require("../shared/cloudinary");
var request = require("request");
var UpdateRequest = require("../../models/updateRequest");

var activityCreateObject = require("./activityCreateObject");

var req;
var res;

var createRoute = async function(localReq, localRes){
    
    req = localReq;
    res = localRes;
    
    //all these functions will run in parallel but the .then(createActivity) won't run until they have all completed
    Promise.all([
                    multerErrorCheck(), 
                    captchaCheck(), 
                    cloudinaryUpload(),
                    geocodeLocation(),
                    additionalChecks(),
                    setValues(),
                    createFirstUpdateHistoryLog(),
                    createFirstUpdateRequest(),
                    addFirstCommentAndLove()
                ])
    .then(createActivity);
    
};
  

async function multerErrorCheck() {
    //if multer error - display here
    if(req.fileValidationError) {
        return res.render("activities/newReview", activityCreateObject(req, res));
    } else {
        return;
    }
}

async function captchaCheck() {
    //not sure why it's in this format here but just req.body.captcha for registering a user
    req.body.captcha = req.body['g-recaptcha-response'];

    // CHECK CAPTCHA (only if no current user)
    if(!req.user) {
        if (!req.body.captcha) {
            req.fileValidationError = "Please select reCAPTCHA (you might also need to reselect your image)";
            return res.render("activities/newReview", activityCreateObject(req, res));
        } else {
            // secret key
            var secretKey = process.env.CAPTCHA_SECRET;
            // Verify URL
            var verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}`;
            // Make request to Verify URL
            await request.get(verifyURL, (err, response, body) => {
                if(err){
                    req.fileValidationError = "Captcha failed, please try again";
                    return res.render("activities/newReview", activityCreateObject(req, res));
                }
                // if not successful
                if (body.success !== undefined && !body.success) {
                    req.fileValidationError = "Captcha failed, please try again";
                    return res.render("activities/newReview", activityCreateObject(req, res));
                }
            });
        }
    } else {
        return;
    }
}

async function cloudinaryUpload() {
    //if an image has been added on create then upload it to Cloudinary
    if(req.file){
        // CLOUDINARY
        cloudinary.config(cloudinaryConf);
    
        // set image location to correct folder on Cloudinary
        var public_id = "sl-" + process.env.ENV_ID + "/activities/" + req.file.filename;
        
        // Upload the image to Cloudinary and wait for a response
        await cloudinary.v2.uploader.upload(req.file.path, {public_id: public_id}, function(err, result) {
            if(err) {
                req.flash('errorMessage', err.message);
                return res.redirect('back');
            } else {
                // add cloudinary url for the image to the activity object under image property
                req.body.activity.image = result.secure_url;
                // add image's public_id to activity object
                req.body.activity.imageId = result.public_id;
                return;
            }
        });
    } else {
        return;
    }
}

async function geocodeLocation() {
    // GEOCODE Location
    //generate geocode data, use "await" to make sure it completes before creating activity
    await geocoder.geocode(req.body.activity.location, function (err, data) {
        if (err || !data.length) {
          req.fileValidationError = "Location is invalid, please edit to fix";
          return res.render("activities/newReview", activityCreateObject(req, res));
        } else {
            //add the geocode data to the activity object using dot notation
            req.body.activity.lat = data[0].latitude;
            req.body.activity.lng = data[0].longitude;
            req.body.activity.location = data[0].formattedAddress; //This uses the nicely formatted location that is returned by geocoder and replaces the original content
            return;
        }
    });
}

async function additionalChecks() {
    //ADDITIONAL CHECKS
    // These should already have been passed in the UI to get to this point, but to stop people adding activities without validating data perform the checks again
    
    //check if inputs are not just whitespace
    if (!(/\S/.test(req.body.activity.name)))           {req.fileValidationError = "Activity Name can't be empty, please edit to fix"; return res.render("activities/newReview", activityCreateObject(req, res))}
    if (!(/\S/.test(req.body.activity.summary)))        {req.fileValidationError = "Summary can't be empty, please edit to fix"; return res.render("activities/newReview", activityCreateObject(req, res))}
    if (!(/\S/.test(req.body.activity.description)))    {req.fileValidationError = "Description can't be empty, please edit to fix"; return res.render("activities/newReview", activityCreateObject(req, res))}
    if (!(/\S/.test(req.body.activity.location)))       {req.fileValidationError = "Location can't be empty, please edit to fix"; return res.render("activities/newReview", activityCreateObject(req, res))}
    if (!(/\S/.test(req.body.activity.when)))           {req.fileValidationError = "When can't be empty, please edit to fix"; return res.render("activities/newReview", activityCreateObject(req, res))}
    if (!(/\S/.test(req.body.activity.price)))          {req.fileValidationError = "Cost can't be empty, please edit to fix"; return res.render("activities/newReview", activityCreateObject(req, res))}
    if (!(/\S/.test(req.body.activity.frequency)))      {req.fileValidationError = "Type can't be empty, please edit to fix"; return res.render("activities/newReview", activityCreateObject(req, res))}
    
    //check optional inputs are not just whitespace
    if(req.body.activity.contactEmail) {    if (!(/\S/.test(req.body.activity.contactEmail))) {req.fileValidationError = "Contact Email can't be just white space, please edit to fix"; return res.render("activities/newReview", activityCreateObject(req, res))}}
    if(req.body.activity.contactNum) {      if (!(/\S/.test(req.body.activity.contactNum))) {req.fileValidationError = "Contact Number can't be just white space, please edit to fix"; return res.render("activities/newReview", activityCreateObject(req, res))}}
    if(req.body.activity.website) {         if (!(/\S/.test(req.body.activity.website))) {req.fileValidationError = "Website address can't be just white space, please edit to fix"; return res.render("activities/newReview", activityCreateObject(req, res))}}
    if(req.body.activity.facebook) {        if (!(/\S/.test(req.body.activity.facebook))) {req.fileValidationError = "Facebook address can't be just white space, please edit to fix"; return res.render("activities/newReview", activityCreateObject(req, res))}}
    if(req.body.activity.twitter) {         if (!(/\S/.test(req.body.activity.twitter))) {req.fileValidationError = "Twitter address can't be just white space, please edit to fix"; return res.render("activities/newReview", activityCreateObject(req, res))}}
    if(req.body.activity.videoUrl) {        if (!(/\S/.test(req.body.activity.videoUrl))) {req.fileValidationError = "Video address can't be just white space, please edit to fix"; return res.render("activities/newReview", activityCreateObject(req, res))}}

    // CHECK FOR LENGTH OF INPUTS
    if(req.body.activity.name.length         > 100)     {req.fileValidationError = "Activity Name is too long, please edit to fix"; return res.render("activities/newReview", activityCreateObject(req, res))}
    if(req.body.activity.summary.length      > 300)     {req.fileValidationError = "Summary is too long, please edit to fix"; return res.render("activities/newReview", activityCreateObject(req, res))}
    if(req.body.activity.description.length  > 2000)    {req.fileValidationError = "Description is too long, please edit to fix"; return res.render("activities/newReview", activityCreateObject(req, res))}
    if(req.body.activity.location.length     > 300)     {req.fileValidationError = "Location is too long, please edit to fix"; return res.render("activities/newReview", activityCreateObject(req, res))}
    if(req.body.activity.when.length         > 300)     {req.fileValidationError = "When is too long, please edit to fix"; return res.render("activities/newReview", activityCreateObject(req, res))}
    if(req.body.activity.price.length        > 300)     {req.fileValidationError = "Price is too long, please edit to fix"; return res.render("activities/newReview", activityCreateObject(req, res))}
    if(req.body.activity.frequency.length    > 50)      {req.fileValidationError = "Type is too long, please edit to fix"; return res.render("activities/newReview", activityCreateObject(req, res))}

    //check optional inputs lengths
    if(req.body.activity.contactEmail) {    if(req.body.activity.contactEmail.length > 300)   {req.fileValidationError = "Contact Email is too long, please edit to fix"; return res.render("activities/newReview", activityCreateObject(req, res))}}
    if(req.body.activity.contactNum) {      if(req.body.activity.contactNum.length > 50)      {req.fileValidationError = "Contact Number is too long, please edit to fix"; return res.render("activities/newReview", activityCreateObject(req, res))}}
    if(req.body.activity.website) {         if(req.body.activity.website.length > 2000)       {req.fileValidationError = "Website address is too long, please edit to fix"; return res.render("activities/newReview", activityCreateObject(req, res))}}
    if(req.body.activity.facebook) {        if(req.body.activity.facebook.length > 2000)      {req.fileValidationError = "Facebook address is too long, please edit to fix"; return res.render("activities/newReview", activityCreateObject(req, res))}}
    if(req.body.activity.twitter) {         if(req.body.activity.twitter.length > 2000)       {req.fileValidationError = "Twitter address is too long, please edit to fix"; return res.render("activities/newReview", activityCreateObject(req, res))}}
    if(req.body.activity.videoUrl) {        if(req.body.activity.videoUrl.length > 2000)      {req.fileValidationError = "Video address is too long, please edit to fix"; return res.render("activities/newReview", activityCreateObject(req, res))}}
    
    //check if neither age box has been checked
    if(!req.body.activity.isAdult && !req.body.activity.isChild) { {req.fileValidationError = "No age selected, please edit to fix"; return res.render("activities/newReview", activityCreateObject(req, res))}}
    
    //check if neither suitable box has been checked
    if(!req.body.activity.isPhysical && !req.body.activity.isLearning) { {req.fileValidationError = "No ability selected, please edit to fix"; return res.render("activities/newReview", activityCreateObject(req, res))}}

    //check endDate is formatted correctly
    if(req.body.activity.endDate) {
        if (!(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/
        .test(req.body.activity.endDate))) {
            req.fileValidationError = "End date format is wrong (DD/MM/YYYY), please edit to fix"; 
            return res.render("activities/newReview", activityCreateObject(req, res));
        }
    }

    return;

}

async function setValues() {
    // SET AUTHOR
    if(req.user) {
        req.body.activity.author = req.user._id;
    } else {
        //set it to be the community user (do a BD search to find the ID)
        await User.findOne({ username: process.env.COMMUNITY_USERNAME }, function(err, user) {
            if(err){
                genericErrorResponse(req, res, err);
            } else {
                req.body.activity.author = user._id;
            }
        });
    }
    
    // SET END DATE
    if(req.body.activity.endDate) {
        //convert string to date format for MongoDB
        var endDateDD = req.body.activity.endDate.substring(0, 2);
        var endDateMM = req.body.activity.endDate.substring(3, 5);
        var endDateYYYY = req.body.activity.endDate.substring(6, 10);
        
        var endDate = new Date();
        endDate.setYear(endDateYYYY);
        endDate.setMonth(endDateMM - 1); //zero index on months
        endDate.setDate(endDateDD);
        
        //check the endDate is in the future from now
        if(endDate < new Date()) {
            req.fileValidationError = "End date can't be in the past, please edit to fix"; 
            return res.render("activities/newReview", activityCreateObject(req, res));
        }
        
        req.body.activity.endDate = endDate.toISOString();
    }
    
    // SET STATUS (could just be the default in the DB model in future, but then my seed DB script won't work so for now this is fine)
    req.body.activity.status = "review";
    
    // SET AGES
    req.body.activity.age = {};
    if(req.body.activity.isAdult) { req.body.activity.age.isAdult = true; } else { req.body.activity.age.isAdult = false; }
    if(req.body.activity.isChild) { req.body.activity.age.isChild = true; } else { req.body.activity.age.isChild = false; }
    
    // SET SUITABLE
    req.body.activity.suitable = {};
    if(req.body.activity.isPhysical) { req.body.activity.suitable.isPhysical = true; } else { req.body.activity.suitable.isPhysical = false; }
    if(req.body.activity.isLearning) { req.body.activity.suitable.isLearning = true; } else { req.body.activity.suitable.isLearning = false; }

    // SET OWNER (if that was ticked on the form)
    req.body.activity.owner= [];
    if(req.user && req.body.activity.isOwner) {
        await req.body.activity.owner.push(req.user._id);
    }

    //sanitize protocol from links if given (so that it works with the <a> tag as a link)
    if(req.body.activity.website){   req.body.activity.website = req.body.activity.website.replace(/^https?\:\/\/|\/$/, "") }
    if(req.body.activity.facebook){  req.body.activity.facebook = req.body.activity.facebook.replace(/^https?\:\/\/|\/$/, "") }
    if(req.body.activity.twitter){   req.body.activity.twitter = req.body.activity.twitter.replace(/^https?\:\/\/|\/$/, "") }
    
    if(req.body.activity.videoUrl) {
        req.body.activity.videoUrl = req.body.activity.videoUrl;
        req.body.activity.youtubeVideoId = await getYoutubeUrlId(req.body.activity.videoUrl);
    }
    
    return;
}


async function createFirstUpdateHistoryLog() {
    //*********************************
    // CREATE FIRST UPDATE HISTORY LOG
    //*********************************
    req.body.activity.updateHistory = [];
    
    var updateHistoryAuthor;
    
    if(req.user) {
        updateHistoryAuthor = req.user._id;
    } else {
        //set it to be the community user (do a BD search to find the ID)
        await User.findOne({ username: process.env.COMMUNITY_USERNAME }, function(err, user) {
            if(err){
                genericErrorResponse(req, res, err);
            } else {
                updateHistoryAuthor = user._id;
            }
        });
    }
    
    var updateLog = {};
    updateLog.author = updateHistoryAuthor;
    updateLog.updateType = "Activity Created";
    updateLog.oldStatus = "review";
    updateLog.newStatus = "review";
    
    await ActivityUpdateHistory.create(updateLog, async function(err, updateLog){
        if(err){
            genericErrorResponse(req, res, err);
        } else {
            await req.body.activity.updateHistory.push(updateLog);
            return;
         }
    }); 
}

async function createFirstUpdateRequest() {
    //*************************
    //ADD FIRST UPDATE REQUEST
    //*************************
    req.body.activity.updateRequests = [];
    
    // SET UPDATE REQUEST AUTHOR
    // if there is a current user then set them as the author
    var firstUpdateRequestAuthor;
    if(req.user) {
        firstUpdateRequestAuthor = req.user._id;
    } else {
        //else set it to be the community user (do a BD search to find the ID)
        await User.findOne({ username: process.env.COMMUNITY_USERNAME }, function(err, user) {
            if(err){
                genericErrorResponse(req, res, err);
            } else {
                firstUpdateRequestAuthor = user._id;
            }
        });
    }
    
    var firstUpdateRequest = {
        text: "I've just created this activity, please can you check it for me and change it's status to current if you're happy? Things to check are: 1) Does it look legitimate? 2) Does the website work? 3) Has enough information been filled in?",
        author: firstUpdateRequestAuthor
    };
    
    await UpdateRequest.create(firstUpdateRequest, async function(err, newUpdateRequest){
        if(err){
            genericErrorResponse(req, res, err);
        } else {
            // connect new updateRequest to the current activity
            await req.body.activity.updateRequests.push(newUpdateRequest);
            return;
        }
    });
}

async function addFirstCommentAndLove() {
    //***************************
    // ADD FIRST LOVE AND COMMENT
    //***************************
    //find the sociable life community user and add a love and first comment
    req.body.activity.loves = [];
    
    var communityUser = await User.findOne({ username: process.env.COMMUNITY_USERNAME });
    
    if(!communityUser) {
        genericErrorResponse(req, res, "Couldn't find Community User");
    } else {
        //add first love
        await req.body.activity.loves.push(communityUser._id);
    
        //if user is currently logged in the automatically add them to the love list as well
        if(req.user) {
            await req.body.activity.loves.push(req.user._id);
        }
    
        var firstComment = {};
        firstComment.text = "Thanks for adding this activity to Sociable Life!";
        firstComment.author = communityUser._id;
        
        
        //add first comment
        req.body.activity.comments = [];
        await Comment.create(firstComment, async function(err, comment){
            if(err){
                genericErrorResponse(req, res, err);
            } else {
                // connect new comment to the current activity
                await req.body.activity.comments.push(comment);
                return;
            }
        });
    }
}

async function createActivity() {
    // CREATE ACTIVITY
    //Create a new activity and save to database
    await Activity.create(req.body.activity, async function(err, newlyCreatedActivity){
        if(err){
            genericErrorResponse(req, res, err);
        } else {
            //then redirect back to new activity page
            req.flash("successMessage", "Your activity has been created - once it's been reviewed we'll add it to the map! (You can find all your activities listed on your user profile page)");
            res.redirect("/activities/" + newlyCreatedActivity._id + "?isNew=true"); //redirects to the newly created activity
        }
    }); 
}

function getYoutubeUrlId(url){
    var code = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i);
    
    if(code) {
        return (typeof code[1] == 'string') ? code[1] : false;
    } else {
        return;
    }
}


// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = createRoute;