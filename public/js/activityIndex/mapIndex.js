/* global $ */
/* global google */

function initActivityIndexMap() {
    //set correct map zoom based on screen width
    if($(window).width() > 500){
        mapInitZoom = 6;
    } else {
        mapInitZoom = 5;
    }
    
    //if a zoom level has been stored in the browser then set mapInitZoom and mapInitCenter
    if (typeof(Storage) !== "undefined") {
        if(localStorage.getItem("mapZoomBrowserStorage")) {
            mapInitZoom = Number(localStorage.getItem("mapZoomBrowserStorage"));
        }
        if(localStorage.getItem("mapCenterLatBrowserStorage") && localStorage.getItem("mapCenterLngBrowserStorage")) {
            mapInitCenter = {lat: Number(localStorage.getItem("mapCenterLatBrowserStorage")), lng: Number(localStorage.getItem("mapCenterLngBrowserStorage")) };
        }
    }
    
    map = new google.maps.Map(document.getElementById('activity-index-map'), {
        zoom: mapInitZoom,
        center: mapInitCenter,
        // scrollwheel: false,
        gestureHandling: 'cooperative',
        mapTypeControl: false,
        streetViewControl: false,
        scaleControl: false,
        fullscreenControl: false,
        clickableIcons: false
    });
    
    var mapKeyDiv = document.createElement('div');
    
    var allAgesKeyDivOpacity = '';
    var adultsKeyDivOpacity = '';
    var childrenKeyDivOpacity = '';
    
    //check the value of the input boxes so the markers have the correct opacity when created
    if(!($('#adultsCheck').prop('checked')) && !($('#childrenCheck').prop('checked'))) {
        allAgesKeyDivOpacity = 'style="opacity: 0.2;" ';
    }
    if(!($('#adultsCheck').prop('checked'))) {
        adultsKeyDivOpacity = 'style="opacity: 0.2;" ';
    }
    if(!($('#childrenCheck').prop('checked'))) {
        childrenKeyDivOpacity = 'style="opacity: 0.2;" ';
    }
    
    var mapKeyHtml = '<div class="d-flex flex-row mb-1">' +
                        '<div id="allAgesKeyDiv" ' + allAgesKeyDivOpacity + 'class="d-flex flex-column align-items-center mr-2 mapKeyDiv">' +
                            '<img src="/img/Brown.svg" alt="All Ages Map Icon Brown"</img>' +
                            '<span>All Ages<span>' +
                        '</div>' +
                        '<div id="adultsKeyDiv" ' + adultsKeyDivOpacity + 'class="d-flex flex-column align-items-center mr-2 mapKeyDiv">' +
                            '<img src="/img/Blue.svg" alt="Adult Map Icon Blue"</img>' +
                            '<span>Adults</span>' +
                        '</div>' +
                        '<div id="childrenKeyDiv" ' + childrenKeyDivOpacity + 'class="d-flex flex-column align-items-center mapKeyDiv">' +
                            '<img src="/img/Aqua.svg" alt="Children Map Icon Light Blue"</img>' +
                            '<span>Children</span>' +
                        '</div>' +
                    '</div>';
                        
    
    // Set CSS for the control border.
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.borderRadius = '30px 30px 0px 0px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Activity Map Key';
    mapKeyDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    var controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontSize = '16px';
    controlText.style.paddingTop = '5px';
    controlText.style.paddingBottom = '5px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.innerHTML = mapKeyHtml;
    controlUI.appendChild(controlText);
    
    mapKeyDiv.index = 1;
    map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(mapKeyDiv);
    
}




async function addMarkers(activities){
    clearMarkers(); //clear existing markers before adding new ones
    if(markerCluster){ //clears cluster icons off map
        markerCluster.clearMarkers();
    }
    
    //you already have the list of activities
    //so split this into two lists, one with duplicates and one without
    //the without list just creates normal markers
    //the with list creates one marker and info window for each set of duplicates (gold star marker icon?) with a list of the stacked activities
    
    var singleMarkerActivities = await filterSingleMarkerActivities(activities);
    var clusterMarkerLocations = await filterClusterMarkerActivities(activities);
    
    // Loop through the results array and place a marker for each set of coordinates
    await $.each(singleMarkerActivities, async function(index) {
        var marker = await standardMarkerCreate(this); //create new standard marker
        standardMarkerInfoWindow(this, marker); //create standard marker info window
        markers.push(marker); //add the newly created standard marker onto the markers array
    });
    
    await $.each(clusterMarkerLocations, async function(index) {
        var clusterMarker = await clusterMarkerCreate(this); //create new cluster marker using just the location
        clusterMarkerInfoWindow(this, clusterMarker, activities); //create cluster marker info window, and find all activities with that location
        markers.push(clusterMarker); //add the newly created clustered marker onto the markers array
    });
    
    // Initialise map clustering
    markerCluster = new MarkerClusterer(map, markers, {imagePath: '/js/lib/GoogleMapsClustering/m'});
    
    //Hack to stop the map zooming in when you drag on a cluster
    google.maps.event.addListener(map,'dragstart',function(){ markerCluster.zoomOnClick_=false;}); 
    google.maps.event.addListener(map,'mouseup',function(){setTimeout(function(){ markerCluster.zoomOnClick_=true;},50);});
    
    return activities; //need to return the activities so it can be passed through to the activityIndex functions
}



function filterSingleMarkerActivities(activities){
    var singleMarkerActivities = [];
    
    $.each(activities, function(){
        //if the array only contains one element with that 'location' value (itself), then store it in the singleMarkerActivities array
        var count = 0;
        for(var i = 0; i < activities.length; ++i){
            if(activities[i].location === this.location)
                count++;
        }
        if(count === 1) {
            singleMarkerActivities.push(this);
        }
    });
    return singleMarkerActivities;
}

function filterClusterMarkerActivities(activities){
    var clusterMarkerActivities = [];
    
    $.each(activities, function(){
        var count = 0;
        for(var i = 0; i < activities.length; ++i){
            if(activities[i].location === this.location)
                count++;
        }
        if(count > 1) { //if count is greater than one, there must be two activities at the same location
            clusterMarkerActivities.push(this);
        }
    });
    
    //create a new array of only locations (which will still contain duplicates)
    var clusterLocations = []; //[{location: <location>, lat: <lat>, lng: <lng>}]
    
    $.each(clusterMarkerActivities, function(i){
        var object = {};
        object.location = this.location;
        object.lat = this.lat;
        object.lng = this.lng;
        clusterLocations[i] = object;
    });

    //then filter that array to be only unique locations
    return removeDuplicateLocations(clusterLocations, 'location');
}

function removeDuplicateLocations(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
}



function standardMarkerCreate(currentActivity){
    //check age range of current activity and set marker color
    var image;
    if(currentActivity.age.isAdult && currentActivity.age.isChild) {
        image = {url: '/img/Brown.svg'};
    } else if(currentActivity.age.isChild) {
        image = {url: '/img/Aqua.svg'};
    } else {
        image = {url: '/img/Blue.svg'};
    }
    
    //set lat and lng from activity
    var latLng = new google.maps.LatLng(currentActivity.lat, currentActivity.lng);
    
    //create marker
    var marker = new google.maps.Marker({
        position: latLng,
        map: map,
        icon: image,
        //animation: google.maps.Animation.DROP,
        title: currentActivity.name
    });
    
    return marker;
}

function standardMarkerInfoWindow(currentActivity, marker){
    //set the tooltip content for the status icons
    var statusIcon;
    if(currentActivity.status === "current"){
        statusIcon = statusIconCurrent;
    } else if(currentActivity.status === "review"){
        statusIcon = statusIconReview;
    } else {
        statusIcon = statusIconRemoved;
    }
    
    var activityAge = '';
    if(currentActivity.age.isChild && currentActivity.age.isAdult) { 
        activityAge = 'All Ages';
    } else if(currentActivity.age.isChild) {
        activityAge = 'Children';
    } else if(currentActivity.age.isAdult) {
        activityAge = 'Adults';
    }
        
        
    var activitySuitable = '';
    if(currentActivity.suitable.isPhysical && currentActivity.suitable.isLearning) { 
        activitySuitable = 'All Abilities';
    } else if(currentActivity.suitable.isPhysical) {
        activitySuitable = 'Physical Disabilities';
    } else if(currentActivity.suitable.isLearning) {
        activitySuitable = 'Learning Disabilities';
    }

    //create content for infowindow
    var content =  '<div id="iw-container">' +
                        
                        '<div class="iw-title">' + 
                            '<div class="d-flex flex-row">' +
                                '<div class="mr-1">' +
                                    statusIcon + 
                                '</div>' +
                                '<div>' +
                                    '<a class="text-white" href="/activities/' + currentActivity._id + '">' + currentActivity.name + '</a>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                        
                        '<div class="iw-content pb-0">' +
                            
                            '<div class="d-flex justify-content-between align-items-start">' +
                                '<div>' +
                                    '<div class="iw-subTitle">Summary</div>' +
                                    '<p class="mb-1">' + currentActivity.summary + '</p>' +
                                '</div>' +
                            '</div>' +

                            '<a class="btn btn-primary btn-block mt-1 border" href="/activities/' + currentActivity._id + '">View Activity Page</a><br>' +
                            
                            '<hr class="mb-1 mt-0">' +
                            
                            '<div class="d-flex align-items-start">' +
                                '<div class="mr-5">' +
                                    '<div class="iw-subTitle">Ages</div>' +
                                    '<p class="mb-1">' + activityAge + '</p>' +
                                '</div>' +
                                '<div>' +
                                    '<div class="iw-subTitle">Suitable for</div>' +
                                    '<p class="mb-1">' + activitySuitable + '</p>' +
                                '</div>' +
                            '</div>' +
                            
                            '<hr class="mb-1 mt-0">' +
                            
                            '<div class="d-flex align-items-start">' +
                                '<div class="mr-3">' +
                                    '<div class="iw-subTitle">Type</div>' +
                                    '<p class="mb-1">' + currentActivity.frequency + '</p>' +
                                '</div>' +
                                '<div>' +
                                    '<div class="iw-subTitle">When</div>' +
                                    '<p class="mb-1">' + currentActivity.when + '</p>' +
                                '</div>' +
                            '</div>' +
                            
                            '<hr class="mb-2 mt-0">' +
                            
                            '<div class="d-flex flex-row justify-content-around mb-2">' +
                                '<span class="fa-stack fa-1x sociable-love mr-3">' +
                                    '<i class="fa fa-heart fa-stack-2x heart-offset"></i>' +
                                    '<span class="fa-stack-1x text-white">' + (currentActivity.loves.length) + '</span>' +
                                '</span>' +
                                '<span class="fa-stack fa-1x sociable-comment">' +
                                    '<i class="fa fa-comment fa-stack-2x comment-offset"></i>' +
                                    '<span class="fa-stack-1x text-white">' + (currentActivity.comments.length) + '</span>' +
                                '</span>' +
                            '</div>' +
                            '<hr style="height:3px;border:none;color:#333;background-color:#333;" />' +
                            
                        '</div>' +
                        '<div class="iw-bottom-gradient"></div>' +
                    '</div>';
    
    //add content to infowindow
    var infowindow = new google.maps.InfoWindow({
            content: content
        });
    
    //close other info windows when opening a new one
    marker.addListener('click', function() {
        closeLastOpenedInfoWindow(); //close the last opened info window
        infowindow.open(map, marker); // open the new info window
        lastOpenedInfoWindow = infowindow; // set the new "last opened info window" value to the current info window
    });
    google.maps.event.addListener(map, "click", function(event) {
        infowindow.close();
    });
    
    styleInfoWindowListener(infowindow);
    
}


function clusterMarkerCreate(location){
    var image = {url: '/img/clusteredPin.svg'};
    
    //set lat and lng from activity
    var latLng = new google.maps.LatLng(location.lat, location.lng);
    
    //create marker
    var marker = new google.maps.Marker({
        position: latLng,
        map: map,
        icon: image,
        title: "Click for more info"
    });
    
    return marker;
}

function clusterMarkerInfoWindow(locationObj, clusterMarker, activities){

    //for each activity in activities that has the current location, add it's data to the data array
    var activitiesInCluster = [];
    
    $.each(activities, function(i){
        if(this.location === locationObj.location){
            activitiesInCluster.push(this);
        }
    });
    
    var stringTest = '';
    
    //create content for infowindow
    var contentStart =  '<div id="iw-container">' +
                        
                        '<div class="iw-title">' + 
                            '<div class="d-flex flex-row">' +
                                '<div>' +
                                    '<a class="text-white"><strong>Multiple Activities at:</strong> ' + locationObj.location + '</a>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                        
                        '<div class="iw-content pb-0">' +
                            
                            '<div class="d-flex flex-column">';
                                
    var contentMiddle = '';
    
    var contentEnd =        '</div>' +
                            
                            '<hr style="height:3px;border:none;color:#333;background-color:#333;" />' +

                        '</div>' +
                        '<div class="iw-bottom-gradient"></div>' +
                    '</div>';
                    
    
    $.each(activitiesInCluster, function(i){
        //set the tooltip content for the status icons for each activity in the cluster
        var statusIcon;
        if(this.status === "current"){
            statusIcon = statusIconCurrent;
        } else if(this.status === "review"){
            statusIcon = statusIconReview;
        } else {
            statusIcon = statusIconRemoved;
        }
        
        contentMiddle +=    '<div>' +
                                '<div class="iw-subTitle"><a href="/activities/' + this._id + '">' + statusIcon + ' ' + this.name + '</a></div>' +
                                '<p class="mb-1">' + this.summary + '</p>' +
                            '</div>';
    });     
    
                    
    var content = contentStart + contentMiddle + contentEnd;
    
    //add content to infowindow
    var infowindow = new google.maps.InfoWindow({
            content: content
        });
    
    //close other info windows when opening a new one
    clusterMarker.addListener('click', function() {
        closeLastOpenedInfoWindow(); //close the last opened info window
        infowindow.open(map, clusterMarker); // open the new info window
        lastOpenedInfoWindow = infowindow; // set the new "last opened info window" value to the current info window
    });
    google.maps.event.addListener(map, "click", function(event) {
        infowindow.close();
    });
    
    styleInfoWindowListener(infowindow);
    
}


function closeLastOpenedInfoWindow() {
    if (lastOpenedInfoWindow) {
        lastOpenedInfoWindow.close();
    }
}

function clearMarkers() {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers = [];
    
    
}



function styleInfoWindowListener(infowindow){
    //style info window content
    google.maps.event.addListener(infowindow, 'domready', function() {
        // Reference to the DIV that wraps the bottom of infowindow
        var iwOuter = $('.gm-style-iw');
    
        /* Since this div is in a position prior to .gm-div style-iw.
         * We use jQuery and create a iwBackground variable,
         * and took advantage of the existing reference .gm-style-iw for the previous div with .prev().
        */
        var iwBackground = iwOuter.prev();
    
        // Removes background shadow DIV
        iwBackground.children(':nth-child(2)').css({'opacity' : '0'});
    
        // Removes white background DIV
        iwBackground.children(':nth-child(4)').css({'opacity' : '0'});
        
        // Changes the desired tail shadow color.
        iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'rgba(72, 181, 233, 0.6) 0px 1px 6px', 'z-index' : '1'});
    
        //hack to get around the fact that the divs (2 and 4 above) don't disappear so you can't click through to the map
        //so instead when you click it, the infowindow closes
        iwBackground.click(function(){
            closeLastOpenedInfoWindow();
        });
    
        // Reference to the div that groups the close button elements.
        var iwCloseBtn = iwOuter.next();
        
        // Apply the desired effect to the close button
        iwCloseBtn.css({opacity: '0'});
        
        // If the content of infowindow not exceed the set maximum height, then the gradient is removed.
        if($('.iw-content').height() < 250){
            $('.iw-bottom-gradient').css({display: 'none'});
        }
        
        //stop the old close button from appearing when you mouse over it
        iwCloseBtn.mouseover(function(){
            $(this).css({opacity: '0'});
        });
        iwCloseBtn.mouseout(function(){
            $(this).css({opacity: '0'});
        });
    
    });
}