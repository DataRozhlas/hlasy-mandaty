import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import SelectKraj from "./SelectKraj.jsx";
import Box from "@material-ui/core/Box";
import Link from "@material-ui/core/Link";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import GrafSnemovna from "./GrafSnemovna.jsx";
import Tooltip from "@material-ui/core/Tooltip";

const useStyles = makeStyles((theme) => {
  return {
    boxik: {
      borderLeft: "0.2rem solid",
      paddingLeft: "1rem",
      borderColor: "#64dd17",
      alignSelf: "flex-start",
    },
  };
});

const url = "https://www.psp.cz/sqw/text/orig2.sqw?idd=186875";

const bendaRepublika = (vysledky) => {
  // § 49

  const jenPostupujiciStranyCR = {
    ...vysledky,
    CR: {
      ...vysledky.CR,
      strana: vysledky.CR.strana.filter((strana) => strana.proc > 5),
    },
  };

  const jenPostupujiciStrany = {
    ...jenPostupujiciStranyCR,
    kraje: jenPostupujiciStranyCR.kraje.map((kraj) => {
      return {
        ...kraj,
        strany: kraj.strany.filter((strana) =>
          jenPostupujiciStranyCR.CR.strana
            .map((i) => i.nazev)
            .includes(strana.nazev)
        ),
      };
    }),
  };
  // § 50 / 2
  const hlasyPostupujicich = jenPostupujiciStrany.kraje.map((kraj) => {
    return {
      ...kraj,
      hlasyPostupujicich: kraj.strany.reduce((acc, curr) => {
        return acc + curr.hlasy;
      }, 0),
    };
  });
  const postupujiciSectene = {
    ...jenPostupujiciStrany,
    kraje: hlasyPostupujicich.map((kraj) => {
      return {
        ...kraj,
        krajskeVolebniCislo: Math.round(
          kraj.hlasyPostupujicich / (kraj.mandaty + 2)
        ),
      };
    }),
  };
  // § 50 / 3
  const mandatyHrube = {
    ...postupujiciSectene,
    kraje: postupujiciSectene.kraje.map((kraj) => {
      return {
        ...kraj,
        strany: kraj.strany.map((strana) => {
          return {
            ...strana,
            mandatyHrube: Math.floor(strana.hlasy / kraj.krajskeVolebniCislo),
            zbytek: strana.hlasy % kraj.krajskeVolebniCislo,
          };
        }),
      };
    }),
  };
  // § 50 / 4 bylo v některém kraji přiděleno příliš mnoho mandátů?

  const mandatyHrubeKontrola = {
    ...mandatyHrube,
    kraje: mandatyHrube.kraje.map((kraj) => {
      return {
        ...kraj,
        mandatyHrube: kraj.strany.reduce((acc, curr) => {
          return acc + curr.mandatyHrube;
        }, 0),
      };
    }),
  };

  const mandatyKorekce = {
    ...mandatyHrubeKontrola,
    kraje: mandatyHrubeKontrola.kraje.map((kraj) => {
      if (kraj.mandatyHrube > kraj.mandaty) {
        kraj.strany.sort((a, b) => (a.zbytek > b.zbytek ? 1 : -1));
        const rozdil = kraj.mandatyHrube - kraj.mandaty;
        return {
          ...kraj,
          strany: kraj.strany.map((strana, i) => {
            if (i < rozdil) {
              return { ...strana, mandatyKorekce: 1 };
            } else return strana;
          }),
        };
      } else return kraj;
    }),
  };

  // § 51 / 1 kolik mandátů zbývá rozdělit ve druhém skrutiniu?

  const zbyvaRozdelit = {
    ...mandatyKorekce,
    druheSkrutinium: {
      rozdeleno: mandatyKorekce.kraje.reduce((acc, curr) => {
        return (
          acc +
          (curr.mandatyHrube > curr.mandaty ? curr.mandaty : curr.mandatyHrube)
        );
      }, 0),
      strany: mandatyKorekce.CR.strana.map((strana) => {
        return {
          ...strana,
          nevyuziteHlasy: mandatyKorekce.kraje.reduce((acc, curr) => {
            return (
              acc +
              curr.strany.filter((i) => i.nazev === strana.nazev)[0].zbytek
            );
          }, 0),
        };
      }),
    },
  };

  const secistNevyuzite = {
    ...zbyvaRozdelit,
    druheSkrutinium: {
      ...zbyvaRozdelit.druheSkrutinium,
      nevyuziteHlasy: zbyvaRozdelit.druheSkrutinium.strany.reduce(
        (acc, curr) => {
          return acc + curr.nevyuziteHlasy;
        },
        0
      ),
    },
  };

  const zjistitKvotu = {
    ...secistNevyuzite,
    druheSkrutinium: {
      ...secistNevyuzite.druheSkrutinium,
      kvota: Math.round(
        secistNevyuzite.druheSkrutinium.nevyuziteHlasy /
          (200 - secistNevyuzite.druheSkrutinium.rozdeleno + 1)
      ),
    },
  };

  const pridelMandaty = {
    ...zjistitKvotu,
    druheSkrutinium: {
      ...zjistitKvotu.druheSkrutinium,
      strany: zjistitKvotu.druheSkrutinium.strany.map((strana) => {
        return {
          ...strana,
          mandaty: Math.floor(
            strana.nevyuziteHlasy / zjistitKvotu.druheSkrutinium.kvota
          ),
          zbytek: strana.nevyuziteHlasy % zjistitKvotu.druheSkrutinium.kvota,
        };
      }),
    },
  };

  const rozdelenoVprvnimKroku = {
    ...pridelMandaty,
    druheSkrutinium: {
      ...pridelMandaty.druheSkrutinium,
      rozdelenoVprvnimKroku: pridelMandaty.druheSkrutinium.strany.reduce(
        (acc, curr) => {
          return acc + curr.mandaty;
        },
        0
      ),
    },
  };

  const doserMandaty = {
    ...rozdelenoVprvnimKroku,
    druheSkrutinium: {
      ...rozdelenoVprvnimKroku.druheSkrutinium,
      strany: rozdelenoVprvnimKroku.druheSkrutinium.strany
        .sort((a, b) => (a.zbytek < b.zbytek ? 1 : -1))
        .map((strana, i) => {
          return {
            ...strana,
            extramandat:
              i <
              200 -
                (rozdelenoVprvnimKroku.druheSkrutinium.rozdelenoVprvnimKroku +
                  rozdelenoVprvnimKroku.druheSkrutinium.rozdeleno)
                ? 1
                : 0,
          };
        }),
    },
  };

  const doGrafu = {
    ...doserMandaty,
    graf: doserMandaty.druheSkrutinium.strany.map((strana) => {
      return [
        strana.zkratka,
        strana.mandaty +
          strana.extramandat +
          doserMandaty.kraje.reduce((acc, curr) => {
            const partaj = curr.strany.filter(
              (i) => i.nazev === strana.nazev
            )[0];
            const result = partaj.mandatyKorekce
              ? partaj.mandatyHrube - partaj.mandatyKorekce
              : partaj.mandatyHrube;
            return acc + result;
          }, 0),
      ];
    }),
  };
  return doGrafu;
};

function Benda({ rok, krok, vysledky, kvota, kraj, setKraj }) {
  const classes = useStyles();

  switch (krok) {
    case false:
      return null;
    case 1:
      return null;
    case 2:
      return (
        <Typography paragraph={true} className={classes.boxik}>
          <Link href={url} target="_blank">
            V návrhu poslance ODS Marka Bendy
          </Link>
          , který sněmovna projedná ve druhém čtení, je hranice pro dvoučlenné
          koalice stanovena na 8 % a pro počtenější na 11 % hlasů.
        </Typography>
      );
    case 3:
      return (
        <Typography paragraph={true} className={classes.boxik}>
          Návrh Marka Bendy, který získal díky hlasům ANO a SPD podporu ústavně
          právního výboru, chce <em>republikové mandátové číslo</em> zachovat ve
          stejné podobě: <strong>{kvota.toLocaleString("cs-CZ")}</strong>. V
          další fázi by se pak mandáty v krajích rozdělovaly pomocí{" "}
          <em>Imperialiho kvóty</em>.
        </Typography>
      );
    case 4:
      return (
        <Typography paragraph={true} className={classes.boxik}>
          Ústavně právní výbor a poslanec Benda navrhují tento postup zachovat.
        </Typography>
      );
    case 5:
      const bendaVysledky = bendaRepublika(vysledky);
      const bendaVysledkyKraj = bendaVysledky.kraje.filter(
        (i) => i.nazev === kraj
      )[0];
      const krajskaKvota = bendaVysledkyKraj.mandaty + 2;
      const zbyvaRozdelit =
        bendaVysledkyKraj.mandaty - bendaVysledkyKraj.mandatyHrube;
      return (
        <Box className={classes.boxik}>
          <Typography paragraph={true}>
            Podle návrhu poslance Bendy by se mandáty v krajích rozdělovaly
            pomocí Imperialiho kvóty: součet hlasů pro strany, které postupují
            do sněmovny, se v každém kraji vydělí počtem mandátů, jež tomuto
            kraji připadly, zvětšeným o dva. Názorná ukázka:
          </Typography>
          <Box display="flex" justifyContent="center">
            <SelectKraj
              kraj={kraj}
              setKraj={setKraj}
              id="bendaselect"
            ></SelectKraj>
          </Box>
          <Typography paragraph={true}>
            Ve vybraném kraji se má rozdělit {krajskaKvota - 2} mandátů + 2 ={" "}
            {krajskaKvota}. Postupující strany zde dostaly dohromady{" "}
            {bendaVysledkyKraj.hlasyPostupujicich.toLocaleString("cs-CZ")}{" "}
            hlasů. Dál tedy budeme počítat se zaokroulenou kvótou{" "}
            <strong>
              {bendaVysledkyKraj.krajskeVolebniCislo.toLocaleString("cs-CZ")}
            </strong>{" "}
            (tj. {bendaVysledkyKraj.hlasyPostupujicich.toLocaleString("cs-CZ")}{" "}
            : {krajskaKvota}). Tou se u každé strany vydělí počet hlasů.
            Kolikrát se do něj kvóta vejde, tolik by měla mít strana mandátů.{" "}
          </Typography>
          <Box display="flex" flexWrap="wrap" justifyContent="center" mb={2}>
            {bendaVysledkyKraj.strany
              .sort((a, b) => (a.hlasy < b.hlasy ? 1 : -1))
              .map((strana) => {
                if (strana.mandatyHrube > 0)
                  return (
                    <Card
                      key={strana.id}
                      variant="outlined"
                      style={{ margin: "0.2rem" }}
                    >
                      <CardContent>
                        <Typography
                          variant="subtitle2"
                          align="center"
                          gutterBottom={true}
                        >
                          {strana.zkratka}
                        </Typography>
                        <Typography variant="body2" align="center">
                          {strana.mandatyHrube}{" "}
                          {strana.mandatyHrube === 1
                            ? "mandát"
                            : strana.mandatyHrube < 5
                            ? "mandáty"
                            : "mandátů"}
                        </Typography>
                        <Typography variant="body2" align="center">
                          za {strana.hlasy.toLocaleString("cs-CZ")} hlasů
                        </Typography>
                        <Typography variant="body2" align="center">
                          (zbytek {strana.zbytek.toLocaleString("cs-CZ")})
                        </Typography>
                      </CardContent>
                    </Card>
                  );
              })}
          </Box>
          {zbyvaRozdelit < 0 ? (
            <Typography paragraph={true}>
              V kraji se podařilo rozdělit o {-zbyvaRozdelit}{" "}
              {-zbyvaRozdelit === 1
                ? "mandát"
                : -zbyvaRozdelit < 5
                ? "mandáty"
                : "mandátů"}{" "}
              víc než kolik mu připadlo v kroku 4. Je proto potřeba odebrat{" "}
              {-zbyvaRozdelit > 1
                ? "tyto mandáty stranám"
                : "tento mandát straně"}{" "}
              s nejnižším zbytkem po dělení (
              {bendaVysledkyKraj.strany
                .filter((strana) => strana.mandatyKorekce)
                .map((strana) => strana.nazev)
                .join(", ")}
              ).
            </Typography>
          ) : null}
          {zbyvaRozdelit > 0 ? (
            <Typography paragraph={true}>
              V kraji se podařilo rozdělit o {zbyvaRozdelit}{" "}
              {zbyvaRozdelit === 1
                ? "mandát"
                : zbyvaRozdelit < 5
                ? "mandáty"
                : "mandátů"}{" "}
              míň než kolik mu připadlo v kroku 4.{" "}
              {zbyvaRozdelit === 1
                ? "Tento mandát se bude"
                : "Tyto mandáty se budou"}{" "}
              rozdělovat v dalším kroku.
            </Typography>
          ) : null}
        </Box>
      );
    case 6:
      const v = bendaRepublika(vysledky);
      return (
        <Box className={classes.boxik}>
          <Typography paragraph={true}>
            Druhé skrutinium si můžeme představit jako další volební kraj, do
            kterého se převede{" "}
            {v.druheSkrutinium.nevyuziteHlasy.toLocaleString("cs-CZ")}{" "}
            „nevyužitých“ hlasů postupujících stran ze zbytků při dělení v
            ostatních krajích. V minulém kroku se metodou poslance Bendy
            podařilo rozdělit {v.druheSkrutinium.rozdeleno} mandátů, zbývá tedy{" "}
            {200 - v.druheSkrutinium.rozdeleno}. Strany si je rozdělí
            následovně:
          </Typography>
          <Box display="flex" flexWrap="wrap" justifyContent="center" mb={2}>
            {v.druheSkrutinium.strany
              .sort((a, b) => (a.nevyuziteHlasy < b.nevyuziteHlasy ? 1 : -1))
              .map((strana) => {
                if (strana.mandaty > 0 || strana.extramandat > 0)
                  return (
                    <Card
                      key={strana.id}
                      variant="outlined"
                      style={{ margin: "0.2rem" }}
                    >
                      <CardContent>
                        <Typography
                          variant="subtitle2"
                          align="center"
                          gutterBottom={true}
                        >
                          {strana.zkratka}
                        </Typography>
                        <Typography variant="body2" align="center">
                          {strana.mandaty + strana.extramandat}{" "}
                          {strana.mandaty + strana.extramandat === 1
                            ? "mandát"
                            : strana.mandaty + strana.extramandat < 5
                            ? "mandáty"
                            : "mandátů"}
                        </Typography>
                        <Typography variant="body2" align="center">
                          za {strana.nevyuziteHlasy.toLocaleString("cs-CZ")}{" "}
                          hlasů
                        </Typography>
                      </CardContent>
                    </Card>
                  );
              })}
          </Box>
          <Typography paragraph={true}>
            Největší kritiku zatím návrh sklidil za to, že dává stranám možnost,
            aby si samy vybraly pořadí krajslých kandidátek, z nichž by se
            mandáty ve druhém skrutiniu obsazovaly. Kdyby tak neučinily do
            dvanácti hodin od sečtení voleb, mandáty by automaticky spadly do
            krajů s největšími zbytky po dělení hlasů v prvním skrutiniu.
          </Typography>
        </Box>
      );
    case 7:
      const d = bendaRepublika(vysledky);
      return (
        <Box className={classes.boxik}>
          <GrafSnemovna
            data={d.graf}
            titulek={`${rok}, návrh poslance Bendy`}
          ></GrafSnemovna>
        </Box>
      );
    case 8:
      return <div>povidy8</div>;
  }
}

export default Benda;
