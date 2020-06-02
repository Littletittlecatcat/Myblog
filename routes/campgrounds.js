const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const middleware = require("../middleware")


//Index Route -- Show all Campgrounds

router.get('/', function (req, res) {
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds/index', {
                campgrounds: allCampgrounds,
                currentUser: req.user //passport创造user之后，会放到req.user。这边可以console.log（）出来
            })
        }
    });
});




//Create Route -- Add Campgrounds to DB
router.post('/', middleware.isLoggedIn, function (req, res) {
    //get data from form and add to array
    var name = req.body.name
    var price = req.body.price
    var image = req.body.image
    var desc = req.body.description
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {
        price: price,
        name: name,
        image: image,
        description: desc,
        author: author
    }
    //campgrounds.push(newCampground) 原本的campgrounds array 移到DB所以不用了，这还就做改动
    Campground.create(newCampground, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            //redirect back to campground page
            res.redirect('/campgrounds');
        }
    });
});


//New -- Show Form to Create New Campground

router.get('/new', middleware.isLoggedIn, function (req, res) {
    res.render('campgrounds/new');
})

//下面這行一定要在/new之後，不然:id會把/new當成其中一個id
//Show -- Show more info about one campground
router.get('/:id', function (req, res) {
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(
        function (err, foundCampground) {
            if (err || !foundCampground) {
                req.flash("errer", "Campground not found");
                res.redirect("back")
            } else {
                console.log(foundCampground);
                //這邊印出來的foundcampground就是帶有commentID的campground object
                //render show template with that campground
                //後面的findCampground把req.param.id找到的value，用前面的campground pass in show template
                res.render('campgrounds/show', {
                    campground: foundCampground
                });
            }
        });
});

//Edit Campground Route
router.get("/:id/edit", middleware.checkOwnership, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        res.render("campgrounds/edit", {
            campground: foundCampground
        });
    })
});

//otherwise, redirect
//if not, redirect


//Update Campground Route

router.put("/:id", middleware.checkOwnership, function (req, res) {
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
        if (err) {
            res.redirect("/campground")
        } else {
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
    //redirect somewhere
})

//Destory Campground Route
/* router.delete("/:id", isLoggedIn, function (req, res) {
    Campground.findByIdAndDelete(req.params.id, function (err) {
        if (err) {
            res.redirect("/campgrounds")
        } else {
            res.redirect("/campgrounds")
        }
    })
}) */
//下面這段同時把comments和campgrounds同時刪掉
router.delete("/:id", middleware.checkOwnership, async (req, res) => {
    try {
        let foundCampground = await Campground.findById(req.params.id);
        await foundCampground.remove();
        req.flash("success", "Campground Deleted")
        res.redirect("/campgrounds");
    } catch (error) {
        console.log(error.message);
        res.redirect("/campgrounds");
    }
});


module.exports = router;