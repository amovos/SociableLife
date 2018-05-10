// ==========================
// INDEX ROUTES
// ==========================

var express = require("express");
var router = express.Router();

// ==========================
// ROOT ROUTE
// ==========================
router.get("/", function(req, res){
    res.render("landing");
});

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = router;