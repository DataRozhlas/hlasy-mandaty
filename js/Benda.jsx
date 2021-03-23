import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";

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

function Benda({ krok, vysledky, postupuji, kvota }) {
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
      return (<Typography paragraph={true} className={classes.boxik}>
        Ústavně právní výbor a poslanec Benda navrhují tento postup zachovat.
      </Typography>);
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

export default Benda;
