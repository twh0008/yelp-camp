var express             = require("express");
    
var Campground          = require("../models/campground"),
    Comment             = require("../models/comment"),
    middleware          = require("../middleware");


var router = express.Router({mergeParams: true});
// Comments new
router.get("/new",middleware.isLoggedIn, function(req, res) {
    //find Campground by id
    Campground.findById(req.params.id, function(err, campground) {
       if (err) {
           console.log(err);
           req.flash("error", err.message);
       } else {
            res.render("comments/new", {campground: campground}); 
       }
    });
});


//Comments CREATE
router.post("/",middleware.isLoggedIn, function(req, res) {
    //Adds new comment to database
    //lookup Camground using id
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            res.redirect("back");
        } else {
               //create new Comment
               Comment.create(req.body.comment, function(err, comment) {
                   if (err) {
                       console.log(err);
                   } else {
                       //add username/id to comment
                       comment.author.id = req.user._id;
                       comment.author.username = req.user.username;
                       
                       //save comment
                       comment.save();
                       
                       //attach comment to campground
                       campground.comments.push(comment);
                       campground.save();
                       req.flash("success", "Comment Added!");
                       res.redirect("/campgrounds/" + campground._id);
                   }
                   
               });
               
                }
    });
 
});
// COMMENT EDIT
router.get("/:comment_id/edit", middleware.isLoggedIn, middleware.isCommentOwner, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, comment) {
       if (err || !comment) {
           console.log(err);
           req.flash("error", err.message);
           res.redirect("back");
       }
       res.render("comments/edit", {campground_id: req.params.id, comment: comment});
    });
});

//COMMENT UPDATE

router.put("/:comment_id", middleware.isLoggedIn, middleware.isCommentOwner, function(req,res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment) {
       if (err) {
           console.log(err);
           req.flash("error", err.message);
       } 
       req.flash("success", "Successfully Updated!");
       res.redirect("/campgrounds/" + req.params.id);
    });
});

router.delete("/:comment_id", middleware.isLoggedIn, middleware.isCommentOwner, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
       if (err) {
           console.log(err);
           req.flash("error", err.message);
           res.redirect("back");
       } 
       req.flash("success", "Successfully Deleted!");
       res.redirect("back");
    });

    });




module.exports = router;