/* global $ */ //this is how to get rid of the warning because $ isn't defined in this file

//on page load, page number starts at 1
var pageNumber = 1;
var perPage = 8
var activityCounter = 0;

//******************
// FUNCTIONS
//******************
function addActivities(activities) { //function used to add activities on page load
    //reset counters before adding new activities
    pageNumber = 1;
    activityCounter = 0;
    
    removeAllActivities(); //remove all activities before trying to add new ones
    activities.forEach(function(activity, index){
        if(index <= pageNumber * perPage - 1){
            addActivity(activity);
            activityCounter++;
        }
    });
    if(activities.length <= perPage){
        $('#loadMoreBtn').hide();
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
    }
    //updateMasonryLayout(); causes the page to jump
    reloadMasonryLayout();
}

function addActivity(activity){ //function used whenever we want to add an item to the DOM (e.g. on page load or when an item is created)
    var statusIcon;
    var statusText;
    //adding alt text to the span surrounding the icon makes it accessible to screen readers
    if(activity.status === "current"){
        statusText = '<strong>Current Info</strong><br>This activity has been checked or updated in the last 6 months';
        statusIcon = '<span class="tooltip-status" alt="' + statusText + '"><i class="fa fa-check-circle fa-1x text-success"></i><span class="tooltip-status-text">' + statusText + '</span></span>';
       
    } else {
        statusText = '<strong>Out of date</strong><br>This activity has not been checked or updated in the last 6 months. The information might be out of date.';
        statusIcon = '<span class="tooltip-status" alt="' + statusText + '"><i class="fa fa-question-circle fa-1x text-danger"></i><span class="tooltip-status-text">' + statusText + '</span></span>';
    }
    
    var newActivity = $(
        '<div class="grid-item col-lg-3 col-md-4 col-sm-6 mb-4">' +
            '<div class="card activity-card" onclick="location.href=\'/activities/' + activity._id + '\'">' +
              '<a href="/activities/' + activity._id + '"><img class="card-img-top activity-index-image" src="' + activity.image + '" alt="<%= activity.name %>"></a>' +
              '<div class="card-body pb-2">' +
                '<h5 class="card-title">' + statusIcon + ' <a href="/activities/' + activity._id + '">' + activity.name + '</a></h5>' +
                '<p class="card-text text-left mb-1">' + activity.summary + '</p>' +
                
                '<hr class="mb-2 mt-2">' +
                
                '<div class="d-flex flex-row justify-content-between">' +
                    '<div class="d-flex flex-column col-5 nopadding text-left">' +
                        '<div>' +
                            '<strong>Ages</strong>' +
                        '</div>' +
                        '<div>' +
                            activity.age +
                        '</div>' +
                    '</div>' +
                    '<div class="d-flex flex-column col-7 nopadding text-left">' +
                        '<div>' +
                            '<strong>Suitable for</strong>' +
                        '</div>' +
                        '<div>' +
                            activity.suitable +
                        '</div>' +
                    '</div>' +
                '</div>' +
                
                '<hr class="mb-2 mt-2">' +
                    
                '<div class="d-flex flex-row justify-content-around">' +
                    '<span class="fa-stack fa-1x sociable-love mr-3">' +
                        '<i class="fa fa-heart fa-stack-2x heart-offset"></i>' +
                        '<span class="fa-stack-1x text-white">' + (activity.loves.length) + '</span>' +
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
    
    //$('#activity-grid').append(newActivity);
    $masonryContainer.append(newActivity).masonry( 'appended', newActivity );
}

var $masonryContainer;

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