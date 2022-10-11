let citySearch = [];
let userInput = [];
let userInputSaved;
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
let searchResultForUse;

// let tempK;
// let tempF;

function inIt() {
  userInputSaved = [];
  userInputSaved.push(JSON.parse(localStorage.getItem("Searches")));
  console.log(userInputSaved);
}

inIt();

$("#citySearchContainer").on("click", "#weatherSubmitBtn", function (event) {
  event.preventDefault();
  console.log(userInputSaved);
  userInput = $("#citySearchI").val();
  console.log($("#citySearchI"));
  console.log(userInput);
  if (userInput.indexOf(",") !== -1) {
    userInput = userInput.split(",");
    // userInputFormatted = userInputFormatted.push(userInput);
    userInputSaved.push(userInput);
    localStorage.setItem("Searches", JSON.stringify(userInputSaved));
  } else if (userInput === "") {
    userInputSaved.push(userInput);
    localStorage.setItem("Searches", JSON.stringify(userInputSaved));
  } else {
    //userInputFormatted = userInputFormatted.push(userInput);
    userInputSaved.push(userInput);
    localStorage.setItem("Searches", JSON.stringify(userInputSaved));
  }
  console.log(userInput);
  console.log(userInputSaved);
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
      //   console.log(citySearch[0].lon);
      fetchDataByCoords(citySearch);
    });
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
    let newCoordinates = coordinates.resultsLat[i].slice(3, 10)
  }
  for (var i = 0; i < coords.length; i++) {
    // console.log(formattedCoords.lat[i]);
    // fetch('http://api.openweathermap.org/geo/1.0/reverse?lat=' + formattedCoords.lat[i] + '&lon=' + formattedCoords.long[i] + '&limit=1&appid=2d3b3bc21074396280d510a4956a8fe6')
    fetch(
      "http://api.openweathermap.org/data/2.5/forecast?lat=" +
      stringCoords.lat[i] +
      "&lon=" +
      stringCoords.long[i] +
      "&appid=214f0628b63be875d9fcdd939008692a"
    )
      .then((response) => response.json())
      .then((data) => {
        searchResult = data;
        // console.log("data", data);
        console.log("searchResult", searchResult);
        localStorage.setItem("searchResult", JSON.stringify(searchResult));
        searchResultForUse = JSON.parse(
          localStorage.getItem("searchResult", searchResult)
        );
        kelvinToFarenheit(searchResultForUse);
        mPStoMPH(searchResultForUse);
        console.log("searchResultForUse", searchResultForUse);
      });
  }
}

function kelvinToFarenheit(results) {
  //searchResultForUse = JSON.parse(localStorage.getItem("searchResult", searchResult))
  for (var i = 0; i < results.list.length; i++) {
    //console.log("results", results);

    let tempK = parseFloat(results.list[i].main.temp);
    let tempF = (tempK - 273.15) * 1.8 + 32;
    tempFDisp = tempF.toString();
    // console.log(tempFDisp);
    tempFDisp = tempFDisp.slice(0, 5);
    //console.log("tempFDisp", tempFDisp);
    results.list[i].main.tempFDisp = tempFDisp;
    //console.log(results.list[i].main.tempFDisp);
  }
  localStorage.setItem("searchResult", JSON.stringify(results));
  console.log("searchResultForUse", results);
}

function mPStoMPH(results) {
  //searchResultForUse = JSON.parse(localStorage.getItem("searchResult", searchResult))
  for (var i = 0; i < results.list.length; i++) {
    let windMph = results.list[i].wind.speed * 2.237;
    windMphFDisp = windMph.toString();
    windMphFDisp = windMphFDisp.slice(0, 4);
    results.list[i].wind.windMphFDisp = windMphFDisp + " MPH";
  }
  localStorage.setItem("searchResult", JSON.stringify(results));
  console.log("windResults", results);
  showForecast()
}

function showForecast() {
  let processedResults = JSON.parse(localStorage.getItem('searchResult'))
  console.log(processedResults)
  let forecastCard = $("<div>")
  forecastCard.attr("class", "col-2 border forecast-card mx-2")
  $("#5dayContainer").append(forecastCard)

  let dateContainer = $("<div>")
  dateContainer.attr("class", "date-container h3")
  let dateSpan = $("<span>")
  dateSpan.text(processedResults.list[3].dt)
  dateContainer.append(dateSpan)
  forecastCard.append(dateContainer)

  let tempContainer = $("<div>")
  tempContainer.attr("class", "temp-container")
  let tempSpan = $("<span>")
  tempSpan.text(processedResults.list[3].main.tempFDisp)
  tempContainer.append(tempSpan)
  forecastCard.append(tempContainer)

  let windContainer = $("<div>")
  windContainer.attr("class", "wind")
  let windSpan = $("<span>")
  windSpan.text(processedResults.list[3].wind.windMphFDisp)
  windContainer.append(windSpan)
  forecastCard.append(windContainer)

  let humidityContainer = $("<div>")
  humidityContainer.attr('class', 'humidity')
  let humiditySpan = $("<span>")
  humiditySpan.text(processedResults.list[3].main.humidity)
  humidityContainer.append(humiditySpan)
  forecastCard.append(humidityContainer)
}

