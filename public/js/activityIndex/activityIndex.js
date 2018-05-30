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
}

function addActivity(activity){ //function used whenever we want to add an item to the DOM (e.g. on page load or when an item is created)
    var newActivity = $(
        '<div class="col-lg-3 col-md-4 col-sm-6 mb-4">' +
            '<div class="card activity">' +
              '<img class="card-img-top" src="' + activity.image + '" alt="<%= activity.name %>">' +
              '<div class="card-body">' +
                '<h5 class="card-title">' + activity.name + '</h5>' +
                '<p class="card-text">Some quick example text to build on the card title and make up the bulk of the card\'s content.</p>' +
                '<a href="/activities/' + activity._id + '" class="btn btn-primary" class="btn btn-primary">More Info</a>' +
              '</div>' +
            '</div>' +
        '</div>'
        );
    $('#activity-grid').append(newActivity);
}

function removeAllActivities() {
    $('#activity-grid').empty();
}