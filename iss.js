const request = require('request');

const urlForIP = "https://api.ipify.org?format=json";
const urlForGEO = "https://freegeoip.app/json/";
const urlForISS = "http://api.open-notify.org/iss-pass.json";

const fetchMyIP = function(callback) {

  request(urlForIP, (error, response, body) => {

    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const ipObj = JSON.parse(body);
  
    if (!ipObj.ip) {
      callback(`Can't find your IP address`, null);
      return;
    }

    callback(null, ipObj.ip);
  });

};

const fetchCoordsByIP = function(ip, callback) {

  request(urlForGEO + ip, (error, response, body) => {

    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching GEO. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const geoObj = JSON.parse(body);
  
    if (!geoObj.latitude || !geoObj.longitude) {
      callback(`Can't find your GEO Data`, null);
      return;
    }

    const { latitude, longitude } = geoObj;

    callback(null, {latitude, longitude});
  });

};


const fetchISSFlyOverTimes = function(coords, callback) {

  request(`${urlForISS}?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {

    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching ISS Data. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const issObj = JSON.parse(body);
  
    if (!issObj.response) {
      callback(`Can't find any ISS Data`, null);
      return;
    }

    callback(null, issObj.response);
  });


};

const nextISSTimesForMyLocation = function(callback) {
  
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }
  
    fetchCoordsByIP(ip, (error, dataGEO) => {
      if (error) {
        return callback(error, null);
      }
  
      fetchISSFlyOverTimes(dataGEO, (error, dataISS) => {
        if (error) {
          return callback(error, null);
        }

        callback(error, dataISS);
      });
    });
  });  
}

module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation };