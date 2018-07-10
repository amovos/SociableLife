/* global $ */

//******************
// SEARCH FUNCTIONS
//******************

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
    searchInputs = await getSearchInputs();
    returnedActivities = await $.getJSON("/api/activities/" + searchInputs.searchQuery);
    return returnedActivities;
}

async function activityFilter(activities){
    //perform client side filtering on the returned results from the database
    //so you don't make a DB call every time you change a filter or the search distance slightly
    //this should make it faster for the user
    var filteredActivitiesLocal;
    
    //SEARCH QUERY FILTER
    //The search query filiter is applied on the databse search, so isn't performed again here
    
    // APPLY MAP KEY / AGES FILTERING OPTIONS
    filteredActivitiesLocal = await mapKeyFilter(activities);

    // APPLY LOCATION FILTERING
    //if a location has been set, find activities within the search radius
    if(searchInputs.location){
        filteredActivitiesLocal = await locationFilter(filteredActivitiesLocal);
    } else {
        //else, if no location has been set then clear circler and search marker
        clearCircleAndSearchMarker();
    }
    
    // APPLY STATUS FILTERING OPTIONS
    filteredActivitiesLocal = await statusFilter(filteredActivitiesLocal);
    
    // APPLY SUITABLE FOR FILTERING OPTIONS
    filteredActivitiesLocal = await suitableFilter(filteredActivitiesLocal);
    
    // APPLY TYPE FILTERING OPTIONS
    filteredActivitiesLocal = await typeFilter(filteredActivitiesLocal);
    
    //set the filter message based on the number of returned activities
    activityFilterMessage(filteredActivitiesLocal);
    
    //set the returned list of filtered activities to the global variable filteredActivities so it can be used later by other functions without filtering again
    filteredActivities = filteredActivitiesLocal;
    
    //store filter variables in browser localStorage so that it will save them when returning
    if (typeof(Storage) !== "undefined") {
        localStorage.setItem("activityFilterLocation", $('#setLocationInput').val());
        // localStorage.setItem("", $('#').val());
        // localStorage.setItem("", $('#').val());
        // localStorage.setItem("", $('#').val());
        // localStorage.setItem("", $('#').val());
        // localStorage.setItem("", $('#').val());
        // localStorage.setItem("", $('#').val());
        // localStorage.setItem("", $('#').val());
        // localStorage.setItem("", $('#').val());
        // localStorage.setItem("", $('#').val());
        // localStorage.setItem("", $('#').val());
        // localStorage.setItem("", $('#').val());
        // localStorage.setItem("", $('#').val());
        // localStorage.setItem("", $('#').val());
    }
    
    //return the list of filtered activities to be used by the next function in the promise chain
    return filteredActivitiesLocal;
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
        fillOpacity: 0.1,
    });
    circle.bindTo('center', searchMarker, 'position');
    map.fitBounds(circle.getBounds());
    
    //close the last opened info window when the circle is clicked
    google.maps.event.addListener(circle, "click", function(event) {
        if(lastOpenedInfoWindow){
            lastOpenedInfoWindow.close();
        }
    });
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

function mapKeyUpdateFunction(passedThis){

    var selectedCheck;
    var selectIconDiv;
    
    //reset this global selector variable so the mapKeyClickFunction() works as expected
    mapKeySelectedVar = "";
    
    if(passedThis.id === "adultsCheck"){
        selectedCheck = $("#adultsCheck");
        selectIconDiv = $("#adultsKeyDiv");
    } else {
        selectedCheck = $("#childrenCheck");
        selectIconDiv = $("#childrenKeyDiv");
    }

    if(selectedCheck.prop('checked')) {
        selectedCheck.prop('checked', false);
        selectIconDiv.css('opacity', '0.2');
        mapKeyOpacityVar = '0.2'; //sets the global variable mapKeyOpacityVar to be the new value after click, so the hover effect works as expected
    } else {
        selectedCheck.prop('checked', true);
        selectIconDiv.css('opacity', '1');
        mapKeyOpacityVar = '1'; //sets the global variable mapKeyOpacityVar to be the new value after click, so the hover effect works as expected
    }
    
    //if neither adults or children are selected then "all ages" should also be grey
    if(!($('#adultsCheck').prop('checked')) && !($('#childrenCheck').prop('checked')) ) {
        $("#allAgesKeyDiv").css('opacity', '0.2');
    } else {
        $("#allAgesKeyDiv").css('opacity', '1');
    }
    
}

function mapKeyClickFunction(passedThis){
    mapKeyOpacityVar = '1';
    
    //if one is clicked, uncheck the other two and check this one
    //and set the global variable mapKeySelectedVar to be the clicked id
    //so that if the same one is clicked again, then it will show all
    if(passedThis.id === "allAgesKeyDiv"){
    //select all and clear global variable selector
    mapKeyAllCheckedAndTrue();
    mapKeySelectedVar = "";

    } else if(passedThis.id === "adultsKeyDiv"){
        if(mapKeySelectedVar === "adultsKeyDiv"){
            //select all
            mapKeyAllCheckedAndTrue();
            
            //clear global variable selector
            mapKeySelectedVar = "";
            
        } else {
            mapKeySelectedVar = "adultsKeyDiv";
            
            $("#adultsKeyDiv").css('opacity', '1');
            $("#childrenKeyDiv").css('opacity', '0.2');
            $("#allAgesKeyDiv").css('opacity', '1');
            
            $("#adultsCheck").prop('checked', true);
            $("#childrenCheck").prop('checked', false);
        }
    } else {
        if(mapKeySelectedVar === "childrenKeyDiv"){
            //select all
            mapKeyAllCheckedAndTrue();
            
            //clear global variable selector
            mapKeySelectedVar = "";
            
        } else {
            mapKeySelectedVar = "childrenKeyDiv";
            
            $("#childrenKeyDiv").css('opacity', '1');
            $("#allAgesKeyDiv").css('opacity', '1');
            $("#adultsKeyDiv").css('opacity', '0.2');
            
            $("#childrenCheck").prop('checked', true);
            $("#adultsCheck").prop('checked', false);
        }
    }
}

function mapKeyAllCheckedAndTrue(){
    $("#allAgesKeyDiv").css('opacity', '1');
    $("#adultsKeyDiv").css('opacity', '1');
    $("#childrenKeyDiv").css('opacity', '1');
    
    $("#adultsCheck").prop('checked', true);
    $("#childrenCheck").prop('checked', true);
}

function resetSearch(){
    //clear all input fields
    $('#searchQueryInput').val('');
    $('#setLocationInput').val('');
    $('#setDistanceInput').val('');
    $('#findNearMeClearBtn').hide();
    $('#searchQueryClearBtn').hide();
    
    //reset filters
    $('#adultsCheck,#childrenCheck').prop('checked', true);
    $('#allAgesKeyDiv,#adultsKeyDiv,#childrenKeyDiv').css('opacity', '1');
    
    //check all boxes
    $('.checkbox-input').prop('checked', true);
    //then uncheck review and removed
    $('#reviewStatusCheck,#removedStatusCheck').prop('checked', false);
    //then reset all the button text
    $('#statusCheckboxToggle,#agesCheckboxToggle,#suitableCheckboxToggle,#typeCheckboxToggle').html('Clear All');
    
    //hide "Back to Top" button
    $('#backToTopBtn').hide();
    
    //re-center map
    map.setCenter(mapInitCenter);
    map.setZoom(mapInitZoom);
    
    //clear circle and markers and run a new search
    clearCircleAndSearchMarker();
    activitySearch()
    .then(activityFilter)
    .then(addMarkers)
    .then(addActivities)
    .then(updateMasonryLayout);
}