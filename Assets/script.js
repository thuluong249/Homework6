var uv;
var searchHistory = [];
// store api key
const apiKey = "&appid=afaa8eea1769b4359fd8e07b2efcefbd";

let date = new Date();

$("#searchTerm").keypress(function (event) {

  if (event.keyCode === 12) {
    event.preventDefault();
    $("#searchBtn").click();
  }
});

$("#searchBtn").on("click", function () {
    // get the value of the input from user
    let city = $("#searchTerm").val();

    // clear input box
    $("#searchTerm").val("");  
  getCityWeather(city)
})
function getCityWeather(cityToSearchFor) {
let city = cityToSearchFor 

  $('#forecastH0', '#forecastH1', '#forecastH2', '#forecastH3', '#forecastH4').addClass('show');

  // full url to call api
  const queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + apiKey;

  $.ajax({
    url: queryUrl,
    method: "GET"
  })
    .then(function (response) {

      console.log(response)

      console.log(response.name)
      console.log(response.weather[0].icon)

      let tempF = (response.main.temp - 273.15) * 1.80 + 32;
      console.log(Math.floor(tempF))

      console.log(response.main.humidity)

      console.log(response.wind.speed)

      getCurrentConditions(response);
      getCurrentForecast(city);

      if(!searchHistory.includes(city)) {
        makeList(city);
        searchHistory.push(city);
      }

    })
};

function makeList(city) {
  let theCity = city
  let listItem = $("<li>").addClass("list-group-item").text(city);
  listItem.on("click", function(){
    getCityWeather(theCity)
  })
  $(".list").append(listItem);
}

function getCurrentConditions(response) {

  // get the temperature and convert to fahrenheit 
  let tempF = (response.main.temp - 273.15) * 1.80 + 32;
  tempF = Math.floor(tempF);

  $('#currentCity').empty();

  // get and set the content 

  const card = $("<div>").addClass("card");
  const cardBody = $("<div>").addClass("card-body");
  const city = $("<h4>").addClass("card-title").text(response.name);
  const cityDate = $("<h4>").addClass("card-title").text(date.toLocaleDateString('en-US'));
  const temperature = $("<p>").addClass("card-text current-temp").text("Temperature: " + tempF + " °F");
  const humidity = $("<p>").addClass("card-text current-humidity").text("Humidity: " + response.main.humidity + "%");
  const wind = $("<p>").addClass("card-text current-wind").text("Wind Speed: " + response.wind.speed + " MPH");
  const image = $("<img>").attr("src", "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png")

  // add to page
  city.append(cityDate, image)
  cardBody.append(city, temperature, humidity, wind);
  card.append(cardBody);
  $("#currentCity").append(card)

}

function getUVindex(lat, lon) {
  $.ajax({
    url: "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + apiKey,
    method: "GET"
  }).then(function (response) {
    console.log(response.current.uvi);
    uv = response.current.uvi;
    const uvindex = $("<p>").addClass("card-text current-uvindex").text("UVIndex: " + uv);
    $(".card-body").append(uvindex);
    $("#uvindex").text("test");
  })
}
function getCurrentForecast(city) {

  $.ajax({
    url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + apiKey,
    method: "GET"
  }).then(function (response) {
    getUVindex(response.city.coord.lat, response.city.coord.lon);
    console.log(response)
    $('#forecast').empty();

    // variable to hold response.list
    let results = response.list;
    console.log(results)

    for (let i = 0; i < results.length; i++) {

      let day = results[i].dt_txt.slice(0, 10);
      let dateArr = day.split("-");
      day = dateArr[1] + "/" + dateArr[2] + "/" + dateArr[0];
      //still need to do
      if (results[i].dt_txt.indexOf("12:00:00") !== -1) {

        // get the temperature and convert to fahrenheit 
        let temp = (results[i].main.temp - 273.15) * 1.80 + 32;
        let tempF = Math.floor(temp);

        const card = $("<div>").addClass("card col-md-2 ml-4 bg-primary text-white");
        const cardBody = $("<div>").addClass("card-body p-3 forecastBody")
        const cityDate = $("<h4>").addClass("card-title").text(day);
        const temperature = $("<p>").addClass("card-text forecastTemp").text("Temperature: " + tempF + " °F");
        const humidity = $("<p>").addClass("card-text forecastHumidity").text("Humidity: " + results[i].main.humidity + "%");

        const image = $("<img>").attr("src", "https://openweathermap.org/img/w/" + results[i].weather[0].icon + ".png")

        cardBody.append(cityDate, image, temperature, humidity);
        card.append(cardBody);
        $("#forecast").append(card);

      }
    }
  });

}


