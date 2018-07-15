var mongoose = require("mongoose");

var updateRequestSchema = mongoose.Schema({
    text: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    isDone: { type: Boolean, default: false },
    isDoneDate: Date,
    isDoneValue: String,
    isDoneUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

module.exports = mongoose.model("UpdateRequest", updateRequestSchema);