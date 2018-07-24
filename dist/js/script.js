// document.getElementById('validatePostcode').addEventListener('click', validatePostcode);
document.getElementById('postcodeFind').addEventListener('click', getPostcode);

//Get today's date
var today = new Date().toISOString().substr(0,10);

//Polyfill for non-ES6
if ( !String.prototype.contains ) {
    String.prototype.contains = function() {
        return String.prototype.indexOf.apply( this, arguments ) !== -1;
    };
}

// function validatePostcode() {
//   let pcode = document.getElementById('postcode').value;
//   console.log('checking: '+pcode);
//   let validationString = 'https://api.postcodes.io/postcodes/'+pcode+'/validate';
//   fetch(validationString)
//   .then((res) => res.json())
//   .then((data) => {
//     if (data.result == true) {
//       console.log(data.result);
//       return true;
//     }
//     // else {
//     //   // document.getElementById('postcode').classList.add('has-error');
//     //   // document.getElementById('postcode').value = "Please enter a valid postcode";
//     //   return false;
//     // }
//   })
// }

function getPostcode(e) {
    //Stop form submitting
    e.preventDefault();
    let postcode = document.getElementById('postcode').value;

    //Validate postcode
    // document.getElementById('postcode').classList.remove('has-error');
    let validationString = 'https://api.postcodes.io/postcodes/'+postcode+'/validate';
    fetch(validationString)
    .then((res) => res.json())
    .then((data) => {
      if (data.result == true) {
        console.log(data.result);
      }
      else {
        console.log('invalid postcode');
        return false;
      }
    })

    //Get lat/long
    let pcode = 'https://api.postcodes.io/postcodes/' + postcode;

    //Fetch from API
    fetch(pcode)
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
      console.log(err);
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
        document.getElementById('levelText').classList.add('fadeInUp');
      }
    })
  })
  .catch((err) => console.log(err))
}
