import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Tooltip from "@material-ui/core/Tooltip";
import GrafSnemovna from "./GrafSnemovna.jsx";

const useStyles = makeStyles((theme) => {
  return {
    boxik: {
      borderLeft: "0.2rem solid",
      paddingLeft: "1rem",
      borderColor: "#ffd600",
      alignSelf: "flex-start",
      width: "100%",
    },
  };
});

const url = "https://www.psp.cz/sqw/text/orig2.sqw?idd=185756";

const vnitroRepublika = (vysledky) => {
  const volebniCislo = {
    CR: vysledky.CR,
    hlasyPostupujici: vysledky.CR.strana.reduce((acc, curr) => {
      return acc + curr.hlasy;
    }, 0),
    republikoveVolebniCislo:
      Math.ceil(
        (vysledky.CR.strana.reduce((acc, curr) => {
          return acc + curr.hlasy;
        }, 0) /
          201) *
          100
      ) / 100,
  };
  const prvniSkrutinium = {
    ...volebniCislo,
    CR: {
      ...volebniCislo.CR,
      strana: volebniCislo.CR.strana.map((s) => {
        return {
          ...s,
          mandatyPoslanci: Math.floor(
            s.hlasy / volebniCislo.republikoveVolebniCislo
          ),
          zbytek: s.hlasy % volebniCislo.republikoveVolebniCislo,
        };
      }),
    },
  };

  const zbyvaPo = {
    ...prvniSkrutinium,
    zbyvaPo: prvniSkrutinium.CR.strana.reduce((acc, curr) => {
      return acc + curr.mandatyPoslanci;
    }, 0),
    CR: {
      ...prvniSkrutinium.CR,
      strana: prvniSkrutinium.CR.strana.sort((a, b) =>
        a.zbytek < b.zbytek ? 1 : -1
      ),
    },
  };

  const druheSkrutinium = {
    ...zbyvaPo,
    CR: {
      ...zbyvaPo.CR,
      strana: zbyvaPo.CR.strana.map((s, i) => {
        const zbytek = 200 - zbyvaPo.zbyvaPo;
        return { ...s, extraMandat: i < zbytek ? 1 : 0 };
      }),
    },
  };

  return druheSkrutinium;
};

function Vnitro2({ krok, vysledky, rok }) {
  const classes = useStyles();

  switch (krok) {
    case false:
      return null;
    case 1:
      return null;
    case 2:
      return null;
    case 3:
      const v3 = vnitroRepublika(vysledky);
      return (
        <Typography paragraph={true} className={classes.boxik}>
          Druhá varianta vládního návrhu, podle které by mohla být celá
          republika počítána jako jeden volební kraj, používá mírně odlišný
          výpočet kvóty: hlasy pro postupující strany dělí počtem poslanců
          zvětšným o jedna. Ve roce {rok} vychází na{" "}
          <strong>{v3.republikoveVolebniCislo.toLocaleString("cs-CZ")}</strong>.
        </Typography>
      );
    case 4:
      return null;
    case 5:
      const v5 = vnitroRepublika(vysledky);
      return (
        <Box className={classes.boxik} mb={2}>
          <Typography paragraph={true}>
            Vzhledem k nižšímu volebnímu číslu vychází vládní návrh s celou
            republikou jako jediným obvodem v některých letech mírně odlišně od
            varianty se 14 kraji.
          </Typography>
          <Box display="flex" flexWrap="wrap" justifyContent="center" mb={2}>
            {v5.CR.strana
              .sort((a, b) => (a.mandatyPoslanci < b.mandatyPoslanci ? 1 : -1))
              .map((strana) => {
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
                          {strana.zkratka}
                        </Typography>
                        <Typography variant="body2" align="center">
                          {`${strana.mandatyPoslanci} mandátů`}
                        </Typography>

                        <Typography variant="body2" align="center">
                          {`za ${strana.hlasy.toLocaleString("cs-CZ")} hlasů`}
                        </Typography>
                      </CardContent>
                    </Tooltip>
                  </Card>
                );
              })}
          </Box>
          <Typography paragraph={true}>
            V roce {rok} se podařilo přidělit {v5.zbyvaPo} mandátů.
          </Typography>
        </Box>
      );
    case 6:
      const v6 = vnitroRepublika(vysledky);
      return (
        <Box className={classes.boxik} mb={2}>
          <Typography paragraph={true}>
            Varianta s jediným volebním krajem vychází v posledních trojích
            volbách stejně jako navrhovaná se čtrnácti kraji. V roce 2006 by ve
            srovnání s tímto návrhem (nikoli se skutečností) ODS jednoho
            poslance přidala na úkor Zelených.
          </Typography>
          <Box display="flex" flexWrap="wrap" justifyContent="center" mb={2}>
            {v6.CR.strana
              .sort((a, b) =>
                a.mandatyPoslanci + a.extraMandat <
                b.mandatyPoslanci + b.extraMandat
                  ? 1
                  : -1
              )
              .map((strana) => {
                return (
                  <Card
                    key={strana.id}
                    variant="outlined"
                    style={{
                      margin: "0.2rem",
                      borderColor: strana.extraMandat ? "#e63946" : null,
                    }}
                  >
                    <Tooltip title={strana.nazev} style={{ cursor: "default" }}>
                      <CardContent>
                        <Typography
                          variant="subtitle2"
                          align="center"
                          gutterBottom={true}
                        >
                          {strana.zkratka}
                        </Typography>
                        <Typography variant="body2" align="center">
                          {`${
                            strana.extraMandat
                              ? `${strana.mandatyPoslanci} + ${strana.extraMandat}`
                              : strana.mandatyPoslanci
                          } mandátů`}
                        </Typography>

                        <Typography variant="body2" align="center">
                          {`(zbytek ${(
                            Math.round(strana.zbytek * 100) / 100
                          ).toLocaleString("cs-CZ")})`}
                        </Typography>
                      </CardContent>
                    </Tooltip>
                  </Card>
                );
              })}
          </Box>
          <Typography paragraph={true}>
            Obdobným způsobem se potom mandáty pro každou stranu rozpočítají
            mezi kraje: V každém kraji dostane strana z výše přidělených tolik
            mandátů, kolikrát se vejde volební číslo do počtu hlasů, které v
            daném kraji získala.{" "}
          </Typography>
        </Box>
      );
    case 7:
      const p7 = vnitroRepublika(vysledky);
        const doGrafu = p7.CR.strana.map((s) => {
          const zkratka = s.zkratka;
          const mandaty = s.mandatyPoslanci + s.extraMandat;

          return [zkratka, mandaty];
        });
      return (
        <Box className={classes.boxik} mb={2}>
          <GrafSnemovna
            data={doGrafu}
            titulek={`${rok}, republika jako jeden kraj`}
          ></GrafSnemovna>
        </Box>
      );
    case 8:
      return <div>povidy8</div>;
  }
}

export default Vnitro2;
