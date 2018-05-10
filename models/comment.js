var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    text: String,
    createdAt: { type: Date, default: Date.now },
    author: {
        id: { //it's a relational database so the ID will be stored as an object using this format
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String //as the main piece of info that's regularly used is the username it's better to store it in the comment then have to look it up each time using the ID
    }
});

module.exports = mongoose.model("Comment", commentSchema);