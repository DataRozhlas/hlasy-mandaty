import React from "react";
import GrafStran from "./GrafStran.jsx";
import SimpleSelect from "./SimpleSelect.jsx";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

const postupuji = vysledky.CR.strana.filter(strana => {
    
})

function UvodniSlovo({ krok, rok, setRok, vysledky }) {
  switch (krok) {
    case 1:
      return (
        <>
          <Typography paragraph={true}>
            Stejný výsledek voleb může vést k mírně odlišnému rozložení sil ve
            sněmovně a případně i k různým vládám. Tady si můžete vyzkoušet, jak
            by dopadly čtvery předchozí volby, kdyby se na ně vztahovaly
            aktuálně navrhované změny ve způsobu přepočtení hlasů na mandáty.{" "}
          </Typography>
          <Typography>Které volby si s námi chcete přepočítat?</Typography>
          <Box mb={2}>
            <SimpleSelect rok={rok} setRok={setRok}></SimpleSelect>
          </Box>
          <GrafStran
            vysledky={vysledky}
            titulek={
              vysledky &&
              `${
                vysledky.CR.strana.length
              } politických stran obdrželo ${vysledky.CR.hlasy.toLocaleString(
                "cs-CZ"
              )} platných hlasů`
            }
          ></GrafStran>
        </>
      );
    case 2:
      return (
        <>
          {" "}
          <Typography paragraph={true}>
            {`V roce ${rok}, který jste si vybrali, překonalo hranici pro vstup do sněmovny ${postupuji.length} stran:`}
          </Typography>
          <Box display="flex" flexWrap="wrap" justifyContent="center" mb={2}>
            {postupuji.map((strana, i) => {
              return (
                <Card
                  key={strana._attributes.KSTRANA}
                  variant="outlined"
                  style={{ margin: "0.2rem" }}
                >
                  <CardContent>
                    <Typography
                      variant="subtitle2"
                      align="center"
                      gutterBottom={true}
                    >
                      {i + 1}. {strana._attributes.NAZ_STR}
                    </Typography>
                    <Typography variant="body2" align="center">
                      {`${strana.HODNOTY_STRANA._attributes.PROC_HLASU.toLocaleString(
                        "cs-CZ"
                      )} %`}
                    </Typography>

                    <Typography variant="body2" align="center">
                      {`${strana.HODNOTY_STRANA._attributes.HLASY.toLocaleString(
                        "cs-CZ"
                      )} hlasů`}
                    </Typography>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        </>
      );
    case 3:
      return <div>povidy3</div>;
    case 4:
      return <div>povidy4</div>;
    case 5:
      return <div>povidy5</div>;
    case 6:
      return <div>povidy6</div>;
    case 7:
      return <div>povidy7</div>;
    case 8:
      return <div>povidy8</div>;
  }
}

export default UvodniSlovo;
