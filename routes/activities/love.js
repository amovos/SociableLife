// ==========================
// ACTIVITY LOVE ROUTE
// ==========================

var Activity = require("../../models/activity");

var updateLovesRoute = async function(req, res){
    await Activity.findById(req.params.activityId, async function(err, foundActivity){
        if(err || !foundActivity){
            return; //need to add useful error message here
        } else {
            //check to see if user ID is already in array
            var isInArray = foundActivity.loves.some(function (user) {
                return user.equals(req.params.id);
            });
            
            if(isInArray){
                //remove user id from love array
                foundActivity.loves.splice(foundActivity.loves.indexOf(req.params.id), 1);
                foundActivity.save();
                return res.send(false);
                
            } else {
                //add user id to love array
                foundActivity.loves.push(req.params.id);
                foundActivity.save();
                
                return res.send(true);
            }
        }
    });
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = updateLovesRoute;