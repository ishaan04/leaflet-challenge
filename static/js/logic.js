///////////////////////////////////////////
//DEFAULT SETUP

var leaflet = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {attribution:
      "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    zoomOffset: -1,
    maxZoom: 18,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  }
);

// DEFAULT MAP LOCATION.
var mapbase = L.map("mapid", {center: [37, -95],zoom: 5});

//GREY MAP SETUP
leaflet.addTo(mapbase);

/////////////////////////////////////////////
//D3 SETUP - EARTHQUAKE JSON FILE SETUP
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data) {

  // STYLE FUNCTION SETUP
  function styleInfo(feature) {return {
      fillColor: getColor(feature.geometry.coordinates[2]),    
      opacity: 0.5,
      color: "#000000",
      fillOpacity: 0.7,
      stroke: true,
      weight: 0.9,
      radius: getRadius(feature.properties.mag)
    };
  }

  // EARTHQUAKE MARKER COLORS AND DEPTH OF THE EARTHQUAKE SETUP- COLORS RETRIEVED FROM https://www.w3schools.com/colors/colors_picker.asp
  function getColor(depth) {switch (true) 
    {case depth > 100:
      return "#b30000";
    case depth > 80:
      return "#ff471a";
    case depth > 60:
      return "#ffb366";
    case depth > 40:
      return "#ffff1a";
    case depth > 20:
      return "#80ff00";
    default:
      return " #ccffdd";
    }
  }

  // EARTHQUAKE RADIUS MEASURE FUNCTION
  function getRadius(magnitude) {if (magnitude === 0) {return 1;}
    return magnitude * 4;}

  //GEOJSON LAYER SETUP
  L.geoJson(data, {pointToLayer: function(feature, latlng) {return L.circleMarker(latlng);},
    style: styleInfo,
    // INFO ABOUT THE EARTHQUAKE SETUP
    onEachFeature: function(feature, layer) {layer.bindPopup("Magnitude: "
          + feature.properties.mag
          + "<br>Depth: "
          + feature.geometry.coordinates[2]
          + "<br>Location: "
          + feature.properties.place);}
  }).addTo(mapbase);

/////////////////////////////////////////////
//LEGEND SETUP WITH EDITS TO HTML
  var legendbox = L.control({position: "topleft"});
  legendbox.onAdd = function() {var div = L.DomUtil.create("div", "info legend");

    var grades = [-20, 20, 40, 60, 80, 100]; //RETRIEVED FROM https://www.w3schools.com/colors/colors_picker.asp
    var colors = [
      " #ccffdd",
      "#80ff00",
      "#ffff1a",
      "#ffb366",
      "#ff471a",
      "#b30000"];

    for (var i = 0; i < grades.length; i++) {div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
      + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };
  legendbox.addTo(mapbase);
});