const https = require("https");
const fs = require("fs");

const dataCSU = [
  "https://volby.cz/pls/ps2006/vysledky",
  "https://volby.cz/pls/ps2010/vysledky",
  "https://volby.cz/pls/ps2013/vysledky",
  "https://volby.cz/pls/ps2017nss/vysledky",
];

dataCSU.forEach((url) => {
  const file = fs.createWriteStream(`data/vysledky${url.match(/\d{4}/g)}.xml`);
  https.get(url, (response) => response.pipe(file));
  console.log(file);
});