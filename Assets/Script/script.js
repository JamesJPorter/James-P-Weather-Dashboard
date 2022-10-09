
let citySearch = [];
let userInput = [];
let userInputFormatted = [];
let searchResult = [];

$("#citySearchContainer").on("click", "#weatherSubmitBtn", function (event) {
    event.preventDefault();
    userInput = $("#citySearchI").val()
    console.log($('#citySearchI'))
    console.log(userInput)
    if (userInput.indexOf(",") !== -1) {
        userInput = userInput.split(",");
       // userInputFormatted = userInputFormatted.push(userInput);
        localStorage.setItem("Searches", JSON.stringify(userInputFormatted));
      } else if (userInput.indexOf(" ") !== -1) {
        userInput = userInput.split(" ");
        //userInputFormatted = userInputFormatted.push(userInput);
        localStorage.setItem("Searches", JSON.stringify(userInput));
      } else if (userInput === "") {
        localStorage.setItem("Searches", JSON.stringify(userInput));
      } else {
        //userInputFormatted = userInputFormatted.push(userInput);
        localStorage.setItem("Searches", JSON.stringify(userInput));
      }
      console.log(userInput)
      //console.log(userInputFormatted)
    fetchDataByCity(userInput)
})


function fetchDataByCity(city){
    fetch('http://api.openweathermap.org/geo/1.0/direct?q=' + city +  '&limit=5&appid=214f0628b63be875d9fcdd939008692a')
    .then ((response) => response.json())
    .then((data) => {
        citySearch = data
        console.log(data)
        console.log(citySearch)
        console.log(citySearch[0].lon)
        fetchDataByCoords(citySearch)
    })
}

function fetchDataByCoords(coords){
    console.log(citySearch[0].lon)
    for (var i = 0; i < coords.length; i++){
        fetch('api.openweathermap.org/data/2.5/forecast?lat=' + coords[i].lat + '&lon=' + coords[i].lon + '&appid=214f0628b63be875d9fcdd939008692a')
    .then((response) => response.json())
    .then((data) => {
        searchResult.push(data)
        console.log(data)
        console.log(searchResult)
        localStorage.setItem("SavedSearches", JSON.stringify(searchResults))
    })}
}