// import pry from 'pryjs';
// import _ from 'underscore';
// eval(pry.it)
$(document).ready( () => {
  $('#search-btn').click( () => getForecast());

  $('#search-input').keypress( e => {
    if (e.keyCode === 13) {
      $('#search-btn').click();
    }
  });

  $('#login-btn').click( () => login());
  // $('#logout-btn').click( () => login()); not implemented

})

const getForecast = () => {
  console.log("hi");
  let location = document.querySelector('#search-input').value;
  let url = `https://sweater-weather-288.herokuapp.com/api/v1/forecast?location=${location}`;
  fetch(url)
  .then( response => response.json() )
  .then( data => {
    displayCurrentWeather(data["data"]["attributes"]["current_weather"]);
    displayHourlyForecast(data["data"]["attributes"]["hourly_forecast"]);
    displayDailyForecast(data["data"]["attributes"]["daily_forecast"]);
  })
  .catch( error => console.error(error) )
}

const login = () => {
  let url = `https://sweater-weather-288.herokuapp.com/api/v1/sessions`;
  fetch(url, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      email: 'whatever@example.com',
      password: 'password'
    })
  })
  .then( response => response.json() )
  .then( data => {
    sessionStorage.setItem("user_id", data["data"]["id"]);
    sessionStorage.setItem("api_key", data["data"]["attributes"]["api_key"]);
  })
  .catch( error => console.error(error) );
  listFavorites();
}

const postFavorite = () => {
  let loc = "denver,co";
  let key = sessionStorage.getItem("api_key");
  let url = `https://sweater-weather-288.herokuapp.com/api/v1/favorites`;
  fetch(url, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      location: loc,
      api_key: key,
    })
  })
  .catch( error => console.error(error) );
  listFavorites();
}

const listFavorites = () => {
  let api_key = sessionStorage.getItem("api_key");
  let url = `https://sweater-weather-288.herokuapp.com/api/v1/favorites?api_key=${api_key}`;
  fetch(url)
  .then( response => response.json() )
  .then( data => console.log(data) )
  .catch( error => console.error(error) );
}

const displayCurrentWeather= (data) => {
  $("#summary").text(data["summary"]);
  $("#temp").text(`${data["temp"]}°`);
  $("#high").text(`${data["high"]}°`);
  $("#low").text(`${data["low"]}°`);
  $("#location").text(data["location"]);
  $("#date_time").text(data["date_time"]);
  $("#hourly_summary").text(data["hourly_summary"]);
  $("#feels_like").text(`Feels Like: ${data["feels_like"]}°`);
  $("#humidity").text(`Humidity: ${data["humidity"]}`);
  $("#visibility").text(`Visibility: ${data["visibility"]}`);
  $("#uv").text(`UV: ${data["uv"]}`);

  // for (const [key, value] of Object.entries(data)) {
  //   console.log(value);
  //   $(`#${key}`).text(value);
  // }
  //  data(data, (key, value) => {
  //   $(`#${key}`).text(value);
  // })
}

const displayHourlyForecast= (data) => {
  data.forEach( (hour, index) => {
      $(`#time-${index}`).text(`${hour["time"]}`);
      $(`#temp-${index}`).text(`${hour["temp"]}°`);
  })
}

const displayDailyForecast= (data) => {
  data.forEach( (day, index) => {
      $(`#day-${index}`).text(`${day["day"]}`);
      $(`#summary-${index}`).text(`${day["summary"]}`);
      $(`#precip-${index}`).text(`${day["precip"]}`);
      $(`#high-${index}`).text(`${day["high"]}°`);
      $(`#low-${index}`).text(`${day["low"]}°`);
  })
}
