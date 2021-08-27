const { nextISSTimesForMyLocation } = require('./iss');

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }

  for (passTime of passTimes) {
    const dateTime = new Date(0);
    dateTime.setUTCSeconds(passTime.risetime);

    console.log(`Next pass at ${dateTime.toString()} for ${passTime.duration} seconds!`);
  }
});



