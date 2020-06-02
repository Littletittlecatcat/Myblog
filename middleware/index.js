//All the middleware go here
const middlewareObj = {}
const Campground = require("../models/campground");
const Comment = require("../models/comment");



middlewareObj.checkOwnership = function (req, res, next) {
    //is User loging?
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function (err, foundCampground) {
            if (err || !foundCampground) {
                req.flash("error", "Campground not found")
                res.redirect("back")
            } else {
                //does user own the campground?
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You Don't Have Permission to Edit")
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Please Login First")
        res.redirect("back")
    }
}

middlewareObj.checkCommentOwnership = function (req, res, next) {
    //is User loging?
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err || !foundComment) {
                req.flash("error", "Comment not found")
                res.redirect("back")
            } else {
                //does user own the comment?
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You Don't Have Permission")
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Please Login First")
        res.redirect("back")
    }
}

middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please Login First!")
    res.redirect('/login')
}

module.exports = middlewareObj