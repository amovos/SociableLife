// ==========================
// COMMENTS ROUTES
// ==========================

var express = require("express");
var router = express.Router({mergeParams: true}); //{mergeParams: true} means that even though :id isn't in the path in this file it still gets passed through so it can be used.
var middleware = require("../middleware"); //don't need to specify index.js, it's a special name when you require a directory

// ==========================
// RESTFUL ROUTES
// ==========================

// INDEX COMMENT ROUTE
// No show all comments page


// NEW COMMENT ROUTE
var newRoute = require("./comments/new");
router.get("/new", middleware.isLoggedIn, newRoute);

// CREATE COMMENT ROUTE
var createRoute = require("./comments/create");
router.post("/", middleware.isLoggedIn, createRoute);

// SHOW COMMENT ROUTE
// No show single comment page


// EDIT COMMENT ROUTE
var editRoute = require("./comments/edit");
router.get("/:comment_id/edit", middleware.checkCommentOwnership, editRoute);

// UPDATE COMMENT ROUTE
var updateRoute = require("./comments/update");
router.put("/:comment_id", middleware.checkCommentOwnership, updateRoute);

// DESTROY COMMENT ROUTE
var destroyRoute = require("./comments/destroy");
router.delete("/:comment_id", middleware.checkCommentOwnership, destroyRoute);


// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = router;