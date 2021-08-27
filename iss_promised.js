const request = require('request-promise-native');

const urlForIP = "https://api.ipify.org?format=json";
const urlForGEO = "https://freegeoip.app/json/";
const urlForISS = "http://api.open-notify.org/iss-pass.json";

const fetchMyIP = function() {
  //Test - Custom error handling 
  return new Promise((resolve, reject) => {

    request(urlForIP, (error, response, body) => {
    
      if (response.statusCode != 200) {
        const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
        reject(new Error(msg));
        return;
      }

      const ipObj = JSON.parse(body);

      if (!ipObj.ip) {
        reject(new Error('Can\'t find your IP address'));
        return;
      }

      resolve(body);
      
    });
  });
  /***********************  
  Can't catch an error at a catch bracket after .then() when an error is thrown directly.
  ************************

   const ipJSON = request(urlForIP, (error, response, body) => {
     //console.log(response.statusCode); // It won't work. response is wrapped by somthing, I guess.

      // if (response.statusCode == 200) { //pretending 200 is error.
      //   const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      //   throw Error(msg);
      // }

      //  throw Error('Make some errors!!!');
   });

   return ipJSON;
  */
};

const fetchCoordsByIP = function(ipJSON) {
  const ipObj = JSON.parse(ipJSON);
  return request(urlForGEO + ipObj.ip);
};

const fetchISSFlyOverTimes = function(geoJSON) {
  const geoObj = JSON.parse(geoJSON);
  return request(`${urlForISS}?lat=${geoObj.latitude}&lon=${geoObj.longitude}`);
}

const nextISSTimesForMyLocation = function() {
  const response =
   fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((issObj) => {
      const { response } = JSON.parse(issObj);
      return response;
    });

  return response;
};

module.exports = { nextISSTimesForMyLocation };