var mongoose = require("mongoose");

var activitySchema = new mongoose.Schema({
    name: String,
    image: { type: String, default: "https://res.cloudinary.com/amovos/image/upload/v1526052638/activityPlaceHolder.png" },
    imageId: String,
    summary: String,
    description: String,
    suitable: String,
    when: String,
    frequency: String,
    price: String,
    website: String,
    linkStatus: {
        isLinkBroken: { type: Boolean, default: false },
        errorMessage: String,
        dateFirstBroken: Date,
        dateLastChecked: Date
    },
    tags: String,
    status: { type: String, default: 'current' }, //Need to make this dynamic, but for testing needs a value
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