# Sweater Weather

Sweater Weather is a simple, single page application that displays the current weather and forecast for a given location. As a Registered User, favorite locations can be managed (in progress). The deployed application can be found at https://ryan-mcneil.github.io/sweater_weather_front_end/. The application hits various endpoints of the Sweater Weather API, deployed to https://sweater-weather-288.herokuapp.com. Please see the documentation at https://github.com/ryan-mcneil/sweater_weather for more info.

## Initial Setup

1. Run `git clone git@github.com:ryan-mcneil/sweater_weather_front_end.git` in folder for the repository to live.

2. Run `npm install` to install necessary libraries locally

3. Run `npm start` and visit http://localhost:8080/ to visit the application running locally.

## How to use

 - A visitor can enter a city into the search field, and clicking the 'Get Forecast' button will display the forecast for that location.

 - A visitor can click 'Sign In' to see a list of their favorite locations, and a button to add new favorites

## Known Issues

 - The application currently does not support the ability to create users, and is using a single user from the database (although the backend does). Future iterations will utilize all of the backend features and provide the ability to create new users with separate favorite lists.

 - The application currently does not support the ability to delete favorites, but will be able to in future iterations.

 - The application currently does not parse and update location names to display them correctly. It sends the input to the backend as-is. Error handling for this will be introduced in future iterations.

## Testing

 - Against my better judgement, the front end of this application is not tested. My experience testing in Node Mocha is limited, and with 5 days to build the project, I decided to do all of my testing live, in the console. SAD.

## How to Contribute

 - Please send any pull requests if you'd like to make any additions!

## Built With

 * [JavaScript](https://www.javascript.com/)
 * [Node.js](https://nodejs.org/en/)
 * [jQuery](https://jquery.com/)

### UI Inspiration
 - https://dribbble.com/shots/4594119-Weather-App#
 - https://dribbble.com/search?q=weather

### Color Scheme

 - https://coolors.co/cacaaa-eec584-c8ab83-55868c-7f636e
