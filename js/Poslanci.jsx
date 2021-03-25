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
      borderColor: "#8d6e63",
      alignSelf: "flex-start",
    },
  };
});

const poslanciRepublika = (vysledky) => {
  const volebniCislo = {
    CR: vysledky.CR,
    hlasyPostupujici: vysledky.CR.strana.reduce((acc, curr) => {
      return acc + curr.hlasy;
    }, 0),
    republikoveVolebniCislo:
      Math.round(
        (vysledky.CR.strana.reduce((acc, curr) => {
          return acc + curr.hlasy;
        }, 0) /
          200) *
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

const url = "https://www.psp.cz/sqw/text/orig2.sqw?idd=166236";

function Poslanci({ krok, vysledky, rok }) {
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
            Návrh skupiny poslanců z roku 2019
          </Link>
          , který je teoreticky také stále ve hře, počítá s tím, že by pro
          koalice platila stejná podmínka jako pro samostatné strany, tedy 5 %
          hlasů celostátně.
        </Typography>
      );
    case 3:
      const p3 = poslanciRepublika(vysledky);
      return (
        <Typography paragraph={true} className={classes.boxik}>
          Návrh poslanců KDU-ČSL z roku 2019 postup obrací: nejprve rozdělí
          mandáty stranám, až poté je přiděluje do krajů. K oběma účelům používá{" "}
          <em>volební číslo</em>. Dělí také hlasy počtem mandátů, ovšem
          tentokrát ne všechny hlasy, ale jen hlasy pro strany, jež postupují do
          sněmovny. Zaokrouhluje se na dvě desetinná místa:{" "}
          {p3.hlasyPostupujici.toLocaleString("cs-CZ")} hlasů : 200 ={" "}
          <strong>{p3.republikoveVolebniCislo.toLocaleString("cs-CZ")}</strong>.
        </Typography>
      );
    case 4:
      return null;
    case 5:
      const p5 = poslanciRepublika(vysledky);
      return (
        <Box className={classes.boxik} mb={2}>
          <Typography paragraph={true}>
            Návrh poslanců strany lidové v prvním kroku jednoduše přidělí každé
            straně tolik mandátů, kolikrát se volební číslo{" "}
            {p5.republikoveVolebniCislo.toLocaleString("cs-CZ")} vejde do počtu
            hlasů, jež získala v celé republice.
          </Typography>
          <Box display="flex" flexWrap="wrap" justifyContent="center" mb={2}>
            {p5.CR.strana
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
            Tímto způsobem se podařilo přidělit {p5.zbyvaPo} mandátů.
          </Typography>
        </Box>
      );
    case 6:
      const p6 = poslanciRepublika(vysledky);
      return (
        <Box className={classes.boxik} mb={2}>
          <Typography paragraph={true}>
            Zbývající mandáty podle návrhu lidoveckých poslanců připadnou
            stranám s největším zbytkem po prvním dělení.
          </Typography>
          <Box display="flex" flexWrap="wrap" justifyContent="center" mb={2}>
            {p6.CR.strana
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
        const p7 = poslanciRepublika(vysledky);
        const doGrafu = p7.CR.strana.map((s) => {
          const zkratka = s.zkratka;
          const mandaty = s.mandatyPoslanci + s.extraMandat;

          return [zkratka, mandaty];
        });
      return (
        <Box className={classes.boxik} mb={2}>
          <GrafSnemovna
            data={doGrafu}
            titulek={`${rok}, návrh lidoveckých poslanců`}
          ></GrafSnemovna>
        </Box>
      );
    case 8:
      return null;
  }
}

export default Poslanci;
