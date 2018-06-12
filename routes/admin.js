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

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = router;