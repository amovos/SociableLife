/* global google */
/* global $ */

var map;
var zoom;
var markers = [];
var lastOpenedInfoWindow;



function initActivityIndexMap() {
    
    //set correct map zoom based on screen width
    if($(window).width() > 500){
        zoom = 6;
    } else {
        zoom = 5;
    }
    
    map = new google.maps.Map(document.getElementById('activity-index-map'), {
        zoom: zoom,
        center: {lat: 54.4800, lng: -4.1000 },
        scrollwheel: false,
        //gestureHandling: 'cooperative',
        mapTypeControl: false,
        streetViewControl: false,
        scaleControl: false,
        fullscreenControl: false
    });
}

function addMarkers(activities){
    clearMarkers(); //clear existing markers before adding new ones
    
    // Loop through the results array and place a marker for each set of coordinates
    $.each(activities, function(index) {
        var currentActivity = this;
        
        //check age range of current activity and set marker color
        var image;
        if(currentActivity.age === 'All Ages') {
            image = {url: '/img/Brown.svg'};
        } else if(currentActivity.age === 'Children') {
            image = {url: '/img/Aqua.svg'};
        } else {
            image = {url: '/img/Blue.svg'};
        }
        
        window.setTimeout(function() { //animation delay function
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
            
            markers.push(marker); //add the newly created marker onto the markers array
            
            //create content for infowindow
            var content =  '<div id="iw-container">' +
                                '<div class="iw-title">' + currentActivity.name + '</div>' +
                                '<div class="iw-content">' +
                                    '<div>' +
                                        '<img src="' + currentActivity.image + '">' + //need to add thumbnail sizes to this cloudinary image so it doesn't load all the massive images each time
                                    '</div>' +
                                    
                                    '<div class="iw-subTitle">Summary</div>' +
                                    '<p>' + currentActivity.description + '</p>' +
                                    
                                    '<p><a class="btn btn-primary" href="https://google.com">Activity Website</a><br>' +
                                    
                                    '<div class="iw-subTitle">Ages</div>' +
                                    '<p>All Ages<p>' +
                                    
                                    '<div class="iw-subTitle">Ages</div>' +
                                    '<p>All Abilities<p>' +
                                    
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
                iwBackground.children(':nth-child(2)').css({'display' : 'none'});
            
                // Removes white background DIV
                iwBackground.children(':nth-child(4)').css({'display' : 'none'});
                
                // Changes the desired tail shadow color.
                iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'rgba(72, 181, 233, 0.6) 0px 1px 6px', 'z-index' : '1'});
            
                // Reference to the div that groups the close button elements.
                var iwCloseBtn = iwOuter.next();
            
                // Apply the desired effect to the close button
                iwCloseBtn.css({
                    opacity: '1', 
                    right: '40px', 
                    top: '3px', 
                    width: '25px', 
                    height: '25px', 
                    border: '6px solid #1166c6', 
                    'border-radius': '12px', 
                    'box-shadow': '0 0 5px #3990B9'}
                );
            
                // The API automatically applies 0.7 opacity to the button after the mouseout event. This function reverses this event to the desired value.
                iwCloseBtn.mouseout(function(){
                  $(this).css({opacity: '1'});
                });
            });
            
        }, index*0); //(1000/activities.length)); //set delay time for drop animation
    });
    return activities; //need to return the activities so it can be passed through to the activityIndex functions
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