import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";

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
    ...vysledky,
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

  return volebniCislo;
};

const url = "https://www.psp.cz/sqw/text/orig2.sqw?idd=166236";

function Poslanci({ krok, vysledky }) {
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
      console.log(p3);
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
      return <div>povidy5</div>;
    case 6:
      return <div>povidy6</div>;
    case 7:
      return <div>povidy7</div>;
    case 8:
      return <div>povidy8</div>;
  }
}

export default Poslanci;
