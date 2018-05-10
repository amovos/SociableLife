// ==========================
// COMMENTS ROUTES
// ==========================

var express = require("express");
var router = express.Router({mergeParams: true}); //{mergeParams: true} means that even though :id isn't in the path in this file it still gets passed through so it can be used.
var middleware = require("../middleware"); //don't need to specify index.js, it's a special name when you require a directory

// ==========================
// RESTFUL ROUTES
// ==========================
// From app.js: app.use("/activities/:id/comments", commentRoutes);

// INDEX COMMENT ROUTE
// No show all comments page


// NEW COMMENT ROUTE
router.get("/new", middleware.isLoggedIn, require("./comments/new"));

// CREATE COMMENT ROUTE
router.post("/", middleware.isLoggedIn, require("./comments/create"));

// SHOW COMMENT ROUTE
// No show single comment page


// EDIT COMMENT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, require("./comments/edit"));

// UPDATE COMMENT ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, require("./comments/update"));

// DESTROY COMMENT ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, require("./comments/destroy"));


// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = router;