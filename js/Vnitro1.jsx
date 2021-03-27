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

function Vnitro1({ krok, vysledky }) {
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
          </Link>
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
      return null;
    case 5:
      return (
        <Typography paragraph={true} className={classes.boxik}>
          Vládní návrh v první variantě se 14 volebními kraji také používá až na
          nepodstatný rozdíl v zaokrouhlování stejný postup a dopadl by stejně
          jako návrh poslanců KDU-ČSL.
        </Typography>
      );
    case 6:
      return (
        <Typography paragraph={true} className={classes.boxik}>
          Vládní návrh by v první variantě se 14 volebními kraji dopadl stejně
          jako návrh lidoveckých poslanců a senátorů.
        </Typography>
      );
    case 7:
      return (
        <Typography paragraph={true} className={classes.boxik}>
          Také vládní návrh by ve variantě se 14 volebními kraji dopadl pokaždé stejně.
        </Typography>
      );
    case 8:
      return <div>povidy8</div>;
  }
}

export default Vnitro1;
