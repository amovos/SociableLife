/* global $ */

//******************
// FUNCTIONS
//******************
async function addActivities(activities) { //function used to add activities on page load
    //reset counters before adding new activities
    pageNumber = 1;
    activityCounter = 0;
    
    removeAllActivities(); //remove all activities before trying to add new ones
    
    //just before checking to see what the order should be, check if location has a value and if it doesn't, update the radio boxes
    if(!($('#setLocationInput').val())){
        //disable the distance order radio checkbox
        $('#orderDistanceCheck').attr("disabled", true);
        
        //and if the value was previously distance, change it to date updated
        if($('#orderDistanceCheck').prop('checked')){
            $('#orderDateUpdatedCheck').prop('checked', false);
        }
    } else {
        //if the location input does have a value, enable the ordering by distance
        $('#orderDistanceCheck').attr("disabled", false);
    }
    
    
    //order array here based on the value of the radio button order options
    if($('#orderLovesCheck').prop('checked')){
       activities = await orderActivitiesByLoves(activities);
    } else if($('#orderDistanceCheck').prop('checked')){
        activities = await orderActivitiesByDistance(activities);
    } else if($('#orderDateUpdatedCheck').prop('checked')){
        activities = await orderActivitiesByDateUpdated(activities);
    } else {
        activities = await orderActivitiesByFeatured(activities);
    }
    
    //once ordered set the window storage variable to filteredActivities so it can be used when moving to other activities
    if (typeof(Storage) !== "undefined") {
        //store the object in localStorage under filteredActivities
        localStorage.setItem("filteredActivities", JSON.stringify(activities));
    }
    
    activities.forEach(function(activity, index){
        if(index <= pageNumber * perPage - 1){
            addActivity(activity);
            activityCounter++;
        }
    });
    if(activities.length <= perPage){
        $('#loadMoreBtn').hide();
        $('#backToTopBtn').hide();
    } else {
        $('#loadMoreBtn').show();
    }
}

function addMoreActivities(activities){
    pageNumber++;
    activities.forEach(function(activity, index){
        if(activityCounter <= index){
            if(index <= pageNumber * perPage - 1){
                addActivity(activity);
                activityCounter++;
            }
        }
    });
    if(activityCounter >= (activities.length - 1)){
        $('#loadMoreBtn').hide();
        $('#backToTopBtn').show();
    }
    //updateMasonryLayout(); causes the page to jump
    reloadMasonryLayout();
}

function addActivity(activity){ //function used whenever we want to add an item to the DOM (e.g. on page load or when an item is created)
    
    //set the tooltip content for the status icons
    var statusIcon;
    var statusText;
    if(activity.status === "current"){
        statusText = statusTextCurrent;
        statusIcon = statusIconCurrent;
    } else if(activity.status === "review"){
        statusText = statusTextReview;
        statusIcon = statusIconReview;
    } else {
        statusText = statusTextRemoved;
        statusIcon = statusIconRemoved;
    }
    
    var loveColorClass = setIndexCardLoveColor(activity);
    var activityDistanceMiles;
    
    //add distance box to top corner of activity images
    if($('#setLocationInput').val()){
        activityDistanceMiles =     '<span style="position: absolute; z-index: 3; border: 1px solid #1168F9; border-radius: 3px;" class="alert alert-primary pb-1 pt-1 pr-1 pl-1" role="alert">' + 
                                    Math.round(0.621371 * getDistanceFromLatLonInKm(searchMarkerLat, searchMarkerLng, activity.lat, activity.lng)) + 
                                    ' miles</span>';
    } else {
        activityDistanceMiles = '';
    }
    
    var activityAge = '';
    if(activity.age.isChild && activity.age.isAdult) { 
        activityAge = 'All Ages';
    } else if(activity.age.isChild) {
        activityAge = 'Children';
    } else if(activity.age.isAdult) {
        activityAge = 'Adults';
    }
        
        
    var activitySuitable = '';
    if(activity.suitable.isPhysical && activity.suitable.isLearning) { 
        activitySuitable = 'All Abilities';
    } else if(activity.suitable.isPhysical) {
        activitySuitable = 'Physical Disabilities';
    } else if(activity.suitable.isLearning) {
        activitySuitable = 'Learning Disabilities';
    }
    
    var activityImgUrl;
    if(activity.imageId) {
        activityImgUrl = "https://res.cloudinary.com/amovos/image/upload/f_auto,q_auto:low" + activity.image.slice(46);
    } else {
        activityImgUrl = activity.image;
    }
    
    var newActivity = $(
        '<div class="grid-item col-lg-3 col-md-4 col-sm-6 mb-4">' +
            '<div class="card activity-card" onclick="location.href=\'/activities/' + activity._id + '\'">' +
              '<a style="position: relative; z-index: 1;" href="/activities/' + activity._id + '">' +
                activityDistanceMiles +
                '<img style="position: relative; z-index: 2;" class="card-img-top activity-index-image" src="' + activityImgUrl + '" alt="' + activity.name + ' Picture">' +
              '</a>' +
              '<div class="card-body pb-2">' +
                '<h5 class="card-title">' + statusIcon + ' <a href="/activities/' + activity._id + '">' + activity.name + '</a></h5>' +
                '<p class="card-text text-left mb-1 first-letter-capitalize">' + activity.summary + '</p>' +
                
                '<hr class="mb-2 mt-2">' +
                
                '<div class="d-flex flex-row justify-content-between">' +
                    '<div class="d-flex flex-column col-5 nopadding text-left">' +
                        '<div>' +
                            '<strong>Ages</strong>' +
                        '</div>' +
                        '<div>' +
                             activityAge +
                        '</div>' +
                    '</div>' +
                    '<div class="d-flex flex-column col-7 nopadding text-left">' +
                        '<div>' +
                            '<strong>Suitable for</strong>' +
                        '</div>' +
                        '<div>' +
                            activitySuitable +
                        '</div>' +
                    '</div>' +
                '</div>' +
                
                '<hr class="mb-2 mt-2">' +
                
                '<div class="d-flex flex-row justify-content-between">' +
                    '<div class="d-flex flex-column nopadding text-left">' +
                        // '<div>' +
                        //     '<strong>Type</strong>' +
                        // '</div>' +
                        '<div>' +
                            activity.location +
                        '</div>' +
                    '</div>' +
                    // '<div class="d-flex flex-column col-7 nopadding text-left">' +
                    //     '<div>' +
                    //         '<strong>When</strong>' +
                    //     '</div>' +
                    //     '<div>' +
                    //         activity.when +
                    //     '</div>' +
                    // '</div>' +
                '</div>' +
                
                '<hr class="mb-2 mt-2">' +
                    
                '<div class="d-flex flex-row justify-content-around">' +
                    '<span class="fa-stack fa-1x sociable-love mr-3">' +
                        '<i class="fa fa-heart fa-stack-2x heart-offset"></i>' +
                        '<span class="fa-stack-1x ' + loveColorClass + '">' + (activity.loves.length) + '</span>' +
                    '</span>' +
                    '<span class="fa-stack fa-1x sociable-comment">' +
                        '<i class="fa fa-comment fa-stack-2x comment-offset"></i>' +
                        '<span class="fa-stack-1x text-white">' + (activity.comments.length) + '</span>' +
                    '</span>' +
                '</div>' +
                
                // '<p class="mb-0 mt-2"><a href="/activities/' + activity._id + '" class="btn btn-primary" class="btn btn-primary">More Info</a></p>' +
              '</div>' +
            '</div>' +
        '</div>'
        );
    
    $masonryContainer.append(newActivity).masonry( 'appended', newActivity );
}

function initMasonry(){
    $masonryContainer = $('.grid').masonry({
        itemSelector: '.grid-item'
    });
}

async function updateMasonryLayout(){
    await $masonryContainer.masonry('destroy');
    initMasonry();
}

async function reloadMasonryLayout(){
    await $masonryContainer.masonry('reloadItems');
    initMasonry();
}

function removeAllActivities() {
    $('#activity-grid').empty();
}

function scrollToActivityIndexMap() {
    
    event.preventDefault(); //Prevent default anchor click behavior

    var hash = "#activity-index-map";
    
    $('html, body').animate({
        scrollTop: $(hash).offset().top
    }, 800, function(){
        window.location.hash = hash;
    });
    
}