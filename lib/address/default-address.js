const fs = require('fs');
const file = './lib/address/default-address.json';

let defaultAddress = false;
try {
  defaultAddress = fs.readFileSync(file)
} catch (e) {
  defaultAddress = false;
};

let saveAddress = (address) => {
  fs.writeFileSync(file, JSON.stringify(address));
};

let defineAddress = (address) => {
  return new Promise((resolve, reject) => {
    let definedAddress = { address: address };
    if (definedAddress) {
      saveAddress(definedAddress);
      resolve(definedAddress);
    } else {
      reject('Unable to write default address file');
    }
  });
};

let readAddress = () => {
  return new Promise((resolve, reject) => {
    if (defaultAddress) {
      resolve(JSON.parse(defaultAddress))
    } else {
      reject(`Unable to read this file: ${file}`);
    }
  });
};

let removeAddress = () => {
  return new Promise((resolve, reject) => {
    fs.access(file, fs.constants.F_OK, (err) => {
      if (err) {
        reject('Default address undefined');
      } else {
        fs.unlinkSync(file);
        resolve('Default address was removed');
      }
    });
  });
};

let logAddress = (log) => {
  let divider = '';
  for (let i = 0; i < log.address.length + 9; i++) {
    divider += '-';
  }
  console.log(`\n${divider}`);
  console.log(`Address: ${log.address}`);
  console.log(`${divider}\n`);
};

module.exports = { defaultAddress, defineAddress, readAddress, removeAddress, logAddress };
