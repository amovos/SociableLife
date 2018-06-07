//The functions in this file are called just before the activities cards are created

//ORDER BY DATE UPDATED
function orderActivitiesByDateUpdated(activities){
    return activities.sort(compareByDateUpdated).reverse();
}
function compareByDateUpdated(a,b) {
  if (a.createdAt < b.createdAt) //change to updated when that's part of the DB model
    return -1;
  if (a.createdAt > b.createdAt) //change to updated when that's part of the DB model
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
