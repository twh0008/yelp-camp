var express             = require("express");
    
var Campground          = require("../models/campground"),
    Comment             = require("../models/comment"),
    middleware          = require("../middleware");
    
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

var router = express.Router();


//INDEX - show all campgrounds
router.get("/", function(req,res){
    var perPage = 8;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
    
    
    if(req.query.search) {
       
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
 
        Campground.find({name: regex}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function(err,foundCampground) {
            
             if (err || !foundCampground) {
              console.log(err);
              req.flash("error", err);
            }
                Campground.count({name: regex}).exec(function (err, count) {
                    if (err) {
                        console.log(err);
                    } else {
                    if (foundCampground.length < 1 && count === 0) {
                        req.flash("noMatch", "Campground not found!");
                        return res.redirect("back");
                    }
                    
                        res.render("campgrounds/index", {
                            campgrounds: foundCampground,
                            currentUser: req.user,
                            page: 'campgrounds',
                            current: pageNumber,
                            pages: Math.ceil(count / perPage),
                            search: req.query.search
                        }); 
                    }
                });

            
        });
    } else {
    // Get all campgrounds
    Campground.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function(err,allCampgrounds){
        if (err || !allCampgrounds) {
            console.log(err);
        } 
        Campground.count().exec(function (err, count) {
            if(err) {
                console.log(err);
        } else {
            res.render("campgrounds/index", 
            {
                campgrounds: allCampgrounds, 
                currentUser: req.user, 
                page: 'campgrounds',
                current: pageNumber,
                pages: Math.ceil(count / perPage),
                search: false
                
            }); 
        }
        });
    });
    }
});

//CREATE - add new campground to db
router.post("/", middleware.isLoggedIn, function(req,res){
   var name = req.body.name;
   var image = req.body.image;
   var price = req.body.price;
   var description = req.body.description;
   var author = {
       id: req.user._id,
       username: req.user.username
       };
    if(!image.length) {
        req.flash("error", "Please enter a link to an image.");
        return res.redirect('back');
    }
    if(!name.length) {
        req.flash("error", "Please enter a name.");
        return res.redirect('back');
    }
    if(!price.length) {
        req.flash("error", "Please enter a price.");
        return res.redirect('back');
    }
    if(!description.length) {
        req.flash("error", "Please enter a description");
        return res.redirect('back');
    }
       
    //GOOGLE MAP GEOCODE
       geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    
    var newCampground = {name: name, image: image, price: price, description: description, author: author, location: location, lat: lat, lng: lng};
    
    //Create new campground, and save to db
    
    Campground.create(newCampground, function(err, newCampground) {
        if(err) {
            console.log(err);
            req.flash("error", err.message);
        } else {
            // newCampground.author = req.user;
            // newCampground.save();
            //redirect to campgrounds
            req.flash("success", "Successfully Created!");
            res.redirect("/campgrounds");
        }
   });
 });
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
   res.render("campgrounds/new");
});

//SHOW - shows more info about a campground
router.get("/:id", function(req, res) {
    //find the campground with the id
    // var id = req.params.id;
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground) {
        if (err || !foundCampground) {
            console.log(err);
            req.flash("error", err);
        } else {
            //render the showpage
            console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground});
   
        }
    });
 
});

//  EDIT CAMPGROUND ROUTE

router.get("/:id/edit",middleware.isLoggedIn, middleware.isCampgroundOwner, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err || !campground) {
            console.log(err);
            req.flash("error", err.message);
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/edit", {campground: campground});
        }
    });
});


// UPDATE CAMPGROUND ROUTE
router.put("/:id",middleware.isLoggedIn, middleware.isCampgroundOwner, function(req, res) {
    //GOOGLE MAP GEOCODE
    geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
        req.flash('error', 'Invalid address');
        return res.redirect('back');
    }
    req.body.campground.lat = data[0].latitude;
    req.body.campground.lng = data[0].longitude;
    req.body.campground.location = data[0].formattedAddress;
    if(!req.body.campground.image.length) {
        req.flash("error", "Please enter a link to an image.");
        return res.redirect('back');
    }
    if(!req.body.campground.name.length) {
        req.flash("error", "Please enter a name.");
        return res.redirect('back');
    }
    if(!req.body.campground.price.length) {
        req.flash("error", "Please enter a price.");
        return res.redirect('back');
    }
    if(!req.body.campground.description.length) {
        req.flash("error", "Please enter a description");
        return res.redirect('back');
    }
    
    Campground.findByIdAndUpdate(req.params.id,req.body.campground, function(err, campground) {
        console.log(req.body.campground)
        if (err || !campground.length) {
            console.log(err);
            req.flash("error", err.message);
             res.redirect("/campgrounds");
        }
        else {
            req.flash("success", "Successfully Updated!");
            res.redirect("/campgrounds/" + req.params.id);
        }
        
    });   
  });
});

// DESTROY
router.delete("/:id",middleware.isLoggedIn, middleware.isCampgroundOwner, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Successfully Deleted!");
            res.redirect("/campgrounds");
        }
        
        
    });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}*+?.,\\^$#\s]/g, "\\$&");
}

module.exports = router;