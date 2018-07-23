document.getElementById('pollen').addEventListener('click', getCount);
document.getElementById('postcodeFind').addEventListener('click', getPostcode);

//Get today's date
var today = new Date().toISOString().substr(0,10);

//Polyfill for non-ES6
if ( !String.prototype.contains ) {
    String.prototype.contains = function() {
        return String.prototype.indexOf.apply( this, arguments ) !== -1;
    };
}




function getCount(e) {
    //Stop form submitting
    e.preventDefault();

    //Get lat/long
    let loc = 'https://cors-anywhere.herokuapp.com/' +
    'https://socialpollencount.co.uk/api/forecast?location=[' +
    document.getElementById('location').value + ']';

    //Fetch from API
    fetch(loc, {
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
          // Show on page
          document.getElementById('levelText').innerHTML = reading.pollen_count;
          document.getElementById('levelText').classList.add("w3-animate");
        }
      })
    })
    .catch((err) => console.log(err))
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
      //console.log(data.result.postcode);
      let lat = data.result.latitude,
          lon = data.result.longitude;
      console.log(lat+','+lon);

    })
    .catch((err) => console.log(err))
}
