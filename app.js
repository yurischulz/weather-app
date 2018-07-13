console.time('app');

const _ = require('lodash');
const yargs = require('yargs');
const axios = require('axios');
const lib = {
  address: require('./lib/address/default-address.js'),
  weather: require('./lib/weather/weather.js')
};
const gmapsKey = 'AIzaSyDnBMIpbLiqALJWACM9dcsXh_LONeqDEqI';
const forecastKey = 'ce96524e3ceb9f7adf438b8d59d3f683';
const argvOptions = {
  a: {
    demand: false,
    alias: 'address',
    describe: 'Address to fetch weather for',
    string: true
  }
}

let argv = yargs
  .options({
    a: argvOptions.a
  })
  .command('add', 'Add default address', {
    a: argvOptions.a
  })
  .command('read', 'Read default address')
  .command('remove', 'Remove default address')
  .help()
  .alias('help', 'h')
  .argv;
let encodedAddress = argv.address ? encodeURIComponent(argv.address) : lib.address.defaultAddress ? encodeURIComponent(lib.address.defaultAddress) : false;
let gmapsUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${gmapsKey}`
let command = argv._[0];

if (encodedAddress && command !== 'remove') {
  axios.get(gmapsUrl)
  .then((response) => {
    if (response.data.status === 'ZERO_RESULTS') {
      throw new Error('Unable to find that address.');
    }
    let address = {
      address: response.data.results[0].formatted_address,
      latitude: response.data.results[0].geometry.location.lat,
      longitude: response.data.results[0].geometry.location.lng
    }
    let forecastUrl = `https://api.darksky.net/forecast/${forecastKey}/${address.latitude},${address.longitude}`;
    lib.address.logAddress(address);
    return axios.get(forecastUrl);
  })
  .then((response) => {
    let weather = {
      time: response.data.currently.time,
      summary: response.data.currently.summary,
      temperature: response.data.currently.temperature,
      apparentTemperature: response.data.currently.apparentTemperature,
      daily: response.data.daily.summary
    }
    lib.weather.logWeather(weather);
  })
  .catch((e) => {
    if (e.code === 'ENOTFOUND') {
      console.log('Unable to connect to API servers.');
    } else {
      console.log(e.message);
    }
  });
} else if (!command) {
  console.log('No such address to fetch');
}

if (command) {
  switch (command) {
    case 'add':
      lib.address.defineAddress(argv.address)
      .then((res) => {
        console.log('Default address defined');
        lib.address.logAddress(res);
      }, (errorMessage) => {
        console.log(errorMessage);
      });
      break;
    case 'read':
      lib.address.readAddress()
      .then((res) => {
        console.log('Default address found');
        lib.address.logAddress(res);
      }, (errorMessage) => {
        console.log(errorMessage);
      });
      break;
    case 'remove':
      lib.address.removeAddress()
      .then((res) => {
        console.log(res);
      }, (errorMessage) => {
        console.log(errorMessage);
      });
      break;
    default:
      console.log('Oooopss... Something looks wrong');
      break;
  }
}

console.timeEnd('app');
