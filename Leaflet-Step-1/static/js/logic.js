
// Create a map object
var myMap = L.map("map", {
    center: [12 , 12],
    zoom: 2
  });

/* var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson'; */
/* var url ='https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson'; */
var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson';
d3.json(url, function(data) {
    console.log(data);

    var featuresData = data.features;

    //console.log(featuresData);

    L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox/light-v10",
        accessToken: API_KEY
        }).addTo(myMap); 

    // Loop through the cities array and create one marker for each city object
    for (var i = 0; i < featuresData.length; i++) {

        var latitude = featuresData[i].geometry.coordinates[1];
        //console.log("Latitude: "+latitude);

        var longitude = featuresData[i].geometry.coordinates[0];
        //console.log("Longitude: "+longitude);

        var magnitude = featuresData[i].properties.mag;
        console.log("Magnitude: "+magnitude);


        // Conditionals for countries points
        function getColor(d) {
            return d >= 6.5  ? '#C62D42' :
                   d >= 6    ? '#E12C2C' :
                   d >= 5    ? '#FF7F49' :
                   d >= 4.5  ? '#FFAA1D' :
                   d >= 3.5  ? '#FFCC33' :
                   d >= 2.5  ? '#FFFF9F' :
                               '#87FF2A';
        }

        // Add circles to map
        L.circle( 
            [ 
                featuresData[i].geometry.coordinates[1],
                featuresData[i].geometry.coordinates[0]
            ], {
            fillOpacity: 0.75,
            color: "transparent",
            fillColor: getColor(featuresData[i].properties.mag),
            radius: (featuresData[i].properties.mag * 20000)
            }).bindPopup(
                "<h1>" 
                + featuresData[i].properties.place
                + "</h1> <hr> <h3> Magnitude: "
                + featuresData[i].properties.mag 
                + "</h3>"
                ).addTo(myMap);
         
    }

    // Add a legend
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (lgd) {
    
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 2.5, 3.5, 4.5, 5, 6, 6.5];
    
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1)  + '"></i> ' 
                + grades[i]  + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+')
            ;
        }
    
        return div;
    };
    
    legend.addTo(myMap);
    

})