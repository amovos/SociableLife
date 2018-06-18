// ==========================
// ALL COMMENTS SHOW ROUTE
// ==========================

var Comment = require("../../models/comment");
var Activity = require("../../models/activity");

var allCommentsShow = async function(req, res) {
    var foundComments = await Comment.find().sort({createdAt: -1})
        .populate({
            path: 'author',
            model: 'User'
        });
        
    var allActivities = await Activity.find();
    
    res.render("admin/allComments", {comments: foundComments, activities: allActivities});
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = allCommentsShow;