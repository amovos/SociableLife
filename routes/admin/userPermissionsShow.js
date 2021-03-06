// ==========================
// USER PERMISSIONS SHOW ROUTE
// ==========================

var User = require("../../models/user");

var userPermissionsShow = async function(req, res) {
    var foundUsers = await User.find().sort({createdAt: -1});
    
    res.render("admin/userPermissions", {users: foundUsers});
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = userPermissionsShow;