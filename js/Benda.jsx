import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import SelectKraj from "./SelectKraj.jsx";
import Box from "@material-ui/core/Box";
import Link from "@material-ui/core/Link";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
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

function Benda({
  krok,
  vysledky,
  postupuji,
  kvota,
  kraj,
  setKraj,
  krajeDhondt,
  setScrollTarget,
}) {
  const classes = useStyles();
  const postupujiNazvy = postupuji.map((strana) => strana.nazev);
  const bendaRepublika = (vysledky) => {
    // § 49
    const jenPostupujiciStranyCR = vysledky.CR.strana.filter((strana) =>
      postupujiNazvy.includes(strana.nazev)
    );
    const jenPostupujiciStranyKraje = vysledky.kraje.map((kraj) => {
      return {
        ...kraj,
        strany: kraj.strany.filter((strana) =>
          postupujiNazvy.includes(strana.nazev)
        ),
      };
    });
    const jenPostupujiciStrany = {
      CR: { ...vysledky.CR, strana: jenPostupujiciStranyCR },
      kraje: jenPostupujiciStranyKraje,
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

    return mandatyKorekce;
  };

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
      console.log(bendaVysledky);
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
              setScrollTarget={setScrollTarget}
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
                          {strana.hlasy.toLocaleString("cs-CZ")} hlasů
                        </Typography>
                        <Typography variant="body2" align="center"></Typography>
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
      return (
        <Typography>Podle návrhu poslance Bendy zbývá rozdělit {}</Typography>
      );
    case 7:
      return <div>povidy7</div>;
    case 8:
      return <div>povidy8</div>;
  }
}

export default Benda;
