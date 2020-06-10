var express = require("express");
var router = express.Router();
var campground = require("../models/campgrounds");
var comment  =  require("../models/comments");
var middleware = require("../middleware"); // index is special name and we don't have to include it 


//==================
//COMMENTS ROUTES
//==================

// new comment form 
 router.get("/campgrounds/:id/comment/new", middleware.isLoggedIn, function(req, res){
	
	campground.findById(req.params.id , function(err, foundCampground){
		if(err){
			console.log(err)
		} else {
			   res.render("comments/new", {foundCampground: foundCampground});

		}
	})
    
 });

// create comments
 router.post("/campgrounds/:id/comment", middleware.isLoggedIn, function(req, res){
	   
	campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log(err)
		} else {
			
			comment.create(req.body.comment, function(err, Comment){
				if(err){
					res.redirect("/campgrounds");
				} else {
					
					Comment.author.id = req.user._id;
					Comment.author.username = req.user.username;
					Comment.save();
					
					 
					foundCampground.comments.push(Comment);
					foundCampground.save();
					req.flash("success", "you have added comment successfully");
					res.redirect("/campgrounds/" + foundCampground._id);
					
				}
			});
		}
	});
});


//COMMENTS EDIT ROUTE
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	comment.findById(req.params.comment_id,  function(err, foundComment){
		if(err){
			res.redirect("back");
		} else {
			
				res.render("comments/edit", { campground_id: req.params.id, foundComment:foundComment});
		}
	})
 });

//COMMENT UPDATE
router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
	comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back");
 		} else {
		  res.redirect("/campgrounds/" + req.params.id);
		}
		
	});
});

//COMMENT DESTROY 
router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res ){
	 comment.findByIdAndRemove(req.params.comment_id, req.body.comment, function(err, foundComment){
		 if(err){
			 res.redirect("back")
		 } else {
			 req.flash("success", "comment deleted")
			 res.redirect("/campgrounds/" + req.params.id);
		 }
	 })
})

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
function checkCommentOwnership(req, res, next){
	
	
		if(req.isAuthenticated()){
		
		comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			  res.redirect("/back");
 		} else {
			   
			if(foundComment.author.id.equals(req.user._id)){
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
