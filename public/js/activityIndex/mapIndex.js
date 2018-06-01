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
    
    
    var mapKeyDiv = document.createElement('div');
    
    var mapKeyHtml = '<div class="d-flex flex-row">' +
                        '<div class="d-flex flex-column align-items-center mr-2">' +
                            '<img src="/img/Brown.svg"</img>' +
                            'All Ages' +
                        '</div>' +
                        '<div class="d-flex flex-column align-items-center mr-2">' +
                            '<img src="/img/Blue.svg"</img>' +
                            'Adults' +
                        '</div>' +
                        '<div class="d-flex flex-column align-items-center">' +
                            '<img src="/img/Aqua.svg"</img>' +
                            'Children' +
                        '</div>' +
                    '</div>';
                        
    
    // Set CSS for the control border.
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.borderRadius = '5px';
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
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(mapKeyDiv);
    
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
        
        
        
        //DUPLICATE CODE FROM ACTIVITYINDEX.JS
        var statusIcon;
        var statusText;
        //adding alt text to the span surrounding the icon makes it accessible to screen readers
        if(currentActivity.status === "current"){
            statusText = '<strong>Current Info</strong><br>This activity has been checked or updated in the last 6 months';
            statusIcon = '<span class="tooltip-status" alt="' + statusText + '"><i class="fa fa-check-circle fa-1x text-success"></i><span class="tooltip-status-text">' + statusText + '</span></span>';
           
        } else {
            statusText = '<strong>Out of date</strong><br>This activity has not been checked or updated in the last 6 months. The information might be out of date.';
            statusIcon = '<span class="tooltip-status" alt="' + statusText + '"><i class="fa fa-question-circle fa-1x text-danger"></i><span class="tooltip-status-text">' + statusText + '</span></span>';
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
                                        '<p>' + currentActivity.summary + '</p>' +
                                    '</div>' +
                                '</div>' +

                                
                                '<div class="d-flex align-items-start">' +
                                    '<div class="mr-5">' +
                                        '<div class="iw-subTitle">Ages</div>' +
                                        '<p>' + currentActivity.age + '</p>' +
                                    '</div>' +
                                    '<div>' +
                                        '<div class="iw-subTitle">Suitable for</div>' +
                                        '<p>' + currentActivity.suitable + '</p>' +
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
                                
                                '<a class="btn btn-primary btn-block " href="/activities/' + currentActivity._id + '">More Info</a><br>' +
                                
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
                right: '42px', 
                top: '3px', 
                width: '25px', 
                height: '25px', 
                border: '6px solid #1166c6', 
                'border-radius': '12px', 
                'box-shadow': '0 0 5px #3990B9'}
            );
            
            
            // If the content of infowindow not exceed the set maximum height, then the gradient is removed.
            if($('.iw-content').height() < 250){
                $('.iw-bottom-gradient').css({display: 'none'});
            }
        
            // The API automatically applies 0.7 opacity to the button after the mouseout event. This function reverses this event to the desired value.
            iwCloseBtn.mouseout(function(){
              $(this).css({opacity: '1'});
            });
        });
            
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