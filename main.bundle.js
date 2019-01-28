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

	// import pry from 'pryjs';
	// import _ from 'underscore';
	// eval(pry.it)
	$(document).ready(function () {
	  if (sessionStorage.getItem("user_id")) {
	    displayFavorites();
	  }
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
	  // $('#logout-btn').click( () => login()); not implemented
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
	    getFavorites();
	  }).catch(function (error) {
	    return console.error(error);
	  });
	};

	var postFavorite = function postFavorite() {
	  var loc = "denver,co";
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
	  if (data) {
	    $(".favorites").css("visibility", "visible");
	    var favs = document.querySelector(".favorites");
	    data.forEach(function (datum) {
	      var btn = document.createElement("button");
	      var text = document.createTextNode(datum["location"]);
	      btn.appendChild(text);
	      favs.appendChild(btn);
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

	  // for (const [key, value] of Object.entries(data)) {
	  //   console.log(value);
	  //   $(`#${key}`).text(value);
	  // }
	  //  data(data, (key, value) => {
	  //   $(`#${key}`).text(value);
	  // })
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

/***/ })
/******/ ]);