// ==========================
// USER ROUTES
// ==========================

var express = require("express");
var router = express.Router();
var middleware = require("../middleware"); //don't need to specify index.js, it's a special name when you require a directory
var upload = require("../middleware/multer");

// ==========================
// ROUTES
// ==========================
// From app.js: app.use("/", userRoutes);


// ==========================
// USER INVITE, CREATION & LOGIN/OUT
// ==========================
// INVITE CODE NEW
router.get("/invitecode", require("./user/inviteCode"));

// USER NEW
router.get("/register", require("./user/userNew"));

// USER CREATE
router.post("/register", upload.single('image'), require("./user/userCreate"));

// LOGIN NEW
router.get("/login", require("./user/loginNew"));

// LOGIN CREATE
router.post("/login", require("./user/loginCreate"));

// LOGOUT
router.get("/logout", require("./user/logout"));


// ==============================
// USER PROFILE, EDIT AND UPDATE
// ==============================
// USER PROFILE
router.get("/users/:id", middleware.isLoggedIn, require("./user/userProfile"));

// EDIT PROFILE
router.get("/users/:id/edit", middleware.userProfileOwnership, require("./user/userEdit"));

// UPDATE PROFILE
router.put("/users/:id", middleware.userProfileOwnership, require("./user/userUpdate"));

// EDIT AVATAR
router.get("/users/:id/avatar", middleware.userProfileOwnership, require("./user/userAvatarEdit"));

// UPDATE AVATAR
router.put("/users/:id/avatar", middleware.userProfileOwnership, upload.single('image'), require("./user/userAvatarUpdate"));


// =============
// USER DESTROY
// =============
// DESTROY USER SHOW
router.get("/users/:id/delete", middleware.userProfileOwnership, require("./user/userDestroyShow"));


// ==========================
// USER PASSWORD RESET
// ==========================
// FORGOT PASSWORD - SHOW
router.get("/forgot", require("./user/forgotPwdShow"));

// FORGOT PASSWORD - POST
router.post("/forgot", require("./user/forgotPwdPost"));

// RESET PASSWORD - SHOW
router.get("/reset/:token", require("./user/resetPwdShow"));

// RESET PASSWORD - POST
router.post("/reset/:token", require("./user/resetPwdPost"));


// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = router;