import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";

const useStyles = makeStyles((theme) => {
  return {
    boxik: {
      borderLeft: "0.2rem solid",
      paddingLeft: "1rem",
      borderColor: "#ffd600",
      alignSelf: "flex-start",
    },
  };
});

const url = "https://www.psp.cz/sqw/text/orig2.sqw?idd=185756";

function Vnitro2( {krok, vysledky} ) {
  const classes = useStyles();

  switch (krok) {
    case false:
      return null;
    case 1:
      return null;
    case 2:
      return null;
    case 3:
      return null;
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

export default Vnitro2;
