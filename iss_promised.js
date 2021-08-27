const request = require('request-promise-native');

const urlForIP = "https://api.ipify.org?format=json";
const urlForGEO = "https://freegeoip.app/json/";
const urlForISS = "http://api.open-notify.org/iss-pass.json";

const fetchMyIP = function() {
  return request(urlForIP);
  // const ipJSON =  request(urlForIP);

  //  const ipJSON = request(urlForIP, (error, response, body) => {
  //    //console.log(response.IncomingMessage);

  //     // if (response.statusCode == 200) {
  //     //   const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
  //     //   throw Error(msg);
  //     // }

  //     //  throw Error('Make some errors!!!');
  //  });

  //  return ipJSON;
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