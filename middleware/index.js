var Campground      = require("../models/campground"),
    Comment         = require("../models/comment"),
    middlewareObj   = {};


middlewareObj.isLoggedIn = function isLoggedIn(req, res, next) {
   if (req.isAuthenticated()) {
       return next();
   } 
   req.flash("error", "You need to be logged in to do that!");
   res.redirect("/login");
};

middlewareObj.isCampgroundOwner = function isCampgroundOwner(req,res,next) {
   
    //find campground
    Campground.findById(req.params.id, function(err, campground) {
       if (err || !campground) {
           req.flash("error", "Campground Not Found!");
           res.redirect("back");
       } else if ((campground.author.id.equals(req.user._id)) || req.user.isAdmin) {
           // compare campground author with logged in
           //if same, allow
             return next();
            //if not, then redirect
           } else {
               req.flash("error", "You don't have permission to do that!");
               res.redirect("back");
           }
       
    });
};

middlewareObj.isCommentOwner = function isCommentOwner(req,res,next) {
   
    //find campground
    Comment.findById(req.params.comment_id, function(err, comment) {
       if (err || !comment) {
           console.log(err);
           req.flash("error", "Comment not found!");
           res.redirect("back");
       } else if ((comment.author.id.equals(req.user._id)) || req.user.isAdmin) {
            // compare campground author with logged in
            //if same, allow
             return next();
            
            //if not, then redirect
        } else {
               req.flash("error", "You don't have permission to do that!");
               res.redirect("back");
        }
       
    });
    
};

function isAdmin(req, res, next) {
    
}


module.exports = middlewareObj;