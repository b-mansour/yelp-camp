var express = require("express");
var router = express.Router();
var campground = require("../models/campgrounds");
var middleware = require("../middleware"); // index is special name and we don't have to include it 




router.get("/", function(req, res){
	res.render("landing", {messeg: req.flash("error")});
});

//INDEX-ROUTE :Displays all  campgrounds.

 router.get("/campgrounds", function(req, res){
	 console.log(req.user);
	 campground.find({}, function(err, allcampgrounds){
		 if(err){
			 console.log("SOMETHING WENT WRONG");
			 console.log(err)
		 }
		 else {
 			   res.render("campgrounds/index", {campgrounds: allcampgrounds});
		 }
		 


	 })
  });

//CREATE-ROUTE: Add new campground to DB

router.post("/campgrounds", middleware.isLoggedIn, function(req, res){
	var name = req.body.name;
	var image = req.body.img;
	var description = req.body.description;
	
	var author = {
		id: req.user._id,
		username: req.user.username
	};

	
	var newCampground = {name: name, image: image, description: description, author:author}
 campground.create(newCampground , function(err, newlyCreated){
	 
	 if(err){
		 console.log(err)
	 } else {
		 
 		res.redirect("/campgrounds")
		 console.log(newlyCreated);

 	 }
 });	
 });

//NEW-ROUTE: show form to create new campground.

router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res){
		res.render("campgrounds/new");
		});

//SHOW - shows more info about one campground

router.get("/campgrounds/:id", function(req, res){
	campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		
		if(err){
			res.send("ERROR");
		} else {
			console.log(foundCampground);
            res.render("campgrounds/show", {foundCampground: foundCampground});
           
		}
  });
});

//EDIT CAMPGROUND ROUTE
router.get("/campgrounds/:id/edit",middleware.checkCampgroundOwnership, function(req, res){
 		
	campground.findById(req.params.id, function(err, foundCampground){
		 if(err){
			 res.redirect("/campgrounds");
		 } else {
			 
			 res.render("campgrounds/edit", {foundCampground: foundCampground});
           }
		 
 	    });
    });

//UPDATE CAMPGROUND ROUTE 
router.put("/campgrounds/:id",middleware.checkCampgroundOwnership, function(req, res){
	campground.findByIdAndUpdate(req.params.id, req.body.data,  function(err, foundCampground){
		if(err){
			res.redirect("/campgrounds")
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//DESTROY CAMPGROUND ROUTE 

router.delete("/campgrounds/:id",middleware.checkCampgroundOwnership, function(req, res){
  campground.findByIdAndRemove(req.params.id, function(err, foundCampground){
	  if(err){
		  res.redirect("/campgrounds/" + req.params.id);
	  } else {
		  res.redirect("/campgrounds")
 	  }
  }); 
});
 

/*
// middleware
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		
		return next();
	}
	
	res.redirect("/login");
}
*/

/*
//middleware
function checkCampgroundOwnership(req, res, next){
	
	
		if(req.isAuthenticated()){
		
		campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			  res.redirect("/back");
 		} else {
			   
			if(foundCampground.author.id.equals(req.user._id)){
				      next();              // res.render("campgrounds/edit", {foundCampground: foundCampground});
	           } else {
 				  res.redirect("back"); 	                       //res.send(" YOU DO NOT HAVE PERMISSION TO DO THAT");
			   }
 		    }
	    });
	
		
	} else {
       res.redirect("back");
	}
	
	
}
*/

 



module.exports = router;