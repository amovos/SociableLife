var mongoose = require("mongoose");

var activityUpdateHistorySchema = mongoose.Schema({
    updatedAt: { type: Date, default: Date.now },
    updateType: String,
    oldStatus: String,
    newStatus: String,
    author: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
});

module.exports = mongoose.model("ActivityUpdateHistory", activityUpdateHistorySchema);