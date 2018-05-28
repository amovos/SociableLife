// ==========================
// API ROUTES
// ==========================

var express = require("express");
var router = express.Router();

// ==========================
// ALL ACTIVITIES API ROUTE
// ==========================
router.get("/activities", require("./api/activities"));

// ==========================
// ACTIVITY SEARCH API ROUTE
// ==========================
router.get("/activities/:searchQuery", require("./api/activitiesSearch"));


// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = router;