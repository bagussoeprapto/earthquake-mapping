// Store the API endpoint inside a queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

// Perform a GET request of the queryUrl
d3.json(queryUrl, function(data) {
 // Upon response, send the data.features object to the createFeatures function
 createFeatures(data.features);
});

function createFeatures(earthquakeData) {
 // This function loops through each feature in the features array
 // Run the onEachFeature function once for each piece of data in the array
 // The GeoJSON layer contains the features array on the earthquakeData object
 var earthquakes = L.geoJson(earthquakeData, {
   onEachFeature(feature, layer){
    
    // The popup shows earthquake info, such as place, magnitude, and date/time
    layer.bindPopup("<h3>" + feature.properties.place +
       "</h3><hr><p>Magnitude: " + feature.properties.mag + "</p>");
   },

   // Create circles with Radius and Colors based on magnitude
   pointToLayer: function (feature, latLng) {
     return new L.circle(latLng,
       {radius: getRadius(feature.properties.mag),
        color: circleColor(feature.properties.mag),
        fillOpacity: .7,
        stroke: true,
        weight: .5,
     })
   }
 });
 
  function circleColor(magnitude) {
    if (magnitude < 1.0) {
      return "lightsalmon";
    }
    else if (magnitude < 2.0) {
      return "salmon";
    }
    else if (magnitude < 3.0) {
      return "indianred";
    }
    else if (magnitude < 4.0) {
      return "firebrick";
    }
    else if (magnitude < 5.0) {
      return "red";
    }
    else {
      return "darkred";
    }
  }
  
  function getRadius(magnitude) {  
    return magnitude * 80000
  }

 // Sending our earthquakes layer to the createMap function
 createMap(earthquakes)
}

function createMap(earthquakes) {

 // Define streetmap layer
 var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
   attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
   maxZoom: 19,
   id: "mapbox.streets",
   accessToken: API_KEY
 });

 // Define a baseMaps object to hold our base layers
 var baseMaps = {
   StreetMap: streetmap,
 };

 // Create overlay object to hold our overlay layer
 var overlayMaps = {
   Earthquakes: earthquakes
 };

 // Create our map, giving it the streetmap and earthquakes layers to display on load
 var myMap = L.map("map", {
   center: [
     0, 0
   ],
   zoom: 2,
   layers: [streetmap, earthquakes]
 });

 // Create a layer control
 // Pass in our baseMaps and overlayMaps
 // Add the layer control to the map
 L.control.layers(baseMaps, overlayMaps, {
   collapsed: false
 }).addTo(myMap);
}

// Set up the legend
var legend = L.control({ position: "bottomright" });
legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend"),
    magnitude = [1,2,3,4,5,6],
    labels = [];

  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
    '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
    grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }

  return div;
};

// Adding legend to the map
legend.addTo(myMap);

  