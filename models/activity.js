var mongoose = require("mongoose");

var activitySchema = new mongoose.Schema({
    name: String,
    image: { type: String, default: "https://res.cloudinary.com/amovos/image/upload/v1526052638/activityPlaceHolder.png" },
    imageId: String,
    description: String,
    price: String,
    location: String,
    lat: Number,
    lng: Number,
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        displayName: String //as the main piece of info that's regularly used is the displayName it's better to store it in the comment then have to look it up each time using the ID
    },
    comments: [ //this is an array because it returns an array of multiple comments
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }    
    ]
});

//Compile the schema into a model
//This variable Activity is now what we use to interact with the database (allows us to use mongodb methods in our code e.g. find, update etc.). Use the name of the SINGULAR ITEM (e.g. cat or person) which will make a collection called cats or people
module.exports = mongoose.model("Activity", activitySchema);