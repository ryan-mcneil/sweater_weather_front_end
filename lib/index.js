
const locationForecast = () => {
  let location = document.getElementById('city-input').value;
  let url = `https://sweater-weather-288.herokuapp.com/api/v1/forecast?location=${location}`;
  fetch(url)
  .then( response => response.json() )
  .then( data => console.log(data) )
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
    sessionStorage.setItem("api_key", data["data"]["attributes"]["api_key"]);
  })
  .catch( error => console.error(error) );
  listFavorites();
}

// const postFavorite = () => {
//   let url = `https://sweater-weather-288.herokuapp.com/api/v1/forecast?location=${location}`;
// }

const listFavorites = () => {
  api_key = sessionStorage.getItem("api_key");
  let url = `https://sweater-weather-288.herokuapp.com/api/v1/favorites?api_key=${api_key}`;
  fetch(url)
  .then( response => response.json() )
  .then( data => console.log(data) )
  .catch( error => console.error(error) );
}


$('#city-input').keypress( e => {
  if (e.keyCode === 13) {
    $('#search').click();
  }
});
