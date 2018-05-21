var map;
var lastOpenedInfoWindow;

function initActivityIndexMap() {
    map = new google.maps.Map(document.getElementById('activity-index-map'), {
        zoom: 3,
        center: {lat: 51.5074, lng: 0.1278 },
        scrollwheel: false,
        streetViewControl: false,
        scaleControl: false,
        fullscreenControl: false
    });
    
}

// Loop through the results array and place a marker for each
// set of coordinates.
$.getJSON('/api/map', function(results) {
    $.each(results, function(i, f) {
        var latLng = new google.maps.LatLng(results[i].lat, results[i].lng);
        var marker = new google.maps.Marker({
            position: latLng,
            map: map
        });
        var infowindow = new google.maps.InfoWindow({
                content: "hello world" + i
            });
        marker.addListener('click', function() {
            closeLastOpenedInfoWindow(); //close the last opened info window
            infowindow.open(map, marker); // open the new info window
            lastOpenedInfoWindow = infowindow; // set the new "last opened info window" value to the current info window
        });
        google.maps.event.addListener(map, "click", function(event) {
            infowindow.close();
        });
    });
});

function closeLastOpenedInfoWindow() {
    if (lastOpenedInfoWindow) {
        lastOpenedInfoWindow.close();
    }
}