// ==========================
// ADMIN ROUTES
// ==========================

var express = require("express");
var router = express.Router();
var middleware = require("../middleware");

// ==========================
// INDEX ROUTE
// ==========================
router.get("/", middleware.isAdmin, require("./admin/index"));

// ==========================
// BROKEN LINK SHOW ROUTE
// ==========================
router.get("/brokenLinks", middleware.isAdmin, require("./admin/brokenLinksShow"));

// ============================
// BROKEN LINK CHECK ALL ROUTE
// ============================
router.post("/brokenLinks/checkAll", middleware.isAdmin, require("./admin/brokenLinksCheckAll"));

// ============================
// USER PERMISSION SHOW ROUTE
// ============================
router.get("/userPermissions", middleware.isAdmin, require("./admin/userPermissionsShow"));

// ============================
// USER PERMISSION UPDATE ROUTE
// ============================
router.put("/userPermissions", middleware.isAdmin, require("./admin/userPermissionsUpdate"));

// ============================
// ALL COMMENTS SHOW ROUTE
// ============================
router.get("/allComments", middleware.isAdmin, require("./admin/allCommentsShow"));

// ============================
// UPDATE REQUESTS SHOW ROUTE
// ============================
router.get("/updateRequests", middleware.isAdminOrMod, require("./admin/updateRequestsShow"));

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = router;