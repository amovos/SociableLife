var mongoose = require("mongoose");

var activitySchema = new mongoose.Schema({
    name: String,
    image: { type: String, default: "https://res.cloudinary.com/amovos/image/upload/v1526052638/activityPlaceHolder.png" },
    imageId: String,
    summary: String,
    description: String,
    videoUrl: String,
    youtubeVideoId: String,
    suitable: String,
    when: String,
    frequency: String,
    price: String,
    website: String,
    facebook: String,
    twitter: String,
    contactEmail: String,
    contactNum: String,
    linkStatus: {
        isLinkBroken: { type: Boolean, default: false },
        errorMessage: String,
        dateFirstBroken: Date,
        dateLastChecked: Date
    },
    tags: String,
    status: { type: String, default: 'current' }, //Need to make this dynamic, but for testing needs a value of current for the seed data (all new activities are set to "review") //Options "current", "review", "removed"
    age: String,
    location: String,
    lat: Number,
    lng: Number,
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date,
    author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
    },
    owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
    },
    updateRequests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UpdateRequest"
        }    
    ],
    comments: [ //this is an array because it returns an array of multiple comments
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }    
    ],
    loves: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }  
    ]
});

//Compile the schema into a model
//This variable Activity is now what we use to interact with the database (allows us to use mongodb methods in our code e.g. find, update etc.). Use the name of the SINGULAR ITEM (e.g. cat or person) which will make a collection called cats or people
module.exports = mongoose.model("Activity", activitySchema);