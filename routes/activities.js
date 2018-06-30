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
router.get("/new", require("./activities/new"));

// NEW ACTIVITY POST ROUTE - route to allow "edit info" button to work during creation to repopulate fields
router.post("/new", require("./activities/newPostReturn"));

// NEW ACTIVITY REVIEW POST ROUTE (AJAX CHECKS)
router.post("/newReview", require("./activities/createReview"));

// NEW ACTIVITY REVIEW POPULATE POST ROUTE (POST CHECKED DATA TO REVIEW PAGE)
router.post("/newReviewPopulate", require("./activities/newReview"));

// NEW ACTIVITY CHECK ROUTE
router.get("/newCheck", require("./activities/newCheck"));

// NEW ACTIVITY AUTHOR ROUTE
router.get("/newAuthor", require("./activities/newAuthor"));

// CREATE ACTIVITY ROUTE - Route to add submitted activity to DB
router.post("/", upload.single('image'), require("./activities/create"));

// SHOW ACTIVITY ROUTE - shows more info about one activity
router.get("/:id", require("./activities/show"));

// EDIT ACTIVITY ROUTE
router.get("/:id/edit", middleware.checkActivityOwnership, require("./activities/edit"));

// UPDATE ACTIVITY ROUTE
router.put("/:id", middleware.checkActivityOwnership, upload.single('image'), require("./activities/update"));

// EDIT ACTIVITY IMAGE ROUTE
router.get("/:id/editImage", middleware.checkActivityOwnership, require("./activities/editImage"));

// UPDATE ACTIVITY IMAGE ROUTE
router.put("/:id/updateImage", middleware.checkActivityOwnership, upload.single('image'), require("./activities/updateImage"));

// UPDATE ACTIVITY STATUS ROUTE
router.post("/updateStatus", middleware.isAdminOrMod, require("./activities/updateStatus"));

// DESTROY ACTIVITY ROUTE
router.delete("/:id", middleware.checkActivityOwnership, require("./activities/destroy"));

// ==========================
// OTHER ROUTES
// ==========================
// LOVE ROUTE
router.get("/:activityId/:id/love", middleware.userProfileOwnership, require("./activities/love"));

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = router;