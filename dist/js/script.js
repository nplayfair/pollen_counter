// document.getElementById('pollen').addEventListener('click', getCount);
document.getElementById('postcodeFind').addEventListener('click', getPostcode);

//Get today's date
var today = new Date().toISOString().substr(0,10);

//Polyfill for non-ES6
if ( !String.prototype.contains ) {
    String.prototype.contains = function() {
        return String.prototype.indexOf.apply( this, arguments ) !== -1;
    };
}

function getPostcode(e) {
    //Stop form submitting
    e.preventDefault();

    //Get lat/long
    let pcode = 'https://api.postcodes.io/postcodes/' +
    document.getElementById('postcode').value;

    //Fetch from API
    fetch(pcode, {
      method: "GET",
    })
    .then((res) => res.json())
    .then((data) => {
      document.getElementById('foundLocation').innerHTML = "Today's level for " +data.result.nuts+ ":";
      let lat = data.result.latitude,
          lon = data.result.longitude;
      let latlonStr = data.result.latitude+','+data.result.longitude;
      console.log(latlonStr);
      grabCount(latlonStr);
    })
    .catch((err) => {

    })
}

function grabCount(latlon) {
  let queryString = 'https://cors-anywhere.herokuapp.com/https://socialpollencount.co.uk/api/forecast?location=[' +
    latlon + ']';
  console.log(queryString);

  fetch(queryString, {
    method: "GET",
  })
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
    let currentLevel = 'Unknown';
    data.forecast.forEach(function(reading) {
      if(reading.date.contains(today)) {
        //This is todays reading
        console.log("todays reading found");
        console.log(reading.pollen_count);
        // Show count on page
        document.getElementById('levelText').innerHTML = reading.pollen_count;
      }
    })
  })
  .catch((err) => console.log(err))
}
