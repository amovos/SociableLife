// ==========================
// UPDATE REQUESTS ROUTES
// ==========================

var express = require("express");
var router = express.Router({mergeParams: true}); //{mergeParams: true} means that even though :id isn't in the path in this file it still gets passed through so it can be used.
var middleware = require("../middleware"); //don't need to specify index.js, it's a special name when you require a directory

// ==========================
// RESTFUL ROUTES
// ==========================
// From app.js: app.use("/activities/:id/updateRequests", updateRequestRoutes);

// INDEX UPDATE REQUESTS ROUTE
// No show all update request page

// NEW UPDATE REQUESTS ROUTE
// No new update request page

// CREATE UPDATE REQUESTS ROUTE
router.post("/", require("./updateRequests/create"));

// SHOW UPDATE REQUESTS ROUTE
// No show update request page

// EDIT UPDATE REQUESTS ROUTE
// No edit update request page

// UPDATE UPDATE REQUESTS ROUTE
router.post("/:updateRequest_id", middleware.isAdminOrMod, require("./updateRequests/update"));

// DESTROY UPDATE REQUESTS ROUTE
router.delete("/:updateRequest_id", middleware.isAdmin, require("./updateRequests/destroy"));


// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = router;