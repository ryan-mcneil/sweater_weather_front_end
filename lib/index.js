const locationForecast = () => {
  let location = document.getElementById('city-input').value;
  let url = `https://sweater-weather-288.herokuapp.com/api/v1/forecast?location=${location}`;
  fetch(url)
  .then( response => response.json() )
  .then( data => console.log(data) )
  .catch( error => console.error(error) )
}


const postFavorite = () => {
  let url = `https://sweater-weather-288.herokuapp.com/api/v1/forecast?location=${location}`;
}

$('#city-input').keypress(function(e) {
  if (e.keyCode === 13) {
    $('#search').click();
  }
});
