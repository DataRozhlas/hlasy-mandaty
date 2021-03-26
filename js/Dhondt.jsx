import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";
import SelectKraj from "./SelectKraj.jsx";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import GrafSnemovna from "./GrafSnemovna.jsx";

const useStyles = makeStyles((theme) => {
  return {
    boxik: {
      borderLeft: "0.2rem solid",
      paddingLeft: "1rem",
      borderColor: "#6200ea",
      alignSelf: "flex-start",
      width: "100%",
    },
  };
});

const url =
  "https://www.zakonyprolidi.cz/cs/1995-247/zneni-20190302#cast1-oddil2";

const pridelDhondtvKrajich = (kraje, vybranyKraj) => {
  let result = [];
  const jenVybrany = kraje.filter((kraj) => kraj.nazev === vybranyKraj);

  jenVybrany[0].strany.forEach((strana) => {
    if (strana.mandaty > 0) {
      for (let i = 0; i < strana.mandaty; i++) {
        result.push({
          nazev: strana.zkratka,
          cislomandatu: i + 1,
          hlasy: strana.hlasy,
          delitel: strana.hlasy / (i + 1),
          id: `${strana.id}-${i}`,
        });
      }
    }
  });
  const setridenyResult = result.sort((a, b) => {
    return a.delitel < b.delitel ? 1 : -1;
  });
  return setridenyResult;
};

const DhondtRepublika = (vysledky) => {
  const volebniCislo = {
    ...vysledky,
    republikoveVolebniCislo: Math.round(vysledky.CR.hlasy / 200),
  };

  const mandatyVKrajich = {
    ...volebniCislo,
    kraje: volebniCislo.kraje
      .map((kraj) => {
        return {
          ...kraj,
          mandatyDhondtZaklad: Math.floor(
            kraj.hlasy / volebniCislo.republikoveVolebniCislo
          ),
          mandatyDhondtZbytek:
            kraj.hlasy % volebniCislo.republikoveVolebniCislo,
        };
      })
      .sort((a, b) => (a.mandaty < b.mandaty ? 1 : -1)),
  };

  const zbytekZkraju = {
    ...mandatyVKrajich,
    zbytekZkraju:
      200 -
      mandatyVKrajich.kraje.reduce((acc, curr) => {
        return acc + curr.mandatyDhondtZaklad;
      }, 0),
  };

  return zbytekZkraju;
};

function Dhondt({ krok, vysledky, krajeDhondt, rok, kraj, setKraj }) {
  const classes = useStyles();

  switch (krok) {
    case false:
      return null;
    case 1:
      return null;
    case 2:
      return (
        <>
          <Typography paragraph={true} className={classes.boxik}>
            Podle{" "}
            <Link href={url} target="_blank">
              dosavadních pravidel
            </Link>{" "}
            strany musí na celostátní úrovni dostat aspoň 5 % hlasů. Dokud ji na
            začátku února{" "}
            <Link
              href="https://www.usoud.cz/fileadmin/user_upload/Tiskova_mluvci/Publikovane_nalezy/2021/Pl._US_44_17_vcetne_disentu.pdf"
              target="_blank"
            >
              Ústavní soud nezrušil
            </Link>
            , platila zvýšená <em>uzavírací klauzule</em>, tedy vyšší práh pro
            vstup do sněmovny, pro všechny koalice složené z více stran.
            Dvoučlenné musely získat 10 %, tříčlenné 15 % a početnější 20 %
            hlasů.
          </Typography>
        </>
      );
    case 3:
      const d = DhondtRepublika(vysledky);
      return (
        <Typography paragraph={true} className={classes.boxik}>
          V systému, který dosud platil, se nejprve spočítalo{" "}
          <em>republikové mandátové číslo</em>. Součet všech platných hlasů se
          vydělil počtem poslanců a výsledek se zaokrouhlil na celé číslo.
          Takhle: {d.CR.hlasy.toLocaleString("cs-CZ")} hlasů : 200 poslanců ={" "}
          <strong>{d.republikoveVolebniCislo.toLocaleString("cs-CZ")}</strong>.
          Toto číslo se pak použilo pro přidělení mandátů jednotlivým krajům. V
          nich se následně poslanecká křesla mezi strany rozpočítala pomocí{" "}
          <em>D'Hondtova dělitele</em>.
        </Typography>
      );
    case 4:
      const d4 = DhondtRepublika(vysledky);
      return (
        <>
          <Box display="flex" flexWrap="wrap" justifyContent="center" mb={2}>
            {d4.kraje.map((kraj, i) => {
              return (
                <Card
                  key={kraj.id}
                  variant="outlined"
                  style={{
                    margin: "0.2rem",
                    borderColor:
                      kraj.mandaty > kraj.mandatyDhondtZaklad
                        ? "#e63946"
                        : null,
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="subtitle2"
                      align="center"
                      gutterBottom={true}
                    >
                      {kraj.nazev}
                    </Typography>
                    <Typography variant="body2" align="center">
                      {`${
                        kraj.mandaty > kraj.mandatyDhondtZaklad
                          ? `${kraj.mandaty - 1} + 1`
                          : kraj.mandaty
                      } mandátů`}
                    </Typography>
                    <Typography variant="body2" align="center">
                      {`${kraj.hlasy.toLocaleString("cs-Cz")} hlasů`}
                    </Typography>
                    <Typography variant="body2" align="center">
                      {`(zbytek ${kraj.mandatyDhondtZbytek.toLocaleString(
                        "cs-Cz"
                      )})`}
                    </Typography>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
          <Typography paragraph={true} className={classes.boxik}>
            V přepočtu, který se používal poslední dvě dekády, se nejprve
            rozdělily hlasy do krajů. Počet hlasů v každém kraji se vydělil{" "}
            <em>republikovým mandátovým číslem</em> a výsledek se zaokrouhlil
            dolů. V roce {rok} po tomto prvním dělení zbylo {d4.zbytekZkraju}{" "}
            poslaneckých křesel. Ta se rozdělila krajům s největším zbytkem po
            dělení (v červeném rámečku).
          </Typography>
        </>
      );
    case 5:
      return (
        <Box className={classes.boxik} mb={2}>
          <Typography paragraph={true}>
            Před zásahem Ústavního soudu se mandáty v krajích rozdělovaly{" "}
            <Link
              href="https://cs.wikipedia.org/wiki/D%27Hondtova_metoda"
              target="_blank"
            >
              D'Hondtovou metodou
            </Link>
            : u každého kandidáta se počet hlasů pro jeho stranu v daném kraji
            vydělil jeho pořadím na kandidátce. Lídr kandidátky jako by měl k
            dispozici všechny hlasy své strany, druhý na kandidátce polovinu
            hlasů, třetí třetinu atd.
          </Typography>

          <Typography paragraph={true}>
            Výsledky tohoto dělení u všech kandidátů a všech postupujících stran
            se pak shromáždily do jedné velké tabulky a seřadily od nejvyššího k
            nejnižšímu. Kdo byl v tabulce &bdquo;nad čarou&ldquo;, tedy měl
            pořadové číslo menší nebo rovné počtu mandátů pro daný kraj, stal se
            poslankyní či poslancem. (Zanedbejme možnost posouvat se na
            kandidátkách pomocí preferenčních hlasů, kterou Ústavní soud
            nezrušil.) Takhle to dopadalo ve vámi zvoleném roce {rok} v
            jednotlivých krajích:
          </Typography>
          <Box display="flex" justifyContent="center">
            <SelectKraj kraj={kraj} setKraj={setKraj}></SelectKraj>
          </Box>
          <Box display="flex" flexWrap="wrap" justifyContent="center" mb={2}>
            {pridelDhondtvKrajich(vysledky.kraje, kraj).map((mandat, i) => {
              return (
                <Card
                  key={mandat.id}
                  variant="outlined"
                  style={{ margin: "0.2rem" }}
                >
                  <CardContent>
                    <Typography
                      variant="subtitle2"
                      align="center"
                      gutterBottom={true}
                    >
                      {i + 1}. mandát{" "}
                      {mandat.nazev === "Piráti" ? "získávají" : "získává"}{" "}
                      {mandat.nazev}
                    </Typography>
                    <Typography variant="body2" align="center">
                      {mandat.hlasy.toLocaleString("cs-CZ")} hlasů
                    </Typography>
                    <Typography variant="body2" align="center">
                      {" "}
                      {mandat.cislomandatu}. místo na kandidátce
                    </Typography>
                    <Typography variant="body2" align="center">
                      výsledek dělení{" "}
                      <strong>
                        {((mandat.delitel * 100) / 100).toLocaleString("cs-CZ")}
                      </strong>
                    </Typography>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        </Box>
      );
    case 6:
      return (
        <Typography paragraph={true} className={classes.boxik}>
          V dosavadním systému sčítání už by byly všechny mandáty rozdělené.
        </Typography>
      );
    case 7:
      const d5 = DhondtRepublika(vysledky);
      const doGrafu = d5.CR.strana.map((s) => {
        const zkratka = s.zkratka;
        const mandaty = d5.kraje.reduce((acc, curr) => {
          return (
            acc + curr.strany.filter((p) => p.nazev === s.nazev)[0].mandaty
          );
        }, 0);

        return [zkratka, mandaty];
      });
      return (
        <Box className={classes.boxik} mb={2}>
            <GrafSnemovna
            data={doGrafu}
            titulek={`${rok}, skutečnost (D'Hondtova metoda)`}
          ></GrafSnemovna>
        </Box>
      );
    case 8:
      return <div>povidy8</div>;
  }
}

export default Dhondt;
