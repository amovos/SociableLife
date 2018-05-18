// ==========================
// INDEX ROUTES
// ==========================

var express = require("express");
var router = express.Router();

// ==========================
// ROOT ROUTE
// ==========================
router.get("/", function(req, res){
    res.render("general/home", {page: 'home'});
});

// ==========================
// ABOUT US ROUTE
// ==========================
router.get("/aboutus", function(req, res){
    res.render("general/aboutUs", {page: 'aboutUs'});
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