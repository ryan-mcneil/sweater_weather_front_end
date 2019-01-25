// pry = require('pryjs');
// const _ = require('underscore');
// eval(pry.it)

const locationForecast = () => {
  let location = document.getElementById('search-input').value;
  let url = `https://sweater-weather-288.herokuapp.com/api/v1/forecast?location=${location}`;
  fetch(url)
  .then( response => response.json() )
  .then( data => {
    displayCurrentWeather(data["data"]["attributes"]["current_weather"]);
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
  for (const [key, value] of Object.entries(data)) {
    console.log(value);
    $(`#${key}`).text(value);
  }
  //  data(data, (key, value) => {
  //   $(`#${key}`).text(value);
  // })
  // $("#summary").text(data["summary"]);
}


$('#search-input').keypress( e => {
  if (e.keyCode === 13) {
    $('#search-btn').click();
  }
});
