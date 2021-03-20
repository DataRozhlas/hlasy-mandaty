const fs = require("fs");

const roky = [2006, 2010, 2013, 2017];

roky.forEach((rok) => {
  const data = JSON.parse(fs.readFileSync(`data/vysledky${rok}.json`, "utf8"));

  const result = {
    CR: {
      hlasy: data.VYSLEDKY.CR.UCAST._attributes.PLATNE_HLASY,
      strana: data.VYSLEDKY.CR.STRANA.map((strana) => {
        return {
          id: strana._attributes.KSTRANA,
          nazev: strana._attributes.NAZ_STR,
          hlasy: strana.HODNOTY_STRANA._attributes.HLASY,
          //proc: strana.HODNOTY_STRANA._attributes.PROC_HLASU,
        };
      }),
    },
    kraje: data.VYSLEDKY.KRAJ.map((kraj) => {
      return {
        id: kraj._attributes.CIS_KRAJ,
        nazev: kraj._attributes.NAZ_KRAJ,
        mandaty: kraj._attributes.POCMANDATU,
        //volici: kraj.UCAST._attributes.ZAPSANI_VOLICI,
        hlasy: kraj.UCAST._attributes.PLATNE_HLASY,
        strany: kraj.STRANA.map((strana) => {
          return {
            id: strana._attributes.KSTRANA,
            nazev: strana._attributes.NAZ_STR,
            hlasy: strana.HODNOTY_STRANA._attributes.HLASY,
            mandaty: strana.HODNOTY_STRANA._attributes.MANDATY
              ? strana.HODNOTY_STRANA._attributes.MANDATY
              : 0,
          };
        }),
      };
    }),
  };
  fs.writeFileSync(`data/${rok}.json`, JSON.stringify(result));
});
