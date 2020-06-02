var mongoose = require("mongoose");
const Comment = require('./comment');


//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    price: String,
    description: String,
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    created: {
        type: Date,
        default: Date.now
    }

});

campgroundSchema.pre('remove', async function () {
    await Comment.deleteMany({
        _id: {
            $in: this.comments
        }
    });
});


module.exports = mongoose.model("Campground", campgroundSchema);