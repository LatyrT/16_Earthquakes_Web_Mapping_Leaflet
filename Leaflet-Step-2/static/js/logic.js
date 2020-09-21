
// 1st dataset
var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson';
d3.json(url, function(data) {
    //console.log(data); 

    // 2nd dataset
    var url2 = 'https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json';
    d3.json(url2, function(data2) {
        //console.log(data2);

        var featuresData = data.features;
            console.log('** Dataset # 1: ');
            console.log(featuresData);

        var featuresData2 = data2.features;
            console.log('** Dataset # 2: ');
            console.log(featuresData2);


        var circleMarkers = [];
        var polygonMarkers = [];

        // Get data for the circles
        for (var i = 0; i < featuresData.length; i++) {

            var latitude = featuresData[i].geometry.coordinates[1];
            //console.log("Latitude: "+latitude);

            var longitude = featuresData[i].geometry.coordinates[0];
            //console.log("Longitude: "+longitude);

            var magnitude = featuresData[i].properties.mag;
            //console.log("Magnitude: "+magnitude);

            var place = featuresData[i].properties.place;
            //console.log("Place: "+place);

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
            //var circleMarkers = [];
            circleMarkers.push(L.circle( 
                [ 
                    latitude,
                    longitude
                ], {
                fillOpacity: 0.75,
                color: "transparent",
                fillColor: getColor(magnitude),
                radius: (magnitude * 20000)
                }).bindPopup(
                    "<h1>" 
                    + place
                    + "</h1> <hr> <h3> Magnitude: "
                    + magnitude
                    + "</h3>"
                    ));
                    console.log(circleMarkers);
        }

        // Get data for the polygon
        for (var i = 0; i < featuresData2.length; i++) { 

            var polygonCoord = featuresData2[i].geometry.coordinates
            console.log(polygonCoord);

            // Create the polygon
            //var polygonMarkers = [];
            polygonMarkers.push(L.polygon(polygonCoord, {
                color: "black",
                width: 0.25,
                fillColor: "transparent",
                fillOpacity: 0.75
            }));

            //console.log(polygonMarkers);

        }

        
        // mapBox Satellite
        var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 18,
            id: "mapbox/satellite-v9",
            accessToken: API_KEY
            })

        // mapBox Light(Grey)
        var grayscaleMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 18,
            id: "mapbox/light-v10",
            accessToken: API_KEY
            });
        
        // mapBox Outdoors
        var outdoorsMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 18,
            id: "mapbox/outdoors-v11",
            accessToken: API_KEY
            }); 
        
        

        // Create separate layer groups
        var circlesEarthquakes = L.layerGroup(circleMarkers); 
        var polygonFaultLines = L.layerGroup(polygonMarkers);

        // Create a basemaps object
        var baseMaps = {
            "Satellite" : satelliteMap,
            "GrayScale" : grayscaleMap,
            "Outdoors" : outdoorsMap
        };

        // Create an overlay object
        var overlayMaps = {
            "Hearthquakes" : circlesEarthquakes,
            "Fault Lines" : polygonFaultLines
        };

        // Create a map object
        var myMap = L.map("map", {
            center: [12 , 12],
            zoom: 2,
            layers: [outdoorsMap, polygonFaultLines, circlesEarthquakes]
        });

        L.control.layers(baseMaps, overlayMaps, {
            collapsed: false
        }).addTo(myMap);

        // Add a legend
        var legend = L.control({position: 'bottomright'});

        legend.onAdd = function (lgd) {
        
            var div = L.DomUtil.create('div', 'info legend'),
                grades = [0, 2.5, 3.5, 4.5, 5, 6, 6.5];
        
            // loop through the grades
            for (var i = 0; i < grades.length; i++) {
                div.innerHTML +=
                    '<i style="background:' + getColor(grades[i] + 1)  + '"></i> ' 
                    + grades[i]  + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+')
                ;
            }
            
            return div;
        };

        legend.addTo(myMap);

    });
    
});














