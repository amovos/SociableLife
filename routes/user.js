// ==========================
// USER ROUTES
// ==========================

var express = require("express");
var router = express.Router();

// ==========================
// RESTFUL ROUTES
// ==========================

// USER NEW
var newUserRoute = require("./user/userNew");
router.get("/register", newUserRoute);

// USER CREATE
var createUserRoute = require("./user/userCreate");
router.post("/register", createUserRoute);

// LOGIN NEW
var newLoginRoute = require("./user/loginNew");
router.get("/login", newLoginRoute);

// LOGIN CREATE
var createLoginRoute = require("./user/loginCreate");
router.post("/login", createLoginRoute);

// LOGOUT
var logoutRoute = require("./user/logout");
router.get("/logout", logoutRoute);

// USER PROFILE
var userProfileRoute = require("./user/userProfile");
router.get("/users/:id", userProfileRoute);


// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = router;