let citySearch = [];
let userInput = [];
let coordinates = {
  resultsLat: [],
  resultsLon: [],
};
let stringCoords = {
    lat: [],
    long: [],
};
let formattedCoords = {
    lat: [],
    long: [],
};
let searchResult;

let tempK; 
let tempF;

$("#citySearchContainer").on("click", "#weatherSubmitBtn", function (event) {
    event.preventDefault();
    userInput = $("#citySearchI").val();
    console.log($("#citySearchI"));
    console.log(userInput);
    if (userInput.indexOf(",") !== -1) {
        userInput = userInput.split(",");
        // userInputFormatted = userInputFormatted.push(userInput);
        localStorage.setItem("Searches", JSON.stringify(userInputFormatted));
    } else if (userInput === "") {
        localStorage.setItem("Searches", JSON.stringify(userInput));
    } else {
        //userInputFormatted = userInputFormatted.push(userInput);
        localStorage.setItem("Searches", JSON.stringify(userInput));
    }
    console.log(userInput);
    //console.log(userInputFormatted)
    fetchDataByCity(userInput);
});

function fetchDataByCity(city) {
    fetch(
        "http://api.openweathermap.org/geo/1.0/direct?q=" +
        city +
        "&limit=1&appid=214f0628b63be875d9fcdd939008692a"
        )
        .then((response) => response.json())
        .then((data) => {
            citySearch = data;
            console.log(data);
            console.log(citySearch);
            console.log(citySearch[0].lon);
            fetchDataByCoords(citySearch);
        });
}

function kelvinToFarenheit() {
    console.log("temp convert", searchResult)
    let searchResultForUse = JSON.parse(localStorage.getItem("searchResult", searchResult))
    console.log(searchResultForUse)
    console.log("Search Result parsed", searchResultForUse)
    tempK = parseFloat(searchResultForUse.list[0].main.temp);
    let tempF = (tempK - 273.15) * 1.8 + 32;
    tempFDisp = tempF.toString()
    console.log(tempFDisp)
    tempFDisp = tempFDisp.slice(0, 5)
    console.log("tempFDisp", tempFDisp)
}

function fetchDataByCoords(coords) {
    console.log(coords);
    console.log(coords[0].lat);
    console.log(coords[0].lon);
    for (var i = 0; i < coords.length; i++) {
        coordinates.resultsLat[i] = coords[i].lat.toString();
        console.log(coordinates);
        stringCoords.lat.push(coordinates.resultsLat[i]);
    console.log("stringCoords", stringCoords);
    formattedCoords.lat[i] = Number(stringCoords.lat[i].slice(0, 5));
    console.log("formattedCoords", formattedCoords);
    coordinates.resultsLon[i] = coords[i].lon.toString();
    console.log(coordinates);
    stringCoords.long.push(coordinates.resultsLon[i]);
    console.log("stringCoords", stringCoords);
    formattedCoords.long[i] = Number(stringCoords.long[i].slice(0, 4));
    console.log("formattedCoords", formattedCoords);
    //let newCoordinates = coordinates.resultsLat[i].slice(3, 10)
  }
  for (var i = 0; i < coords.length; i++) {
    console.log(formattedCoords.lat[i]);
    // fetch('http://api.openweathermap.org/geo/1.0/reverse?lat=' + formattedCoords.lat[i] + '&lon=' + formattedCoords.long[i] + '&limit=1&appid=2d3b3bc21074396280d510a4956a8fe6')
    fetch(
      "http://api.openweathermap.org/data/2.5/forecast?lat=" +
        formattedCoords.lat[i] +
        "&lon=" +
        formattedCoords.long[i] +
        "&appid=214f0628b63be875d9fcdd939008692a"
    )
      .then((response) => response.json())
      .then((data) => {
        searchResult = (data);
        console.log("data", data);
        console.log("searchResult", searchResult);
        kelvinToFarenheit()
        localStorage.setItem("searchResult", JSON.stringify(searchResult));
        console.log("stringified", searchResult)
      });
  }
}



function mPStoMPH(windSpeed){
   let windMph = windSpeed * 2.237
   console.log("windMph", windMph)
}
