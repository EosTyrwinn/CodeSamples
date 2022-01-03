import * as ajax from "./ajax.js";

// GeoJSON code
let geojson = {
    type: 'FeatureCollection',
    features: []
};

let markers = [];

let map;

export function initMap(){
    mapboxgl.accessToken = 'pk.eyJ1IjoiZW9zdHlyd2lubiIsImEiOiJjazkwNmlucWswMWZsM2xueGZpbXJ6d2ZjIn0.TJhnQPYp-983GygjomMDyg';
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/outdoors-v11',
        center: [-98.582187, 38.27312],
        zoom: 4
    });

    map.on('load', function() {
        // Insert the layer beneath any symbol layer.
        var layers = map.getStyle().layers;
         
        var labelLayerId;
        for (var i = 0; i < layers.length; i++) {
            if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
                labelLayerId = layers[i].id;
                break;
            }
        }
        
    });
}

export function addMarkersToMap(){
    //Update Status
    pageLoading.innerHTML = "Data Displayed!"

    // add markers to map
    for(let marker of geojson.features){
        // Decide which marker to use based on the number of speakers
        let className;
        if(marker.properties.description < 10000){
            className = "minor";
        } else if (marker.properties.description < 50000){
            className = "midling";
        } else if (marker.properties.description < 100000){
            className = "medium";
        } else {
            className = "major";
        }

        // create a HTML element for each feature
        addMarker(marker.geometry.coordinates, marker.properties.title, marker.properties.description, className);
    }
}

// Gets the coordinates of the needed area. Places markers at their locations
export function loadMarkers(jsonString){
    
    if(jsonString == false){
        pageLoading.innerHTML = "No Data Availible";
        return;
    }

    let json = JSON.parse(jsonString);
    
    //Update status
    if(json){
        pageLoading.innerHTML = "Data Loaded!";
    }
    else
    {
        pageLoading.innerHTML = "Data Failed to Load!";
    }
    
    let locationInfo = []
    let calls = 0;
    // populate an array with data of the locations
    for (let i = 1; i < json.length; i++){
        // Get the name of the location
        let name = json[i][2];

        //Set up url stuff for the location API
        const GEODATA_URL = "https://open.mapquestapi.com/geocoding/v1/address?key=";
        const API_KEY = "e8YnGJBMcAgG5bhRIzGr8LrrWxERjiAD";
        let url = GEODATA_URL + API_KEY;
        //Search for the location in the API
        url += "&location=" + name;

        
         function makeFeature(e){
            let jsonLoc = JSON.parse(e);

            // All states are the first result in the API except for 3 which are confused with NYC, Georgia the country, and D.C. repsectivly
            let locIndex = 0;
            if(name == "New York" || name == "Georgia" || name == "Washington"){
                locIndex = 1;
            }

            //Set up the location info
            let loc = {
                coords: [jsonLoc.results[0].locations[locIndex].latLng.lng,jsonLoc.results[0].locations[locIndex].latLng.lat],
                title: name,
                speakers: json[i][0]
            }

            //Add the location to the list and see if all of the locations are done being loaded
            locationInfo.push(loc);
            calls++;
            if(calls >= json.length - 1){
                fillPoints();
                calls = 0;
                //Zomm to location needed
                let zoomurl = GEODATA_URL + API_KEY + "&location=" + region.options[region.selectedIndex].text;
                ajax.downloadFile(zoomurl,flyToRegion);
            }
        }

        ajax.downloadFile(url,makeFeature);
    }

    
    function fillPoints(){
        //Make the features for the locations
        for(let loc of locationInfo){
            
            const newFeature = {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates:[]
                },
                properties: {
                    title: "",
                    description: ''
                }
            };

            newFeature.geometry.coordinates = loc.coords;
            newFeature.properties.title = loc.title;
            newFeature.properties.description = loc.speakers;

            geojson.features.push(newFeature);
        }

        addMarkersToMap();
    }
}

export function flyTo(center = [0,0]){
    map.flyTo({center: center});
}

export function setZoomLevel(value = 0){
    map.setZoom(value);
}

export function setPitchAndBearing(pitch = 0, bearing = 0){
    map.setPitch(pitch);
    map.setBearing(bearing);
}

export function addMarker(coordinates, title, description, className){
    let el = document.createElement('div');
    el.className = className;

    //Add marker with the given data
    markers.push(new mapboxgl.Marker(el)
        .setLngLat(coordinates)
        .setPopup(new mapboxgl.Popup({offset:25})
        .setHTML('<h3>' + title + '</h3><p>' + description + '</p>'))
        .addTo(map));
}

export function resetMarkers(){
    geojson.features = [];
    markers.forEach(m => {
        m.remove();
    });
    markers = [];
}

function flyToRegion(jsonString){
    // Get the location to focus on
    let json = JSON.parse(jsonString);
    let name = json.results[0].providedLocation.location;
    let locIndex = 0;
    //Same BS with some states as before
    if(name == "New York" || name == "Georgia" || name == "Washington"){
        locIndex = 1;
    } else if(name == "Wisconson"){
        locIndex = 3;
    }

    //Fly there
    let coords = [json.results[0].locations[locIndex].latLng.lng,json.results[0].locations[locIndex].latLng.lat];
    flyTo(coords);
}