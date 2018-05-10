// ==========================
// ACTIVITY ROUTES
// ==========================

var express = require("express");
var router = express.Router();
var middleware = require("../middleware"); //don't need to specify index.js, it's a special name when you require a directory

// ==========================
// RESTFUL ROUTES
// ==========================

// INDEX ACTIVITY ROUTE - Display info on ALL activities
var indexRoute = require("./activities/index");
router.get('/', indexRoute);

// NEW ACTIVITY ROUTE - Page to add new activity
var newRoute = require("./activities/new");
router.get("/new", middleware.isLoggedIn, newRoute);

// CREATE ACTIVITY ROUTE - Route to add submitted activity to DB
var createRoute = require("./activities/create");
router.post("/", middleware.isLoggedIn, createRoute);

// SHOW ACTIVITY ROUTE - shows more info about one activity
var showRoute = require("./activities/show");
router.get("/:id", showRoute);

// EDIT ACTIVITY ROUTE
var editRoute = require("./activities/edit");
router.get("/:id/edit", middleware.checkActivityOwnership, editRoute);

// UPDATE ACTIVITY ROUTE
var updateRoute = require("./activities/update");
router.put("/:id", middleware.checkActivityOwnership, updateRoute);

// DESTROY ACTIVITY ROUTE
var destroyRoute = require("./activities/destroy");
router.delete("/:id", middleware.checkActivityOwnership, destroyRoute);


// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = router;