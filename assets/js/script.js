// START GLOBAL VARIABLES 
    // API KEY: 8cbc334acb287238dc75bb0e902ac44d
    //moment.JS for date
let currentDay = moment().format("M/DD/YYYY")

let apiKey = "8cbc334acb287238dc75bb0e902ac44d";
let coordinatesURL = 'https://api.openweathermap.org/data/2.5/weather?q=';
let oneCallURL = 'https://api.openweathermap.org/data/2.5/onecall?lat=';
let iconURL = "http://openweathermap.org/img/wn/";
let formSearch = $("#city-search");
let forcastSection = $(".column2");
let cityInput = $("#input-city");
let forecast = $("#forecast");
let searchHist = $("#search-history");

let searhHistAry = loadSearch();

//DECLARE FUNCTIONS
   // get weather from API
function getWeather(city) {
     let apiCoordinatesURl = coordinatesURL + city + "&appid=" + apiKey;
     fetch(apiCoordinatesURl)
     .then(function(response){
        if(response.ok){
            response.json().then(function (weatherData){
                let cityLat = data.coord.lat;
                let cityLong = data.coord.lon;
                let apiOneCallURL = oneCallURL + cityLat + "&long=" + cityLong + "&appid=" + apiKey + "&units=imperial";
                fetch(apiOneCallURL)
                .then(function(response2){
                    if(response2.ok) {
                        response2.json().then(function(weatherdata){
                            let currentWeather= $("<div>").attr({
                                id:"current-weather"
                            })
                            let weatherIcon = weatherData.current.weather[0].icon;
                            let cityCurrentIcon = iconURL+ weatherIcon + ".png";
                            let currentWeatherHeader = $("<h2>").text(city + "(" + currentDay + ")");
                            let iconImg = $("<img>").attr({
                                id: "current-weather-icon",
                                src: cityCurrentIcon,
                                alt: "Current Weather Icon"
                            });
                            let currentWeatherList = $("<ul>");
                            let currentWeatherDetails =["Temperature: " + weatherData.current.temp + " °F", "Winds: " + weatherData.current.wind_speed + " MPH" + "Humidity: " + weatherData.current.humidity + "%" + "UV Index: " + weatherData.current.uvi]
                            for (let i = 0; i < currentWeatherDetails.length; i++) {
                                if(currentWeatherDetails[i]=== "UV Index: " + weatherData.current.uvi){
                                    let listItem = $("<li>").text("UV Index: ")
                                    currentWeatherList.append(listItem);
                                    let uviItem =$("<span>").text(weatherData.current.uvi);
                                    if (uviItem.text()<=2) {
                                        uviItem.addClass("favorable");
                                    } else if(uviItem.text() > 2 && uviItem.text()<= 7) {uviItem.addClass("moderate");
                                    }else {
                                        uviItem.addClass("severe");
                                    }
                                    listItem.append(uviItem); 
                                }else {
                                    let listItem = $("<li>").text(currentWeatherDetails[i])
                                    currentWeatherList.append(listItem);
                                }  
                            }
                            $("forecast").before(currentWeather);
                            currentWeather.append(currentWeatherHeader);
                            currentWeatherHeader.append(iconImg);
                            currentWeather.append(listItem);

                            var fiveDayHeader = $("<h2>").text("5 day Forecast:").attr({
                                id: "five-day-header"
                            });

                            $("#current-weather").after(fiveDayHeader);
                            
                            let forecastArr = [];
                            for (let i = 0; i < 5; i++) { let forecastDate = moment().add(i +1, "days").format("M/DD.YYYY");
                        forecastArr.push(forecastDate);
                     }
                     for (let i = 0; i < forecastArr.length; i++) {
                        let createCard = $("<div>").addClass("column3");
                        
                        let cardBody = $("<div>").addClass("card-body")

                        let cardTitle = $("<h3>").addClass("card-title").text(forecastArr[i]);

                        let forecastIcon = weatherData.daily[i].weater[0].icon;

                        let forecastIconAdd = $("<img>").attr({
                            src: weatherIcon + forecastIcon + ".png",
                            alt: "Weather Image"
                        });

                        let currentWeatherDetails =["Temperature: " + weatherData.current.temp + " °F", "Winds: " + weatherData.current.wind_speed + " MPH" + "Humidity: " + weatherData.current.humidity + "%" + "UV Index: " + weatherData.current.uvi];

                        let temp = $("<p>").addClass("card-text").text("Temperature: " + weatherData.daily[i].temp.max);

                        let wind = $("<p>").addClass("card-text").text("Wind " + weatherData.daily[i].wind_speed + " MPH");

                        let humidity = $("<p>").addClass("card-text").text("Humidity " + weatherData.daily[i].humidity + "%");

                        forecast.append(createCard);
                        createCard.append(cardBody);
                        cardBody.append(cardTitle);
                        cardBody.append(forecastIcon);
                        cardBody.append(temp);
                        cardBody.append(wind);
                        cardBody.append(humidity); 
                        }

                      })
                    }
                })
            });
        } else {
            alert ("Unable to find city");
        };
     })
     .catch(function (error){
        alert("Server Down, please try again later")
     });
}



    
    //display cities from the local storage and create history buttons
function loadSearch(){
    searchHistAry = JSON.parse(localStorage.getItem("search history"));
    if (!searchHistAry) {
        searchHistAry = {
            searchedCity: [],
        };
    } else {
        for (let i = 0; i < searchHistAry.searchedCity.length; i++) {
            searchHist(searchHistAry.searchedCity[i]);
            
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
    .addClass('btn')
    .text(city)
    .on("click", function () {
        $("#current-weather").remove();
        $("#forecast").empty();
        $("#five-day-header").remove();
        getWeather(city);
    })
    .attr({
        type: "button"
    });
    searchHist.append(srchHistBtn);
};


//SPECIAL FUNCTIONS && CALL FUNCTIONS
