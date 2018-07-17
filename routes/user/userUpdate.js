// ==========================
// USER CREATE ROUTE
// ==========================

var User = require("../../models/user");

var updateUserRoute = async function(req, res){
    
    // CHECK USER INPUTS FOR INVALID CHARACTERS
    if(checkUserInput(res, req.body.firstName, "First Name")) {return}
    if(checkUserInput(res, req.body.lastName, "Last Name")) {return}
    if(checkUserInput(res, req.body.displayName, "Display Name")) {return}
    
    // CHECK FOR LENGTH OF INPUTS
    if(req.body.firstName.length    > 30) {return res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> First Name is too long (30 characters max)"})}
    if(req.body.lastName.length     > 30) {return res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> Last Name is too long (30 characters max)"})}
    if(req.body.displayName.length  > 30) {return res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> Display Name is too long (30 characters max)"})}
    if(req.body.contactEmail.length  > 100) {return res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> Contact Email is too long (100 characters max)"})}
    if(req.body.contactNumber.length  > 100) {return res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> Contact Number is too long (100 characters max)"})}
    if(req.body.contactWebsite.length  > 100) {return res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> Contact Website is too long (100 characters max)"})}
    if(req.body.userBio.length  > 500) {return res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> Bio is too long (" + req.body.userBio.length + "/500 characters)"})}
    
    //sanitize protocol from contact website if given (so that it works with the <a> tag as a link)
    if(req.body.contactWebsite){
        req.body.contactWebsite = req.body.contactWebsite.replace(/^https?\:\/\/|\/$/, "");
    }
    
    //Find user to see what needs updating
    User.findById(req.params.id, async function(err, foundUser){
        if(err || !foundUser){
            req.flash("errorMessage", "User not found");
            return res.redirect('/activities');
        }
        
        var changeFlag = false; //only update if a change has been made
        
        // EMAIL OR USERNAME CHANGE
        if(req.body.email !== foundUser.email) {    foundUser.username = req.body.email; 
                                                    foundUser.email = req.body.email; 
                                                    changeFlag = true; 
        }
        
        // FIRST NAME CHANGE
        if(req.body.firstName !== foundUser.firstName) {                foundUser.firstName = req.body.firstName; changeFlag = true; }
        
        // LAST NAME CHANGE
        if(req.body.lastName !== foundUser.lastName) {                  foundUser.lastName = req.body.lastName; changeFlag = true; }
        
        // DISPLAY NAME CHANGE
        if(req.body.displayName !== foundUser.displayName) {            
            foundUser.displayName = req.body.displayName; 
            foundUser.lowerDisplayName = req.body.displayName.toLowerCase();
            changeFlag = true; 
        }
        
        // CONTACT EMAIL CHANGE
        if(req.body.contactEmail !== foundUser.contactInfo.contactEmail) {          foundUser.contactInfo.contactEmail = req.body.contactEmail; changeFlag = true; }
        
        // CONTACT NUMBER CHANGE
        if(req.body.contactNumber !== foundUser.contactInfo.contactNumber) {        foundUser.contactInfo.contactNumber = req.body.contactNumber; changeFlag = true; }
        
        // CONTACT WEBSITE CHANGE
        if(req.body.contactWebsite !== foundUser.contactInfo.contactWebsite) {      foundUser.contactInfo.contactWebsite = req.body.contactWebsite; changeFlag = true; }
        
        // USER BIO CHANGE
        if(req.body.userBio !== foundUser.bio) {                    foundUser.bio = req.body.userBio; changeFlag = true; }
        
        if(changeFlag){
            await foundUser.save(function(err){
                console.log(err);
                if(err && err.message.includes("displayName_1")) {
                    return res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> Sorry, the display name \"" + req.body.displayName + "\" is already being used, please try a different one</a>"});
                } else if(err && err.message.includes("username_1")){
                    return res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> Sorry, a user with the email \"" + req.body.email + "\" already exists"});
                } else {
                    return res.send({type: "success"});
                }
            });
        } else {
            return res.send({type: "success"});
        }
    });

};

function checkUserInput(res, input, Str){
    if(!input.match(/^[a-zA-Z0-9]+([_ -]?[a-zA-Z0-9])*$/)){ //Special characters (_, , -) have to be followed by an alphanumeric character. The first and last characters must be alphanumeric characters.
        res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> " + Str + " isn't valid (it can only contain letters, numbers, -, _ , or spaces (it also can't start or end with spaces)"});
        return true;
    } else {
        return false;
    }
}

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = updateUserRoute;