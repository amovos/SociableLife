// ==============================
// CHECK ALL BROKEN LINKS ROUTE
// ==============================

var checkAllBrokenLinks = require("../../serverScripts/brokenLinksCheckAll.js");

var brokenLinksCheckAll = function(req, res) {
    checkAllBrokenLinks(req.body.timeStamp);
    res.sendStatus(200);
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = brokenLinksCheckAll;