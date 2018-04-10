require('dotenv').config();

var express             = require("express"),
    app                 = express(),
    request             = require("request"),
    bodyParser          = require("body-parser"),
    mongoose            = require("mongoose"),
    flash               = require("connect-flash"),
    passport            = require("passport"),
    LocalStrategy       = require("passport-local"),
    methodOverride      = require("method-override"),
    Campground          = require("./models/campground"),
    Comment             = require("./models/comment"),
    User                = require("./models/user"),
    seedDB              = require("./seeds");
    
    
//requiring routes    
var commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes         = require("./routes/index");

//mongoose.connect("mongodb://localhost/yelp_camp");
mongoose.connect("mongodb://hearts:password@ds241059.mlab.com:41059/yelp_camp");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname +"/public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());

app.locals.moment = require('moment');

// seedDB();



// PASSPORT CONFIG
// ===================================
app.use(require("express-session")({
   secret: "Riley is the best dog",
   resave: false,
   saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//adds user to all templates
app.use(function(req,res,next) {
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   res.locals.noMatch = req.flash("noMatch");
   next();
});



//use route files
app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Listening");
});