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
// CREATE CONTACT ROUTE
router.post("/contact", require("./contact/create"));



// ==========================
// PRIVACY POLICY ROUTE
// ==========================
router.get("/privacy", function(req, res){
    res.render("general/privacy", {page: 'privacy'});
});

// ==========================
// TERMS AND CONDITIONS ROUTE
// ==========================
router.get("/terms", function(req, res){
    res.render("general/terms", {page: 'terms'});
});

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = router;