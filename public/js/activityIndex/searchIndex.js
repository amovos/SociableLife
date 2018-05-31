/* global $ */
/* global addMarkers */
/* global addActivities */

// on page load, load all markers and activities and setup listeners
$(document).ready(function(){ //waits until the DOM has loaded
    //on load search for activities
    //this is useful because if the page returns and repopulates existing content fields then it will re-run the search, which gives a better user experience
    initMasonry();
    newSearch();
    
    //TEMPORARY HACK TO FIX THE MASONRY BUG OF OVERLAPPING IMAGES ON PAGE LOAD
    window.setTimeout(function() {
        updateMasonryLayout();
    }, 2000);
    
    //ON PAGE LOAD IF CONTENT EXISTS (e.g. when the user presses back on the browser)
    if($('#searchQueryInput').val()){
        $('#searchQueryClearBtn').show();
    }
    if($('#setLocationInput').val()){
        $('#findNearMeClearBtn').show();
    }

    //when search button is clicked, filter results
    $('#searchQueryBtn,#findNearMeBtn').on('click', function(){ //the list is there on page load, but the li isn't so attach the listener to the list, then specify li inside which can be created after page load
        newSearch();
    });

    //when typing in text search input or location search input, if enter is pressed run the search
    $('#searchQueryInput,#setLocationInput').keyup(function(e){
        if(e.keyCode==13){ //remove this if statement to get constant search (but this doesn't work well with the marker drop animation)
            newSearch();
        } else {
            //code to show and hide the clear input box buttons
            if($(this).val()){
                if(this.id === 'searchQueryInput'){
                    $('#searchQueryClearBtn').show();
                } else if(this.id == 'setLocationInput'){
                    $('#findNearMeClearBtn').show();
                }
            } else {
                if(this.id === 'searchQueryInput'){
                    $('#searchQueryClearBtn').hide();
                } else if(this.id == 'setLocationInput'){
                    $('#findNearMeClearBtn').hide();
                }
            }
        }
    });
    
    
    //*******************
    //TESTING SEARCH ON EVERY KEY PRESS IN SEARCH FIELD
    //CAN KEEP THE ABOVE CODE AS THAT WILL STILL CHECK IF ENTER IS PRESSES
    //THIS MIGHT HAMMER THE DATABASE, BUT I CAN MONITOR THIS.
    //when typing in text search input run the search on every keypress
    $('#searchQueryInput').keyup(function(e){
        newSearch();
        //code to show and hide the clear input box button
        if($(this).val()){
            $('#searchQueryClearBtn').show();
        } else {
            $('#searchQueryClearBtn').hide();
        }
    });
    //*******************
    
    
    //on enter keypress in the distance input, run a filter
    $('#setDistanceInput').keyup(function(e){
        if(e.keyCode==13){
            searchCircle($('#setDistanceInput').val());
            existingDataSearch();
        }
    });
    
    //if #setDistancePlusBtn is pressed, redraw markers but don't search the database again
    $('#setDistancePlusBtn').on('click', function(){
        increaseSearchDistance();
        existingDataSearch();
    });
    
    //if #setDistanceMinusBtn is pressed, redraw markers but don't search the database again
    $('#setDistanceMinusBtn').on('click', function(){
        decreaseSearchDistance();
        existingDataSearch();
    });
    
    //if the cross button is clicked on the activity search box, clear the input and run the search again
    $('#searchQueryClearBtn').on('click', function(){
        $('#searchQueryClearBtn').hide();
        $('#searchQueryInput').val('');
        newSearch();
    });
    
    //if the cross button is clicked on the activity search box, clear the input and run the search again
    $('#findNearMeClearBtn').on('click', function(){
        $('#findNearMeClearBtn').hide();
        $('#setLocationInput').val('');
        newSearch();
    });
    
    
    
    
    $('#moreFiltersBtn').on('click', function(){
        $('#collapseMoreFilters').collapse("toggle");
        $('#moreFiltersBtn').toggleClass('active');
    });
    
    //load more activities from the filtered list
    $('#loadMoreBtn').on('click', function(){
        addMoreActivities(filteredActivities);
    });
    
});

//******************
// SEARCH FUNCTIONS
//******************

var searchInputs;
var searchMarker;
var searchMarkerLat;
var searchMarkerLng;
var circle;
var locationLat;
var locationLng;

var returnedActivities;
var filteredActivities;

// async function allActivitiesSearch(){
//     //search for all activities
//     var result = await $.getJSON("/api/activities/");
//     addMarkers(result);
//     addActivities(result);
//     returnedActivities = result;
//     filteredActivities = result; //so the #LoadMoreBtn works on page load
    
//     return returnedActivities;
// }

function newSearch(){
    activitySearch()
    .then(activityFilter)
    .then(addMarkers)
    .then(addActivities)
    .then(updateMasonryLayout);
}

function existingDataSearch(){
    activityFilter(returnedActivities)
    .then(addMarkers)
    .then(addActivities)
    .then(updateMasonryLayout);
}

async function activitySearch(){
    //get search inputs
    searchInputs = await getSearchInputs();
    returnedActivities = await $.getJSON("/api/activities/" + searchInputs.searchQuery);
    return returnedActivities;
}

async function activityFilter(activities){
    //perform client side filtering on the returned results from the database
    //so you don't make a DB call every time you change a filter or the search distance slightly
    //this should make it faster for the user
    
    //when I refactor this won't be quite how it works, as each filter will be a function that returns a new array, which gets smaller each time
    filteredActivities = [];
    
    //first, if a location has been set, find activities within the search radius
    if(searchInputs.location){
        //clear old marker if it exists
        if(searchMarker){
            searchMarker.setMap(null);
        }
        
        searchMarkerLat = searchInputs.location[0].latitude;
        searchMarkerLng = searchInputs.location[0].longitude;
        
        //create new marker for center of radius
        //**refactor this so it doesn't use the API each time unless the location has actually changed
        var latLng = await new google.maps.LatLng(searchMarkerLat, searchMarkerLng);
        searchMarker = await new google.maps.Marker({
            position: latLng,
            map: map
            //icon: image,
            //animation: google.maps.Animation.DROP
            //title: currentActivity.name
        });
        
        //expand 'distanceInputDiv' to show input options
        $('#collapseDistanceSearch').collapse('show');
        
        //set the 'distanceInput' to be a default of 20 and add searchCircle()
        if($('#setDistanceInput').val()){
            searchCircle($('#setDistanceInput').val());
        } else {
            $('#setDistanceInput').val('20');
            searchCircle(20);
        }
        
        //update "setLocationInput" with newly formatted address
        $('#setLocationInput').val(searchInputs.location[0].formattedAddress);
        
        //write trig function to filter only activities inside the circle
        activities.forEach(function(activity){
            if(isInsideCircle(activity)){
                filteredActivities.push(activity);
            }
        });
        
    } else {
        clearCircleAndSearchMarker();
        filteredActivities = activities;
    }
    
    //then apply additional filters to activities within this radius
    //haven't made any yet...
    
    
    //after all the filtering, show a message based on the number of actitivites returned
    if(filteredActivities.length === 0){
        $('#numActivitiesFoundMessage').hide();
        $('#numActivitiesFoundMessage').text('');
        
        $('#noActivitiesFoundMessage').show();
        $('#noActivitiesFoundMessage').html(
            "Sorry, we couldn't find any activities that matched your search 😕 <br><br>" +
            "If you'd like to add a new activity that isn't on our map please check back soon as we're adding this feature as fast as we can!<br>" +
            "If you join our <a href='/MailingList'>mailing list</a> we can let you know when it's ready 📧"
            );
    } else {
        $('#noActivitiesFoundMessage').hide();
        $('#noActivitiesFoundMessage').text('');
        
        $('#numActivitiesFoundMessage').show();
        $('#numActivitiesFoundMessage').html(
            "Found <strong>" + filteredActivities.length + "</strong> activities"
            );
    }
    
    return filteredActivities;
}

async function getSearchInputs(){
    //store all search inputs in an object and pass it to the activitySearch() function
    var searchQuery = $('#searchQueryInput').val();
    
    var location;
    if($('#setLocationInput').val()){
        location = await geocodeLocation($('#setLocationInput').val() + " UK"); //add UK to all locations so it doesn't default to American cities
    }
    
    var distance;
    
    var searchQueryObject = {
        searchQuery: searchQuery,
        location: location,
        distance: distance
    };
    
    return searchQueryObject;
}

function searchCircle(radius){
    if(circle){ //if a circle already exists, delete the old one before making a new one
        circle.setMap(null);
    }
    circle = new google.maps.Circle({
        map: map,
        radius: 1609 * radius,    // 10 miles in metres
        strokeColor: '#115BBF',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#115BBF',
        fillOpacity: 0.2,
    });
    circle.bindTo('center', searchMarker, 'position');
    map.fitBounds(circle.getBounds());
}

function isInsideCircle(activity){
    if(getDistanceFromLatLonInKm(searchMarkerLat, searchMarkerLng, activity.lat, activity.lng) < $('#setDistanceInput').val()*1.609){
        return true;
    } else {
        return false;
    }
}

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

function increaseSearchDistance(activities){
    if(!($('#setDistanceInput').val())){ //if value is still undefined, set it to 20
        $('#setDistanceInput').val("15");
    }
    
    $('#setDistanceInput').val(function(i, oldval) {
        return parseInt(oldval, 10) + 5;
    });
    
}

function decreaseSearchDistance(activities){
    if(!($('#setDistanceInput').val())){ //if value is still undefined, set it to 20
        $('#setDistanceInput').val("25");
    }
    
    $('#setDistanceInput').val(function(i, oldval) {
        if(parseInt(oldval, 10) <= 5){ //can't be below 5
            return 5;
        } else {
            return parseInt(oldval, 10) - 5; //turn the string oldval into an int
        }
    });
    
}

function geocodeLocation(location){
    return $.getJSON("/api/activities/locationSearch/" + location);
}

function clearCircleAndSearchMarker(){
    if(circle){
        circle.setMap(null);
    }
    if(searchMarker){
        searchMarker.setMap(null);
    }
    $('#collapseDistanceSearch').collapse('hide');
}

function resetSearch(){
    $('#searchQueryInput').val('');
    $('#setLocationInput').val('');
    $('#setDistanceInput').val('');
    $('#findNearMeClearBtn').hide();
    $('#searchQueryClearBtn').hide();
    clearCircleAndSearchMarker();
    activitySearch()
    .then(activityFilter)
    .then(addMarkers)
    .then(addActivities)
    .then(updateMasonryLayout);
}



// function clearAll(){ //removed as I couldn't see a reason for this functionality
//     //runs when the "Hide All" button is clicked
//     removeAllActivities();
//     clearMarkers();
//     clearCircleAndSearchMarker();
//     $('#searchQueryInput').val('');
//     $('#setLocationInput').val('');
//     $('#setDistanceInput').val('');
//     $('#loadMoreButton').hide();
// }