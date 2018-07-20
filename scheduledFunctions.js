var schedule = require('node-schedule');

var checkAllBrokenLinks = require("./server_scripts/brokenLinksCheckAll.js");

function scheduledFunctions(){
    //check links every 24 hours
    schedule.scheduleJob('0 1 * * *', function(){ //runs every day at 1am server time
        var isodate = new Date().toISOString();
        checkAllBrokenLinks(isodate);
    });
    
    //remove activities past their endDate every 24 hours
    
    
    //put activities into review that haven't been updated in 6 months
    
    //"remove" activities that haven't been updated in 12 months
    
}

module.exports = scheduledFunctions;