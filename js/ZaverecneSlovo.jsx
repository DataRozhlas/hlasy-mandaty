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
          <Typography paragraph={true}>
            Všechny návrhy obsahují pojistku pro případ, že by se do sněmovny
            dostala jen jedna strana. V takovém případě se hranice vstupu
            snižuje.{" "}
          </Typography>
          <Typography paragraph={true}>
            Donedávna platná nejpřísnější klauzule pro koalice v Evropě přispěla
            k tomu, že za posledních patnáct let kandidovala do sněmovny jenom
            jedna: Koalice pro Českou republiku se skládala ze sedmi subjektů a
            v roce 2006 získala 8 140 hlasů – na postup do sněmovny by jí
            nestačilo ani o milon hlasů víc.
          </Typography>
          <Typography paragraph={true}>
            Do letošních voleb se chystají dvě koalice, kterým předvolební
            průzkumy dávají naději, že by mohly překonat i původní vysokou
            vstupní bariéru: jednou jsou Piráti a Starostové, druhou SPOLU (ODS,
            KDU-ČSL a TOP 09).
          </Typography>
        </>
      );
    case 3:
      return null;
    case 4:
      return (
        <Typography paragraph={true} className={classes.vlevo}>
          Ostatní návrhy počítají s tím, že by se nejdřív rozdělovaly mandáty
          stranám, až potom případně do krajů, s výjimkou návrhu počítajícího s
          jediným volebním obvodem pro celou republiku.
        </Typography>
      );
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
