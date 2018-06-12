var schedule = require('node-schedule');

var checkAllBrokenLinks = require("./serverScripts/brokenLinksCheckAll.js");

function scheduledFunctions(){
    //check links every 24 hours
    schedule.scheduleJob('0 1 * * *', function(){ //runs every day at 1am server time
        var isodate = new Date().toISOString();
        checkAllBrokenLinks(isodate);
    });
}

module.exports = scheduledFunctions;