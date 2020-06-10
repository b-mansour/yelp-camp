var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");
 


//AUTHENTICATION ROUTES

 router.get("/register", function(req, res){
	res.render("register");
});

//sign up logic 

 router.post("/register", function(req, res){
 var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user){
	  if(err){
		  console.log(err);
		  req.flash("error", err.message);
  		  return res.render("register");
	  }
	 passport.authenticate("local")(req, res, function(){
		 req.flash("success", "welcome" + user.username);
		 res.redirect("/campgrounds")
	 });
  });
});

//show login form

 router.get("/login", function(req, res){
	res.render("login");
});

 router.post("/login", passport.authenticate("local", 

{
    successRedirect: "/campgrounds",
    failureRedirect: "/campgrounds"
    }),  function(req, res){
 });

//logout route

 router.get("/logout" , function(req, res){
	req.logout();
    req.flash("success", "logged you out");
	res.redirect("/")
});


//middleware

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		
		return next();
	}
	
	res.redirect("/login");
}




module.exports = router;

