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
let searches;
let forecastContainer = $("<div>");
forecastContainer.attr({ class: "row mt-2", id: "5dayContainer" });
// let forecastCard = $("<div>");

//initialize local storage
function inIt() {
  userInputSaved = JSON.parse(localStorage.getItem("userHistory")) || [];
  console.log(userInputSaved);
  console.log(userInputSaved[userInputSaved.length - 1]);
  if (userInputSaved.length > 0) {
    fetchDataByCity(userInputSaved[userInputSaved.length - 1]);
  }
  printSearchHistory(userInputSaved);
}

inIt();

//grab and format user input on click of the submit button
$("#citySearchContainer").on("click", "#weatherSubmitBtn", function (event) {
  event.preventDefault();
  console.log(userInputSaved);
  userInput = $("#citySearchI").val();
  console.log($("#citySearchI"));
  console.log(userInput);
  // for (var i = 0; i < 5; i++) {
  //   forecastCard.remove();
  // }

  if (userInputSaved.includes(userInput)){
    userInputSaved = userInputSaved
  } else {
    userInputSaved.push(userInput);
    localStorage.setItem("userHistory", JSON.stringify(userInputSaved))
  }
  console.log(userInput);
  console.log(userInputSaved);
  printSearchHistory(userInputSaved);
  fetchDataByCity(userInput);
});

$("#citySearchContainer").on("click", ".savedSearchBtn", function (event) {
  event.preventDefault();
  console.log(userInputSaved);
  userInput = event.target.textContent;
  console.log($(".savedSearchBtn"));
  console.log(userInput);
  // for (var i = 0; i < 5; i++) {
  //   forecastCard.remove();
  // }
  if (userInputSaved.includes(userInput)){
    userInputSaved = userInputSaved
  } else {
    userInputSaved.push(userInput);
    localStorage.setItem("userHistory", JSON.stringify(userInputSaved))
  }
  console.log(userInput);
  console.log(userInputSaved);
  printSearchHistory(userInputSaved);
  fetchDataByCity(userInput);
});

//run an openWeather fetch based upon user input
function fetchDataByCity(city) {
  console.log(city);
  fetch(
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
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

//fetch data by the coordinates contained within the initial user city name based search
function fetchDataByCoords(coords) {
  console.log("coords.length", coords.length);
  console.log(coords);
  console.log(coords[0].lat);
  console.log(coords[0].lon);
  fetch(
    "https://api.openweathermap.org/data/2.5/forecast?lat=" +
      coords[0].lat +
      "&lon=" +
      coords[0].lon +
      "&appid=214f0628b63be875d9fcdd939008692a"
  )
    .then((response) => response.json())
    .then((data) => {
      searchResult = data;
      console.log("searchResult", searchResult);

      kelvinToFahrenheit(searchResult);
      mPStoMPH(searchResult);
      console.log("searchResult", searchResult);
    });
  // }
}

//convert temperature from Kelvin to Fahrenheit and return to original object as new property
function kelvinToFahrenheit(results) {
  for (var i = 0; i < results.list.length; i++) {
    let tempK = parseFloat(results.list[i].main.temp);
    let tempF = (tempK - 273.15) * 1.8 + 32;
    tempFDisp = tempF.toString();
    tempFDisp = tempFDisp.slice(0, 5);
    results.list[i].main.tempFDisp = tempFDisp;
  }
  console.log("searchResultForUse", results);
}

//convert wind speed from meters/second to MPH and return to original object as new property
function mPStoMPH(results) {
  for (var i = 0; i < results.list.length; i++) {
    let windMph = results.list[i].wind.speed * 2.237;
    windMphFDisp = windMph.toString();
    windMphFDisp = windMphFDisp.slice(0, 4);
    results.list[i].wind.windMphFDisp = windMphFDisp + " MPH";
  }
  console.log("windResults", results);
  showForecast(results);
}

//print search results with 5 day forecast on the screen
function showForecast(results) {
  //Banner for search results
  $(".forecast-card").remove();
  let bannerDate = results.list[3].dt_txt;
  bannerDate = bannerDate.split(" ");
  bannerDate = moment(bannerDate[0]).format("MM/DD/YYYY");
  let bannerIconImg = $("<img>");
  bannerIconImg.attr({
    id: `${results.list[3].weather.id}`,
    src:
      "http://openweathermap.org/img/wn/" +
      `${results.list[3].weather[0].icon}` +
      ".png",
    alt: "Weather icon",
  });
  $("#city-name-date").text(results.city.name + " (" + bannerDate + ")");
  $("#city-name-date").append(bannerIconImg);
  $("#temp").text("Temp: " + results.list[3].main.tempFDisp + " F");
  $("#wind").text("Wind: " + results.list[3].wind.windMphFDisp);
  $("#Humidity").text("Humidity: " + results.list[3].main.humidity + "%");
  $(".weather-report").append(forecastContainer);

  //Loop through list to populate 5 day forecast
  console.log(results.list.length);
  for (var i = 0; i < results.list.length; i = i + 8) {
    let forecastCard = $("<div>");
    forecastCard.attr("class", "col-2 border forecast-card mx-2");
    forecastContainer.append(forecastCard);

    let dateContainer = $("<div>");
    dateContainer.attr("class", "date-container h3");
    let dateSpan = $("<span>");
    let date = results.list[i].dt_txt;
    date = date.split(" ");
    date = moment(date[0]).format("MM/DD/YYYY");
    dateSpan.text(date);
    dateContainer.append(dateSpan);
    forecastCard.append(dateContainer);

    let iconContainer = $("<div>");
    iconContainer.attr({ class: "icon" });
    let iconImg = $("<img>");
    iconImg.attr({
      id: `${results.list[i].weather.id}`,
      src:
        "http://openweathermap.org/img/wn/" +
        `${results.list[i].weather[0].icon}` +
        ".png",
      alt: "Weather icon",
    });
    iconContainer.append(iconImg);
    forecastCard.append(iconContainer);

    let tempContainer = $("<div>");
    tempContainer.attr("class", "temp-container");
    let tempSpan = $("<span>");
    tempSpan.text("Temp: " + results.list[i].main.tempFDisp + " F");
    tempContainer.append(tempSpan);
    forecastCard.append(tempContainer);

    let windContainer = $("<div>");
    windContainer.attr("class", "wind");
    let windSpan = $("<span>");
    windSpan.text("Wind: " + results.list[i].wind.windMphFDisp);
    windContainer.append(windSpan);
    forecastCard.append(windContainer);

    let humidityContainer = $("<div>");
    humidityContainer.attr("class", "humidity");
    let humiditySpan = $("<span>");
    humiditySpan.text("Humidity: " + results.list[i].main.humidity + "%");
    humidityContainer.append(humiditySpan);
    forecastCard.append(humidityContainer);
  }
}

let testArr = ["Los Angeles", "Denver", "San Diego"];

function printSearchHistory(inputArr) {
  let searchContainer = $("#citySearchContainer");
  let searchHistoryEl = $("<div>");
  $(".history").remove();

  for (var i = 0; i < inputArr.length; i++) {
    searchHistoryEl.attr("class", "row history");
    searchContainer.append(searchHistoryEl);

    let SearchHistoryCol = $("<div>");
    SearchHistoryCol.attr("class", "col-lg-12 mt-2");
    searchHistoryEl.append(SearchHistoryCol);

    let searchHistoryBtn = $("<button>");
    searchHistoryBtn.attr({
      class: "col-lg-12 savedSearchBtn",
      for: "city-search",
      id: `${inputArr[i]}`,
    });
    searchHistoryBtn.text(inputArr[i]);
    SearchHistoryCol.append(searchHistoryBtn);
  }
}
