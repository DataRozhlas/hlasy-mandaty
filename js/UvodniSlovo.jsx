import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import GrafStran from "./GrafStran.jsx";
import SimpleSelect from "./SimpleSelect.jsx";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Tooltip from "@material-ui/core/Tooltip";

const useStyles = makeStyles((theme) => {
  return {
    vlevo: {
      alignSelf: "flex-start",
    },
  };
});

function UvodniSlovo({ krok, rok, setRok, vysledky, postupuji }) {
  const classes = useStyles();

  switch (krok) {
    case false:
      return null;
    case 1:
      return (
        <>
          <Typography paragraph={true}>
            Stejný výsledek voleb může vést k mírně odlišnému rozložení sil ve
            sněmovně a případně i k různým vládám. Tady si můžete vyzkoušet, jak
            by dopadly čtvery předchozí volby, kdyby se na ně vztahovaly
            aktuálně navrhované změny ve způsobu přepočtení hlasů na mandáty.
            Které volby si s námi chcete přepočítat?
          </Typography>
          <Box mb={2}>
            <SimpleSelect rok={rok} setRok={setRok}></SimpleSelect>
          </Box>
          <GrafStran
            vysledky={vysledky}
            titulek={`${
              vysledky.CR.strana.length
            } politických stran obdrželo ${vysledky.CR.hlasy.toLocaleString(
              "cs-CZ"
            )} platných hlasů`}
          ></GrafStran>
        </>
      );
    case 2:
      return (
        <>
          <Box mb={2}>
            <SimpleSelect rok={rok} setRok={setRok}></SimpleSelect>
          </Box>{" "}
          <Typography paragraph={true} className={classes.vlevo}>
            {`V roce ${rok}, který jste si vybrali, by podle všech dosud zvažovaných návrhů překonalo hranici pro vstup do sněmovny ${postupuji.CR.strana.length} stran, tedy stejně jako ve skutečnosti:`}
          </Typography>
          <Box display="flex" flexWrap="wrap" justifyContent="center" mb={2}>
            {postupuji.CR.strana.map((strana, i) => {
              return (
                <Card
                  key={strana.id}
                  variant="outlined"
                  style={{ margin: "0.2rem" }}
                >
                  <Tooltip title={strana.nazev} style={{ cursor: "default" }}>
                    <CardContent>
                      <Typography
                        variant="subtitle2"
                        align="center"
                        gutterBottom={true}
                      >
                        {i + 1}. {strana.zkratka}
                      </Typography>
                      <Typography variant="body2" align="center">
                        {`${strana.proc.toLocaleString("cs-CZ")} %`}
                      </Typography>

                      <Typography variant="body2" align="center">
                        {`${strana.hlasy.toLocaleString("cs-CZ")} hlasů`}
                      </Typography>
                    </CardContent>
                  </Tooltip>
                </Card>
              );
            })}
          </Box>
          <Typography paragraph={true} className={classes.vlevo}>
            Je ovšem možné, že kdyby pro ně byla platila méně přísná pravidla,
            kandidovalo by více koalic a výsledky mohly vypadat jinak.
          </Typography>
        </>
      );
    case 3:
      return (
        <>
          <Box mb={2}>
            <SimpleSelect rok={rok} setRok={setRok}></SimpleSelect>
          </Box>
          <Typography paragraph={true} className={classes.vlevo}>
            Teď je potřeba aspoň přibližně spočítat, jaký nejmenší počet hlasů
            při dané volební účasti – v roce {rok} to bylo celostátně{" "}
            {vysledky.CR.ucast.toLocaleString("cs-CZ")} % – potřebuje politická
            strana získat, aby mohla obsadit jedno místo v poslanecké sněmovně.
            K tomu slouží různé <em>volební kvóty</em>.
          </Typography>
        </>
      );
    case 4:
      return (
        <Box mb={2}>
          <SimpleSelect rok={rok} setRok={setRok}></SimpleSelect>
        </Box>
      );
    case 5:
      return (
        <Box mb={2}>
          <SimpleSelect rok={rok} setRok={setRok}></SimpleSelect>
        </Box>
      );
    case 6:
      return (
        <Box mb={2}>
          <SimpleSelect rok={rok} setRok={setRok}></SimpleSelect>
        </Box>
      );
    case 7:
      return (
        <Box mb={2}>
          <SimpleSelect rok={rok} setRok={setRok}></SimpleSelect>
        </Box>
      );
    case 8:
      return <div>povidy8</div>;
  }
}

export default UvodniSlovo;
