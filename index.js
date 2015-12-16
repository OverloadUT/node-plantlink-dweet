require('dotenv').load();
var request = require('request');
var dweetClient = require('node-dweetio');
var dweetio = new dweetClient();
var _ = require('underscore');

var commandLineArgs = require('command-line-args');
var cli = commandLineArgs([
  { name: 'repeat', alias: 'r', type: Number, defaultValue: 0 }
]);
var options = cli.parse();

var lastplants = {};

function StripDownPlantLinkData(rawplantlinkdata) {
  var plants = {};
  rawplantlinkdata.forEach(function(plant) {
    plants[plant.name] = {
      moisture: plant.last_measurements[0].moisture,
      battery: plant.last_measurements[0].battery,
      fuel_level: plant.last_measurements[0].plant_fuel_level,
      predicted_water_needed: plant.last_measurements[0].predicted_water_needed,
      last_watered: plant.last_watered_datetime
    };
    //console.log(plant);
  });

  return plants;
}

var main = function main() {
  var jar = request.jar();
  var authcookie = request.cookie('auth="' + process.env.PLANTLINK_AUTH+'"');
  jar.setCookie(authcookie, 'https://dashboard.myplantlink.com');

  request({jar: jar, url: 'https://dashboard.myplantlink.com/api/v1/plants'}, function(error, response, body) {
      if(!error && response.statusCode >= 200 && response.statusCode < 300) {
        var rawplantlinkdata = JSON.parse(body);
        var plants = StripDownPlantLinkData(rawplantlinkdata);

        if(!_.isEqual(plants, lastplants)) {
          dweetio.dweet_for(process.env.DWEETIO_THINGNAME, {plants: plants}, function(err, dweet) {
            if (err) {
              console.error("Dweet error");
            } else {
              console.log("Successful dweet!", dweet);
            }
          });
        } else {
          console.log("No changes...")
        }
        lastplants = plants;
      } else {
        console.log("Error", error);
      }
    });
};

if(options.repeat > 0) {
  setInterval(main, options.repeat * 1000)
}
main();