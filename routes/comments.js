const express = require("express");
const router = express.Router({
    mergeParams: true
});
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");




//Comment New
router.get("/new", middleware.isLoggedIn, function (req, res) {
    //Find Campground by ID
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {
                campground: campground
            });
        }
    });
});


//Comment Create
//这边加isLoggedIn是为了防止有人用postman的post requestion加上comment
router.post("/", middleware.isLoggedIn, function (req, res) {
    //Look up Campground using ID
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err)
        } else {
            //Create new comment
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err)
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save()
                    //connect new campground to comment
                    campground.comments.push(comment);
                    campground.save();
                    //redirect to campground show page
                    res.redirect("/campgrounds/" + campground._id)
                }
            })
        }
    })
});



//Comment Edit Route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function (req, res) {
    Campground.findById(req.params.id, function (err, foundcampground) {
        if (err || !foundcampground) {
            req.flash("error", "Campground not found");
            return res.redirect("bacl")
        }
        Comment.findById(req.params.comment_id, function (err, foundcomment) {
            if (err) {
                res.redirect("back");
            } else {
                //在app.js裡面有這行：app.use("/campgrounds/:id/comments", commentRoutes)。上面有route merge true，所以campground的id已經存在下面的req.params.id了。
                res.render("comments/edit", {
                    campground_id: req.params.id,
                    comment: foundcomment
                });
            }
        });
    })
});

//Comment Update Route
router.put("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//Comment Destory Route
router.delete("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndDelete(req.params.comment_id, function (err) {
        if (err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment Deleted")
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});



module.exports = router;