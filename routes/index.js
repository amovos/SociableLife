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
// CONTACT PAGE ROUTES
// ==========================

// NEW CONTACT ROUTE - Display info on ALL activities
router.get('/contact', require("./contact/new"));

// CREATE COMMENT ROUTE
router.post("/contact", require("./contact/create"));



// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = router;