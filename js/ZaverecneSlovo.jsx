import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";

const useStyles = makeStyles((theme) => {
  return {
    vlevo: {
      alignSelf: "flex-start",
    },
  };
});

function ZaverecneSlovo({ krok }) {
  const classes = useStyles();
  switch (krok) {
    case false:
      return null;
    case 1:
      return null;
    case 2:
      return (
        <>
          <Typography paragraph={true} className={classes.vlevo}>
            Oba návrhy obsahují pojistku pro případ, že by se do sněmovny
            dostala jen jedna strana. V takovém případě se hranice vstupu
            snižuje.
          </Typography>
        </>
      );
    case 3:
      return null;
    case 4:
      return null;
    case 5:
      return null;
    case 6:
      return null;
    case 7:
      return null;
    case 8:
      return null;
  }
}

export default ZaverecneSlovo;
