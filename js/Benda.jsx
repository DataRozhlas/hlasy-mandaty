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
}) {
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
      const krajskaKvota = krajeDhondt(vysledky, false, kraj) + 2;
      const hlasyPostupujicimvKraji = vysledky.kraje
        .filter((i) => {
          return i.nazev === kraj;
        })[0]
        .strany.reduce((acc, curr) => {
          return curr.mandaty > 0 ? acc + curr.hlasy : acc;
        }, 0);
      const imperiali = Math.round(hlasyPostupujicimvKraji / krajskaKvota);
      const spoctiBendaKraj = (vysledky, kraj) => {
        const pocitanyKraj = vysledky.kraje.filter((i) => {
          return i.nazev === kraj;
        })[0];
        const result = pocitanyKraj.strany
          .map((i) => {
            return {
              ...i,
              mandaty_imperiali: Math.floor(i.hlasy / imperiali),
              zbytek: i.hlasy % imperiali,
            };
          })
          .sort((a, b) => (a.mandaty_imperiali < b.mandaty_imperiali ? 1 : -1));
        const mandaty_imperiali = result.reduce((acc, curr) => {
          return acc + curr.mandaty_imperiali;
        }, 0);
        return [result, pocitanyKraj.mandaty, mandaty_imperiali];
      };
      const bendaKraj = spoctiBendaKraj(vysledky, kraj);
      return (
        <Box className={classes.boxik}>
          <Typography paragraph={true}>
            Podle návrhu poslance Bendy by se mandáty v krajích rozdělovaly
            pomocí Imperialiho kvóty: součet hlasů pro strany, které postupují
            do sněmovny, se v každém kraji vydělí počtem mandátů, jež tomuto
            kraji připadly, zvětšeným o dva. Názorná ukázka:
          </Typography>
          <Box display="flex" justifyContent="center">
            <SelectKraj kraj={kraj} setKraj={setKraj}></SelectKraj>
          </Box>
          <Typography paragraph={true}>
            Ve vybraném kraji se má rozdělit {krajskaKvota - 2} mandátů + 2 ={" "}
            {krajskaKvota}. Postupující strany zde dostaly dohromady{" "}
            {hlasyPostupujicimvKraji.toLocaleString("cs-CZ")} hlasů. Dál tedy
            budeme počítat se zaokroulenou kvótou{" "}
            <strong>{imperiali.toLocaleString("cs-CZ")}</strong> (tj.{" "}
            {hlasyPostupujicimvKraji.toLocaleString("cs-CZ")} : {krajskaKvota}).
            Tou se u každé strany vydělí počet hlasů. Kolikrát se do něj kvóta
            vejde, tolik má strana mandátů.{" "}
          </Typography>
          <Box display="flex" flexWrap="wrap" justifyContent="center" mb={2}>
            {bendaKraj[0].map((strana, i) => {
              if (strana.mandaty_imperiali > 0)
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
                        {strana.mandaty_imperiali}{" "}
                        {strana.mandaty_imperiali === 1
                          ? "mandát"
                          : strana.mandaty_imperiali < 5
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
          <Typography paragraph={true}>
            Pokud z tohoto dělení vyjde vyšší počet mandátů než kolik by jich
            kraj měl mít, odečtou se mandáty stranám s nejmenším zbytkem po
            dělení. Pokud se nerozdělí mandáty všechny, převádí se ty
            zbývajícího do dalšího skrutinia.
          </Typography>
        </Box>
      );
    case 6:
      return <div>povidy6</div>;
    case 7:
      return <div>povidy7</div>;
    case 8:
      return <div>povidy8</div>;
  }
}

export default Benda;
