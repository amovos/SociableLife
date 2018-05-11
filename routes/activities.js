// ==========================
// ACTIVITY ROUTES
// ==========================

var express = require("express");
var router = express.Router();
var middleware = require("../middleware"); //don't need to specify index.js, it's a special name when you require a directory
var upload = require("../middleware/multer");

// ==========================
// RESTFUL ROUTES
// ==========================
// From app.js: app.use("/activities", activityRoutes);

// INDEX ACTIVITY ROUTE - Display info on ALL activities
router.get('/', require("./activities/index"));

// NEW ACTIVITY ROUTE - Page to add new activity
router.get("/new", middleware.isLoggedIn, require("./activities/new"));

// CREATE ACTIVITY ROUTE - Route to add submitted activity to DB
router.post("/", middleware.isLoggedIn, upload.single('image'), require("./activities/create"));

// SHOW ACTIVITY ROUTE - shows more info about one activity
router.get("/:id", require("./activities/show"));

// EDIT ACTIVITY ROUTE
router.get("/:id/edit", middleware.checkActivityOwnership, require("./activities/edit"));

// UPDATE ACTIVITY ROUTE
router.put("/:id", middleware.checkActivityOwnership, upload.single('image'), require("./activities/update"));

// DESTROY ACTIVITY ROUTE
router.delete("/:id", middleware.checkActivityOwnership, require("./activities/destroy"));


// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = router;