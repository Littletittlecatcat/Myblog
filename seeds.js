var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment")


var seeds = [{
    name: "Bread",
    image: "https://source.unsplash.com/rsWZ-P9FbQ4/800x450",
    description: "What a Fresh Bread"
}, {
    name: "Salad",
    image: "https://source.unsplash.com/OzBLe_Eg1mg/800x450",
    description: "Bla Bla Bla Bla Bla"
}, {
    name: "Milk",
    image: "https://source.unsplash.com/S1HuosAnX-Y/800x450",
    description: "A cup of milky silky milk"
}]


function seedDB() {
    //Remove all campgrounds
    Campground.remove({}, function (err) {
        if (err) {
            console.log(err);
        }
        console.log("removed all campgrounds");

        // Add a few campgrounds
        //括號裡面的seed 代表data裡面的一個campground
        data.forEach(function (seed) {
            Campground.create(seed, function (err, campground) {
                //這邊callback function 裡面的campground看這邊的解釋：https://www.udemy.com/course/the-web-developer-bootcamp/learn/lecture/3861664#questions/9372525
                if (err) {
                    console.log(err);
                } else {
                    console.log("Add a campground.")

                    //Create a comment on each campground
                    Comment.create({
                        text: "I will get fat!!",
                        author: "John"
                    }, function (err, comment) { //這邊把 comment 生出來了，下一步要把他和 Campground 關聯起來
                        if (err) {
                            console.log(err);
                        } else {
                            campground.comments.push(comment);
                            //這邊的 campground 是上面 Campground.create 新增出來在後面 （err, campground） 的 campground。在影片中原本是叫 data
                            campground.save();
                            console.log("Add a new comment")
                        }
                    });
                }
            });

        });
    });
};

async function seedDB() {
    try {
        await Comment.remove({});
        console.log("Comments removed");
        await Campground.remove({});
        console.log("Campgrounds removed");


        /* for (const seed of seeds) {
            let campground = await Campground.create(seed);
            console.log("Campground created");
            let comment = await Comment.create({
                text: "I will get fat!!",
                author: "John"
            })
            console.log("Comment removed");
            campground.comments.push(comment);
            campground.save();
            console.log("Comment added to Campground");

        } */
    } catch (err) {
        console.log(err)
    }
}




module.exports = seedDB;