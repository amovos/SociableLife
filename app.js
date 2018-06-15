// ==========================
// REQUIRE NPM PACKAGES
// ==========================
var flash           = require("connect-flash"),
    crypto          = require("crypto"), //comes with node so doesn't need to be installed
    express         = require("express"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    bodyParser      = require("body-parser"),
    LocalStrategy   = require("passport-local"),
    session         = require("express-session"),
    MongoStore      = require('connect-mongo')(session),
    methodOverride  = require("method-override");

// ==========================
//GENERIC APP CONFIG
// ==========================
var app = express();

// Run URL redirect function
var urlRedirects = require("./app_config/url_redirect");
urlRedirects(app);

// Configure app settings
app.use(flash());
app.set("view engine", "ejs"); // don't need to add .ejs to the end of all those files when routing
app.use(methodOverride("_method")); // method override needed for HTML forms that can't do PUT so have to be POST, then overrided to PUT once submitted with this override added to the URL
app.use(express.static(__dirname + "/public")); //Configure Public Directory - use __dirname to be as explicit as possible

// Configure bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Configure time tracking
app.locals.moment = require('moment'); 

// Run scheduled scripts
var scheduledFunctions = require("./scheduledFunctions");
scheduledFunctions();


// ==========================
// DB CONFIG
// ==========================
var url = process.env.DATABASEURL || "mongodb://localhost/sl_db"; //creates a backup so that if the environment variable isn't set up it has a backup
mongoose.connect(url);
mongoose.Promise = Promise;
if (process.env.ENV_ID === "dev"){
    mongoose.set('debug', true);
}


// ==========================
// REQUIRE DB MODELS
// ==========================
var User = require("./models/user"); //only used for passport to serialize the users

    
// ==========================
// PASSPORT CONFIG
// ==========================
app.use(session({   secret: process.env.COOKIE_SECRET,
                    resave: true,
                    saveUninitialized: true,
                    store: new MongoStore({ mongooseConnection: mongoose.connection }) //stores cookie in database so sessions are persistent between server restarts
}));

app.use(passport.initialize()); 
app.use(passport.session());

//These methods that we're passing in come from passport-local-mongoose in the users.js file
passport.use(new LocalStrategy(User.authenticate())); 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// ==========================
// SEED DATABASE
// ==========================
// ONLY IN DEV ENVIRONMENT
var middleware = require("./middleware");
// if (process.env.ENV_ID === "dev"){
    app.get('/seed', middleware.isAdmin, function(req, res){
        var seedDB = require("./seeds");
        seedDB(); //Run the seedDB file
        res.redirect("/activities");
    });
// }


// ==========================
// CUSTOM MIDDLEWARE
// ==========================
//This will run every time any route is accessed and will pass the user to it, making it available in the ejs templates

//This particular middleware adds the user info to each request (will be undefined if the user isn't authenticated)
//This means that in any ejs template we can access user data using: currentUser.
app.use(function(req, res, next){ 
    res.locals.currentUser = req.user;
    res.locals.errorMessage = req.flash("errorMessage"); //This variable is avaialble in the header partial, and if it exists it contains the message
    res.locals.successMessage = req.flash("successMessage"); //This variable is avaialble in the header partial, and if it exists it contains the message
    next();
});

// ==========================
// ROUTES
// ==========================
var indexRoutes     = require("./routes/index"),
    userRoutes      = require("./routes/user"),
    commentRoutes   = require("./routes/comments"),
    activityRoutes  = require("./routes/activities"),
    adminRoutes  = require("./routes/admin"),
    apiRoutes  = require("./routes/apis");

//once the route files have been required they need to actually be used in the app, using the Express Router
//the URLs can be shortened here by adding the first common part here e.g. /activities.
app.use("/", indexRoutes);
app.use("/", userRoutes);
app.use("/activities", activityRoutes);
app.use("/activities/:id/comments", commentRoutes);
app.use("/admin", adminRoutes);
app.use("/api", apiRoutes);

//CatchAll Route
app.get('/*', function(req,res){
    //req.flash("errorMessage", "Sorry, we couldn't find the page you were looking for");
    res.redirect("/activities");
});


// ==========================
// ERROR HANDLING
// ==========================
app.use(function (err, req, res, next) {
    // Error code from multer caused by exceeding file size limit
    if (err.code === 'LIMIT_FILE_SIZE') {
        req.flash("errorMessage", "Sorry, that file is too big (5MB limit)");
        return res.redirect("back");
    }
});


// ==========================
// START SERVER
// ==========================
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Sociable Life Server is listening...");
});