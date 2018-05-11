// ==========================
// USER ROUTES
// ==========================

var express = require("express");
var router = express.Router();
var upload = require("../middleware/multer");

// ==========================
// ROUTES
// ==========================
// From app.js: app.use("/", userRoutes);


// ==========================
// USER CREATION & LOGIN/OUT
// ==========================
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


// ==========================
// USER PROFILE
// ==========================
// USER PROFILE
router.get("/users/:id", require("./user/userProfile"));


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