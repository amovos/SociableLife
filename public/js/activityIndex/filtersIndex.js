/* global $ */

function mapKeyFilter(activities){
    var filteredActivitiesLocal = [];
    
    var optionsArray = [
            {
                checkboxId: '#allAgesCheck',
                searchValue: 'All Ages'
            },
            {
                checkboxId: '#adultsCheck',
                searchValue: 'Adults'
            },
            {
                checkboxId: '#childrenCheck',
                searchValue: 'Children'
            }
        ];
    
    for(var i=0; i<optionsArray.length; i++){
        if($(optionsArray[i].checkboxId).prop('checked')){
            activities.forEach(function(activity, index){
                if(activity.age === optionsArray[i].searchValue){
                    filteredActivitiesLocal.push(activity);
                }
            });
        }
    }
    return filteredActivitiesLocal;
}

async function locationFilter(activities){
    var filteredActivitiesLocal = [];
    
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
            filteredActivitiesLocal.push(activity);
        }
    });

    return filteredActivitiesLocal;
}

function statusFilter(activities){
    var filteredActivitiesLocal = [];
    
    var optionsArray = [
            {
                checkboxId: '#currentStatusCheck',
                searchValue: 'current'
            },
            {
                checkboxId: '#reviewStatusCheck',
                searchValue: 'review'
            },
            {
                checkboxId: '#removedStatusCheck',
                searchValue: 'removed'
            }
        ];
    
    for(var i=0; i<optionsArray.length; i++){
        if($(optionsArray[i].checkboxId).prop('checked')){
            activities.forEach(function(activity, index){
                if(activity.status === optionsArray[i].searchValue){
                    filteredActivitiesLocal.push(activity);
                }
            });
        }
    }
    
    return filteredActivitiesLocal;
}

function suitableFilter(activities){
    var filteredActivitiesLocal = [];
    
    var optionsArray = [
            {
                checkboxId: '#allAbilitiesCheck',
                searchValue: 'All abilities'
            },
            {
                checkboxId: '#learningDisabilitiesCheck',
                searchValue: 'Learning disabilities'
            },
            {
                checkboxId: '#physicalDisabilitiesCheck',
                searchValue: 'Physical disabilities'
            }
        ];
    
    for(var i=0; i<optionsArray.length; i++){
        if($(optionsArray[i].checkboxId).prop('checked')){
            activities.forEach(function(activity, index){
                if(activity.suitable === optionsArray[i].searchValue){
                    filteredActivitiesLocal.push(activity);
                }
            });
        }
    }
    
    return filteredActivitiesLocal;
}

function typeFilter(activities){
    var filteredActivitiesLocal = [];
    
    var optionsArray = [
            {
                checkboxId: '#dailyActivitiesCheck',
                searchValue: 'Daily Activities'
            },
            {
                checkboxId: '#weeklyActivitiesCheck',
                searchValue: 'Weekly Activities'
            },
            {
                checkboxId: '#monthlyActivitiesCheck',
                searchValue: 'Monthly Activities'
            },
            {
                checkboxId: '#annualActivitiesCheck',
                searchValue: 'Annual Activities'
            },
            {
                checkboxId: '#oneOffEventsCheck',
                searchValue: 'One-Off Events'
            },
            {
                checkboxId: '#bookYourselfCheck',
                searchValue: 'Book Yourself'
            },
        ];
    
    for(var i=0; i<optionsArray.length; i++){
        if($(optionsArray[i].checkboxId).prop('checked')){
            activities.forEach(function(activity, index){
                if(activity.frequency === optionsArray[i].searchValue){
                    filteredActivitiesLocal.push(activity);
                }
            });
        }
    }
    
    return filteredActivitiesLocal;
}

function activityFilterMessage(activities){
    //after all the filtering, show a message based on the number of actitivites returned
    if(activities.length === 0){
        $('#numActivitiesFoundMessage').hide();
        $('#numActivitiesFoundMessage').text('');
        
        $('#noActivitiesFoundMessage').show();
        $('#noActivitiesFoundMessage').html(
            "Sorry, we couldn't find any activities that matched your search 😕 <br><br>" +
            "We're currently building a option to allow people to add activites to the Sociable Life map, but it's <a href='/addActivity'>not quite ready yet</a> 🏗<br>" +
            "If you'd like to be part of the early access and help us test out this feature <a href='/contact'>please contact us</a> 👍"
            );
    } else {
        $('#noActivitiesFoundMessage').hide();
        $('#noActivitiesFoundMessage').text('');
        
        $('#numActivitiesFoundMessage').show();
        $('#numActivitiesFoundMessage').html(
            "<strong>" + activities.length + "</strong> activities found<br>You can view them on the map <i class='fa fa-map-marker'></i> and in the list below <i class='fa fa-th'></i>"
        );
    } 
}