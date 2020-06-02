var express = require("express");
var router = express.Router();
var User = require("../models/users");
var passport = require("passport")



router.get('/', function (req, res) {
    res.render('landing')
})


//=================
//Auth Routes
//=================

// Render Sign up Page
router.get('/register', function (req, res) {
    res.render('register')
})

//Handle Sign up logic
router.post('/register', function (req, res) {
    //username from the form
    var newUser = new User({
        username: req.body.username
    });
    //req.body.password => password from the form
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            //可以用req.flash("error", err.message) + return res.redirect("/register") 或是下面
            //When using res.render() you can just pass the flash message directly as the second argument, since res.render offers the ability to pass values to the template.
            return res.render('register', {
                "error": err.message
            });
        }
        passport.authenticate('local')(req, res, function () {
            req.flash("success", "Welcome! " + user.username)
            res.redirect('/campgrounds')
        })
    })
});

//Login Routes
//Render Login page
router.get('/login', function (req, res) {
    res.render('login')
})

//這行等同於，app.post("/login", middleware, callbacl)
//上面有passport.use(new localStrategy(User.authenticate()))，這邊的user.aith 等於 passport.auth 的method
router.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
}), function (req, res) {});


//Logout Route
router.get('/logout', function (req, res) {
    req.logOut();
    req.flash("success", "Successfully Log out!")
    res.redirect('/campgrounds')
})


module.exports = router;