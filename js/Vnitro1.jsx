import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";

const useStyles = makeStyles((theme) => {
  return {
    boxik: {
      borderLeft: "0.2rem solid",
      paddingLeft: "1rem",
      borderColor: "#ffab00",
      alignSelf: "flex-start",
    },
  };
});

const url = "https://www.psp.cz/sqw/text/orig2.sqw?idd=185756";

function Vnitro1({ krok, vysledky, postupuji, hlasyPostupujici, kvota }) {
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
            Vládní návrh
          </Link>{" "}
          , který připravilo ministerstvo vnitra, požadoval v obou svých
          variantách 7 % po dvoukoalicích, 9 % po trojkoalicích a 11 % po
          větších uskupeních.
        </Typography>
      );
    case 3:
      return (
        <Typography paragraph={true} className={classes.boxik}>
          Vládní návrh se odlišuje jen v nepodstatném detailu: volební číslo se
          zaokrouhluje na setiny nahoru.
        </Typography>
      );
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

export default Vnitro1;
