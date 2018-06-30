var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true},
    email: {type: String, unique: true, required: true},
    password: String,
    displayName: String,
    avatar: { type: String, default: "https://res.cloudinary.com/amovos/image/upload/v1526054504/avatarPlaceHolder.jpg" },
    avatarId: String,
    firstName: String,
    lastName: String,
    mailingList: { type: Boolean, default: false },
    termsCheck: { type: Boolean, default: true },
    bio: String,
    contactInfo: {
        contactEmail: String,
        contactNumber: String,
        contactWebsite: String
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isAdmin: { type: Boolean, default: false },
    isMod: { type: Boolean, default: false },
    salt: String,
    hash: String
});

UserSchema.plugin(passportLocalMongoose); //adds a bunch of methods to the UserSchema

module.exports = mongoose.model("User", UserSchema);