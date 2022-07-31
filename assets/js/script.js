// START GLOBAL VARIABLES
// API KEY: 8cbc334acb287238dc75bb0e902ac44d
//moment.JS for date
let currentDay = moment().format("M/DD/YYYY");

let apiKey = "8cbc334acb287238dc75bb0e902ac44d";
let weatherURL = "https://api.openweathermap.org/data/3.0/onecall?lat=";
let coordinatesURL = "http://api.openweathermap.org/geo/1.0/direct?q=";
let iconURl = "https://openweathermap.org/img/w/"
let forcastSection = $(".column2");
let cityInput = $("#input-city");
let forecast = $("#forecast");
let searchHist = $("#search-history");
let formSearch = $("#city-search");

let searchHistAry = loadSearch();

//DECLARE FUNCTIONS
// get weather from API
function getWeather(city) {
  let apiCoordinatesURL = coordinatesURL + city + "&appid=" + apiKey;

  fetch(apiCoordinatesURL)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          let cityLat = data[0].lat;
          let cityLong = data[0].lon;
          let apiweatherURL = weatherURL + cityLat + "&lon=" + cityLong + "&appid=" + apiKey +"&units=imperial";

          fetch(apiweatherURL)
          .then(function (response2) {
            if (response2.ok) {
              response2.json().then(function (weatherData) {
                let currentWeather = $("<div>").attr({
                  id: "current-weather",
                });
                let weatherIcon = weatherData.current.weather[0].icon;
                let currentWeatherHeader = $("<h2>").text(
                  city + "(" + currentDay + ")"
                );
                let iconImg = $("<img>").attr({
                  id: "current-weather-icon",
                  src: iconURl + weatherIcon + ".png",
                  alt: "Current Weather Icon",
                });
                let currentWeatherList = $("<ul>");
                let currentWeatherDetails = [
                  "Temperature: " + weatherData.current.temp + " °F",
                  "Winds: " +
                    weatherData.current.wind_speed +
                    " MPH",
                    "Humidity: " +
                    weatherData.current.humidity +
                    "%" ,
                    "UV Index: " +
                    weatherData.current.uvi,
                ];
                for (let i = 0; i < currentWeatherDetails.length; i++) {
                  let listItem = $("<li>").text(currentWeatherDetails[i]);
                  currentWeatherList.append(listItem);
                  if (
                    currentWeatherDetails[i] ===
                    "UV Index: " + weatherData.current.uvi
                  ) {
                    let listItems = $("<li>").text("UV Index: ");
                    currentWeatherList.append(listItems);
                    let uviItem = $("<i>").text(weatherData.current.uvi);
                    if (uviItem.text() <= 2) {
                      uviItem.addClass("favorable");
                    } else if (uviItem.text() > 2 && uviItem.text() <= 7) {
                      uviItem.addClass("moderate");
                    } else {
                      uviItem.addClass("severe");
                    }
                    listItems.append(uviItem);
                  } else {
                    let listItem = $("<li>").text(currentWeatherDetails[i]);
                    currentWeatherList.append(listItem);
                  }
                 
                }
                $("forecast").before(currentWeather);
                currentWeather.append(currentWeatherHeader);
                currentWeatherHeader.append(iconImg);
                currentWeather.append(currentWeatherList);

                var fiveDayHeader = $("<h2>").text("5 day Forecast:").attr({
                  id: "five-day-header",
                });

                $("#current-weather").after(fiveDayHeader);

                let forecastArr = [];
                for (let i = 0; i < 5; i++) {
                  let forecastDate = moment()
                    .add(i + 1, "days")
                    .format("M/DD/YYYY");
                  forecastArr.push(forecastDate);
                }
                for (let i = 0; i < forecastArr.length; i++) {
                  let createCard = $("<div>").addClass("column3");

                  let cardBody = $("<div>").addClass("card-body");

                  let cardTitle = $("<h3>")
                    .addClass("card-title")
                    .text(forecastArr[i]);

                  let forecastIcon = weatherData.daily[i].weather[0].icon;

                  let forecastIconAdd = $("<img>").attr({
                    src: iconURl + forecastIcon + ".png",
                    alt: "Weather Image",
                  });

                  let currentWeatherDetails = [
                    "Temperature: " + weatherData.current.temp + " °F",
                    "Winds: " +
                      weatherData.current.wind_speed +
                      " MPH" +
                      "Humidity: " +
                      weatherData.current.humidity +
                      "%" +
                      "UV Index: " +
                      weatherData.current.uvi,
                  ];

                  let temp = $("<p>")
                    .addClass("card-text")
                    .text("Temperature: " + weatherData.daily[i].temp.max);

                  let wind = $("<p>")
                    .addClass("card-text")
                    .text("Wind " + weatherData.daily[i].wind_speed + " MPH");

                  let humidity = $("<p>")
                    .addClass("card-text")
                    .text("Humidity " + weatherData.daily[i].humidity + "%");

                  let uvi = $("<p>")
                    .addClass("card-text")
                    .text("UV Index " + weatherData.daily[i].uvi)
                  forecast.append(createCard);
                  createCard.append(cardBody);
                  cardBody.append(cardTitle);
                  cardBody.append(forecastIconAdd);
                  cardBody.append(temp);
                  cardBody.append(wind);
                  cardBody.append(humidity);
                  cardBody.append(uvi); 
                }
              });
            }
          });
        });
      } else {
        alert("Unable to find city");
      }
    })
};

//display cities from the local storage and create history buttons
function loadSearch() {
  let searchHistAry = JSON.parse(localStorage.getItem("search history"));
  if (!searchHistAry) {
    searchHistAry = {
      searchedCity: [],
    };
  } else {
    for (let i = 0; i < searchHistAry.searchedCity.length; i++) {
      historyBtn(searchHistAry.searchedCity[i]);
    }
  }
  return searchHistAry;
};
//save the chosen city to local storage
function saveCity() {
  localStorage.setItem("search history", JSON.stringify(searchHistAry));
};
//create the city buttons from history
function historyBtn(city) {
  var srchHistBtn = $("<button>")
    .addClass("btn")
    .text(city)
    .on("click", function () {
      $("#current-weather").remove();
      $("#forecast").empty();
      $("#five-day-header").remove();
      getWeather(city);
    })
    .attr({
      type: "button",
    });
  searchHist.append(srchHistBtn);
};

//function based on form- gets the value from the form and prevents searches that are stored in local sorage
function citySearchBtn(event) {
  event.preventDefault();

  var city = cityInput.val().trim();

  if (searchHistAry.searchedCity.includes(city)) {
    alert(
      city +
        " is in your previous search history, please click the " +
        city +
        " button below for upcoming weather data"
    );
    cityInput.val(" ");
  } else if (city) {
    getWeather(city);
    historyBtn(city);
    searchHistAry.searchedCity.push(city);
    saveCity();
    cityInput.val(" ");
  } else {
    alert("Please enter a city");
  }
};
//SPECIAL FUNCTIONS && CALL FUNCTIONS
// when the user enters the city get the info and get API data
formSearch.on("submit", citySearchBtn);
$("#form-search").on("click", function () {
  $("#forecast").empty();
  $("#five-day-header").remove();
  $("#current-weather").remove();
});

