// ==========================
// API ROUTES
// ==========================

var express = require("express");
var router = express.Router();

// ==========================
// MAP INDEX API ROUTE
// ==========================
router.get("/map", require("./api/activities"));

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = router;