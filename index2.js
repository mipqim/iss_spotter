const { nextISSTimesForMyLocation } = require('./iss_promised');

// fetchMyIP()
//   .then(fetchCoordsByIP)
//   .then(fetchISSFlyOverTimes)
//   .then(body => console.log(body));

nextISSTimesForMyLocation()
  .then(passTimes => {
    for (passTime of passTimes) {
      const dateTime = new Date(0);
      dateTime.setUTCSeconds(passTime.risetime);

      console.log(`Next pass at ${dateTime.toString()} for ${passTime.duration} seconds!`);
    }
  })
  .catch(error => {
    console.log("It didn't work: ", error.message);
  });