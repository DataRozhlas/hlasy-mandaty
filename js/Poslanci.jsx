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

const url = "https://www.psp.cz/sqw/text/orig2.sqw?idd=166236";

function Poslanci({ krok }) { 
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
          , který je teoreticky také stále ve hře, počítá s tím, že by pro koalice
          platila stejná podmínka jako pro samostatné strany, tedy 5 % hlasů
          celostátně.
        </Typography>
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

export default Poslanci;
