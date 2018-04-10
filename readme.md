RESTFUL ROUTES

name        url                 verb            desc
==================================================================
INDEX       /campgrounds        GET         Displays pictures of campgrounds
NEW         /campgrounds/new    GET         Displays a form to create a new campground
CREATE      /campgrounds        POST        Adds new campground to db then redirects
SHOW        /campgrounds/:id    GET         Shows information about campground




NEW         /campgrounds/:id/comments/new    GET         Displays a form to create a new campground
CREATE      /campgrounds/:id/comments        POST        Adds new campground to db then redirects


















// Campground.create(
//     {
//         name: "Bass Creek",
//         image: "https://pixabay.com/get/eb37b9082df3003ed1584d05fb1d4e97e07ee3d21cac104497f2c37fa3e9b0ba_340.jpg",
//         description: "This is a nice place to fish."
//     }, function(err, campground) {
//             if(err) {
//             console.log("Error!");
//             console.log(err);
//         } else {
//             console.log("Campground added!");
//         }
//     });





// var campgrounds = [
//         {name: "Salmon Creek", image: "https://farm3.staticflickr.com/2473/3730341267_5767826611.jpg"},
//         {name: "Bass Creek", image: "https://pixabay.com/get/eb37b9082df3003ed1584d05fb1d4e97e07ee3d21cac104497f2c37fa3e9b0ba_340.jpg"},
//         {name: "Granite Hill", image: "https://pixabay.com/get/eb37b9082df3003ed1584d05fb1d4e97e07ee3d21cac104497f2c37fa3e9b0ba_340.jpg"},
//         {name: "Salmon Creek", image: "https://farm3.staticflickr.com/2473/3730341267_5767826611.jpg"},
//         {name: "Bass Creek", image: "https://pixabay.com/get/eb37b9082df3003ed1584d05fb1d4e97e07ee3d21cac104497f2c37fa3e9b0ba_340.jpg"},
//         {name: "Granite Hill", image: "https://pixabay.com/get/eb37b9082df3003ed1584d05fb1d4e97e07ee3d21cac104497f2c37fa3e9b0ba_340.jpg"}        
//     ];



