// Mapbox API
var mapbox = "https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoidHNlcmluMTgiLCJhIjoiY2poeG5oYnE3MGRwMzNwbWgydGV0dXNrNCJ9.DwxEEgXLIA54vMrZYuWuhw";

// Creating map object
var myMap = L.map("map", {
center: [31.7, -7.09],
  zoom: 2
});

// Adding tile layer to the map
L.tileLayer(mapbox).addTo(myMap);

// Building API query URL
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Grabbing the data with d3..
d3.json(url, function(response) {
  console.log(response);
  // Creating a new marker cluster group
  var markers = L.markerClusterGroup();

  // Loop through our data...
  var earthquakes = []
  features = response.features
  features.forEach(function (feature) {
    // set the data location property to a variable
    var location = feature.geometry;

    // If the data has a location property...
    if (location) {

      // Add a new marker to the cluster group and bind a pop-up
      markers.addLayer(L.marker([location.coordinates[1], location.coordinates[0]])
        .bindPopup("<h4>" + feature.properties.place + " </h4> <hr> <h5>Magnitude: " + feature.properties.mag + "</h5>"));
    }

  })

  // Add our marker cluster layer to the map
  myMap.addLayer(markers);

});
