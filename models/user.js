var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true},
    password: String,
    avatar: String, //could add a default user avatar here
    firstName: String,
    lastName: String,
    email: {type: String, unique: true, required: true},
    createdAt: { type: Date, default: Date.now },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isAdmin: { type: Boolean, default: false }
});

UserSchema.plugin(passportLocalMongoose); //adds a bunch of methods to the UserSchema

module.exports = mongoose.model("User", UserSchema);