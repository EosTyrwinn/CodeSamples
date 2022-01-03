import * as map from "./maps.js";
import * as ajax from "./ajax.js";

export function init(){
    //Make sure the seach button will reload with new info
    searchBtn.onclick = () => {
        map.resetMarkers();
        callAPIs();
    };

    resetBtn.onclick = () => {
        localStorage.clear();
        map.resetMarkers();
    };


    //Save and load the values in the menu
    lang.addEventListener("change",function() {
        localStorage.setItem("ajh1624LangValue",this.value); // save it
    });
    let val = localStorage.getItem("ajh1624LangValue");
    if (val) lang.value=val; // set the dropdown

    region.addEventListener("change",function() {
        localStorage.setItem("ajh1624RegionValue",this.value); // save it
    });
    val = localStorage.getItem("ajh1624RegionValue");
    if (val) region.value=val; // set the dropdown

    map.initMap();
    callAPIs();
}

function callAPIs(){
    //Update Status
    pageLoading.innerHTML = "Fetching Data...";

    //Fetch data from the census bureau
    const CENSUS_URL = "https://api.census.gov/data/2013/language?get=EST,LANLABEL,NAME&for=";
    let url = CENSUS_URL;
    if(region.value != "*"){
        url += "county:*&in=";
    }
    url += "state:" + region.value;
    url += "&LAN=" + lang.value;
    ajax.downloadFile(url,map.loadMarkers);
}
