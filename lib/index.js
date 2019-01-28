$(document).ready( () => {
  checkUser();

  $('#search-btn').click( () => getForecast());

  $('#search-input').keypress( e => {
    if (e.keyCode === 13) {
      $('#search-btn').click();
    }
  });

  $('#login-btn').click( () => login());

  $('#add-favorite-btn').click( () => {
    let location = $('#location').text();
    postFavorite(location);
  })
})

const getForecast = () => {
  let location = $('#search-input').val();
  let url = `https://sweater-weather-288.herokuapp.com/api/v1/forecast?location=${location}`;
  fetch(url)
  .then( response => response.json() )
  .then( data => {
    $(".weather").css("visibility", "visible");
    displayCurrentWeather(data["data"]["attributes"]["current_weather"]);
    displayHourlyForecast(data["data"]["attributes"]["hourly_forecast"]);
    displayDailyForecast(data["data"]["attributes"]["daily_forecast"]);
  })
  .catch( error => console.error(error) )
}

const login = () => {
  if (loggedIn()) {
    sessionStorage.clear();
    setFavoriteButton();
    checkUser();
  } else {
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
      $("#login-btn").text("Sign Out");
      getFavorites();
    })
    .catch( error => console.error(error) );
  }
}

const postFavorite = (loc) => {
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
  getFavorites();
}

const getFavorites = () => {
  let api_key = sessionStorage.getItem("api_key");
  let url = `https://sweater-weather-288.herokuapp.com/api/v1/favorites?api_key=${api_key}`;
  fetch(url)
  .then( response => response.json() )
  .then( data => {
    sessionStorage.setItem("favorites", JSON.stringify(data["data"]["attributes"]["favorites"]));
    displayFavorites();
  })
  .catch( error => console.error(error) );
}

const displayFavorites= () => {
  const data = JSON.parse(sessionStorage.getItem("favorites"));
  $(".favorites-list").remove();
  if (data) {
    $(".favorites").css("visibility", "visible");
    const favs = $(".favorites");
    const favList = $("div", {"class": "favorites-list"});
    favs.append(favList);
    data.forEach( (fav) => {
      let btn = $("<button>");
      let text = document.createTextNode(fav["location"]);
      btn.append(text);
      btn.click( () => {
        displayFavoriteForecast(fav["location"]);
      })
      favs.append(btn);
      $(".favorites h3").text("");

    })
  } else {
    $(".favorites h3").text("No Favorites Yet!");
  }
}

const displayCurrentWeather= (data) => {
  $("#summary").text(data["summary"]);
  $("#temp").text(`${data["temp"]}°`);
  $("#high").text(`High:\u00A0\u00A0\u00A0${data["high"]}°`);
  $("#low").text(`Low:\u00A0\u00A0\u00A0${data["low"]}°`);
  $("#location").text(data["location"]);
  $("#date-time").text(data["date_time"]);
  $("#hourly-summary").text(data["hourly_summary"]);
  $("#feels-like").text(`Feels Like:\u00A0\u00A0\u00A0${data["feels_like"]}°`);
  $("#humidity").text(`Humidity:\u00A0\u00A0\u00A0${Math.round(data["humidity"]*100)}%`);
  $("#visibility").text(`Visibility:\u00A0\u00A0\u00A0${data["visibility"]} miles`);
  $("#uv").text(`UV Index:\u00A0\u00A0\u00A0${data["uv"]}`);
  setFavoriteButton(data["location"])
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
      $(`#precip-${index}`).text(`${Math.round(day["precip"]*100)}% Chance of Precipitation`);
      $(`#high-${index}`).text(`High:\u00A0\u00A0\u00A0\u00A0${day["high"]}°`);
      $(`#low-${index}`).text(`Low:\u00A0\u00A0\u00A0\u00A0${day["low"]}°`);
  })
}

const displayFavoriteForecast= (location) => {
  const data = JSON.parse(sessionStorage.getItem("favorites"));
  const favorite = data.find( obj => obj.location === location );

  $(".weather").css("visibility", "visible");
  displayCurrentWeather(favorite["current_weather"]["current_weather"]);
  displayHourlyForecast(favorite["current_weather"]["hourly_forecast"]);
  displayDailyForecast(favorite["current_weather"]["daily_forecast"]);
}

const setFavoriteButton= (location) => {
  if (loggedIn()) {
    $('#add-favorite-btn').css("visibility", "visible");
    const data = JSON.parse(sessionStorage.getItem("favorites"));
    const favorite = data.find( obj => obj.location === location );
    if (favorite) {
      $('#add-favorite-btn').text("Already a Favorite");
      $('#add-favorite-btn').prop('disabled', true);
    } else {
      $('#add-favorite-btn').text("Add to Favorites");
      $('#add-favorite-btn').prop('disabled', false);
    }
  } else {
    $('#add-favorite-btn').css("visibility", "hidden");
  }
}

const checkUser= () => {
  if (loggedIn()) {
    displayFavorites();
    $("#login-btn").text("Sign Out");
  } else {
    $(".weather").css("visibility", "hidden");
    $(".favorites").css("visibility", "hidden");
    $("#login-btn").text("Sign In");
  }
}

const loggedIn= () => {
  return sessionStorage.getItem("user_id");
}
