var express = require("express");
var app = express(); 
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var localStrategy = require("passport-local");
var methodOverride = require("method-override");
var campground = require("./models/campgrounds");
var comment = require("./models/comments");
var User = require("./models/user");
var seedDB  = require("./seed");
var flash = require("connect-flash");

var campgroundRoutes = require("./routes/campgrounds");
var  commentRoutes =  require("./routes/comments");
var authRoutes = require("./routes/auth");



mongoose.connect("mongodb://localhost:27017/yelp_camp_v6", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();  // seed the database


//PASSPORT CONFIGURATION
app.use(require("express-session")({
		secret:"web devolopment is amazing", 
	    resave:false,
	    saveUninitialized:false
		}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");

	next();
})

app.use(campgroundRoutes);
app.use(commentRoutes);
app.use(authRoutes);
 

 
 

 
	
 app.listen(3000, function(){
	console.log("the yelpCAmp has server started listening successfully");
})

