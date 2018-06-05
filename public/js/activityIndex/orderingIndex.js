//The functions in this file are called just before the activities cards are created

function orderActivities(activities){
    return activities.sort(compareByDateCreated).reverse();
}

function compareByDateCreated(a,b) {
  if (a.createdAt < b.createdAt)
    return -1;
  if (a.createdAt > b.createdAt)
    return 1;
  return 0;
}