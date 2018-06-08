// ==========================
// ADMIN ROUTES
// ==========================

var express = require("express");
var router = express.Router();

// ==========================
// BROKEN LINK SHOW ROUTE
// ==========================
router.get("/brokenLinks", require("./admin/brokenLinksShow")); //need to add a "is admin" middleware and error handling

// ==========================
// BROKEN LINK UPDATE ROUTE
// ==========================
//router.get("/brokenLinks", require("./admin/brokenLinks/update")); //need to add a "is admin" middleware and error handling

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = router;