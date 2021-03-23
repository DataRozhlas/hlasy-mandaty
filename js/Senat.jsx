import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";

const useStyles = makeStyles((theme) => {
  return {
    boxik: {
      borderLeft: "0.2rem solid",
      paddingLeft: "1rem",
      borderColor: "#dd2c00",
      alignSelf: "flex-start",
    },
  };
});

const url = "https://www.senat.cz/xqw/webdav/pssenat/original/98286/82486";

function Senat({ krok, vysledky, postupuji, hlasyPostupujici, kvota }) {
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
            V návrhu skupiny senátorů
          </Link>{" "}
          by koalicím také stačilo stejně jako stranám 5 % hlasů.
        </Typography>
      );
    case 3:
      return (
        <Typography paragraph={true} className={classes.boxik}>
          Senátní návrh se v tomto bodu doslova shoduje s návrhem poslanců,
          volební číslo je tedy také{" "}
          <strong>{kvota.toLocaleString("cs-CZ")}</strong>.
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

export default Senat;
