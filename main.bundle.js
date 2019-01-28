/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

	'use strict';

	$(document).ready(function () {
	  checkUser();

	  $('#search-btn').click(function () {
	    return getForecast();
	  });

	  $('#search-input').keypress(function (e) {
	    if (e.keyCode === 13) {
	      $('#search-btn').click();
	    }
	  });

	  $('#login-btn').click(function () {
	    return login();
	  });

	  $('#add-favorite-btn').click(function () {
	    var location = $('#location').text();
	    postFavorite(location);
	  });
	});

	var getForecast = function getForecast() {
	  var location = document.querySelector('#search-input').value;
	  var url = 'https://sweater-weather-288.herokuapp.com/api/v1/forecast?location=' + location;
	  fetch(url).then(function (response) {
	    return response.json();
	  }).then(function (data) {
	    $(".weather").css("visibility", "visible");
	    displayCurrentWeather(data["data"]["attributes"]["current_weather"]);
	    displayHourlyForecast(data["data"]["attributes"]["hourly_forecast"]);
	    displayDailyForecast(data["data"]["attributes"]["daily_forecast"]);
	  }).catch(function (error) {
	    return console.error(error);
	  });
	};

	var login = function login() {
	  if (loggedIn()) {
	    sessionStorage.clear();
	    setFavoriteButton();
	    checkUser();
	  } else {
	    var url = 'https://sweater-weather-288.herokuapp.com/api/v1/sessions';
	    fetch(url, {
	      method: 'POST',
	      headers: { 'Content-Type': 'application/json' },
	      body: JSON.stringify({
	        email: 'whatever@example.com',
	        password: 'password'
	      })
	    }).then(function (response) {
	      return response.json();
	    }).then(function (data) {
	      sessionStorage.setItem("user_id", data["data"]["id"]);
	      sessionStorage.setItem("api_key", data["data"]["attributes"]["api_key"]);
	      $("#login-btn").text("Sign Out");
	      getFavorites();
	    }).catch(function (error) {
	      return console.error(error);
	    });
	  }
	};

	var postFavorite = function postFavorite(loc) {
	  var key = sessionStorage.getItem("api_key");
	  var url = 'https://sweater-weather-288.herokuapp.com/api/v1/favorites';
	  fetch(url, {
	    method: 'POST',
	    headers: { 'Content-Type': 'application/json' },
	    body: JSON.stringify({
	      location: loc,
	      api_key: key
	    })
	  }).catch(function (error) {
	    return console.error(error);
	  });
	  getFavorites();
	};

	var getFavorites = function getFavorites() {
	  var api_key = sessionStorage.getItem("api_key");
	  var url = 'https://sweater-weather-288.herokuapp.com/api/v1/favorites?api_key=' + api_key;
	  fetch(url).then(function (response) {
	    return response.json();
	  }).then(function (data) {
	    sessionStorage.setItem("favorites", JSON.stringify(data["data"]["attributes"]["favorites"]));
	    displayFavorites();
	  }).catch(function (error) {
	    return console.error(error);
	  });
	};

	var displayFavorites = function displayFavorites() {
	  var data = JSON.parse(sessionStorage.getItem("favorites"));
	  document.querySelector(".favorites-list").innerHTML = "";
	  if (data) {
	    $(".favorites").css("visibility", "visible");
	    var favs = document.querySelector(".favorites-list");
	    data.forEach(function (fav) {
	      var btn = document.createElement("button");
	      var text = document.createTextNode(fav["location"]);
	      btn.appendChild(text);
	      btn.addEventListener('click', function () {
	        displayFavoriteForecast(fav["location"]);
	      });
	      favs.appendChild(btn);
	      $(".favorites h3").text("");
	    });
	  } else {
	    $(".favorites h3").text("No Favorites Yet!");
	  }
	};

	var displayCurrentWeather = function displayCurrentWeather(data) {
	  $("#summary").text(data["summary"]);
	  $("#temp").text(data["temp"] + '\xB0');
	  $("#high").text('High:\xA0\xA0\xA0' + data["high"] + '\xB0');
	  $("#low").text('Low:\xA0\xA0\xA0' + data["low"] + '\xB0');
	  $("#location").text(data["location"]);
	  $("#date-time").text(data["date_time"]);
	  $("#hourly-summary").text(data["hourly_summary"]);
	  $("#feels-like").text('Feels Like:\xA0\xA0\xA0' + data["feels_like"] + '\xB0');
	  $("#humidity").text('Humidity:\xA0\xA0\xA0' + Math.round(data["humidity"] * 100) + '%');
	  $("#visibility").text('Visibility:\xA0\xA0\xA0' + data["visibility"] + ' miles');
	  $("#uv").text('UV Index:\xA0\xA0\xA0' + data["uv"]);
	  setFavoriteButton(data["location"]);
	};

	var displayHourlyForecast = function displayHourlyForecast(data) {
	  data.forEach(function (hour, index) {
	    $('#time-' + index).text('' + hour["time"]);
	    $('#temp-' + index).text(hour["temp"] + '\xB0');
	  });
	};

	var displayDailyForecast = function displayDailyForecast(data) {
	  data.forEach(function (day, index) {
	    $('#day-' + index).text('' + day["day"]);
	    $('#summary-' + index).text('' + day["summary"]);
	    $('#precip-' + index).text(Math.round(day["precip"] * 100) + '% Chance of Precipitation');
	    $('#high-' + index).text('High:\xA0\xA0\xA0\xA0' + day["high"] + '\xB0');
	    $('#low-' + index).text('Low:\xA0\xA0\xA0\xA0' + day["low"] + '\xB0');
	  });
	};

	var displayFavoriteForecast = function displayFavoriteForecast(location) {
	  var data = JSON.parse(sessionStorage.getItem("favorites"));
	  var favorite = data.find(function (obj) {
	    return obj.location === location;
	  });

	  $(".weather").css("visibility", "visible");
	  displayCurrentWeather(favorite["current_weather"]["current_weather"]);
	  displayHourlyForecast(favorite["current_weather"]["hourly_forecast"]);
	  displayDailyForecast(favorite["current_weather"]["daily_forecast"]);
	};

	var setFavoriteButton = function setFavoriteButton(location) {
	  if (loggedIn()) {
	    $('#add-favorite-btn').css("visibility", "visible");
	    var data = JSON.parse(sessionStorage.getItem("favorites"));
	    var favorite = data.find(function (obj) {
	      return obj.location === location;
	    });
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
	};

	var checkUser = function checkUser() {
	  if (loggedIn()) {
	    displayFavorites();
	    $("#login-btn").text("Sign Out");
	  } else {
	    $(".weather").css("visibility", "hidden");
	    $(".favorites").css("visibility", "hidden");
	    $("#login-btn").text("Sign In");
	  }
	};

	var loggedIn = function loggedIn() {
	  return sessionStorage.getItem("user_id");
	};

/***/ })
/******/ ]);