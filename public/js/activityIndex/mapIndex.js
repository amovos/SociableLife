/* global $ */
/* global google */

function initActivityIndexMap() {
    
    //set correct map zoom based on screen width
    if($(window).width() > 500){
        mapInitZoom = 6;
    } else {
        mapInitZoom = 5;
    }
    
    map = new google.maps.Map(document.getElementById('activity-index-map'), {
        zoom: mapInitZoom,
        center: mapInitCenter,
        scrollwheel: false,
        //gestureHandling: 'cooperative',
        mapTypeControl: false,
        streetViewControl: false,
        scaleControl: false,
        fullscreenControl: false
    });
    
    
    var mapKeyDiv = document.createElement('div');
    
    var allAgesKeyDivOpacity = '';
    var adultsKeyDivOpacity = '';
    var childrenKeyDivOpacity = '';
    
    //check the value of the input boxes so the markers have the correct opacity when created
    if(!($('#allAgesCheck').prop('checked'))) {
        allAgesKeyDivOpacity = 'style="opacity: 0.2;" ';
    }
    if(!($('#adultsCheck').prop('checked'))) {
        adultsKeyDivOpacity = 'style="opacity: 0.2;" ';
    }
    if(!($('#childrenCheck').prop('checked'))) {
        childrenKeyDivOpacity = 'style="opacity: 0.2;" ';
    }
    
    var mapKeyHtml = '<div class="d-flex flex-row">' +
                        '<div id="allAgesKeyDiv" ' + allAgesKeyDivOpacity + 'class="d-flex flex-column align-items-center mr-2 mapKeyDiv">' +
                            '<img src="/img/Brown.svg"</img>' +
                            '<span>All Ages<span>' +
                        '</div>' +
                        '<div id="adultsKeyDiv" ' + adultsKeyDivOpacity + 'class="d-flex flex-column align-items-center mr-2 mapKeyDiv">' +
                            '<img src="/img/Blue.svg"</img>' +
                            '<span>Adults</span>' +
                        '</div>' +
                        '<div id="childrenKeyDiv" ' + childrenKeyDivOpacity + 'class="d-flex flex-column align-items-center mapKeyDiv">' +
                            '<img src="/img/Aqua.svg"</img>' +
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
    map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(mapKeyDiv);
    
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
        
        //set the tooltip content for the status icons
        var statusIcon;
        var statusText;
        if(currentActivity.status === "current"){
            statusText = statusTextCurrent;
            statusIcon = statusIconCurrent;
        } else if(currentActivity.status === "review"){
            statusText = statusTextReview;
            statusIcon = statusIconReview;
        } else {
            statusText = statusTextRemoved;
            statusIcon = statusIconRemoved;
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