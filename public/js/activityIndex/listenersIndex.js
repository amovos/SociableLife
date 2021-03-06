//******************
// GLOBAL VARIABLES
//******************

//MAP GLOBAL VARIABLES
var map;
var mapInitZoom;
var mapInitCenter = {lat: 54.4800, lng: -4.1000 };
var markers = [];
var lastOpenedInfoWindow;
var mapKeyOpacityVar;
var mapKeySelectedVar;
var markerCluster;

//SEARCH FUNCTION GLOBAL VARIABLES 
var searchInputs;
var searchMarker;
var searchMarkerLat;
var searchMarkerLng;
var circle;
var locationLat;
var locationLng;
var returnedActivities;
var filteredActivities; //this global variable is used for the "Load More" button

//ACTIVITY INDEX GLOBAL VARIABLES
//on page load, page number starts at 1
var pageNumber = 1;
var perPage = 16
var activityCounter = 0;
var $masonryContainer;

//TOOLTIP GLOBAL VARIABLES
var statusTextCurrent = '<strong>Current Info</strong><br>This activity has been checked or updated in the last 6 months';
var statusTextReview = '<strong>Under Review</strong><br>This activity has not been checked yet or has not been updated in the last 6 months. The information might be out of date.';
var statusTextRemoved = '<strong>Out of Date</strong><br>This activity has been removed because it has already happened or has not been updated for over a year.';
//adding alt text to the span surrounding the icon makes it accessible to screen readers
var statusIconCurrent = '<span class="tooltip-status" alt="' + statusTextCurrent + '"><i class="fa fa-check-circle fa-1x text-success"></i><span class="tooltip-status-text">' + statusTextCurrent + '</span></span>';
var statusIconReview = '<span class="tooltip-status" alt="' + statusTextReview + '"><i class="fa fa-question-circle fa-1x text-warning"></i><span class="tooltip-status-text">' + statusTextReview + '</span></span>';
var statusIconRemoved = '<span class="tooltip-status" alt="' + statusTextRemoved + '"><i class="fa fa-times-circle fa-1x text-danger"></i><span class="tooltip-status-text">' + statusTextRemoved + '</span></span>';

      

//******************
// ON DOCUMENT LOAD
//******************

// on page load, load all markers and activities and setup listeners
$(document).ready(function(){ //waits until the DOM has loaded
    //stops chaching of ajax requests so that the back button re-queries the database (as updates could have happened while they where away)
    $.ajaxSetup({ cache: false });
    
    //if any filter queries are saved then populate the fields (stored in searchIndex.js activityFilter()
    if(localStorage.getItem("activityFilterLocation")){ $('#setLocationInput').val(localStorage.getItem("activityFilterLocation")); }
    if(localStorage.getItem("activityFilterSearchQuery")){ $('#searchQueryInput').val(localStorage.getItem("activityFilterSearchQuery")); }
    if(localStorage.getItem("activityFilterDistance")){ $('#setDistanceInput').val(localStorage.getItem("activityFilterDistance")); }
    
    if(localStorage.getItem("activityFilterOrderByLocation")){ $('#orderDistanceCheck').prop('checked', true); }
    if(localStorage.getItem("activityFilterOrderByDateUpdated")){ $('#orderDateUpdatedCheck').prop('checked', true); }
    if(localStorage.getItem("activityFilterOrderByLoves")){ $('#orderLovesCheck').prop('checked', true); }
    
    if(localStorage.getItem("activityFilterStatusCurrent")){ $('#currentStatusCheck').prop('checked', false); }
    if(localStorage.getItem("activityFilterStatusReview")){ $('#reviewStatusCheck').prop('checked', true); }
    if(localStorage.getItem("activityFilterStatusRemoved")){ $('#removedStatusCheck').prop('checked', true); }
    
    if(localStorage.getItem("activityFilterAgeAdult")){ $('#adultsCheck').prop('checked', false); }
    if(localStorage.getItem("activityFilterAgeChildren")){ $('#childrenCheck').prop('checked', false); }
    
    if(localStorage.getItem("activityFilterSuitableLearning")){ $('#learningDisabilitiesCheck').prop('checked', false); }
    if(localStorage.getItem("activityFilterSuitablePhysical")){ $('#physicalDisabilitiesCheck').prop('checked', false); }
    
    if(localStorage.getItem("activityFilterTypeDaily")){ $('#dailyActivitiesCheck').prop('checked', false); }
    if(localStorage.getItem("activityFilterTypeWeekly")){ $('#weeklyActivitiesCheck').prop('checked', false); }
    if(localStorage.getItem("activityFilterTypeMonthly")){ $('#monthlyActivitiesCheck').prop('checked', false); }
    if(localStorage.getItem("activityFilterTypeAnnual")){ $('#annualActivitiesCheck').prop('checked', false); }
    if(localStorage.getItem("activityFilterTypeOneOff")){ $('#oneOffEventsCheck').prop('checked', false); }
    if(localStorage.getItem("activityFilterTypeBookYourself")){ $('#bookYourselfCheck').prop('checked', false); }

    
    //on load search for activities
    //this is useful because if the page returns and repopulates existing content fields then it will re-run the search, which gives a better user experience
    initMasonry();
    newSearch();
    
    //on load, if no location input has no value, then autofocus
    if(!($('#setLocationInput').val())){
        $('#setLocationInput').focus();
    }
    
    //regularly store the map zoom and center so they can be returned when coming back to this page
    window.setInterval(function() {
        // $(window).focus(function() { //if the user has multiple tabs open then the map location of the current tab will be stored
            if (typeof(Storage) !== "undefined") {    
                localStorage.setItem("mapZoomBrowserStorage", map.getZoom());
                localStorage.setItem("mapCenterLatBrowserStorage", map.getCenter().lat());
                localStorage.setItem("mapCenterLngBrowserStorage", map.getCenter().lng());
                
                // console.log("map.getZoom(): " + map.getZoom());
                // console.log("map.getCenter(): " + map.getCenter());
                
                // console.log("localStorage.getItem('mapZoomBrowserStorage'): " + localStorage.getItem("mapZoomBrowserStorage"));
                // console.log("localStorage.getItem('mapCenterBrowserStorage'): " + localStorage.getItem("mapCenterBrowserStorage"));
                
                // console.log("localStorage.getItem('mapCenterLatBrowserStorage'): " + localStorage.getItem("mapCenterLatBrowserStorage"));
                // console.log("localStorage.getItem('mapCenterLngBrowserStorage'): " + localStorage.getItem("mapCenterLngBrowserStorage"));
            }
        // });
    }, 500);
    
    
    //TEMPORARY HACK TO FIX THE MASONRY BUG OF OVERLAPPING IMAGES ON PAGE LOAD
    window.setInterval(function() {
        reloadMasonryLayout();
    }, 500);
    
    
    //ON PAGE LOAD IF CONTENT EXISTS (e.g. when the user presses back on the browser)
    if($('#searchQueryInput').val()){
        $('#searchQueryClearBtn').show();
    }
    if($('#setLocationInput').val()){
        $('#findNearMeClearBtn').show();
    }
    
    //disabled distance order on load if no location value is present
    if($('#orderDistanceCheck').prop('checked')){
        $('#orderDistanceCheck').attr("disabled", false);
    }
    
    //ON PAGE LOAD, set the values of the filter clearAll/showAll buttons
    if(
        !($('#currentStatusCheck').prop('checked')) &&
        !($('#reviewStatusCheck').prop('checked')) &&
        !($('#removedStatusCheck').prop('checked'))
        ){
            $('#statusCheckboxToggle').html('Select All');
    }
    if(
        !($('#adultsCheck').prop('checked')) &&
        !($('#childrenCheck').prop('checked'))
        ){
            $('#agesCheckboxToggle').html('Select All');
    }
    if(
        !($('#learningDisabilitiesCheck').prop('checked')) &&
        !($('#physicalDisabilitiesCheck').prop('checked'))
        ){
            $('#suitableCheckboxToggle').html('Select All');
    }
    if(
        !($('#dailyActivitiesCheck').prop('checked')) &&
        !($('#weeklyActivitiesCheck').prop('checked')) &&
        !($('#monthlyActivitiesCheck').prop('checked')) &&
        !($('#annualActivitiesCheck').prop('checked')) &&
        !($('#oneOffEventsCheck').prop('checked')) &&
        !($('#bookYourselfCheck').prop('checked'))
        ){
            $('#typeCheckboxToggle').html('Select All');
    }
});
    

//*************
//LISTENERS
//*************

//when search button is clicked, filter results
$('#findNearMeBtn').on('click', function(){
    //as a search by distance is being run, set the ordering distance if something is entered
    if($("#setLocationInput").val()){
        $('#orderDistanceCheck').attr("disabled", false);
        $('#orderDistanceCheck').prop('checked', true);
    }
    newSearch();
});

$('#searchQueryBtn').on('click', function(){
    newSearch();
});

//on clicking on the "Find Activities" label focus on the "location" input box
$('#locationInputLabel').on('click', function() {
    $('#setLocationInput').focus();
});
//on clicking on the "Search Activities" label focus on the "query" input box
$('#searchActivitiesInputLabel').on('click', function() {
    $('#searchQueryInput').focus();
});


//when typing in text search input or location search input, if enter is pressed run the search
$('#searchQueryInput,#setLocationInput').keyup(function(e){
    if(e.keyCode==13){ //remove this if statement to get constant search (but this doesn't work well with the marker drop animation)
        //if the input was the "setLocationInput" then change the order to distance
        if(this.id === "setLocationInput" && $(this).val()){
            $('#orderDistanceCheck').attr("disabled", false);
            $('#orderDistanceCheck').prop('checked', true);
        }
        $(this).blur(); //should minimise the keyboard on mobile
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

//on clicking on any of the order buttons run a filter again with existing data
$('.radio-checkmark-input').on('change', function(){
    existingDataSearch();
});


//***************************************
//AUTO OPEN AND CLOSE OF MORE FILTERS DIV
//open filters box when focus is on either query input box
$('#searchQueryInput,#setLocationInput').focus(function(e){
    $('#collapseMoreFilters').collapse("show");
    $('#moreFiltersBtn').addClass("active");
    $('#moreFiltersBtn').html('<i class="fa fa-arrow-up"></i> Refine Search <i class="fa fa-arrow-up"></i>');
    event.stopPropagation();
});

//stop box from closing when you clicking on the filters div
$('#collapseMoreFilters').on('click', function(){
    event.stopPropagation();
});

//if the user clicks anywhere else (except those outlined above) close the filters div
$(window).click(function() {
    //if focus is not on the input boxes
    if(!($('#searchQueryInput,#setLocationInput').is(":focus"))){
        $('#collapseMoreFilters').collapse("hide");
        $('#moreFiltersBtn').removeClass("active");
        $('#moreFiltersBtn').html('<i class="fa fa-arrow-down"></i> Refine Search <i class="fa fa-arrow-down"></i>');
    }
});
//***************************************



//*******************
//TESTING SEARCH ON EVERY KEY PRESS IN SEARCH FIELD
//CAN KEEP THE ABOVE CODE AS THAT WILL STILL CHECK IF ENTER IS PRESSES
//THIS MIGHT HAMMER THE DATABASE, BUT I CAN MONITOR THIS.
//when typing in text search input run the search on every keypress

//Removed as it was sometimes returning wrong results if there was a network latency

// $('#searchQueryInput').keyup(function(e){
//     newSearch();
//     //code to show and hide the clear input box button
//     if($(this).val()){
//         $('#searchQueryClearBtn').show();
//     } else {
//         $('#searchQueryClearBtn').hide();
//     }
// });
//*******************


//on enter keypress in the distance input, run a filter
$('#setDistanceInput').keyup(function(e){
    if(e.keyCode==13){
        $(this).blur(); //should minimise the keyboard on mobile
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

//if the cross button is clicked on the location search box, clear the input and run the search again
$('#findNearMeClearBtn').on('click', function(){
    $('#findNearMeClearBtn').hide();
    $('#setLocationInput').val('');
    
    //reset map zoom to whole map
    map.setCenter(mapInitCenter);
    map.setZoom(mapInitZoom);
    newSearch();
});



//MAP KEY FILTERS LISTENERS
$('#activity-index-map').on('click', '#allAgesKeyDiv,#adultsKeyDiv,#childrenKeyDiv', async function(){
//put the actual check boxes in the "Refine Search" section, as that will be part of the DOM on page load, and will filter correctly
//these icons will just toggle them
    await mapKeyClickFunction(this);
    existingDataSearch();

});
//hover effect
//the global variable mapKeyOpacityVar is set on click of the markers to the new opacity after click
$('#activity-index-map').on('mouseenter', '#allAgesKeyDiv,#adultsKeyDiv,#childrenKeyDiv', function( event ) {
    mapKeyOpacityVar = $(this).css('opacity');
    $(this).css('opacity', '0.6');
}).on('mouseleave', '#allAgesKeyDiv,#adultsKeyDiv,#childrenKeyDiv', function( event ) {
    $(this).css('opacity', mapKeyOpacityVar);
});



//FILTER BOX LISTENERS
$('#moreFiltersBtn').on('click', function(){
    if($(this).hasClass('active')){
        $('#collapseMoreFilters').collapse("hide");
        $(this).removeClass('active');
        $(this).html('<i class="fa fa-arrow-down"></i> Refine Search <i class="fa fa-arrow-down"></i>');
    } else {
        $('#collapseMoreFilters').collapse("show");
        $(this).addClass('active');
        $(this).html('<i class="fa fa-arrow-up"></i> Refine Search <i class="fa fa-arrow-up"></i>');
    }
    event.stopPropagation(); //stops box from closing when the button is clicked due to the listener on the html element
});

//Ages checkboxes
$('#adultsCheck,#childrenCheck').on('click', async function(){

    //this if statement is a hack to get around the check boxes double flipping when it's clicked and then evaluated mapKeyFilter() function
    if($(this).prop('checked')) {
        $(this).prop('checked', false);
    } else {
        $(this).prop('checked', true);
    }
    
    await mapKeyUpdateFunction(this);
    existingDataSearch();
});

//listen to clicks on any other check boxes
$('.checkbox-input').on('click', function(){
    existingDataSearch();
});

//on clicking a select/clear all buttons
$('#statusCheckboxToggle,#agesCheckboxToggle,#suitableCheckboxToggle,#typeCheckboxToggle').on('click', function(){
    var checkBoxes;
    
    if(this.id === "statusCheckboxToggle"){
        checkBoxes = '#currentStatusCheck,#reviewStatusCheck,#removedStatusCheck';
    } else if(this.id === "agesCheckboxToggle"){
        checkBoxes = '#adultsCheck,#childrenCheck';
        
        
    } else if(this.id === "suitableCheckboxToggle"){
        checkBoxes = '#learningDisabilitiesCheck,#physicalDisabilitiesCheck';
    } else {
        checkBoxes = '#dailyActivitiesCheck,#weeklyActivitiesCheck,#monthlyActivitiesCheck,#annualActivitiesCheck,#oneOffEventsCheck,#bookYourselfCheck';
    }
         
    if($(this).html() === "Clear All"){
        $(checkBoxes).prop('checked', false);
        $(this).html('Select All');
        existingDataSearch();
    } else {
        $(checkBoxes).prop('checked', true);
        $(this).html('Clear All');
        existingDataSearch();
    }
    
    //need to reset the mapkey icons if that was the clear/select all button that was pressed
    //simplest way to do that is re-initialise the map, which is a lot of overhead but it shouldn't be clicked that often
    if(this.id === "agesCheckboxToggle"){
        initActivityIndexMap();
    }
});


//LOAD MORE LISTENER
//load more activities from the filtered list
$('#loadMoreBtn').on('click', function(){
    addMoreActivities(filteredActivities);
});