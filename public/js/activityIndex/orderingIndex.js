//The functions in this file are called just before the activities cards are created

//ORDER BY DATE UPDATED
function orderActivitiesByDateUpdated(activities){
    return activities.sort(compareByDateUpdated).reverse();
}
function compareByDateUpdated(a,b) {
  if (a.updatedAt < b.updatedAt)
    return -1;
  if (a.updatedAt > b.updatedAt)
    return 1;
  return 0;
}


//ORDER BY DISTANCE
async function orderActivitiesByDistance(activities){
    return activities.sort(compareByDistance);
}
function compareByDistance(a,b) {
// if the calculation of distance between the lat and lng of the search pin
// and the lat and lng of the activity...
  
  if (getDistanceFromLatLonInKm(searchMarkerLat, searchMarkerLng, a.lat, a.lng) < getDistanceFromLatLonInKm(searchMarkerLat, searchMarkerLng, b.lat, b.lng)){
    return -1;
  }
  if (getDistanceFromLatLonInKm(searchMarkerLat, searchMarkerLng, a.lat, a.lng) > getDistanceFromLatLonInKm(searchMarkerLat, searchMarkerLng, b.lat, b.lng)) {
    return 1;
  }
  return 0;
}


//ORDER BY LOVES
function orderActivitiesByLoves(activities){
    return activities.sort(compareByLoves).reverse();
}
function compareByLoves(a,b) {
  if (a.loves.length < b.loves.length)
    return -1;
  if (a.loves.length > b.loves.length)
    return 1;
  return 0;
}


//ORDER BY FEATURED
async function orderActivitiesByFeatured(activities){
    
    var featuredActivities = [];
    var remainingActivities = activities;
    
    //find all featured activities
    await activities.forEach(async function(activity) {
      if(activity.featured) {
        await featuredActivities.push(activity);
        await remainingActivities.splice(remainingActivities.indexOf(activity), 1);
      }
    });
    
    await featuredActivities.sort(compareByDateUpdated).reverse();
    await remainingActivities.sort(compareByDateUpdated).reverse();
    
    var combinedActivities = featuredActivities.concat(remainingActivities);

    return combinedActivities;
}