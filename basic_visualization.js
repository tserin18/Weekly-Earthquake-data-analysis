
// Define variables for our tile layers
var light = L.tileLayer(
    "https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoicGh1bXBocmkiLCJhIjoiY2pod3MyNTdiMDQ5NTNtb3ozN3IwanQyMyJ9.8fYEbhtpdC5kWNwMcHF_Mw"
);
var dark = L.tileLayer(
    "https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoicGh1bXBocmkiLCJhIjoiY2pod3MyNTdiMDQ5NTNtb3ozN3IwanQyMyJ9.8fYEbhtpdC5kWNwMcHF_Mw"
);

// Only one base layer can be shown at a time
var baseMaps = {
    Light: light,
    Dark: dark
};

var last_week = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(last_week, function (data) {
    var earthquakes = []
    features = data.features
    features.forEach(function (feature) {
        longitude = feature.geometry.coordinates[0]
        latitude = feature.geometry.coordinates[1]
        title = feature.properties.title
        magnitude = feature.properties.mag
        earthquake = { title: title, magnitude: magnitude, location: [latitude, longitude] }
        earthquakes.push(earthquake)
    })
    process_earthquakes(earthquakes)
});

function earthquake_color(magnitude) {
    magnitude_color = "White"
    if (magnitude > 5) {
        magnitude_color = "Red"
    } else if (magnitude > 4) {
        magnitude_color = "Orange"
    } else if (magnitude > 3) {
        magnitude_color = "Yellow"
    } else if (magnitude > 2) {
        magnitude_color = "Green"
    }
    else {
        magnitude_color = "Green"
    }
    return magnitude_color
}


earthquake_markers = []

function process_earthquakes(earthquakes) {

    earthquakes.forEach(function (earthquake) {

        // console.log(earthquake.location, earthquake.title, earthquake.magnitude)

        // Create map object and set default layers
        //console.log(earthquake.location);
        earthquake_marker = L.circle(earthquake.location, {
            fillOpacity: 0.9,
            color: earthquake_color(earthquake.magnitude),
            fillColor: earthquake_color(earthquake.magnitude),
            radius: (earthquake.magnitude * 10000)
        })

        earthquake_marker.bindPopup("<h4>" + earthquake.title + "</h4> <hr> <h5>Magnitude: " + earthquake.magnitude + "</h5>")

        earthquake_markers.push(earthquake_marker)

    })


    // Add all the cityMarkers to a new layer group.
    // Now we can handle them as one group instead of referencing each individually
    var earthquake_layer = L.layerGroup(earthquake_markers);

    var myMap = L.map("map", {
        center: [31.7, -7.09],
        zoom: 2,
        layers: [light, earthquake_layer]
    });



    // Overlays that may be toggled on or off
    var overlayMaps = {
        Earthquakes: earthquake_layer
    };

    // Pass our map layers into our layer control
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps).addTo(myMap);

    // Setting up the legend
    var legend = L.control({ position: "bottomright" });
    
    legend.onAdd = function () {
        
        var div = L.DomUtil.create("div", "info legend");

        
        var legendInfo = "<h1>Magnitude</h1>" 

        div.innerHTML = legendInfo; 

        labels = []
        labels.push("<li style=\"background-color: Green\">3 or less</li>");
        labels.push("<li style=\"background-color: Yellow\">3 - 4</li>");
        labels.push("<li style=\"background-color: Orange\">4 - 5</li>");
        labels.push("<li style=\"background-color: Red\">greater than 5</li>");

        div.innerHTML += "<ul>" + labels.join("") + "</ul>";

        return div;
    };

    // Adding legend to the map
    legend.addTo(myMap);

}






