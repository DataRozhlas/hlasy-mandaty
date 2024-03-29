const fs = require("fs");
var convert = require("xml-js");

const roky = [2006, 2010, 2013, 2017];

roky.forEach((rok) => {
  const fileName = `vysledky${rok}.xml`;
  fs.readFile(`data/${fileName}`, "utf8", (err, data) => {
    const result = convert.xml2json(data, {
      compact: true,
      spaces: 4,
      nativeType: true,
      nativeTypeAttributes: true,
      ignoreDeclaration: true,
    });
    const file = fs.createWriteStream(`data/vysledky${rok}.json`);
    file.write(result);
    file.on("end", () => {
      file.end();
    });
  });
});
