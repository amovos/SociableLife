/* global $ */
/* global addMarkers */
/* global addActivities */

// on page load, load all markers and activities and setup listeners
$(document).ready(function(){ //waits until the DOM has loaded
    $.getJSON("/api/activities/")
        .then(addMarkers) //this function returns the activities object that can be used in the next chain of the promise
        .then(addActivities);

    //when search button is clicked, filter results
    $('#searchQueryBtn').on('click', function(){ //the list is there on page load, but the li isn't so attach the listener to the list, then specify li inside which can be created after page load
        activitySearch();
    });

    //when typing in text search input, if enter is pressed run the search
    $('#searchQueryInput').keypress(function(e){
        if(e.keyCode==13){ //remove this if statement to get constant search (but this doesn't work well with the marker drop animation)
            activitySearch();
        }
    });
    
    //on focusing on distance input
    $("#setDistanceInput").focus(function(){
        if($('#setDistanceInput').val()){
            searchCircle($('#setDistanceInput').val());
        } else {
            console.log("RUN");
            $('#setDistanceInput').val(20);
            searchCircle(20);
        }
    });
    
    //if pressing enter when on distance input
    $('#setDistanceInput').keypress(function(e){
        if(e.keyCode==13){
            searchCircle($('#setDistanceInput').val());
        }
    });
        
    
});

//******************
// SEARCH FUNCTIONS
//******************

var circle;

function activitySearch(){
    //reset counters before a search
    pageNumber = 1;
    activityCounter = -1;
    
    var searchQuery = $('#searchQueryInput').val();
    $.getJSON("/api/activities/" + searchQuery)
    .then(addMarkers) //this function returns the activities object that can be used in the next chain of the promise
    .then(addActivities);
}

function searchCircle(radius){
    if(circle){ //if a circle already exists, delete the old one before making a new one
        circle.setMap(null);
    }
    circle = new google.maps.Circle({
        map: map,
        radius: 1609 * radius,    // 10 miles in metres
        fillColor: '#115BBF',
        fillOpacity: 0.2,
    });
    circle.bindTo('center', markers[0], 'position');
}

function increaseSearchDistance(){
    if(!($('#setDistanceInput').val())){ //if value is still undefined, set it to 20
        $('#setDistanceInput').val("15");
    }
    
    $('#setDistanceInput').val(function(i, oldval) {
        return parseInt(oldval, 10) + 5;
    });
    searchCircle($('#setDistanceInput').val());
}

function decreaseSearchDistance(){
    if(!($('#setDistanceInput').val())){ //if value is still undefined, set it to 20
        $('#setDistanceInput').val("25");
    }
    
    $('#setDistanceInput').val(function(i, oldval) {
        if(parseInt(oldval, 10) <= 5){
            return 5;
        } else {
        searchCircle($('#setDistanceInput').val());
        return parseInt(oldval, 10) - 5; //turn the string oldval into an int
        }
    });
    
    
}

function clearAll(){
    removeAllActivities();
    clearMarkers();
    $('#searchQueryInput').val('');
}