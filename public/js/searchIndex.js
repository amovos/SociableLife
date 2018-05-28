/* global $ */
/* global addMarkers */
/* global addActivities */

// on page load, load all markers and activities
$(document).ready(function(){ //waits until the DOM has loaded
    $.getJSON("/api/activities/")
        .then(addMarkers) //this function returns the activities object that can be used in the next chain of the promise
        .then(addActivities);

    $('#TextBoxId').keypress(function(e){
      if(e.keyCode==13)
      $('#linkadd').click();
    });

    //when search button is clicked, filter results
    $('#searchQueryBtn').on('click', function(){ //the list is there on page load, but the li isn't so attach the listener to the list, then specify li inside which can be created after page load
        activitySearch();
    });

    //when typing in text input, if enter is pressed run the search
    $('#searchQueryInput').keypress(function(e){
      if(e.keyCode==13){
        activitySearch();
      }
    });
});

function activitySearch(){
    var searchQuery = $('#searchQueryInput').val();
    $.getJSON("/api/activities/" + searchQuery)
    .then(addMarkers) //this function returns the activities object that can be used in the next chain of the promise
    .then(addActivities);
}