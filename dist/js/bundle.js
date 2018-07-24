/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

// document.getElementById('validatePostcode').addEventListener('click', validatePostcode);
document.getElementById('postcodeFind').addEventListener('click', validatePostcode);

//Get today's date
var today = new Date().toISOString().substr(0,10);

//Polyfill for non-ES6
if ( !String.prototype.contains ) {
    String.prototype.contains = function() {
        return String.prototype.indexOf.apply( this, arguments ) !== -1;
    };
}

function validatePostcode(e) {
  //Stop form submitting
  e.preventDefault();

  let postcode = document.getElementById('postcode').value;
  // document.getElementById('postcode').classList.remove('has-error');
  let validationString = 'https://api.postcodes.io/postcodes/'+postcode+'/validate';
  fetch(validationString)
  .then((res) => res.json())
  .then((data) => {
    if (data.result == true) {
      console.log(data.result);
      getPostcode(postcode);
    }
    else {
      console.log(data.result);
      console.log('invalid postcode');
      return;
    }
  })
  .catch((err) => {
    console.log('error: ' + err);
  })
}

function getPostcode(p) {

    //Get lat/long
    let pcode = 'https://api.postcodes.io/postcodes/' + p;

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


/***/ })
/******/ ]);