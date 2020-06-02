var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    User = require("./models/users"),
    flash = require("connect-flash")
seedDB = require("./seeds")


//Requiring Routes
var campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes = require("./routes/comments"),
    authRoutes = require("./routes/index")


mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/yelp_camp", {
    useNewUrlParser: true
});
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(__dirname + "/public"));
app.set('view engine', 'ejs');
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();

//Passport config
app.use(require("express-session")({
    secret: "Keep practicing! Michael.",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//這條要在所有passport相關的config後面
app.use(function (req, res, next) {
    res.locals.currentUser = req.user
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");

    next()
});

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use(authRoutes);


/* Campground.create({
    name: 'Bread',
    image: 'https://source.unsplash.com/rsWZ-P9FbQ4/800x450',
    description: 'What a Fresh Bread'
}, function (err, campground) {
    if (err) {
        console.log(err);
    } else {
        console.log("Newly Create a Campground: ");
        console.log(campground);
    }
}) */



app.listen(3000, function () {
    console.log('You are running your app!')
})